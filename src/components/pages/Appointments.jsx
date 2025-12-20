import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Row,
  Col,
  Badge,
  Spinner,
  Card,
  Form,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import { useAuthContext } from "../context";
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState({ id: null, action: null });
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  // Function to get authentication token from localStorage
  const getToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Build the URL with query parameters
        const params = new URLSearchParams();
        params.append('user', user?.id || '63');

        if (filterStatus !== "all") {
          params.append('status', filterStatus);
        }

        if (searchTerm.trim()) {
          params.append('search', encodeURIComponent(searchTerm.trim()));
        }

        const url = `https://admin.vaidyabandhu.com/api/appointment/?${params.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract appointments from the response
        let appointmentsArray = [];
        if (data && Array.isArray(data.slots)) {
          appointmentsArray = data.slots;
        } else if (Array.isArray(data)) {
          appointmentsArray = data;
        } else if (data && Array.isArray(data.results)) {
          appointmentsArray = data.results;
        } else if (data && Array.isArray(data.data)) {
          appointmentsArray = data.data;
        }

        // Transform the data to match the component structure
        const transformedAppointments = appointmentsArray.map((appointment, index) => ({
          id: appointment.id || index + 1,
          name: appointment.patient_name || appointment.name || `Patient ${index + 1}`,
          age: appointment.age || `N/A`,
          reason: appointment.reason || appointment.purpose || "General consultation",
          gender: appointment.gender || "Male",
          status: appointment.status || "pending",
          time: appointment.time,
          phone: appointment.phone || appointment.mobile || "+1 000-000-0000",
          doctor_name: appointment.doctor_name || "Dr. Smith",
          hospital_name: appointment.hospital_name || "General Hospital"
        }));

        setAppointments(transformedAppointments);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [filterStatus, searchTerm, user]);

  const handleAction = (id, action) => {
    setActionData({ id, action });
    setShowModal(true);
  };

  const confirmAction = async () => {
    const { id, action } = actionData;
    setLoadingActionId(id);

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.patch(
        `https://admin.vaidyabandhu.com/api/appointment/?appointment_id=${id}`,
        { status: action },
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: action } : app
        )
      );

    } catch (err) {
      console.error("Failed to update appointment status:", err);

      let errorMessage = "Failed to update appointment.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    } finally {
      setShowModal(false);
      setLoadingActionId(null);
      setActionData({ id: null, action: null });
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
      case "Completed":
      case "Confirmed":
        return "success";
      case "rejected":
      case "Rejected":
        return "danger";
      default:
        return "warning";
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter((app) => app.status === "pending").length,
    confirmed: appointments.filter((app) => app.status === "confirmed").length,
    rejected: appointments.filter((app) => app.status === "rejected").length,
  };

  return (
    <Container fluid className="py-2 px-4" style={{ minHeight: "calc(100%)" }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h4 className="mb-1">Appointments Management</h4>
              <p className="text-muted mb-0">
                Manage and review patient appointments
              </p>
            </div>
            <Button
              className="px-3 py-2"
              style={{ fontSize: "0.9rem", borderRadius: "20px" }}
            >
              Total: {appointments.length} appointments
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filter and Search Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="py-3">
          <Row className="align-items-center">
            <Col md={6} className="mb-2 mb-md-0">
              <InputGroup>
                <InputGroup.Text
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e9ecef",
                  }}
                >
                  🔍
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: "1px solid #e9ecef" }}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <ButtonGroup className="w-100">
                {["all", "pending", "confirmed", "rejected"].map((status) => (
                  <Button
                    key={status}
                    variant={
                      filterStatus === status ? "primary" : "outline-primary"
                    }
                    onClick={() => setFilterStatus(status)}
                    className={`text-capitalize position-relative ${filterStatus === status ? "" : "outline-primary"
                      }`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    {status === "all" ? "All" : status}
                    <Badge
                      bg={filterStatus === status ? "light" : "primary"}
                      text={filterStatus === status ? "dark" : "white"}
                      className="ms-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {statusCounts[status]}
                    </Badge>
                  </Button>
                ))}
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm">
        <Card.Header
          className="bg-gradient"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
          }}
        ></Card.Header>

        <div
          style={{
            maxHeight: "600px",
            overflowX: "auto",
            overflowY: "auto",
            border: "none",
            borderRadius: "0 0 0.375rem 0.375rem",
            height: "400px",
          }}
          className="position-relative appointment-scrollable-table-container"
        >
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2 text-muted">Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-danger" style={{ fontSize: "1.2rem" }}>
                ⚠️ Error loading appointments
              </div>
              <p className="text-muted">{error}</p>
            </div>
          ) : (
            <>
              <Table
                hover
                responsive
                className="mb-0"
                style={{
                  minWidth: "1000px",
                  fontSize: "0.9rem",
                }}
              >
                <thead
                  className="sticky-top"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  <tr>
                    <th
                      className="text-center"
                      style={{ width: "60px", fontWeight: 600 }}
                    >
                      Sl No
                    </th>
                    <th style={{ minWidth: "140px", fontWeight: 600 }}>
                      👤 Patient
                    </th>
                    <th
                      className="text-center"
                      style={{ width: "80px", fontWeight: 600 }}
                    >
                      Age
                    </th>
                    <th style={{ minWidth: "160px", fontWeight: 600 }}>
                      📋 Reason
                    </th>
                    <th
                      className="text-center"
                      style={{ width: "100px", fontWeight: 600 }}
                    >
                      Gender
                    </th>
                    <th
                      className="text-center"
                      style={{ width: "100px", fontWeight: 600 }}
                    >
                      🕒 Time
                    </th>
                    <th style={{ minWidth: "140px", fontWeight: 600 }}>📞 Phone</th>
                    <th
                      className="text-center"
                      style={{ width: "100px", fontWeight: 600 }}
                    >
                      Status
                    </th>
                    <th
                      className="text-center"
                      style={{ width: "180px", fontWeight: 600 }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((app, idx) => (
                    <tr
                      key={app.id}
                      className={`${loadingActionId === app.id ? "table-active" : ""
                        }`}
                      style={{
                        transition: "all 0.2s ease",
                        borderLeft: `4px solid ${app.status === "confirmed" || app.status === "Completed" || app.status === "Confirmed"
                          ? "#28a745"
                          : app.status === "rejected" || app.status === "Rejected"
                            ? "#dc3545"
                            : "#ffc107"
                          }`,
                      }}
                    >
                      <td
                        className="text-center fw-bold"
                        style={{ color: "#6c757d" }}
                      >
                        {idx + 1}
                      </td>
                      <td>
                        <div className="fw-bold">{app.name}</div>
                      </td>
                      <td className="text-center">{app.age}</td>
                      <td>
                        <small className="text-muted">{app?.reason}</small>
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={app.gender === "Male" ? "info" : "pink"}
                          style={{
                            backgroundColor:
                              app.gender === "Male" ? "#17a2b8" : "#e83e8c",
                            fontSize: "0.75rem",
                          }}
                        >
                          {app.gender}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <small className="fw-bold text-success">
                          {app.time && app.time !== 'N/A'
                            ? (() => {
                              try {
                                // Split the time range string (e.g., "2025-12-12 12:04:00+00:00 - 2025-12-12 12:34:00+00:00")
                                const [startStr, endStr] = app.time.split(' - ');
                                if (!startStr || !endStr) throw new Error('Invalid format');

                                // Normalize and parse both times
                                const startDate = new Date(startStr.replace(' ', 'T'));
                                const endDate = new Date(endStr.replace(' ', 'T'));

                                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                  throw new Error('Invalid date');
                                }

                                // Format to 12-hour with AM/PM
                                const startFormatted = startDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                });
                                const endFormatted = endDate.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                });

                                return `${startFormatted} - ${endFormatted}`;
                              } catch (e) {
                                // Fallback: Extract HH:MM from strings if parsing fails
                                const startMatch = app.time.match(/(\d{2}:\d{2}):\d{2}/);
                                const endMatch = app.time.match(/ - .*(\d{2}:\d{2}):\d{2}/);
                                const startTime = startMatch ? `${startMatch[1]} ${parseInt(startMatch[1].split(':')[0]) >= 12 ? 'PM' : 'AM'}` : 'N/A';
                                const endTime = endMatch ? `${endMatch[1]} ${parseInt(endMatch[1].split(':')[0]) >= 12 ? 'PM' : 'AM'}` : 'N/A';
                                return `${startTime} - ${endTime}`;
                              }
                            })()
                            : 'N/A'}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted font-monospace">
                          {app.phone}
                        </small>
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={getStatusVariant(app.status)}
                          className="text-capitalize px-3 py-1"
                          style={{
                            fontSize: "0.75rem",
                            borderRadius: "15px",
                            fontWeight: 600,
                          }}
                        >
                          {app.status === "pending" && "⏳ "}
                          {app.status === "confirmed" && "✅ "}
                          {app.status === "rejected" && "❌ "}
                          {app.status === "Completed" && "✅ "}
                          {app.status === "Confirmed" && "✅ "}
                          {app.status === "Rejected" && "❌ "}
                          {app.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="success"
                            size="sm"
                            disabled={
                              (app.status === "confirmed" || app.status === "Completed" || app.status === "Confirmed") ||
                              loadingActionId === app.id
                            }
                            onClick={() => handleAction(app.id, "confirmed")}
                            style={{
                              borderRadius: "20px",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              minWidth: "70px",
                            }}
                          >
                            {loadingActionId === app.id &&
                              actionData.action === "confirmed" ? (
                              <Spinner size="sm" />
                            ) : (
                              "✓ Approve"
                            )}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={
                              (app.status === "rejected" || app.status === "Rejected") ||
                              loadingActionId === app.id
                            }
                            onClick={() => handleAction(app.id, "rejected")}
                            style={{
                              borderRadius: "20px",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              minWidth: "70px",
                            }}
                          >
                            {loadingActionId === app.id &&
                              actionData.action === "rejected" ? (
                              <Spinner size="sm" />
                            ) : (
                              "✗ Reject"
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-5">
                  <div className="text-muted" style={{ fontSize: "1.2rem" }}>
                    📅 No appointments found
                  </div>
                  {/* <small className="text-muted">
                    Try adjusting your search or filter criteria
                  </small> */}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            background:
              actionData.action === "confirmed"
                ? "linear-gradient(135deg, #28a745, #20c997)"
                : "linear-gradient(135deg, #dc3545, #fd7e14)",
            color: "white",
            border: "none",
          }}
        >
          <Modal.Title className="fw-bold">
            {actionData.action === "confirmed" ? "✅ Approve" : "❌ Reject"}{" "}
            Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3" style={{ fontSize: "3rem" }}>
            {actionData.action === "confirmed" ? "✅" : "❌"}
          </div>
          <h5 className="fw-bold mb-3">Confirm Action</h5>
          <p className="text-muted mb-0">
            Are you sure you want to{" "}
            <strong className="text-capitalize">{actionData.action}</strong>{" "}
            this appointment?
          </p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            disabled={loadingActionId}
            style={{ borderRadius: "25px", minWidth: "100px" }}
          >
            Cancel
          </Button>
          <Button
            variant={actionData.action === "confirmed" ? "success" : "danger"}
            onClick={confirmAction}
            disabled={loadingActionId}
            style={{ borderRadius: "25px", minWidth: "100px", fontWeight: 600 }}
          >
            {loadingActionId ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Yes, ${actionData.action === "confirmed" ? "Approve" : "Reject"}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Appointments;