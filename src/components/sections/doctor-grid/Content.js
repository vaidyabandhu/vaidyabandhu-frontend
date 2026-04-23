import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { isNotEmptyArray } from "../../utiles/utils";

const deptIcons = [
  "https://img.icons8.com/color/48/stethoscope.png",
  "https://img.icons8.com/color/48/heart-with-pulse.png",
  "https://img.icons8.com/color/48/brain.png",
  "https://img.icons8.com/color/48/lungs.png",
  "https://img.icons8.com/color/48/x-ray.png",
  "https://img.icons8.com/color/48/bone.png",
  "https://img.icons8.com/color/48/microscope.png",
  "https://img.icons8.com/color/48/hospital-room.png",
  "https://img.icons8.com/color/48/pregnant.png",
  "https://img.icons8.com/color/48/skin.png",
];

const DEFAULT_ICON = "https://img.icons8.com/color/48/hospital.png";
const DEFAULT_SPEC_IMG = "https://img.icons8.com/color/96/clinic.png";

const MedicalDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [errorDepartments, setErrorDepartments] = useState(null);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const navigate = useNavigate();
  const specialtyRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [page, setPage] = useState(1);
  const [hasMoreDepartments, setHasMoreDepartments] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const loadMoreRef = useRef(null);
  const requestingPageRef = useRef(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const requestKey = useMemo(() => debouncedSearchTerm.trim(), [debouncedSearchTerm]);

  useEffect(() => {
    setPage(1);
    setHasMoreDepartments(true);
    setInitialLoadDone(false);
    requestingPageRef.current = false;
  }, [requestKey]);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      setErrorDepartments(null);

      try {
        const response = await fetch(
          `https://admin.vaidyabandhu.com/api/department/?page=${page}&search=${requestKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();
        const incoming = Array.isArray(data.data) ? data.data : [];

        if (page > 1 && incoming.length === 0) {
          setHasMoreDepartments(false);
          setInitialLoadDone(true);
          requestingPageRef.current = false;
          return;
        }

        setDepartments((previous) => {
          const merged =
            page === 1
              ? incoming
              : [
                  ...previous,
                  ...incoming.filter(
                    (department) => !previous.some((item) => item.id === department.id)
                  ),
                ];

          const totalCount = Number(data.pagination_data?.total_count || 0);
          const canLoadMore = totalCount
            ? merged.length < totalCount
            : incoming.length > 0;

          setHasMoreDepartments(canLoadMore);
          return merged;
        });

        setInitialLoadDone(true);
        requestingPageRef.current = false;
      } catch (error) {
        setHasMoreDepartments(false);
        // Keep already loaded cards visible if a later-page request fails.
        if (page === 1) {
          setErrorDepartments(error.message);
        }
        setInitialLoadDone(true);
        requestingPageRef.current = false;
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [page, requestKey]);

  useEffect(() => {
    if (
      selectedDept ||
      !loadMoreRef.current ||
      !initialLoadDone ||
      !hasMoreDepartments ||
      loadingDepartments ||
      errorDepartments
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting || requestingPageRef.current) {
          return;
        }

        requestingPageRef.current = true;
        setPage((previous) => previous + 1);
      },
      { rootMargin: "260px 0px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [errorDepartments, hasMoreDepartments, initialLoadDone, loadingDepartments, selectedDept]);

  const fetchSpecialties = async (department) => {
    setSpecialtyLoading(true);
    setSelectedDept(department);

    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/specialty/?department=${department.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch specialties");
      }

      const data = await response.json();
      setSpecialties(data.data || []);
    } catch {
      setSpecialties([]);
    } finally {
      setSpecialtyLoading(false);

      setTimeout(() => {
        if (specialtyRef.current) {
          const top = specialtyRef.current.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 200);
    }
  };

  useEffect(() => {
    if (!selectedDept || specialtyLoading || specialties.length > 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      navigate(`/doctor-list?department=${selectedDept.id}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, selectedDept, specialties.length, specialtyLoading]);

  const handleSelectDept = (dept) => {
    if (selectedDept?.id === dept.id) {
      setSelectedDept(null);
      setSpecialties([]);
      return;
    }

    fetchSpecialties(dept);
  };

  const getIcon = (index) => deptIcons[index % deptIcons.length] || DEFAULT_ICON;

  return (
    <section className="vb-list-page vb-department-page">
      <div className="vb-list-shell">
        <div className="vb-list-search vb-department-search">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search department"
          />
        </div>

        {loadingDepartments && departments.length === 0 && (
          <div className="vb-loading">
            <i className="fas fa-circle-notch fa-spin" />
            <p style={{ margin: "0.5rem 0 0" }}>Loading departments...</p>
          </div>
        )}

        {errorDepartments && !loadingDepartments && departments.length === 0 && (
          <div className="vb-error-box">
            <h4 style={{ marginTop: 0 }}>Couldn’t load departments</h4>
            <p style={{ marginBottom: 0 }}>{errorDepartments}</p>
          </div>
        )}

        <div className="vb-department-grid">
          {isNotEmptyArray(departments) ? (
            departments.map((department, index) => {
              const isSelected = selectedDept?.id === department.id;

              return (
                <article
                  key={department.id}
                  className={`vb-department-card ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleSelectDept(department)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      handleSelectDept(department);
                    }
                  }}
                >
                  <div className="vb-department-icon">
                    <img
                      src={department.image || getIcon(index)}
                      alt={department.name}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src = DEFAULT_ICON;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="vb-department-title">{department.name}</h3>
                    <p className="vb-mini">Tap to view specialties</p>
                  </div>
                </article>
              );
            })
          ) : (
            initialLoadDone &&
            !loadingDepartments && (
              <div className="vb-empty" style={{ gridColumn: "1/-1" }}>
                <h4 style={{ marginTop: 0 }}>No departments found</h4>
                <p style={{ marginBottom: 0 }}>Try another keyword.</p>
              </div>
            )
          )}
        </div>

        {!selectedDept && loadingDepartments && page > 1 && (
          <p className="vb-load-more-note">
            <i className="fas fa-circle-notch fa-spin" /> Loading more departments...
          </p>
        )}

        <div className="vb-load-sentinel" ref={loadMoreRef} />

        {selectedDept && (
          <div ref={specialtyRef} className="vb-specialty-shell">
            <div className="vb-specialty-head">
              <h4>{selectedDept.name} Specialties</h4>
            </div>

            {specialtyLoading && (
              <p className="vb-load-more-note" style={{ textAlign: "left" }}>
                <i className="fas fa-circle-notch fa-spin" /> Loading specialties...
              </p>
            )}

            {!specialtyLoading && specialties.length > 0 && (
              <div className="vb-specialty-grid">
                {specialties.map((specialty) => (
                  <article
                    key={specialty.id}
                    className="vb-specialty-card"
                    onClick={() => navigate(`/doctor-list?specialty=${specialty.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        navigate(`/doctor-list?specialty=${specialty.id}`);
                      }
                    }}
                  >
                    <img
                      src={specialty.image || DEFAULT_SPEC_IMG}
                      alt={specialty.title || specialty.description || "Specialty"}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src = DEFAULT_SPEC_IMG;
                      }}
                    />
                    <h5>{specialty.title}</h5>
                    <p className="vb-mini">View doctors</p>
                  </article>
                ))}
              </div>
            )}

            {!specialtyLoading && specialties.length === 0 && (
              <div className="vb-empty" style={{ textAlign: "left" }}>
                <h4 style={{ marginTop: 0 }}>No specialties listed</h4>
                <p style={{ marginBottom: 0 }}>
                  Redirecting you to doctors in this department...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalDepartments;
