import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Search } from "lucide-react";
import { isNotEmptyArray } from "../../utiles/utils";

// Hospital-specific icons (Icons8 links)
const deptIcons = [
  "https://img.icons8.com/color/48/stethoscope.png", // General Medicine
  "https://img.icons8.com/color/48/heart-with-pulse.png", // Cardiology
  "https://img.icons8.com/color/48/brain.png", // Neurology
  "https://img.icons8.com/color/48/lungs.png", // Pulmonology
  "https://img.icons8.com/color/48/x-ray.png", // Radiology
  "https://img.icons8.com/color/48/bone.png", // Orthopedics
  "https://img.icons8.com/color/48/microscope.png", // Pathology
  "https://img.icons8.com/color/48/hospital-room.png", // Pediatrics
  "https://img.icons8.com/color/48/pregnant.png", // Gynecology
  "https://img.icons8.com/color/48/skin.png", // Dermatology
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
  const [totalCount, setTotalCount] = useState(0);

  // debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // fetch departments
  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true);
    setErrorDepartments(null);
    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/department/?page=${page}&search=${debouncedSearchTerm}`
      );
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data.data || []);
      setTotalCount(data.pagination_data?.total_count || 0);
    } catch (err) {
      setErrorDepartments(err.message);
    } finally {
      setLoadingDepartments(false);
    }
  }, [page, debouncedSearchTerm]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // fetch specialties
  const fetchSpecialties = async (department) => {
    setSpecialtyLoading(true);
    setSelectedDept(department);
    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/specialty/?department=${department.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch specialties");
      const data = await response.json();
      setSpecialties(data.data || []);
    } catch {
      setSpecialties([]);
    } finally {
      setSpecialtyLoading(false);

      // ✅ scroll to the exact top of specialties section
      setTimeout(() => {
        if (specialtyRef.current) {
          const top = specialtyRef.current.offsetTop - 80; // adjust for sticky header
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 200);
    }
  };

  const handleSelectDept = (dept) => {
    if (selectedDept?.id === dept.id) {
      setSelectedDept(null);
      setSpecialties([]);
    } else {
      fetchSpecialties(dept);
    }
  };

  const getIcon = (i) => deptIcons[i % deptIcons.length] || DEFAULT_ICON;

  const onClickSpeclist = (item) => {
    navigate("/doctor-list?specialty=" + item.id);
  };

  const totalPages = Math.ceil(totalCount / 15);

  return (
    <div style={{ padding: "20px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Search */}
      <Container className="py-4">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search department..."
                style={{
                  paddingLeft: 42,
                  height: 46,
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Departments grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        {loadingDepartments ? (
          <div>Loading...</div>
        ) : errorDepartments ? (
          <div style={{ color: "red" }}>{errorDepartments}</div>
        ) : (
          isNotEmptyArray(departments) &&
          departments.map((dept, i) => (
            <div
              key={dept.id}
              onClick={() => handleSelectDept(dept)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: selectedDept?.id === dept.id ? "#e0f2fe" : "#fff",
                padding: "20px",
                cursor: "pointer",
                textAlign: "center",
                boxShadow:
                  "0 2px 4px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1)")
              }
            >
              <div style={{ marginBottom: "12px" }}>
                <img
                  src={dept.image || getIcon(i)}
                  alt={dept.name}
                  style={{ width: 60, height: 60 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON;
                  }}
                />
              </div>
              <div style={{ fontWeight: "500", fontSize: "16px" }}>
                {dept.name}
              </div>
              {/* <div style={{ fontSize: "13px", color: "#666" }}>{dept.code}</div> */}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!selectedDept && totalPages > 1 && (
        <div style={{ textAlign: "center", margin: "60px 0" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ◀ Prev
          </button>
          <span style={{ margin: "0 12px" }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}

      {/* Specialties */}
      {selectedDept && (
        <div ref={specialtyRef} style={{ marginTop: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 style={{ margin: 0 }}>{selectedDept.name} Specialties</h4>
            {/* <button
              onClick={() => {
                setSelectedDept(null);
                setSpecialties([]);
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ×
            </button> */}
          </div>

          {specialtyLoading ? (
            <div>Loading specialties...</div>
          ) : specialties.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {specialties.map((spec, i) => (
                <div
                  key={spec.id}
                  onClick={() => onClickSpeclist(spec)}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    background: "#fff",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={spec.image || DEFAULT_SPEC_IMG}
                    alt={spec.description}
                    style={{ width: 60, height: 60, marginBottom: "10px" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_SPEC_IMG;
                    }}
                  />
                  <div style={{ fontWeight: "500", fontSize: "16px" }}>
                    {spec.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No specialties available. Redirecting to Doctor list...
              {setTimeout(() => {
                navigate(`/doctor-list?department=${selectedDept?.id}`);
              }, 2000)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalDepartments;
