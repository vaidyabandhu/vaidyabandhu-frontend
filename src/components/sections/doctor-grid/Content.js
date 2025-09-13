import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/speciality.css";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Search } from "lucide-react";
import { useFetch } from "../../hooks/usefetch";
import { isNotEmptyArray } from "../../utiles/utils";

// Emoji icons for departments
const deptIcons = [
  "🩺",
  "🔬",
  "🚑",
  "👁️",
  "🫁",
  "🫀",
  "⚖️",
  "🩹",
  "👩‍⚕️",
  "💄",
  "🔎",
  "🩻",
  "🦠",
];
const DEFAULT_ICON = "🏥";

// Default specialty images (cycle if needed)
const specialtyImages = [
  "https://img.icons8.com/doodle/96/000000/doctor-male.png",
  "https://img.icons8.com/doodle/96/000000/stethoscope.png",
  "https://img.icons8.com/doodle/96/000000/nurse-female.png",
  "https://img.icons8.com/doodle/96/000000/health-checkup.png",
  "https://img.icons8.com/doodle/96/000000/hospital-bed.png",
];
const DEFAULT_SPEC_IMG = "https://img.icons8.com/color/96/clinic.png";

const MedicalDepartments = () => {
  const [specialties, setSpecialties] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);
  const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

      // Debounce search input
      useEffect(() => {
        const timeoutId = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm);
        }, 500); // Adjust delay (500ms) as needed
    
        return () => clearTimeout(timeoutId); // Cleanup on each keystroke
      }, [searchTerm]);
  
      const {
  data: departmentsData,
  loading: loadingDepartments,
  error: errorDepartments,
  refetch: refetchDepartments,
} = useFetch({
  method: "GET",
  request: "department/",
     params: {
      search: debouncedSearchTerm.trim() ?? ""
    },
});

  // Fetch specialties for selected department
  const fetchSpecialties = useCallback(async (departmentId) => {
    setSpecialtyLoading(true);
    try {
      const response = await fetch(
        `https://52.66.199.115:8000/api/specialty/?department=${departmentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch specialties");
      const data = await response.json();
      setSpecialties(data.data || []);
    } catch {
      setSpecialties([]);
    } finally {
      setSpecialtyLoading(false);
    }
  }, []);

  // Department selection handler
  const handleSelectDept = (dept, i) => {
    if (selectedDept && selectedDept.id === dept.id) {
      setSelectedDept(null);
      setSpecialties([]);
      return;
    }
    setSelectedDept(dept);
    fetchSpecialties(dept.id);
  };

    // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Icon assignment
  const getIcon = (i) => deptIcons[i % deptIcons.length] || DEFAULT_ICON;

  // Specialty image assignment
  const getSpecImg = (i, imgUrl) =>
    imgUrl ? imgUrl : specialtyImages[i % specialtyImages.length];

  const onClickSpeclist = (item) => {
    navigate("/doctor-list?specialty=" + item.id);
  };

  return (
    <div className="mdc-root container-bg">
            <div className="page-header">
        <Container className="py-4">
          <div className="text-center mb-4">
            <p className="text-muted">
              Browse All Departments
            </p>
          </div>

          {/* Search Bar */}
          <Row className="justify-content-center">
  <Col lg={8} md={10}>
    <div style={{ position: "relative" }}>
      <Search
        size={20}
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#999",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <Form.Control
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search department..."
        style={{
          paddingLeft: 42,      // Enough space for icon + gap
          height: 46,           // Adjust as needed
        }}
      />
    </div>
  </Col>
</Row>

        </Container>
      </div>
      {errorDepartments && (
        <div className="mdc-alert">
          <span>{errorDepartments}</span>
          <button onClick={refetchDepartments} className="mdc-btn mdc-btn-alert">
            Retry
          </button>
        </div>
      )}

      {/* Department Row: Centered with margin */}
      <div className="mdc-horizontal-container">
        <div
          className="mdc-horizontal-scroll"
          style={{ justifyContent: loadingDepartments ? "center" : "start" }}
        >
          {loadingDepartments ? (
            <div className="mdc-loading">Loading...</div>
          ) : (
            isNotEmptyArray(departmentsData?.data) && departmentsData.data.map((dept, i) => (
              <div
                key={dept.id}
                className={`mdc-hcard ${
                  selectedDept && selectedDept.id === dept.id
                    ? "mdc-hcard-selected"
                    : ""
                }`}
                onClick={() => handleSelectDept(dept, i)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="mdc-hcard-icon">
                  {dept?.image ? (
                    <img
                      src={dept.image}
                      alt={dept.name}
                      className="mdc-specialty-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_SPEC_IMG;
                      }}
                    />
                  ) : (
                    getIcon(i)
                  )}
                </div>
                <div className="mdc-hcard-info">
                  <div className="mdc-hcard-name">{dept.name}</div>
                  <div className="mdc-hcard-code">{dept.code}</div>
                  
                </div>
              </div>
            ))
          )}
        </div>
        {/* Info message if no department selected */}
        {!selectedDept && !loadingDepartments && (
          <div className="mdc-info-msg">
            <span>ℹ️ Please select a department to view its specialties.</span>
          </div>
        )}
      </div>

      {/* Specialties Section */}
      <div
        className={`mdc-specialty-section ${
          selectedDept ? "mdc-specialty-section-show" : ""
        }`}
      >
        {selectedDept && (
          <>
            <div className="mdc-specialty-header">
              <span>{selectedDept.name} Specialties</span>
              <button
                className="mdc-btn mdc-btn-close"
                onClick={() => {
                  setSelectedDept(null);
                  setSpecialties([]);
                }}
              >
                ×
              </button>
            </div>
            {specialtyLoading ? (
              <div className="mdc-loading-sm">Loading specialties...</div>
            ) : specialties.length ? (
              <div className="mdc-specialty-grid">
                {specialties.map((spec, i) => (
                  <div
                    className="mdc-specialty-card"
                    key={spec.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => onClickSpeclist(spec)}
                  >
                    <div className="mdc-specialty-imgwrap">
                      <img
                        src={spec.image || getSpecImg(i, spec.image_url)}
                        alt={spec.description}
                        className="mdc-specialty-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_SPEC_IMG;
                        }}
                      />
                    </div>
                    <div className="mdc-specialty-title">
                      {spec.title}
                    </div>
                    <div className="mdc-specialty-meta">
                      <span className="mdc-specialty-code">{spec.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mdc-empty">No specialties available.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalDepartments;
