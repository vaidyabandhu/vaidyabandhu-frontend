import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context";
import { useFetch } from "../hooks/usefetch";
import useLocalStorageState from "../hooks/useLocalStorageState";
import DateRangeFilter2 from "../common/DateRangeFilter2";
import { dateFormat } from "../utiles/dateFormat";
import { addSlotApi, updateSlotApi } from "../../api/slotApi";
import { getDateRange } from "../common/DateRangeFilter2/utils";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";

// --- Slot Modal (updated) ---
function getLocalTimeString(isoDateTime) {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getLocalDateString(isoDateTime) {
  const date = new Date(isoDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const DURATION_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "20 min", value: 20 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
];

// Function to update slots using the PATCH API
const updateSlotPatchApi = async (payload) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  try {
    // Format the date and time to ISO format with UTC timezone
    const formatToISO = (date, time) => {
      return `${date}T${time}:00.000Z`;
    };

    const response = await fetch(
      "https://admin.vaidyabandhu.com/api/slots/slot/update_slots/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: payload.id,
          doctor: parseInt(payload.doctor),
          hospital: parseInt(payload.hospital),
          start_time: formatToISO(payload.start_date, payload.start_time),
          end_time: formatToISO(payload.end_date, payload.end_time),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(
        errorData.message ||
          `Failed to update slot (Status: ${response.status})`
      );
    }

    const data = await response.json();
    console.log("API Success Response:", data);
    return data;
  } catch (error) {
    console.error("Error in updateSlotPatchApi:", error);
    throw error;
  }
};

const SlotFormModal = ({ show, onHide, onSaved, user, slot = null, title }) => {
  const [formData, setFormData] = useState({
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    slot_duration: 15,
    doctor: "",
    hospital: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Get user info from localStorage
  useEffect(() => {
    if (show) {
      try {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);

          // Set doctor and hospital IDs from login response
          setFormData((prev) => ({
            ...prev,
            doctor: parsedUserInfo.doctor_id?.toString() || "",
            hospital: parsedUserInfo.hospital_id?.toString() || "",
          }));
        }
      } catch (err) {
        console.error("Error parsing user info from localStorage:", err);
        setError("Failed to load user information. Please log in again.");
      }
    }
  }, [show]);

  useEffect(() => {
    if (slot) {
      // For existing slot, use slot data
      setFormData({
        start_date: getLocalDateString(slot.start_time),
        start_time: getLocalTimeString(slot.start_time),
        end_date: getLocalDateString(slot.end_time),
        end_time: getLocalTimeString(slot.end_time),
        slot_duration: Math.round(
          (new Date(slot.end_time) - new Date(slot.start_time)) / (1000 * 60)
        ),
        doctor: slot.doctor?.toString() || "",
        hospital: slot.hospital?.toString() || "",
      });
    } else if (userInfo) {
      // For new slot with user info available
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const endTime = new Date(nextHour.getTime() + 30 * 60 * 1000);
      setFormData({
        start_date: nextHour.toISOString().slice(0, 10),
        start_time: nextHour.toTimeString().slice(0, 5),
        end_date: nextHour.toISOString().slice(0, 10),
        end_time: endTime.toTimeString().slice(0, 5),
        slot_duration: 30,
        doctor: userInfo.doctor_id?.toString() || "",
        hospital: userInfo.hospital_id?.toString() || "",
      });
    } else if (!slot && !userInfo && show) {
      // For new slot without user info yet (initial state)
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const endTime = new Date(nextHour.getTime() + 30 * 60 * 1000);
      setFormData({
        start_date: nextHour.toISOString().slice(0, 10),
        start_time: nextHour.toTimeString().slice(0, 5),
        end_date: nextHour.toISOString().slice(0, 10),
        end_time: endTime.toTimeString().slice(0, 5),
        slot_duration: 30,
        doctor: "",
        hospital: "",
      });
    }
  }, [slot, userInfo, show]);

  // Validation helper
  const validateFields = () => {
    if (
      !formData.start_date ||
      !formData.end_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setValidationMsg(""); // Don't show anything until user fills everything
      return false;
    }

    const startDate = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDate = new Date(`${formData.end_date}T${formData.end_time}`);

    if (formData.start_date > formData.end_date) {
      setValidationMsg("Start date cannot be after end date.");
      return false;
    }
    if (
      formData.start_date === formData.end_date &&
      formData.start_time >= formData.end_time
    ) {
      setValidationMsg("For the same day, start time must be before end time.");
      return false;
    }
    if (startDate >= endDate) {
      setValidationMsg("Slot start must be before slot end.");
      return false;
    }
    setValidationMsg("");
    return true;
  };

  useEffect(() => {
    validateFields();
    // eslint-disable-next-line
  }, [
    formData.start_date,
    formData.end_date,
    formData.start_time,
    formData.end_time,
  ]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDurationChange = (e) => {
    handleChange("slot_duration", Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateFields()) return;

    setLoading(true);
    try {
      if (slot) {
        // Use PATCH API for updating existing slots
        const payload = {
          id: slot.id,
          doctor: formData.doctor,
          hospital: formData.hospital,
          start_date: formData.start_date,
          start_time: formData.start_time,
          end_date: formData.end_date,
          end_time: formData.end_time,
        };

        console.log("Updating slot with payload:", payload);
        const response = await updateSlotPatchApi(payload);

        // Check if the response indicates success
        if (
          response.success ||
          response.status === 200 ||
          response.message?.toLowerCase().includes("success")
        ) {
          onSaved(); // refresh + close modal
        } else {
          throw new Error(response.message || "Failed to update slot");
        }
      } else {
        // Use existing API for creating new slots
        const payload = {
          doctor: formData.doctor,
          hospital: formData.hospital,
          start_date: formData.start_date,
          start_time: formData.start_time,
          end_date: formData.end_date,
          end_time: formData.end_time,
          slot_duration: formData.slot_duration,
        };

        console.log("Creating slot with payload:", payload);
        const response = await addSlotApi(payload);

        if (response.status >= 200 && response.status < 300) {
          if (response.data?.message?.toLowerCase().includes("success")) {
            onSaved(); // refresh + close modal
          } else {
            setError(response.data?.message || "Unexpected response");
          }
        } else {
          throw new Error(response.data?.message || "Failed to save slot");
        }
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content rounded-3">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {/* Doctor and Hospital Fields */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Doctor ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.doctor}
                      onChange={(e) => handleChange("doctor", e.target.value)}
                      required
                      disabled
                    />
                    {/* <Form.Text muted>
                      Fetched from login credentials
                    </Form.Text> */}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hospital ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => handleChange("hospital", e.target.value)}
                      required
                      disabled
                    />
                    {/* <Form.Text muted>
                      Fetched from login credentials
                    </Form.Text> */}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        handleChange("start_time", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleChange("end_time", e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Select
                  value={formData.slot_duration}
                  onChange={handleDurationChange}
                  required
                >
                  {DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text muted>
                  Choose the intended duration for this slot.
                </Form.Text>
              </Form.Group>
              {validationMsg && (
                <Alert variant="warning" className="py-2 my-2">
                  {validationMsg}
                </Alert>
              )}
            </div>
            <div className="modal-footer">
              <Button
                type="button"
                variant="secondary"
                onClick={onHide}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !!validationMsg}
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                )}
                {slot ? "Update Slot" : "Create Slot"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- SlotManager UI ---
const SlotManager = ({ dateFilter, showCreateModal, setShowCreateModal }) => {
  const { user } = useAuthContext();
  const [editingSlot, setEditingSlot] = useState(null);

  const response = useFetch({
    method: "GET",
    request: "slots/slot/",
    dontCall:
      !dateFilter.start_date ||
      !dateFilter.end_date ||
      !user?.selectedHostiptal?.id,
    params: {
      doctor_id: user?.id ?? "",
      hospital_id: user?.selectedHostiptal?.id,
      is_blocked: true,
      ...dateFilter,
    },
  });

  const slots = response?.data || [];

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.start_time).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

  const handleEditSlot = (slot) => setEditingSlot(slot);
  const handleSlotSaved = async () => {
    response.refetch();
    setShowCreateModal(false);
    setEditingSlot(null);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (response?.loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!response?.loading && (
        <>
          {response?.error ? (
            <div className="alert alert-danger" role="alert">
              Error loading slots: {response.error}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">No slots found</h6>
              <p className="text-muted">
                Create your first slot to get started
              </p>
            </div>
          ) : (
            <>
              {Object.keys(groupedSlots).length > 0 && (
                <div>
                  {Object.entries(groupedSlots)
                    .sort(([a], [b]) => new Date(a) - new Date(b))
                    .map(([date, dateSlots]) => (
                      <div key={date} className="mb-4">
                        {/* Date Header */}
                        <div
                          className="bg-light p-3 rounded-top border"
                          style={{ background: "#f2f6fa" }}
                        >
                          <h5>{formatDate(date)}</h5>
                          <small className="text-muted">
                            {dateSlots.length} slot
                            {dateSlots.length !== 1 ? "s" : ""}
                          </small>
                        </div>
                        {/* Slots Grid */}
                        <div
                          className="border border-top-0 rounded-bottom p-3"
                          style={{ background: "#f8fafd" }}
                        >
                          <div className="row g-2">
                            {dateSlots
                              .sort(
                                (a, b) =>
                                  new Date(a.start_time) -
                                  new Date(b.start_time)
                              )
                              .map((slot) => (
                                <div key={slot.id} className="col-auto">
                                  <div
                                    className={`border rounded p-2 ${
                                      slot.is_blocked
                                        ? "bg-danger bg-opacity-10 border-danger"
                                        : "bg-success bg-opacity-10 border-success"
                                    }`}
                                    style={{
                                      width: "110px",
                                      fontSize: "0.75rem",
                                      background: slot.is_blocked
                                        ? "#ffeaea"
                                        : "#e6f8f5",
                                    }}
                                  >
                                    {/* Time */}
                                    <div
                                      className="fw-bold text-center mb-1"
                                      style={{
                                        fontSize: "0.8rem",
                                        lineHeight: "1.1",
                                      }}
                                    >
                                      {formatTime(slot.start_time)
                                        .replace(/:\d{2}/, "")
                                        .replace(" ", "")
                                        .toLowerCase()}
                                      -
                                      {formatTime(slot.end_time)
                                        .replace(/:\d{2}/, "")
                                        .replace(" ", "")
                                        .toLowerCase()}
                                    </div>
                                    {/* Duration and Edit */}
                                    <div className="d-flex align-items-center justify-content-between">
                                      <small
                                        className="text-muted"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        {Math.round(
                                          (new Date(slot.end_time) -
                                            new Date(slot.start_time)) /
                                            (1000 * 60)
                                        )}
                                        m
                                      </small>
                                      <button
                                        className="btn p-0 text-primary"
                                        onClick={() => handleEditSlot(slot)}
                                        title="Edit Slot"
                                        style={{
                                          fontSize: "0.8rem",
                                          lineHeight: "1",
                                        }}
                                      >
                                        <i className="fas fa-edit"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Create Slot Modal */}
      {showCreateModal && (
        <SlotFormModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSaved={handleSlotSaved}
          user={user}
          title="Create New Slot"
        />
      )}
      {/* Edit Slot Modal */}
      {editingSlot && (
        <SlotFormModal
          show={!!editingSlot}
          onHide={() => setEditingSlot(null)}
          onSaved={handleSlotSaved}
          user={user}
          slot={editingSlot}
          title="Edit Slot"
        />
      )}
    </>
  );
};

// --- Main Component ---
const Slots = () => {
  const { start, end } = getDateRange("next7");

  const [dateFilter, setDateFilter] = useLocalStorageState(
    "candidate_dateFilter",
    { date_from: start, date_to: end }
  );

  const [showCreateModal, setShowCreateModal] = useState(false);

  const onFilter = ({ start, end }) => {
    setDateFilter({
      date_from: start,
      date_to: end,
    });
  };

  const handleCreateSlot = () => setShowCreateModal(true);

  const onClear = () => {
    setDateFilter({ date_from: "", date_to: "" });
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <div className="container-fluid py-4">
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <header
            className="d-flex align-items-center justify-content-between px-4 py-3 shadow-sm"
            style={{
              background: "#fff",
              borderBottom: "1px solid #e8eaef",
              minHeight: 60,
              fontWeight: 600,
              fontSize: "1.12rem",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <h5>Slots</h5>
            <div className="d-flex align-items-center" style={{ gap: 10 }}>
              <div className="d-flex align-items-center" style={{ gap: 10 }}>
                <span style={{ fontWeight: 500, color: "#5e6e82" }}>Date:</span>
                <DateRangeFilter2
                  hidePreset
                  onFilter={onFilter}
                  onClear={onClear}
                  hideClear={true}
                  date={{
                    start: dateFilter.date_from
                      ? new Date(dateFilter.date_from)
                      : null,
                    end: dateFilter.date_to
                      ? new Date(dateFilter.date_to)
                      : null,
                  }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleCreateSlot}>
                <i className="fas fa-plus me-2"></i>
                Create New Slot
              </button>
            </div>
          </header>
          <div className="shadow-sm bg-white rounded-bottom p-3">
            <SlotManager
              dateFilter={
                dateFilter.date_from && dateFilter.date_to
                  ? {
                      start_date: dateFormat(dateFilter.date_from),
                      end_date: dateFormat(dateFilter.date_to),
                    }
                  : {}
              }
              showCreateModal={showCreateModal}
              setShowCreateModal={setShowCreateModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slots;
