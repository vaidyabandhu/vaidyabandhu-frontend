import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building,
  CheckCircle,
  Copy,
  Filter,
  MapIcon,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Star,
  X,
} from "lucide-react";
import { OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ShowEnquireModal from "./showEnquireModal";
import { useFetch } from "../../hooks/usefetch";
import {
  getAreaLabel,
  rankDirectoryItems,
  sortDirectoryItems,
} from "../../utiles/directorySearch";
import { isNotEmptyArray } from "../../utiles/utils";

const SEARCH_PAGE_SIZE = 500;

const normalizeFilterValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase();

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [value];
};

const getCategoryTokens = (entry) => {
  if (!entry) {
    return [];
  }

  if (typeof entry === "string" || typeof entry === "number") {
    return [String(entry)];
  }

  if (Array.isArray(entry)) {
    return entry.flatMap((item) => getCategoryTokens(item));
  }

  const keys = [
    "id",
    "name",
    "title",
    "category",
    "category_name",
    "subcategory",
    "subcategory_name",
    "sub_category",
    "sub_category_name",
    "service",
    "service_name",
    "service_id",
    "parent_id",
    "parent_name",
    "main_category",
    "main_category_name",
    "main_category_id",
    "sub_category_id",
    "subcategory_id",
  ];

  const nestedKeys = [
    "parent",
    "service_detail",
    "service_details",
    "main_category_detail",
  ];

  return [
    ...keys.flatMap((key) => getCategoryTokens(entry[key])),
    ...nestedKeys.flatMap((key) => getCategoryTokens(entry[key])),
  ];
};

const getCenterCategoryTokenSet = (center) => {
  const categories = [
    ...toArray(center?.category),
    ...toArray(center?.categories),
    ...toArray(center?.sub_category),
    ...toArray(center?.subcategory),
    ...toArray(center?.services),
  ];

  return new Set(
    categories
      .flatMap((item) => getCategoryTokens(item))
      .map((item) => normalizeFilterValue(item))
      .filter(Boolean)
  );
};

const matchesAnySelection = (centerTokens, selectedIds = [], selectedLabels = []) => {
  if (!selectedIds.length && !selectedLabels.length) {
    return true;
  }

  const tokenList = Array.from(centerTokens);

  return [...selectedIds, ...selectedLabels]
    .map((item) => normalizeFilterValue(item))
    .filter(Boolean)
    .some(
      (candidate) =>
        centerTokens.has(candidate) ||
        tokenList.some((token) => token.includes(candidate))
    );
};

const getCenterCityCandidates = (center) =>
  [
    center?.city,
    center?.city_name,
    center?.cityName,
    center?.location,
    center?.area,
    center?.locality,
    center?.neighborhood,
    center?.address,
    center?.city_id,
    center?.cityId,
  ]
    .map((value) => normalizeFilterValue(value))
    .filter(Boolean);

