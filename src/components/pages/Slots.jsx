import React, { useState, useEffect, useMemo } from "react";
import { useAuthContext } from "../context";
import { useFetch } from "../hooks/usefetch";
import useLocalStorageState from "../hooks/useLocalStorageState";
import DateRangeFilter2 from "../common/DateRangeFilter2";
import { dateFormat } from "../utiles/dateFormat";
import { addSlotApi, updateSlotApi, getSlotsApi } from "../../api/slotApi";
import { getDateRange } from "../common/DateRangeFilter2/utils";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";

// --- Slot Modal (updated) ---
function getLocalTimeString(isoDateTime) {
    if (!isoDateTime) return "";
    const date = new Date(isoDateTime);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function getLocalDateString(isoDateTime) {
    if (!isoDateTime) return "";
    const date = new Date(isoDateTime);
    if (isNaN(date.getTime())) return "";
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
                    Authorization: token,
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

    // Initialize form data
    useEffect(() => {
        if (slot) {
            // For existing slot, use slot data
            let duration = 15; // Default value
            if (slot.start_time && slot.end_time) {
                const startDate = new Date(slot.start_time);
                const endDate = new Date(slot.end_time);
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    duration = Math.round((endDate - startDate) / (1000 * 60));
                }
            }

            setFormData({
                start_date: getLocalDateString(slot.start_time),
                start_time: getLocalTimeString(slot.start_time),
                end_date: getLocalDateString(slot.end_time),
                end_time: getLocalTimeString(slot.end_time),
                slot_duration: duration,
                doctor: slot.doctor?.toString() || "",
                hospital: slot.hospital?.toString() || "",
            });
        } else {
            // For new slot — calculate end_time from start_time + duration
            const now = new Date();
            const nextHour = new Date(now.getTime() + 60 * 60 * 1000); // Next hour

            const startDateStr = nextHour.toISOString().slice(0, 10);
            const startTimeStr = nextHour.toTimeString().slice(0, 5);

            const durationMinutes = 30;
            const startDateTime = new Date(`${startDateStr}T${startTimeStr}`);
            const endDateTime = new Date(
                startDateTime.getTime() + durationMinutes * 60 * 1000
            );

            setFormData({
                start_date: startDateStr,
                start_time: startTimeStr,
                end_date: endDateTime.toISOString().slice(0, 10),
                end_time: endDateTime.toTimeString().slice(0, 5),
                slot_duration: durationMinutes,
                doctor: userInfo?.doctor_id?.toString() || "",
                hospital: userInfo?.hospital_id?.toString() || "",
            });
        }
    }, [slot, userInfo, show]);

    // Auto-update end_time when duration or start_time/date changes
    useEffect(() => {
        if (!formData.start_date || !formData.start_time) return;

        const startDateTime = new Date(
            `${formData.start_date}T${formData.start_time}`
        );
        if (isNaN(startDateTime.getTime())) return; // Skip if invalid date

        const endDateTime = new Date(
            startDateTime.getTime() + formData.slot_duration * 60 * 1000
        );
        if (isNaN(endDateTime.getTime())) return; // Skip if invalid date

        setFormData((prev) => ({
            ...prev,
            end_date: endDateTime.toISOString().slice(0, 10),
            end_time: endDateTime.toTimeString().slice(0, 5),
        }));
    }, [formData.slot_duration, formData.start_date, formData.start_time]);

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

        if (formData.slot_duration <= 0) {
            setValidationMsg("Duration must be greater than 0 minutes.");
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
        formData.slot_duration,
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

        // Additional validation: duration > 0
        if (formData.slot_duration <= 0) {
            setError("Duration must be greater than 0 minutes.");
            setLoading(false);
            return;
        }

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
                // For new slots: recalculate end_time to ensure correctness at submit time
                const startDateTime = new Date(
                    `${formData.start_date}T${formData.start_time}`
                );
                const endDateTime = new Date(
                    startDateTime.getTime() + formData.slot_duration * 60 * 1000
                );
                const finalEndDate = endDateTime.toISOString().slice(0, 10);
                const finalEndTime = endDateTime.toTimeString().slice(0, 5);

                const payload = {
                    doctor: formData.doctor,
                    hospital: formData.hospital,
                    start_date: formData.start_date,
                    start_time: formData.start_time,
                    end_date: finalEndDate,
                    end_time: finalEndTime,
                    slot_duration: formData.slot_duration,
                };

                const response = await addSlotApi(payload);
                if (response.status >= 200 && response.status < 500) {
                    onSaved();
                } else {
                    throw new Error(response.data?.message || "Failed to save slot");
                }
            }
        } catch (err) {
            console.error("Error in handleSubmit:", err);

            // Handle specific overlap error
            let errorMessage = "Something went wrong";
            const errorString = JSON.stringify(err).toLowerCase();

            if (
                errorString.includes("overlaps") ||
                errorString.includes("this slot overlaps with an existing one")
            ) {
                errorMessage =
                    "This slot overlaps with an existing one. Please choose a different time.";
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
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
const SlotManager = ({
    dateFilter,
    showCreateModal,
    setShowCreateModal,
    refreshKey,
}) => {
    const [slotsData, setSlotsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingSlot, setEditingSlot] = useState(null);

    const user = useMemo(() => {
        try {
            const u = localStorage.getItem("userInfo");
            return u ? JSON.parse(u) : null;
        } catch {
            return null;
        }
    }, []);
    const token = localStorage.getItem("token");

    // Fetch slots
    const fetchSlots = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const params = {
                doctor_id: user.doctor_id,
                hospital_id: user.hospital_id,
                start_date: dateFilter.start_date,
                end_date: dateFilter.end_date,
            };

            const data = await getSlotsApi(params, token);
            setSlotsData(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load slots");
        } finally {
            setLoading(false);
        }
    };

    // Fetch on load / refresh
    useEffect(() => {
        if (!user?.doctor_id || !user?.hospital_id) return;
        if (!dateFilter.start_date || !dateFilter.end_date) return;

        fetchSlots();
    }, [dateFilter.start_date, dateFilter.end_date]);


    //  Group slots by date
    const groupedSlots = useMemo(() => {
        if (!slotsData || slotsData.length === 0) return {};
        const grouped = {};
        slotsData.forEach((entry) => {
            grouped[entry.date] = [entry];
        });
        return grouped;
    }, [slotsData]);

    //  Refresh after save
    const handleSlotSaved = async () => {
        await fetchSlots();
        setShowCreateModal(false);
        setEditingSlot(null);
    };

    const handleEditSlot = (slot) => setEditingSlot(slot);

    //  Utility formatting
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatShortDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    //  Total slot count
    const totalSlots = Object.values(groupedSlots).reduce(
        (sum, groups) =>
            sum +
            groups.reduce(
                (s, group) =>
                    s + (Array.isArray(group.slots) ? group.slots.length : 0),
                0
            ),
        0
    );

    //  UI Render
    return (
        <>
            {loading ? (
                <div className="text-center py-5">Loading slots...</div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            ) : Object.keys(groupedSlots).length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">No slots found</h6>
                    <p className="text-muted">Create your first slot to get started</p>
                </div>
            ) : (
                <>
                    <h5 className="mb-3">Available Slots ({totalSlots} total)</h5>

                    <div
                        className="border rounded p-3"
                        style={{ background: "#f8fafd" }}
                    >
                        {Object.entries(groupedSlots)
                            .sort(([a], [b]) => new Date(a) - new Date(b))
                            .map(([date, [dateGroup]]) => {
                                const slotsForDate = dateGroup?.slots || [];
                                return (
                                    <div key={date} className="mb-4">
                                        <div className="col-12 fw-bold my-2">{date}</div>
                                        <div className="row g-2">
                                            {slotsForDate
                                                .sort(
                                                    (a, b) =>
                                                        new Date(a.start_time) - new Date(b.start_time)
                                                )
                                                .map((slot) => {
                                                    const start = new Date(slot.start_time);
                                                    const end = new Date(slot.end_time);
                                                    const duration = Math.round(
                                                        (end - start) / (1000 * 60)
                                                    );

                                                    return (
                                                        <div key={slot.id} className="col-auto">
                                                            <div
                                                                className={`border rounded p-2 ${slot.is_blocked
                                                                    ? "bg-danger bg-opacity-10 border-danger"
                                                                    : "bg-success bg-opacity-10 border-success"
                                                                    }`}
                                                                style={{
                                                                    width: "140px",
                                                                    fontSize: "0.75rem",
                                                                    background: slot.is_blocked
                                                                        ? "#ffeaea"
                                                                        : "#e6f8f5",
                                                                }}
                                                            >
                                                                <div className="fw-bold text-center mb-1">
                                                                    {formatShortDate(slot.start_time)}
                                                                </div>
                                                                <div className="text-center mb-1">
                                                                    {formatTime(slot.start_time)} -{" "}
                                                                    {formatTime(slot.end_time)}
                                                                </div>
                                                                <div className="text-center mb-2">
                                                                    {duration} min
                                                                </div>

                                                                <div className="d-flex align-items-center justify-content-center">
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
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <SlotFormModal
                    show={showCreateModal}
                    onHide={() => setShowCreateModal(false)}
                    onSaved={handleSlotSaved}
                    user={user}
                    title="Create New Slot"
                />
            )}

            {/* Edit Modal */}
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
    const [refreshKey, setRefreshKey] = useState(0);

    const onFilter = ({ start, end }) => {
        setDateFilter({
            date_from: start,
            date_to: end,
        });
    };

    const handleCreateSlot = () => setShowCreateModal(true);

    const handleSlotSaved = () => {
        // Force a refresh by updating the refreshKey
        setRefreshKey((prev) => prev + 1);
        setShowCreateModal(false);
    };

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
                            dateFilter={dateFilter.date_from && dateFilter.date_to
                                ? {
                                    start_date: dateFormat(dateFilter.date_from),
                                    end_date: dateFormat(dateFilter.date_to),
                                }
                                : {}}
                            showCreateModal={showCreateModal}
                            setShowCreateModal={setShowCreateModal}
                            refreshKey={refreshKey}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slots;
