import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { useLocation } from "react-router-dom";
import { isNotEmptyArray } from "../../utiles/utils";
import { useFetch } from "../../hooks/usefetch";

// Responsive filter sidebar for mobile + desktop
function FilterSidebar({
  filtersContent,
  showMobileFilters,
  setShowMobileFilters,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {showMobileFilters && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040, background: "rgba(0,0,0,0.3)" }}
          onClick={() => setShowMobileFilters(false)}
        />
      )}
      {/* Mobile drawer */}
      <div
        className="card shadow-sm d-md-none"
        style={{
          position: "fixed",
          left: showMobileFilters ? 0 : "-100vw",
          top: 0,
          height: "100vh",
          maxWidth: "90vw",
          width: "320px",
          transition: "left 0.3s",
          background: "#fff",
          zIndex: 1050,
          padding: "16px 10px",
          overflowY: "auto",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          className="btn btn-link"
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            fontSize: 22,
            color: "#444",
            zIndex: 10,
          }}
          onClick={() => setShowMobileFilters(false)}
        >
          ×
        </button>
        <div className="card-body pt-4">{filtersContent}</div>
      </div>
      {/* Desktop sidebar */}
      <div className="d-none d-md-block">
        <div className="card shadow-sm">
          <div className="card-body">{filtersContent}</div>
        </div>
      </div>
    </>
  );
}