const DiagnosticCentersApp = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();

  const [serviceSearch, setServiceSearch] = useState("");

  const token = localStorage.getItem("token");
  const itemsPerPage = 5;
  const defaultImage =
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const isClientSearchActive = debouncedSearchTerm.trim().length > 0;
  const hasClientFilters =
    isClientSearchActive ||
    Boolean(selectedAddress) ||
    selectedServices.length > 0 ||
    selectedSubServices.length > 0;

  const {
    data: services,
    loading: loadingServices,
    error: errorServices,
    refetch: fetchServices,
  } = useFetch({
    method: "GET",
    request: "diagnostic/diagnostic-category",
    params: {
      pagination: false,
    },
  });

  const {
    data: diagnosticCenters,
    loading: loadingCenters,
    error: errorCenters,
    refetch: refreshListApi,
  } = useFetch({
    method: "GET",
    request: "diagnostic/list-center",
    params: {
      page_count: (hasClientFilters ? SEARCH_PAGE_SIZE : itemsPerPage).toString(),
      page: hasClientFilters ? "1" : currentPage.toString(),
      search: hasClientFilters ? "" : debouncedSearchTerm.trim(),
      city: "",
      services: "",
      category: "",
    },
  });

  const {
    data: citiesData,
    loading: loadingAddresses,
    error: citiesError,
  } = useFetch({
    method: "GET",
    request: "https://admin.vaidyabandhu.com/api/city/",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  useEffect(() => {
    if (citiesData && citiesData.data) {
      const transformedCities = citiesData.data.map((city) => ({
        id: city.id,
        name: city.city_name,
      }));
      setAddresses(transformedCities);
    }

    if (citiesError) {
      // eslint-disable-next-line no-console
      console.error("Error fetching cities:", citiesError);
      setAddresses([
        { id: "Delhi", name: "Delhi" },
        { id: "Mumbai", name: "Mumbai" },
        { id: "Bangalore", name: "Bangalore" },
        { id: "Chennai", name: "Chennai" },
        { id: "Hyderabad", name: "Hyderabad" },
      ]);
    }
  }, [citiesData, citiesError]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((previous) =>
      previous.includes(serviceId)
        ? previous.filter((item) => item !== serviceId)
        : [...previous, serviceId]
    );
    setSelectedSubServices([]);
    setCurrentPage(1);
  };

  const handleSubServiceToggle = (subServiceId) => {
    setSelectedSubServices((previous) =>
      previous.includes(subServiceId)
        ? previous.filter((item) => item !== subServiceId)
        : [...previous, subServiceId]
    );
    setCurrentPage(1);
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
    setCurrentPage(1);
  };

  const handleEnquire = async () => {
    const hasToken = token;

    if (hasToken) {
      try {
        const response = await fetch("https://admin.vaidyabandhu.com/api/enquiry/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            full_name: "test",
            phone: "1234567898",
            email: "email@email.com",
            address: "Bangalore",
          }),
        });

        if (response.ok) {
          toast.success("Enquiry submitted successfully!", {
            position: "top-center",
          });
        } else {
          toast.error("Failed to submit enquiry. Please try again.", {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error("Error occurred while submitting enquiry.", {
          position: "top-center",
        });
        // eslint-disable-next-line no-console
        console.error("Enquiry error:", error);
      }
      return;
    }

    setShowEnquireModal(true);
  };

  const handleCenterClick = (center) => {
    navigate(`/clinic-list-details?id=${center.id}`);
  };

  const clearFilters = () => {
    setSelectedAddress("");
    setSelectedServices([]);
    setSelectedSubServices([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const totalPages = useMemo(
    () =>
      hasClientFilters
        ? 1
        : Math.ceil(
            (diagnosticCenters?.pagination_data?.total_count ||
              diagnosticCenters?.data?.length ||
              0) / itemsPerPage
          ),
    [diagnosticCenters, hasClientFilters, itemsPerPage]
  );

  const hasActiveFilters = useMemo(
    () =>
      selectedAddress ||
      selectedServices.length > 0 ||
      selectedSubServices.length > 0 ||
      searchTerm,
    [selectedAddress, selectedServices, selectedSubServices, searchTerm]
  );

  const handleCopy = (event, text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text} has been copied.`, { position: "top-center" });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Failed to copy text: ", error);
      });

    event.stopPropagation();
  };

  const filteredServices = isNotEmptyArray(services?.data)
    ? services.data.filter((service) =>
        service.name.toLowerCase().includes(serviceSearch.trim().toLowerCase())
      )
    : [];

  const serviceNameById = useMemo(() => {
    const serviceMap = new Map();
    const subServiceMap = new Map();

    if (isNotEmptyArray(services?.data)) {
      services.data.forEach((service) => {
        serviceMap.set(String(service.id), service.name);

        if (isNotEmptyArray(service.sub_category)) {
          service.sub_category.forEach((sub) => {
            subServiceMap.set(String(sub.id), sub.name);
          });
        }
      });
    }

    return { serviceMap, subServiceMap };
  }, [services?.data]);

  const activeFilterCount =
    (selectedAddress ? 1 : 0) + selectedServices.length + selectedSubServices.length;

  const selectedCityMeta = useMemo(
    () => addresses.find((item) => String(item.id) === String(selectedAddress)),
    [addresses, selectedAddress]
  );

  const visibleCenters = useMemo(() => {
    const centers = Array.isArray(diagnosticCenters?.data) ? diagnosticCenters.data : [];
    const selectedServiceNames = selectedServices
      .map((item) => serviceNameById.serviceMap.get(String(item)))
      .filter(Boolean);
    const selectedSubServiceNames = selectedSubServices
      .map((item) => serviceNameById.subServiceMap.get(String(item)))
      .filter(Boolean);
    const normalizedSelectedCityId = normalizeFilterValue(selectedAddress);
    const normalizedSelectedCityName = normalizeFilterValue(selectedCityMeta?.name);

    const filteredCenters = centers.filter((center) => {
      const categoryTokens = getCenterCategoryTokenSet(center);

      const matchesCity =
        !selectedAddress ||
        getCenterCityCandidates(center).some(
          (candidate) =>
            candidate === normalizedSelectedCityId ||
            candidate === normalizedSelectedCityName ||
            (normalizedSelectedCityName && candidate.includes(normalizedSelectedCityName))
        );

      const matchesCategory = matchesAnySelection(
        categoryTokens,
        selectedServices,
        selectedServiceNames
      );

      const matchesSubCategory = matchesAnySelection(
        categoryTokens,
        selectedSubServices,
        selectedSubServiceNames
      );

      return matchesCity && matchesCategory && matchesSubCategory;
    });

    if (!isClientSearchActive) {
      return sortDirectoryItems(filteredCenters, (center) => center?.name);
    }

    return rankDirectoryItems(filteredCenters, debouncedSearchTerm, (center) => [
      { text: center?.name, priority: 0 },
      { text: getAreaLabel(center), priority: 1 },
      { text: center?.address, priority: 2 },
    ]);
  }, [
    debouncedSearchTerm,
    diagnosticCenters?.data,
    isClientSearchActive,
    selectedAddress,
    selectedCityMeta?.name,
    selectedServices,
    selectedSubServices,
    serviceNameById.serviceMap,
    serviceNameById.subServiceMap,
  ]);

  const renderFilterPanel = ({ mobile = false } = {}) => (
    <div className={`vb-filter-panel ${mobile ? "vb-filter-panel-mobile" : ""}`}>
      <div className="vb-results-header" style={{ marginBottom: "0.9rem" }}>
        <h3 className="vb-filter-title" style={{ margin: 0 }}>Filters</h3>
        {hasActiveFilters && (
          <button type="button" className="vb-btn vb-btn-secondary" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      <div className="vb-filter-group">
        <h4 className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
          <MapIcon size={14} /> City
        </h4>
        {loadingAddresses ? (
          <div className="py-2">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <select
            className="vb-filter-input"
            value={selectedAddress}
            onChange={handleAddressChange}
          >
            <option value="">All Cities</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="vb-filter-group">
        <h4 className="d-flex align-items-center" style={{ gap: "0.35rem" }}>
          <Shield size={14} /> Services
        </h4>

        {loadingServices ? (
          <div className="py-2">
            <Spinner animation="border" size="sm" />
          </div>
        ) : errorServices ? (
          <div className="vb-error-box" style={{ textAlign: "left", padding: "0.8rem" }}>
            <p style={{ marginBottom: "0.5rem" }}>{errorServices}</p>
            <button type="button" className="vb-btn vb-btn-secondary" onClick={fetchServices}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              className="vb-filter-input"
              placeholder="Search service"
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
              style={{ marginBottom: "0.6rem" }}
            />
            <div className="vb-check-list" style={{ maxHeight: "300px" }}>
              {isNotEmptyArray(filteredServices) ? (
                filteredServices.map((service) => (
                  <div key={service.id}>
                    <label className="vb-check-item">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                      />
                      <span>{service.name}</span>
                    </label>

                    {selectedServices.includes(service.id) &&
                      isNotEmptyArray(service.sub_category) && (
                        <div style={{ paddingLeft: "1.4rem", marginTop: "0.3rem" }}>
                          {service.sub_category.map((subService) => (
                            <label className="vb-check-item" key={subService.id}>
                              <input
                                type="checkbox"
                                checked={selectedSubServices.includes(subService.id)}
                                onChange={() => handleSubServiceToggle(subService.id)}
                              />
                              <span>{subService.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <p className="vb-load-more-note" style={{ textAlign: "left", padding: 0 }}>
                  No services found
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="vb-list-page vb-clinic-page">
      <div className="vb-list-shell">
        <div className="vb-list-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by center name or area"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <button
          type="button"
          className="vb-btn vb-btn-secondary vb-mobile-filter-trigger"
          onClick={() => setShowMobileFilters(true)}
        >
          <Filter size={16} /> Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>

        <div className="vb-list-layout">
          <div>{renderFilterPanel()}</div>

          <div>
            {hasActiveFilters && (
              <div className="vb-chip-wrap" style={{ marginBottom: "0.7rem" }}>
                {selectedAddress && (
                  <span className="vb-chip">
                    City: {addresses.find((item) => String(item.id) === String(selectedAddress))?.name || selectedAddress}
                  </span>
                )}
                {selectedServices.map((service) => (
                  <span key={`service-${service}`} className="vb-chip">
                    {serviceNameById.serviceMap.get(String(service)) || `Service #${service}`}
                  </span>
                ))}
                {selectedSubServices.map((service) => (
                  <span key={`sub-${service}`} className="vb-chip">
                    {serviceNameById.subServiceMap.get(String(service)) || `Sub #${service}`}
                  </span>
                ))}
              </div>
            )}

            {loadingCenters ? (
              <div className="vb-loading">
                <Spinner animation="border" />
                <p style={{ margin: "0.5rem 0 0" }}>Finding diagnostic centers...</p>
              </div>
            ) : errorCenters ? (
              <div className="vb-error-box">
                <AlertCircle className="mb-2" size={20} />
                <h4 style={{ marginTop: 0 }}>Couldn’t load centers</h4>
                <p>{errorCenters}</p>
                <button type="button" className="vb-btn vb-btn-secondary" onClick={refreshListApi}>
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            ) : !isNotEmptyArray(visibleCenters) ? (
              <div className="vb-empty">
                <Building className="mb-2" size={24} />
                <h4 style={{ marginTop: 0 }}>No diagnostic centers found</h4>
                <p style={{ marginBottom: hasActiveFilters ? "0.9rem" : 0 }}>
                  {selectedAddress || selectedServices.length > 0 || selectedSubServices.length > 0
                    ? "No diagnostic centers found for the selected filters."
                    : "No diagnostic centers found. Try a different name or area."}
                </p>
                {hasActiveFilters && (
                  <button className="vb-btn vb-btn-secondary" onClick={clearFilters}>
                    <X size={14} /> Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="vb-results-header">
                  <div>
                    <strong>{visibleCenters.length}</strong>{" "}
                    {hasClientFilters ? "matching center(s)" : "center(s) on this page"}
                  </div>
                  <div>
                    {hasClientFilters
                      ? "Results update instantly as filters change"
                      : `Page ${currentPage} of ${Math.max(totalPages, 1)}`}
                  </div>
                </div>

                <div className="vb-card-stack">
                  {visibleCenters.map((center) => (
                    <article
                      key={center.id}
                      className="vb-clinic-row"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCenterClick(center)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          handleCenterClick(center);
                        }
                      }}
                    >
                      <div className="vb-clinic-media">
                        <img src={center.image || defaultImage} alt={center.name} loading="lazy" />
                      </div>

                      <div className="vb-clinic-body">
                        <div className="vb-clinic-head">
                          <h3>{center.name}</h3>
                          <span className="vb-chip">
                            <Star size={12} style={{ marginTop: "-2px" }} /> {center.rating || "4.5"}
                          </span>
                        </div>

                        <p className="vb-hospital-address" style={{ marginBottom: "0.45rem" }}>
                          <MapPin size={14} style={{ marginRight: "0.35rem", marginTop: "-2px" }} />
                          {center.address || "Address not available"}
                          {center.city ? `, ${center.city}` : ""}
                          {center.pincode ? ` - ${center.pincode}` : ""}
                        </p>

                        <div className="d-flex align-items-center" style={{ gap: "0.45rem", marginBottom: "0.55rem" }}>
                          <Phone size={14} />
                          <span style={{ fontSize: "0.86rem", color: "#2d5d60" }}>
                            {center.contact_number || "N/A"}
                          </span>
                          {center.contact_number && (
                            <button
                              type="button"
                              className="vb-icon-btn"
                              onClick={(event) => handleCopy(event, center.contact_number)}
                              aria-label="Copy phone"
                            >
                              <Copy size={13} />
                            </button>
                          )}
                        </div>

                        <DiagnosticCenterCategories
                          categories={isNotEmptyArray(center?.category) ? center.category : []}
                        />

                        <div className="vb-card-actions">
                          <button
                            type="button"
                            className="vb-btn vb-btn-secondary"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCenterClick(center);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className="vb-btn vb-btn-primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEnquire(center);
                            }}
                          >
                            Enquire
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {!hasClientFilters && totalPages > 1 && (
                  <div className="vb-page-actions">
                    <button
                      type="button"
                      className="vb-btn vb-btn-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                    >
                      Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                      type="button"
                      className="vb-btn vb-btn-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((previous) => Math.min(totalPages, previous + 1))
                      }
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="vb-mobile-filter-sheet" onClick={() => setShowMobileFilters(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h4 style={{ margin: 0, fontSize: "1rem" }}>Filters</h4>
              <button
                type="button"
                className="vb-mobile-close"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            {renderFilterPanel({ mobile: true })}
          </div>
        </div>
      )}

      {showEnquireModal && (
        <ShowEnquireModal
          show={showEnquireModal}
          onClose={() => setShowEnquireModal(false)}
          setShowSuccessMessage={setShowSuccessMessage}
          token={token}
        />
      )}

      {showSuccessMessage && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
          <div
            className="alert alert-success alert-dismissible fade show shadow-lg border-0"
            role="alert"
            style={{ borderRadius: "16px" }}
          >
            <div className="d-flex align-items-center">
              <CheckCircle className="me-3" size={24} />
              <div>
                <h6 className="mb-1 fw-bold">Booking Confirmed!</h6>
                <p className="mb-0 small">
                  Your appointment request has been submitted. The center will contact you soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const DiagnosticCenterCategories = ({ categories }) => {
  const visibleCategories = categories.slice(0, 6);
  const remainingCategories = categories.slice(6);

  const renderPopover = () => (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="d-flex flex-wrap gap-2">
          {remainingCategories.map((service) => (
            <span
              key={service.id}
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{ borderRadius: "20px" }}
            >
              {service.name}
            </span>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="mb-2">
      <div className="d-flex flex-wrap gap-2">
        {isNotEmptyArray(visibleCategories) &&
          visibleCategories.map((service) => (
            <span
              key={service.id}
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{ borderRadius: "20px" }}
            >
              {service.name}
            </span>
          ))}

        {remainingCategories.length > 0 && (
          <OverlayTrigger trigger="hover" placement="top" overlay={renderPopover()}>
            <span
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{ borderRadius: "20px", cursor: "pointer" }}
            >
              +{remainingCategories.length} more
            </span>
          </OverlayTrigger>
        )}
      </div>
    </div>
  );
};

export default DiagnosticCentersApp;
