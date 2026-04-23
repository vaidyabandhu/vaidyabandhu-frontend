import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/usefetch";

const availabilityOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ratingOptions = [
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
  { value: "2", label: "2+ Stars" },
  { value: "1", label: "1+ Stars" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "Nopreference", label: "No preference" },
];

const normalizeDoctorSearch = (value = "") =>
  value
    .trim()
    .replace(/^dr\.?\s*/i, "")
    .replace(/\s+/g, " ");

const getHospitalDisplayImage = (hospital = {}) =>
  hospital?.image ||
  hospital?.photo ||
  hospital?.hospital_image ||
  hospital?.hospital_photo ||
  hospital?.thumbnail ||
  hospital?.logo ||
  "/assets/img/default-img.jpg";

const getHospitalDisplayAddress = (hospital = {}) =>
  [
    hospital?.address,
    hospital?.address_1,
    hospital?.address_2,
    hospital?.area,
    hospital?.local_area,
    hospital?.locality,
    hospital?.neighborhood,
    hospital?.location,
    hospital?.area_name,
    hospital?.place,
    hospital?.region,
    hospital?.city,
    hospital?.city_name,
    hospital?.district,
    hospital?.state,
    hospital?.pincode,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter(
      (item, index, collection) =>
        collection.findIndex(
          (candidate) => candidate.toLowerCase() === item.toLowerCase()
        ) === index
    )
    .join(", ");

const getHospitalContact = (hospital = {}) =>
  hospital?.contact_number ||
  hospital?.phone_number ||
  hospital?.phone ||
  hospital?.mobile ||
  hospital?.contact ||
  "";

const Content = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const specialtyParam = params.get("specialty");
  const hospitalId = params.get("id");

  const itemPerPage = 15;

  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [hospitalName, setHospitalName] = useState("");

  const [selectedSpecialties, setSelectedSpecialties] = useState(
    specialtyParam ? [Number(specialtyParam)] : []
  );
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [locations, setLocations] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadMoreRef = useRef(null);
  const requestingPageRef = useRef(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const normalizedDoctorSearch = useMemo(
    () => normalizeDoctorSearch(debouncedSearchTerm),
    [debouncedSearchTerm]
  );

  const filterResetKey = useMemo(
    () =>
      JSON.stringify({
        search: normalizedDoctorSearch,
        selectedSpecialties,
        selectedLocations,
        selectedAvailability,
        selectedRating,
        selectedGender,
        sortBy,
        hospitalName,
        hospitalId,
      }),
    [
      normalizedDoctorSearch,
      selectedSpecialties,
      selectedLocations,
      selectedAvailability,
      selectedRating,
      selectedGender,
      sortBy,
      hospitalName,
      hospitalId,
    ]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoadDone(false);
    requestingPageRef.current = false;
  }, [filterResetKey]);

  const { data: specialtiesData } = useFetch({
    method: "GET",
    request: "specialty/",
  });

  const { data: citiesData, error: citiesError } = useFetch({
    method: "GET",
    request: "https://admin.vaidyabandhu.com/api/city/",
  });

  useEffect(() => {
    if (citiesData?.data) {
      const transformed = citiesData.data.map((city) => ({
        id: city.id,
        name: city.city_name,
      }));
      setLocations(transformed);
      return;
    }

    if (citiesError) {
      setLocations([
        { id: "Delhi", name: "Delhi" },
        { id: "Mumbai", name: "Mumbai" },
        { id: "Bangalore", name: "Bangalore" },
        { id: "Chennai", name: "Chennai" },
        { id: "Hyderabad", name: "Hyderabad" },
      ]);
    }
  }, [citiesData, citiesError]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch({
    method: "GET",
    request: "https://admin.vaidyabandhu.com/api/doctors",
    params: {
      search: normalizedDoctorSearch,
      specialties: selectedSpecialties.join(","),
      city: selectedLocations.join(","),
      availability: selectedAvailability.join(","),
      rating: selectedRating,
      gender: selectedGender,
      sort: sortBy,
      page_count: itemPerPage,
      page,
      hospital_ids: hospitalId,
      name: hospitalName,
    },
  });

  useEffect(() => {
    if (!data || !Array.isArray(data.data)) {
      if (page > 1 && data) {
        setHasMore(false);
        requestingPageRef.current = false;
      }
      return;
    }

    const incoming = data.data;

    if (page > 1 && incoming.length === 0) {
      setHasMore(false);
      setInitialLoadDone(true);
      requestingPageRef.current = false;
      return;
    }

    setDoctors((previous) => {
      const merged =
        page === 1
          ? incoming
          : [
              ...previous,
              ...incoming.filter(
                (doctor) => !previous.some((item) => item.id === doctor.id)
              ),
            ];

      const totalCount = Number(data?.pagination_data?.total_count || 0);
      const canLoadMore = totalCount
        ? merged.length < totalCount
        : incoming.length === itemPerPage;

      setHasMore(canLoadMore);
      return merged;
    });

    setInitialLoadDone(true);
    requestingPageRef.current = false;
  }, [data, itemPerPage, page]);

  useEffect(() => {
    if (!loading) {
      requestingPageRef.current = false;
    }
  }, [loading]);

  useEffect(() => {
    if (!loadMoreRef.current || !initialLoadDone || !hasMore || loading || error) {
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
      { rootMargin: "240px 0px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [error, hasMore, initialLoadDone, loading]);

  const filteredSpecialties = useMemo(
    () =>
      specialtiesData?.data?.filter(
        (specialty) =>
          specialty.title &&
          specialty.title
            .toLowerCase()
            .includes(specialtySearchTerm.toLowerCase().trim())
      ) || [],
    [specialtiesData?.data, specialtySearchTerm]
  );

  const filteredLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          location.name &&
          location.name.toLowerCase().includes(locationSearchTerm.toLowerCase().trim())
      ),
    [locationSearchTerm, locations]
  );

  const hospitalDetails = useMemo(() => {
    const routeHospital =
      location?.state?.hospital &&
      (!hospitalId || String(location.state.hospital.id) === String(hospitalId))
        ? location.state.hospital
        : null;

    if (routeHospital) {
      return routeHospital;
    }

    const matchedHospital = doctors
      .flatMap((doctor) => (Array.isArray(doctor?.hospital) ? doctor.hospital : []))
      .find((hospital) => String(hospital?.id) === String(hospitalId));

    return matchedHospital || null;
  }, [doctors, hospitalId, location?.state?.hospital]);

  const hospitalAddress = useMemo(
    () => getHospitalDisplayAddress(hospitalDetails || {}),
    [hospitalDetails]
  );

  const hospitalPhone = useMemo(
    () => getHospitalContact(hospitalDetails || {}),
    [hospitalDetails]
  );

  const hasActiveFilters =
    searchTerm ||
    selectedSpecialties.length > 0 ||
    selectedLocations.length > 0 ||
    selectedAvailability.length > 0 ||
    selectedRating ||
    selectedGender ||
    sortBy ||
    hospitalName;

  const getActiveFilters = () => {
    const filters = [];

    selectedSpecialties.forEach((id) => {
      const specialty = specialtiesData?.data?.find((item) => item.id === id);
      if (specialty) {
        filters.push({ type: "specialty", id, label: specialty.title });
      }
    });

    selectedLocations.forEach((id) => {
      const location = locations.find((item) => item.id === id);
      if (location) {
        filters.push({ type: "location", id, label: location.name });
      }
    });

    selectedAvailability.forEach((day) => {
      filters.push({ type: "availability", id: day, label: day });
    });

    if (selectedRating) {
      const rating = ratingOptions.find((item) => item.value === selectedRating);
      if (rating) {
        filters.push({ type: "rating", id: selectedRating, label: rating.label });
      }
    }

    if (selectedGender) {
      const gender = genderOptions.find((item) => item.value === selectedGender);
      if (gender) {
        filters.push({ type: "gender", id: selectedGender, label: gender.label });
      }
    }

    if (hospitalName) {
      filters.push({
        type: "hospital_name",
        id: hospitalName,
        label: `Hospital: ${hospitalName}`,
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  const clearSearch = () => setSearchTerm("");

  const handleSpecialtyChange = (specialtyId) => {
    setSelectedSpecialties((previous) =>
      previous.includes(specialtyId)
        ? previous.filter((id) => id !== specialtyId)
        : [...previous, specialtyId]
    );
  };

  const handleLocationChange = (locationId) => {
    setSelectedLocations((previous) =>
      previous.includes(locationId)
        ? previous.filter((id) => id !== locationId)
        : [...previous, locationId]
    );
  };

  const handleAvailabilityChange = (day) => {
    setSelectedAvailability((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedLocations([]);
    setSelectedAvailability([]);
    setSelectedRating("");
    setSelectedGender("");
    setSortBy("");
    setSpecialtySearchTerm("");
    setLocationSearchTerm("");
    setHospitalName("");
  };

  const removeFilter = (filterType, filterId) => {
    switch (filterType) {
      case "specialty":
        setSelectedSpecialties((previous) =>
          previous.filter((id) => id !== filterId)
        );
        break;
      case "location":
        setSelectedLocations((previous) =>
          previous.filter((id) => id !== filterId)
        );
        break;
      case "availability":
        setSelectedAvailability((previous) =>
          previous.filter((item) => item !== filterId)
        );
        break;
      case "rating":
        setSelectedRating("");
        break;
      case "gender":
        setSelectedGender("");
        break;
      case "hospital_name":
        setHospitalName("");
        break;
      default:
        break;
    }
  };

  const filtersContent = (
    <>
      <div className="vb-filter-group">
        <h4>Specialities</h4>
        <input
          type="text"
          className="vb-filter-input"
          placeholder="Search speciality"
          value={specialtySearchTerm}
          onChange={(event) => setSpecialtySearchTerm(event.target.value)}
        />
        <div className="vb-check-list" style={{ marginTop: "0.5rem" }}>
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((specialty) => (
              <label className="vb-check-item" key={specialty.id}>
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty.id)}
                  onChange={() => handleSpecialtyChange(specialty.id)}
                />
                <span>{specialty.title}</span>
              </label>
            ))
          ) : (
            <p className="vb-mini" style={{ margin: 0 }}>
              No specialities found.
            </p>
          )}
        </div>
      </div>

      <div className="vb-filter-group">
        <h4>City</h4>
        <input
          type="text"
          className="vb-filter-input"
          placeholder="Search city"
          value={locationSearchTerm}
          onChange={(event) => setLocationSearchTerm(event.target.value)}
        />
        <div className="vb-check-list" style={{ marginTop: "0.5rem" }}>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <label className="vb-check-item" key={location.id}>
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location.id)}
                  onChange={() => handleLocationChange(location.id)}
                />
                <span>{location.name}</span>
              </label>
            ))
          ) : (
            <p className="vb-mini" style={{ margin: 0 }}>
              No cities found.
            </p>
          )}
        </div>
      </div>

      <div className="vb-filter-group">
        <h4>Availability</h4>
        <div className="vb-check-list">
          {availabilityOptions.map((day) => (
            <label className="vb-check-item" key={day}>
              <input
                type="checkbox"
                checked={selectedAvailability.includes(day)}
                onChange={() => handleAvailabilityChange(day)}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="vb-filter-group">
        <h4>Rating</h4>
        <select
          className="vb-filter-input"
          value={selectedRating}
          onChange={(event) => setSelectedRating(event.target.value)}
        >
          <option value="">Any rating</option>
          {ratingOptions.map((rating) => (
            <option key={rating.value} value={rating.value}>
              {rating.label}
            </option>
          ))}
        </select>
      </div>

      <div className="vb-filter-group">
        <h4>Gender</h4>
        <select
          className="vb-filter-input"
          value={selectedGender}
          onChange={(event) => setSelectedGender(event.target.value)}
        >
          <option value="">Any gender</option>
          {genderOptions.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </select>
      </div>

      <div className="vb-filter-group">
        <h4>Hospital Name</h4>
        <input
          type="text"
          className="vb-filter-input"
          placeholder="Type hospital name"
          value={hospitalName}
          onChange={(event) => setHospitalName(event.target.value)}
        />
      </div>

      <div className="vb-filter-actions">
        <button
          type="button"
          className="vb-btn vb-btn-secondary"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="vb-btn vb-btn-primary"
          onClick={() => setShowMobileFilters(false)}
        >
          Apply
        </button>
      </div>
    </>
  );

  return (
    <section className="vb-list-page">
      <div className="vb-list-shell">
        {hospitalDetails && (
          <section className="vb-hospital-hero-card" aria-label="Selected hospital details">
            <div className="vb-hospital-hero-media">
              <img
                src={getHospitalDisplayImage(hospitalDetails)}
                alt={hospitalDetails?.name || "Hospital"}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/assets/img/default-img.jpg";
                }}
              />
            </div>

            <div className="vb-hospital-hero-body">
              <span className="vb-pill">Selected Hospital</span>
              <h2 className="vb-hospital-hero-title">
                {hospitalDetails?.name || "Hospital"}
              </h2>

              {hospitalAddress && (
                <p className="vb-hospital-hero-address">
                  <i className="fal fa-map-marker-alt" aria-hidden="true" />
                  <span>{hospitalAddress}</span>
                </p>
              )}

              <div className="vb-hospital-hero-meta">
                {hospitalPhone && (
                  <span>
                    <i className="fal fa-phone-alt" aria-hidden="true" />
                    <span>{hospitalPhone}</span>
                  </span>
                )}

                {(hospitalDetails?.city || hospitalDetails?.city_name) && (
                  <span>
                    <i className="fal fa-city" aria-hidden="true" />
                    <span>{hospitalDetails?.city || hospitalDetails?.city_name}</span>
                  </span>
                )}

                <span>
                  <i className="fal fa-user-md" aria-hidden="true" />
                  <span>
                    {doctors.length} doctor{doctors.length === 1 ? "" : "s"} available
                  </span>
                </span>
              </div>
            </div>
          </section>
        )}

        <div className="vb-list-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search doctors, hospitals, specialities..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="vb-icon-btn"
              aria-label="Clear doctor search"
            >
              ×
            </button>
          )}
        </div>

        <div className="vb-results-header">
          <div>
            <h3 className="vb-filter-title" style={{ marginBottom: "0.2rem" }}>
              Discover Doctors
            </h3>
            <p className="vb-mini" style={{ margin: 0 }}>
              Showing {doctors.length} doctor{doctors.length === 1 ? "" : "s"}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="vb-btn vb-btn-secondary vb-mobile-filter-trigger"
              onClick={() => setShowMobileFilters(true)}
            >
              Filters
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="vb-btn vb-btn-secondary"
                onClick={handleReset}
              >
                Clear Filters
              </button>
            )}
          </div>

          {activeFilters.length > 0 && (
            <div className="vb-chip-wrap" style={{ width: "100%" }}>
              {activeFilters.map((filter) => (
                <span className="vb-chip" key={`${filter.type}-${filter.id}`}>
                  {filter.label}
                  <button
                    type="button"
                    onClick={() => removeFilter(filter.type, filter.id)}
                    aria-label={`Remove ${filter.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="vb-list-layout">
          <aside className="vb-filter-panel" aria-label="Doctor filters">
            {filtersContent}
          </aside>

          <div>
            {error && page === 1 && (
              <div className="vb-error-box">
                <h4 style={{ marginTop: 0 }}>Couldn’t load doctors</h4>
                <p style={{ marginBottom: "0.8rem" }}>{error}</p>
                <button type="button" className="vb-btn vb-btn-primary" onClick={refetch}>
                  Try Again
                </button>
              </div>
            )}

            {loading && page === 1 && !initialLoadDone && (
              <div className="vb-loading">
                <i className="fas fa-circle-notch fa-spin" aria-hidden="true" />
                <p style={{ margin: "0.5rem 0 0" }}>Fetching doctor list...</p>
              </div>
            )}

            {!loading && !error && initialLoadDone && doctors.length === 0 && (
              <div className="vb-empty">
                <h4 style={{ marginTop: 0 }}>No doctors found</h4>
                <p style={{ marginBottom: 0 }}>
                  Try adjusting the filters or clearing your search.
                </p>
              </div>
            )}

            {doctors.length > 0 && (
              <div className="vb-card-stack">
                {doctors.map((item) => {
                  const hospitals = item?.hospital || [];
                  const hospitalNames = hospitals
                    .map((hospital) => hospital.name)
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <article className="vb-doctor-card" key={item.id}>
                      <div className="vb-doctor-grid">
                        <div className="vb-doctor-media">
                          <img
                            src={
                              item?.photo && item.photo.trim() !== ""
                                ? item.photo
                                : "/assets/img/default-img.jpg"
                            }
                            alt={item?.full_name || "Doctor"}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = "/assets/img/default-img.jpg";
                            }}
                          />
                        </div>

                        <div className="vb-doctor-body">
                          <div className="vb-doctor-head">
                            <div>
                              <h3 className="vb-doctor-name">{item.full_name}</h3>
                              <p className="vb-mini">{item.designation || "Designation not specified"}</p>
                              <span className="vb-doctor-verified">✓ Verified</span>
                            </div>
                            <Link
                              to={`/doctor-details?id=${item.id}`}
                              className="vb-btn vb-btn-primary"
                            >
                              View Profile
                            </Link>
                          </div>

                          <p className="vb-mini" style={{ margin: 0 }}>
                            <i className="fal fa-hospital" style={{ marginRight: "0.3rem" }} />
                            {hospitalNames || "Hospital not specified"}
                          </p>

                          {item.department_name && (
                            <p className="vb-mini" style={{ margin: 0 }}>
                              <i className="fal fa-layer-group" style={{ marginRight: "0.3rem" }} />
                              {item.department_name}
                            </p>
                          )}

                          <div className="vb-tag-row">
                            {Array.isArray(item.speciality) && item.speciality.length > 0 ? (
                              item.speciality.slice(0, 3).map((speciality, index) => (
                                <span className="vb-tag" key={`${item.id}-${speciality.id || index}`}>
                                  {speciality.title}
                                </span>
                              ))
                            ) : (
                              <span className="vb-tag">Speciality not specified</span>
                            )}
                          </div>

                          <ul className="vb-info-list">
                            <li>
                              <strong>Qualification:</strong> {item.qualification || "Not specified"}
                            </li>
                            <li>
                              <strong>Experience:</strong> {item.experience || 0} Yrs
                            </li>
                          </ul>

                          <div className="vb-card-actions">
                            <Link to={`/doctor-details?id=${item.id}`} className="vb-btn vb-btn-secondary">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {loading && page > 1 && (
              <p className="vb-load-more-note">
                <i className="fas fa-circle-notch fa-spin" /> Loading more doctors...
              </p>
            )}

            <div className="vb-load-sentinel" ref={loadMoreRef} />
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="vb-mobile-filter-sheet" onClick={() => setShowMobileFilters(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.8rem",
              }}
            >
              <h3 className="vb-filter-title">Filters</h3>
              <button
                type="button"
                className="vb-icon-btn"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            {filtersContent}
          </div>
        </div>
      )}
    </section>
  );
};

export default Content;