const Content = () => {
  const [locations, setLocations] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [itemPerpage] = useState(5);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const specialtyParam = params.get("specialty");
  const id = params.get("id");
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    specialtyParam ? [Number(specialtyParam)] : []
  );
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  console.log({ selectedGender, selectedRating });
  // Static options
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
  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  // Fetch specialties
  const {
    data: specialtiesData,
    loading: specialtiesLoading,
    error: specialtiesError,
  } = useFetch({ method: "GET", request: "specialty/" });
  // Fetch locations
  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
  } = useFetch({
    method: "GET",
    request: "https://admin.vaidyabandhu.com/api/locations/",
  });
  useEffect(() => {
    if (locationsData) setLocations(locationsData.data || []);
    if (locationsError) {
      setLocations([
        { id: "Delhi", name: "Delhi" },
        { id: "Mumbai", name: "Mumbai" },
        { id: "Bangalore", name: "Bangalore" },
        { id: "Chennai", name: "Chennai" },
        { id: "Hyderabad", name: "Hyderabad" },
      ]);
    }
  }, [locationsData, locationsError]);
  // Fetch doctors
  const {
    data,
    loading: loader,
    error,
    refetch,
  } = useFetch({
    method: "GET",
    request: "doctors/",
    params: {
      search: debouncedSearchTerm.trim(),
      specialties: selectedSpecialties.join(","),
      locations: selectedLocations.join(","),
      availability: selectedAvailability.join(","),
      rating: selectedRating,
      gender: selectedGender,
      sort: sortBy,
      page_count: itemPerpage,
      page: activePage,
      hostital_id: id,
    },
  });
  console.log({ loader, data });
  // Filter Handlers
  const handlePageChange = (pageNumber) => setActivePage(pageNumber);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");
  const handleSpecialtyChange = (specialtyId) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialtyId)
        ? prev.filter((id) => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };
  const handleLocationChange = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };
  const handleAvailabilityChange = (day) => {
    setSelectedAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handleReset = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedLocations([]);
    setSelectedAvailability([]);
    setSelectedRating("");
    setSelectedGender("");
    setSortBy("");
    setSpecialtySearchTerm("");
    setLocationSearchTerm("");
  };
  const hasActiveFilters =
    searchTerm ||
    selectedSpecialties.length > 0 ||
    selectedLocations.length > 0 ||
    selectedAvailability.length > 0 ||
    selectedRating ||
    selectedGender ||
    sortBy;
  // Filtered
  const filteredSpecialties = specialtiesData?.data?.filter((specialty) =>
    specialty.title.toLowerCase().includes(specialtySearchTerm.toLowerCase())
  );
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );
  // Filter chips
  const getActiveFilters = () => {
    const filters = [];
    if (selectedSpecialties.length > 0) {
      selectedSpecialties.forEach((id) => {
        const specialty = specialtiesData?.data?.find((s) => s.id === id);
        if (specialty)
          filters.push({ type: "specialty", id, label: specialty.title });
      });
    }
    if (selectedLocations.length > 0) {
      selectedLocations.forEach((id) => {
        const location = locations.find((l) => l.id === id);
        if (location)
          filters.push({ type: "location", id, label: location.name });
      });
    }
    if (selectedAvailability.length > 0) {
      selectedAvailability.forEach((day) =>
        filters.push({ type: "availability", id: day, label: day })
      );
    }
    if (selectedRating) {
      const rating = ratingOptions.find((r) => r.value === selectedRating);
      if (rating)
        filters.push({
          type: "rating",
          id: selectedRating,
          label: rating.label,
        });
    }
    if (selectedGender) {
      const gender = genderOptions.find((g) => g.value === selectedGender);
      if (gender)
        filters.push({
          type: "gender",
          id: selectedGender,
          label: gender.label,
        });
    }
    return filters;
  };
  const removeFilter = (filterType, filterId) => {
    switch (filterType) {
      case "specialty":
        setSelectedSpecialties((prev) => prev.filter((id) => id !== filterId));
        break;
      case "location":
        setSelectedLocations((prev) => prev.filter((id) => id !== filterId));
        break;
      case "availability":
        setSelectedAvailability((prev) =>
          prev.filter((day) => day !== filterId)
        );
        break;
      case "rating":
        setSelectedRating("");
        break;
      case "gender":
        setSelectedGender("");
        break;
      default:
        break;
    }
  };
  const activeFilters = getActiveFilters();
  // Filters sidebar content (single instance, used twice)
  const filtersContent = (
    <>
      {/* Specialities */}
      <div className="mb-4">
        <h6 className="font-weight-bold mb-3">Specialities</h6>
        <div className="form-group">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Search Speciality"
              value={specialtySearchTerm}
              onChange={(e) => setSpecialtySearchTerm(e.target.value)}
              style={{ paddingRight: specialtySearchTerm ? "35px" : "12px" }}
            />
            {specialtySearchTerm && (
              <button
                onClick={() => setSpecialtySearchTerm("")}
                className="btn btn-link p-0"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "20px",
                  fontSize: "18px",
                  color: "#FFF",
                  textDecoration: "none",
                  lineHeight: "1",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {!isNotEmptyArray(filteredSpecialties) ? (
            <p className="text-muted small">No specialties found</p>
          ) : (
            filteredSpecialties.map((specialty) => (
              <div key={specialty.id} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`specialty-${specialty.id}`}
                  checked={selectedSpecialties.includes(specialty.id)}
                  onChange={() => handleSpecialtyChange(specialty.id)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`specialty-${specialty.id}`}
                >
                  {specialty.title}
                </label>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Location */}
      <div className="mb-4">
        <h6 className="font-weight-bold mb-3">City</h6>
        <div className="form-group">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm mb-3"
              placeholder="Search Cities"
              value={locationSearchTerm}
              onChange={(e) => setLocationSearchTerm(e.target.value)}
              style={{ paddingRight: locationSearchTerm ? "35px" : "12px" }}
            />
            {locationSearchTerm && (
              <button
                onClick={() => setLocationSearchTerm("")}
                className="btn btn-link p-0"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "20px",
                  fontSize: "18px",
                  color: "#6c757d",
                  textDecoration: "none",
                  lineHeight: "1",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredLocations.length === 0 ? (
            <p className="text-muted small">No locations found</p>
          ) : (
            filteredLocations.map((location) => (
              <div key={location.id} className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`location-${location.id}`}
                  checked={selectedLocations.includes(location.id)}
                  onChange={() => handleLocationChange(location.id)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`location-${location.id}`}
                >
                  {location.name}
                </label>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Availability */}
      <div className="mb-4">
        <h6 className="font-weight-bold mb-3">Availability</h6>
        <div className="row">
          {availabilityOptions.map((day) => (
            <div key={day} className="col-6 mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`day-${day}`}
                  checked={selectedAvailability.includes(day)}
                  onChange={() => handleAvailabilityChange(day)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`day-${day}`}
                >
                  {day.slice(0, 3)}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Rating  */}
      {/* <div className="mb-4">
        <h6 className="font-weight-bold mb-3">Rating</h6>
        {ratingOptions.map((rating) => (
          <div key={rating.value} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id={`rating-${rating.value}`}
              checked={selectedRating === rating.value}
              onChange={() =>
                setSelectedRating(
                  selectedRating === rating.value ? "" : rating.value
                )
              }
            />
            <label
              className="form-check-label small"
              htmlFor={`rating-${rating.value}`}
            >
              {rating.label}
            </label>
          </div>
        ))}
      </div> */}
      {/* Gender */}
      {/* <div className="mb-4">
        <h6 className="font-weight-bold mb-3">Gender</h6>
        {genderOptions.map((gender) => (
          <div key={gender.value} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id={`gender-${gender.value}`}
              checked={selectedGender === gender.value}
              onChange={() =>
                setSelectedGender(
                  selectedGender === gender.value ? "" : gender.value
                )
              }
            />
            <label
              className="form-check-label small"
              htmlFor={`gender-${gender.value}`}
            >
              {gender.label}
            </label>
          </div>
        ))}
      </div> */}
    </>
  );

  return (
    <div className="sidebar-style-9 container-bg">
      <div className="section section-padding">
        <div className="container-fluid">
          {/* Top Search Bar - Centered */}
          <div className="row mb-4 justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12 d-flex justify-content-center">
              <div className="search-container">
                <div
                  className="search-wrapper d-flex align-items-center"
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "50px",
                    padding: "0px 23px",
                    border: "1px solid #e9ecef",
                    width: "130%",
                    maxWidth: "500px",
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search for Doctors & Specialities...."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control border-0 bg-transparent"
                    style={{
                      fontSize: "16px",
                      padding: "12px 40px",
                      paddingRight: searchTerm ? "50px" : "40px",
                      outline: "none",
                      boxShadow: "none",
                      marginBottom: "0px",
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="btn btn-link p-0"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                        color: "rgb(244 250 255)",
                        textDecoration: "none",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                        zIndex: 10,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Chips Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="filter-section">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                  <div className="d-flex flex-wrap align-items-center">
                    <div className="d-flex flex-wrap align-items-center mb-2">
                      <h5
                        className="mb-0 me-3"
                        style={{ fontSize: "16px", fontWeight: "600" }}
                      >
                        Filters
                      </h5>
                      {/* Mobile filter toggle */}
                      <button
                        className="btn me-2 btn-primary flex-fill d-flex align-items-center justify-content-center gap-2 ms-2 d-md-none"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        style={{ borderRadius: "12px" }}
                      >
                        <i
                          className="fas fa-filter"
                          style={{ fontSize: "16px" }}
                        ></i>
                        Filters
                        {hasActiveFilters && (
                          <span className="badge bg-light text-primary rounded-pill">
                            {selectedSpecialties.length +
                              selectedLocations.length +
                              selectedAvailability.length +
                              (selectedRating ? 1 : 0) +
                              (selectedGender ? 1 : 0)}
                          </span>
                        )}
                      </button>
                      {hasActiveFilters && (
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={handleReset}
                          style={{
                            borderRadius: "20px",
                            padding: "5px 15px",
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#FFF",
                          }}
                        >
                          RESET
                        </button>
                      )}
                    </div>
                    <div className="filter-chips-container d-flex flex-wrap">
                      {activeFilters.map((filter, index) => (
                        <span
                          key={index}
                          className="badge badge-light d-flex align-items-center me-2 mb-2"
                          style={{
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "15px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#495057",
                          }}
                        >
                          {filter.label}
                          <button
                            className="btn btn-link p-0 ms-2"
                            onClick={() => removeFilter(filter.type, filter.id)}
                            style={{
                              fontSize: "14px",
                              color: "#FFF",
                              textDecoration: "none",
                              lineHeight: "1",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 col-md-4 mb-4">
              <FilterSidebar
                filtersContent={filtersContent}
                showMobileFilters={showMobileFilters}
                setShowMobileFilters={setShowMobileFilters}
              />
            </div>
            {/* Doctor List */}
            <div className="col-lg-9 col-md-8">
              {error ? (
                <div className="alert alert-danger text-center">
                  <h5>Error</h5>
                  <p>{error}</p>
                  <button className="btn btn-primary mt-2" onClick={refetch}>
                    Try Again
                  </button>
                </div>
              ) : loader ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Fetching doctor list...</p>
                </div>
              ) : !isNotEmptyArray(data?.data) ? (
                <div className="text-center py-5">
                  <h5>No doctors found</h5>
                  <p>
                    Try adjusting your search criteria or reset the filters.
                  </p>
                </div>
              ) : (
                <>
                  {data.data.map((item) => (
                    <div className="sigma_team style-17" key={item.id}>
                      <div className="row no-gutters">
                        <div className="col-md-3">
                          <div className="sigma_team-thumb">
                            <img
                              src={item.photo}
                              alt={item.full_name}
                              style={{ maxHeight: "auto", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                        <div className="col-md-5 col-sm-6">
                          <div className="sigma_team-body">
                            <h5>
                              <Link to={`/doctor-details?id=${item.id}`}>
                                {item.full_name}
                              </Link>
                            </h5>
                            <div className="sigma_team-categories">
                              {item.speciality?.map((specialityItem, index) => (
                                <Link
                                  to={`/doctor-details?id=${specialityItem.id}`}
                                  className="sigma_team-category"
                                  key={index}
                                >
                                  {specialityItem.title}
                                  {index !== item.speciality.length - 1 && ", "}
                                </Link>
                              ))}
                            </div>
                            <p>{item.qualification}</p>
                            <div className="d-flex align-items-center mt-4">
                              <Link
                                to={`/doctor-details?id=${item.id}`}
                                className="sigma_btn"
                              >
                                View More
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-6">
                          <div className="sigma_team-footer">
                            <div className="sigma_team-info">
                              <span>
                                <i className="fal fa-map-marker-alt" />
                                {isNotEmptyArray(item?.hospital)
                                  ? item.hospital
                                      .map((el) => el.hospital_name)
                                      .join(", ")
                                  : "Not specified"}
                              </span>
                              <span>
                                <i className="fal fa-award" />
                                {item.experience} Yrs Experience
                              </span>
                              <span>
                                <i className="fal fa-calendar" />
                                {item.educational_degrees}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Pagination */}
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={itemPerpage}
                      totalItemsCount={data?.pagination_data?.total_count}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange}
                      innerClass="pagination"
                      activeClass="active"
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile pagination styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .pagination .page-link {
            padding: 4px 10px;
            font-size: 14px;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Content;