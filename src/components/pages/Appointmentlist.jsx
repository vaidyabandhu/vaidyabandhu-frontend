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

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://admin.vaidyabandhu.com/api/appointment/patient_list/?key=appointment', {
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const transformedAppointments = data.slots.map(patient => ({
          id: patient.id || patient.membership_id || Math.random().toString(36).substring(7),
          name: patient.name || patient.membership_id || 'Unknown',
          doctor_name: patient.doctor_name || 'N/A',
          hospital_name: patient.hospital_name || 'N/A',
          gender: patient.gender || 'N/A',
          status: patient.status || 'pending',
          phone: patient.phone || 'N/A',
          email: patient.email || 'N/A',
          profile_image: patient.profile_image || ''
        }));

        setAppointments(transformedAppointments);
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

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

      // Success: Update local state to reflect the change immediately
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
        return "success";
      case "rejected":
        return "danger";
      default:
        return "warning";
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.membership_id && app.membership_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));
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
              <h4 className="mb-1">Patient Management</h4>
              <p className="text-muted mb-0">
                Manage and review patient information
              </p>
            </div>
            <Button
              className="px-3 py-2"
              style={{ fontSize: "0.9rem", borderRadius: "20px" }}
            >
              Total: {appointments.length} patients
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
                  placeholder="Search by name, ID, or email..."
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
                <th className="text-center" style={{ width: "60px", fontWeight: 600 }}>
                  #
                </th>
                <th style={{ minWidth: "140px", fontWeight: 600 }}>
                  👤 Patient
                </th>
                <th style={{ minWidth: "140px", fontWeight: 600 }}>
                  Doctor Name
                </th>
                <th style={{ minWidth: "160px", fontWeight: 600 }}>
                  Hospital Name
                </th>
                <th className="text-center" style={{ width: "100px", fontWeight: 600 }}>
                  Gender
                </th>
                <th className="text-center" style={{ width: "100px", fontWeight: 600 }}>
                  🕒 Status
                </th>
                <th style={{ minWidth: "140px", fontWeight: 600 }}>📞 Phone</th>
                <th style={{ minWidth: "180px", fontWeight: 600 }}>📧 Email</th>
                <th className="text-center" style={{ width: "180px", fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2 text-muted">Loading patients...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <div className="text-danger">{error}</div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <div className="text-muted" style={{ fontSize: "1.2rem" }}>
                      📅 No patients found
                    </div>
                    {/* <small className="text-muted">
                      Try adjusting your search or filter criteria
                    </small> */}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app, idx) => (
                  <tr
                    key={app.id}
                    className={`${loadingActionId === app.id ? "table-active" : ""}`}
                    style={{
                      transition: "all 0.2s ease",
                      borderLeft: `4px solid ${app.status === "confirmed" ? "#28a745" : app.status === "rejected" ? "#dc3545" : "#ffc107"}`
                    }}
                  >
                    <td className="text-center fw-bold" style={{ color: "#6c757d" }}>
                      {idx + 1}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                       {app.profile_image ? (
  <img
    src={app.profile_image}
    alt={app.name || "Patient"}
    className="rounded-circle me-2"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
) : (
  <img
    src={
      app.gender === "Male"
        ? "https://ui-avatars.com/api/?name=Male&background=0D8ABC&color=fff&size=128"
        : app.gender === "Female"
          ? "https://ui-avatars.com/api/?name=Female&background=E91E63&color=fff&size=128"
          : "https://ui-avatars.com/api/?name=User&background=9E9E9E&color=fff&size=128"
    }
    alt={`${app.gender || "Unknown"} avatar`}
    className="rounded-circle me-2"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
)}
                        <div>
                          <div className="fw-bold">{app?.name}</div>
                          {/* <small className="text-muted">ID: {app.id}</small> */}
                        </div>
                      </div>
                    </td>
                    <td>{app.doctor_name}</td>
                    <td>{app.hospital_name}</td>
                    <td className="text-center">
                      <Badge
                        bg={app.gender === "Male" ? "info" : app.gender === "Female" ? "danger" : "secondary"}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {app.gender}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge
                        bg={getStatusVariant(app.status)}
                        className="text-capitalize px-3 py-1"
                        style={{ fontSize: "0.75rem", borderRadius: "15px", fontWeight: 600 }}
                      >
                        {app.status === "pending" && "⏳ "}
                        {app.status === "confirmed" && "✅ "}
                        {app.status === "rejected" && "❌ "}
                        {app.status}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-muted font-monospace">{app?.phone}</small>
                    </td>
                    <td>
                      <small className="text-muted">{app?.email || 'N/A'}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="success"
                          size="sm"
                          disabled={app.status === "confirmed" || loadingActionId === app.id}
                          onClick={() => handleAction(app.id, "confirmed")}
                          style={{ borderRadius: "20px", fontWeight: 600, fontSize: "0.75rem", minWidth: "90px" }}
                        >
                          {loadingActionId === app.id && actionData.action === "confirmed" ? (
                            <Spinner size="sm" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={app.status === "rejected" || loadingActionId === app.id}
                          onClick={() => handleAction(app.id, "rejected")}
                          style={{ borderRadius: "20px", fontWeight: 600, fontSize: "0.75rem", minWidth: "70px" }}
                        >
                          {loadingActionId === app.id && actionData.action === "rejected" ? (
                            <Spinner size="sm" />
                          ) : (
                            "✗ Reject"
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
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
            Patient
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
            this patient?
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