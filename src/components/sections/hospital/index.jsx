import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useFetch } from "../../hooks/usefetch";
import { sortDirectoryItems } from "../../utiles/directorySearch";

const getHospitalAddress = (hospital = {}) => {
  const parts = [
    hospital.address,
    hospital.address_1,
    hospital.address_2,
    hospital.address1,
    hospital.address2,
    hospital.area,
    hospital.local_area,
    hospital.locality,
    hospital.neighborhood,
    hospital.location,
    hospital.area_name,
    hospital.place,
    hospital.region,
    hospital.city,
    hospital.city_name,
    hospital.district,
    hospital.state,
    hospital.landmark,
    hospital.pincode,
  ]
    .map((p) => String(p || "").trim())
    .filter(Boolean);

  return parts
    .filter((p, i) => parts.findIndex((c) => c.toLowerCase() === p.toLowerCase()) === i)
    .join(", ");
};

const HospitalsPage = () => {
  const navigate = useNavigate();
  const itemPerPage = 18;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [hospitals, setHospitals] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const loadMoreRef = useRef(null);
  const requestingPageRef = useRef(false);

  // Debounce the search input by 350ms before hitting the API
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Reset list whenever the search term changes
  useEffect(() => {
    setPageNo(1);
    setHospitals([]);
    setHasMore(true);
    setInitialLoadDone(false);
    requestingPageRef.current = false;
  }, [debouncedSearch]);

  // Single "search" param handles name, address and city on the server side
  const { data, loading, error } = useFetch({
    method: "GET",
    request: "/hospital/",
    params: {
      search: debouncedSearch,
      page_count: itemPerPage.toString(),
      page: pageNo.toString(),
    },
  });

  useEffect(() => {
    if (!loading) requestingPageRef.current = false;
  }, [loading]);

  useEffect(() => {
    if (!data || !Array.isArray(data.data)) {
      if (pageNo > 1 && data) {
        setHasMore(false);
        requestingPageRef.current = false;
      }
      return;
    }

    const incoming = data.data;

    if (pageNo > 1 && incoming.length === 0) {
      setHasMore(false);
      setInitialLoadDone(true);
      requestingPageRef.current = false;
      return;
    }

    setHospitals((prev) => {
      const merged =
        pageNo === 1
          ? incoming
          : [...prev, ...incoming.filter((h) => !prev.some((p) => p.id === h.id))];

      const sorted = sortDirectoryItems(merged, (h) => h?.name);
      const totalCount = Number(data?.pagination_data?.total_count || 0);
      setHasMore(totalCount ? sorted.length < totalCount : incoming.length === itemPerPage);
      return sorted;
    });

    setInitialLoadDone(true);
    requestingPageRef.current = false;
  }, [data, itemPerPage, pageNo]);

  // Infinite scroll — works for both browsing and paginated search results
  useEffect(() => {
    if (!loadMoreRef.current || !initialLoadDone || !hasMore || loading || error) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !requestingPageRef.current) {
          requestingPageRef.current = true;
          setPageNo((n) => n + 1);
        }
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [error, hasMore, initialLoadDone, loading]);

  const visibleHospitals = useMemo(
    () =>
      hospitals.map((h) => ({
        ...h,
        address: getHospitalAddress(h),
      })),
    [hospitals]
  );

  const handleHospitalClick = (hospital) => {
    navigate(`/doctor-list?id=${hospital.id}`, {
      state: {
        hospital: {
          ...hospital,
          address: hospital.address || getHospitalAddress(hospital),
        },
      },
    });
  };

  return (
    <section className="vb-hospitals-page">
      <style>{`
        .vb-hospitals-page {
          background: linear-gradient(180deg, #f9fdfc 0%, #f0faf7 40%, #ffffff 100%);
          min-height: 100vh;
          padding: 32px 0 56px;
        }

        .vb-hospitals-shell {
          width: min(1080px, calc(100% - 32px));
          margin: 0 auto;
        }

        .vb-hospitals-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 58px;
          padding: 0 16px;
          margin-bottom: 22px;
          background: #ffffff;
          border: 1px solid #dcefeb;
          border-radius: 18px;
          box-shadow: 0 14px 30px rgba(12, 72, 77, 0.06);
        }

        .vb-hospitals-search-bar input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #12373a;
          font-size: 15px;
        }

        .vb-hospital-directory {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .vb-hospital-directory-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 20px;
          background: #ffffff;
          border: 1px solid #dcefeb;
          border-radius: 22px;
          box-shadow: 0 16px 34px rgba(12, 72, 77, 0.06);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          cursor: pointer;
        }

        .vb-hospital-directory-row:hover {
          transform: translateY(-3px);
          border-color: #bfded8;
          box-shadow: 0 22px 42px rgba(12, 72, 77, 0.1);
        }

        .vb-hospital-directory-title {
          margin: 0;
          color: #12373a;
          font-size: 1.05rem;
          line-height: 1.5;
          font-weight: 700;
        }

        .vb-hospital-directory-copy {
          min-width: 0;
        }

        .vb-hospital-directory-address {
          margin: 2px 0 0;
          font-size: 12px;
          color: #7b8794;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .vb-hospital-directory-btn {
          flex-shrink: 0;
          min-width: 136px;
          white-space: nowrap;
        }

        .vb-error-box,
        .vb-loading-box,
        .vb-empty-box {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px 22px;
          border: 1px solid #dcefeb;
          box-shadow: 0 18px 40px rgba(12, 72, 77, 0.06);
          margin-bottom: 18px;
        }

        .vb-error-box {
          background: #fff4f4;
          border-color: #fecaca;
          color: #b42318;
        }

        .vb-load-more-note {
          text-align: center;
          margin: 24px 0 0;
          color: #5f7778;
          font-weight: 500;
        }

        @media (max-width: 767px) {
          .vb-hospitals-page {
            padding: 20px 0 36px;
          }

          .vb-hospitals-shell {
            width: min(100%, calc(100% - 20px));
          }

          .vb-hospitals-search-bar {
            min-height: 44px;
            height: 44px;
            padding: 0 12px;
            border-radius: 16px;
            margin-bottom: 16px;
          }

          .vb-hospitals-search-bar input {
            font-size: 16px;
          }

          .vb-hospital-directory {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .vb-hospital-directory-row {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 8px;
            padding: 10px 12px;
            border-radius: 8px;
            border: 0.5px solid #d0e8d8;
            box-shadow: none;
          }

          .vb-hospital-directory-btn {
            min-width: 0;
            width: 100%;
            justify-content: center;
            padding: 8px 10px;
            font-size: 0.72rem;
            border-radius: 8px;
          }

          .vb-hospital-directory-title {
            font-size: 13px;
            font-weight: 500;
            line-height: 1.4;
          }

          .vb-hospital-directory-address {
            font-size: 11px;
            line-height: 1.35;
          }
        }
      `}</style>

      <div className="vb-hospitals-shell">
        <div className="vb-hospitals-search-bar">
          <Search size={18} color="#6b7280" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospitals by name, address or city"
          />
        </div>

        {error && pageNo === 1 && (
          <div className="vb-error-box">
            <h4 style={{ marginTop: 0, marginBottom: "6px" }}>Couldn't load hospitals</h4>
            <p style={{ marginBottom: 0 }}>{error}</p>
          </div>
        )}

        {loading && pageNo === 1 && !initialLoadDone && (
          <div className="vb-loading-box">
            <div style={{ textAlign: "center" }}>
              <i className="fas fa-circle-notch fa-spin" />
              <p style={{ margin: "10px 0 0", color: "#5f7778" }}>
                Fetching hospital list...
              </p>
            </div>
          </div>
        )}

        {!loading && !error && initialLoadDone && visibleHospitals.length === 0 && (
          <div className="vb-empty-box">
            <div style={{ textAlign: "center" }}>
              <h4 style={{ marginTop: 0, marginBottom: "8px", color: "#12373a" }}>
                No hospitals found
              </h4>
              <p style={{ marginBottom: 0, color: "#5f7778" }}>
                {debouncedSearch
                  ? `No hospitals matched "${debouncedSearch}". Try a different name, address or city.`
                  : "No hospitals available at the moment."}
              </p>
            </div>
          </div>
        )}

        {visibleHospitals.length > 0 && (
          <div className="vb-hospital-directory">
            {visibleHospitals.map((hospital) => (
              <article
                className="vb-hospital-directory-row"
                key={hospital.id}
                onClick={() => handleHospitalClick(hospital)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleHospitalClick(hospital);
                }}
              >
                <div className="vb-hospital-directory-copy">
                  <h3 className="vb-hospital-directory-title">
                    {hospital.name || "Hospital"}
                  </h3>
                  <p className="vb-hospital-directory-address">
                    {hospital.address || "Address not available"}
                  </p>
                </div>
                <button
                  type="button"
                  className="vb-btn vb-btn-secondary vb-hospital-directory-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHospitalClick(hospital);
                  }}
                >
                  View Doctors
                </button>
              </article>
            ))}
          </div>
        )}

        {loading && pageNo > 1 && (
          <p className="vb-load-more-note">
            <i className="fas fa-circle-notch fa-spin" /> Loading more hospitals...
          </p>
        )}

        <div ref={loadMoreRef} />
      </div>
    </section>
  );
};

export default HospitalsPage;
