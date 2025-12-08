import React, { Component } from "react";
import { Link } from "react-router-dom";

class Content extends Component {
  async componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctor_id');
    const hospitalId = urlParams.get('hospital_id');
    const token = localStorage.getItem("token"); // FIXED
    if (!token) {
      alert("Session expired or not logged in. Please login again.");
      window.location.href = "/doctor-list";
      return;
    }
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/profile/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Add "Token " prefix (see below)
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token"); // Clear only "token"
        alert("Session expired. Please login again testing.");
        window.location.href = "/doctor-list";
        return;
      }
      const data = await response.json();
      if (response.ok && data) {
        this.setState({
          fullname: data.full_name || "",
          email: data.email || "",
          dateofbirth: data.age ? String(data.age) : "",
          phoneno: data.mobile || "",
          gender: data.gender || "",
          doctorId: doctorId,
          hospitalId: hospitalId,
        });
        this.fetchAvailableSlots(doctorId, hospitalId);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  fetchAvailableSlots = async (doctorId, hospitalId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/doctor-list";
      return;
    }

    this.setState({ doctorId, hospitalId, loadingSlots: true });

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    const startStr = today.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/slots/slot/?start_date=${startStr}&end_date=${endStr}&doctor_id=${doctorId}&hospital_id=${hospitalId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) throw new Error("Failed");

      const result = await response.json();

      // Handle both: direct array OR { data: [...] }
      const rawData = Array.isArray(result) ? result : (result.data || []);

      // Save full data
      this.setState({ allSlotsData: rawData });

      // Show TODAY's slots
      const todayStr = today.toISOString().split("T")[0];
      const todayEntry = rawData.find(d => d.date === todayStr);
      const slots = (todayEntry?.slots || []).filter(s => !s.is_blocked);

      const formatted = slots.map(slot => ({
        id: slot.id,
        time: new Date(slot.start_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      this.setState({
        availableSlots: formatted,
        date: todayStr,
        loadingSlots: false,
      });

    } catch (err) {
      console.error("Initial load error:", err);
      this.setState({ availableSlots: [], loadingSlots: false });
    }
  };

  processSlotsForDate = (selectedDate) => {
    const { allSlotsData } = this.state;

    if (!allSlotsData || allSlotsData.length === 0) {
      this.setState({ availableSlots: [] });
      return;
    }

    // Find the date object that matches the selected date
    const dateData = allSlotsData.find((item) => item.date === selectedDate);

    if (dateData && dateData.slots) {
      // Process slots for the selected date
      const timeSlots = dateData.slots.map((slot) => {
        const startTime = new Date(slot.start_time);
        return {
          id: slot.id,
          time: startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
      this.setState({ availableSlots: timeSlots });
    } else {
      this.setState({ availableSlots: [] });
    }
  };

  constructor(props) {
    super(props);
    const today = new Date().toISOString().split("T")[0]; // Set today as default date
    this.state = {
      fullname: "",
      email: "",
      dateofbirth: "",
      phoneno: "",
      gender: "",
      hospital: "",
      service: "",
      date: today, // Set default date to today
      doctor: "",
      remarks: "",
      cardName: "",
      cardNumber: "",
      expDate: "",
      cardCvv: "",
      condition: "",
      doctorId: "",
      hospitalId: "",
      availableSlots: [],
      selectedSlot: null,
      isBooking: false,
      loadingSlots: true,
      allSlotsData: [],
    };

    // Bind all methods
    this.fullname = this.fullname.bind(this);
    this.email = this.email.bind(this);
    this.dateofbirth = this.dateofbirth.bind(this);
    this.phoneno = this.phoneno.bind(this);
    this.gender = this.gender.bind(this);
    this.hospital = this.hospital.bind(this);
    this.service = this.service.bind(this);
    this.date = this.date.bind(this);
    this.doctor = this.doctor.bind(this);
    this.remarks = this.remarks.bind(this);
    this.cardName = this.cardName.bind(this);
    this.cardNumber = this.cardNumber.bind(this);
    this.expDate = this.expDate.bind(this);
    this.cardCvv = this.cardCvv.bind(this);
    this.condition = this.condition.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSlotSelect = this.handleSlotSelect.bind(this);
    this.blockSlot = this.blockSlot.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleDateChange = async (event) => {
    const selectedDate = event.target.value;

    this.setState({
      date: selectedDate,
      selectedSlot: null,
      availableSlots: [],
      loadingSlots: true,
    });

    if (!selectedDate) {
      this.setState({ loadingSlots: false });
      return;
    }

    const { doctorId, hospitalId } = this.state;
    const token = localStorage.getItem("token");

    if (!doctorId || !hospitalId) {
      alert("Doctor info missing.");
      this.setState({ loadingSlots: false });
      return;
    }

    try {
      const url = `https://admin.vaidyabandhu.com/api/slots/slot/?start_date=${selectedDate}&end_date=${selectedDate}&doctor_id=${doctorId}&hospital_id=${hospitalId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error("Failed");

      const result = await response.json();
      
      // Extract slots from ANY format
      let slots = [];
      if (result?.data && Array.isArray(result.data)) {
        const entry = result.data.find(d => d.date === selectedDate);
        slots = entry?.slots || [];
      } else if (Array.isArray(result)) {
        const entry = result.find(d => d.date === selectedDate);
        slots = entry?.slots || [];
      }

      const available = slots.filter(s => !s.is_blocked);
      const formatted = available.map(slot => ({
        id: slot.id,
        time: new Date(slot.start_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      this.setState({
        availableSlots: formatted,
        loadingSlots: false,
      });

    } catch (err) {
      console.error("Date change error:", err);
      this.setState({
        availableSlots: [],
        loadingSlots: false,
      });
      alert("No slots available for this date.");
    }
  };

  handleSlotSelect(slotId) {
    this.setState({ selectedSlot: slotId });
  }
  blockSlot = async () => {
    const token = localStorage.getItem("token"); // FIXED
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/doctor-list";
      return;
    }
    if (!this.state.selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    this.setState({ isBooking: true });
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/slots/slot/block/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Add "Token " prefix
          },
          body: JSON.stringify({
            slot: this.state.selectedSlot,
          }),
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token"); // Clear only "token"
        alert("Session expired. Please login again.");
        window.location.href = "/appointment";
        return;
      }
      const data = await response.json();
      if (response.ok) {
        alert("Slot booked successfully! Please wait, the doctor is reviewing your appointment. The status is currently in progress.");
        this.resetForm();
        this.fetchAvailableSlots(this.state.doctorId, this.state.hospitalId);
      } else {
        console.error("Failed to book slot:", data);
        alert("Your slot is already booked. Please select a different slot.");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("An error occurred. Please try again.");
    } finally {
      this.setState({ isBooking: false });
    }
  };

  // Form field handlers
  fullname(event) {
    this.setState({ fullname: event.target.value });
  }

  email(event) {
    this.setState({ email: event.target.value });
  }

  dateofbirth(event) {
    this.setState({ dateofbirth: event.target.value });
  }

  phoneno(event) {
    this.setState({ phoneno: event.target.value });
  }

  gender(event) {
    this.setState({ gender: event.target.value });
  }

  hospital(event) {
    this.setState({ hospital: event.target.value });
  }

  service(event) {
    this.setState({ service: event.target.value });
  }

  date(event) {
    this.setState({ date: event.target.value });
  }

  doctor(event) {
    this.setState({ doctor: event.target.value });
  }

  remarks(event) {
    this.setState({ remarks: event.target.value });
  }

  cardName(event) {
    this.setState({ cardName: event.target.value });
  }

  cardNumber(event) {
    this.setState({ cardNumber: event.target.value });
  }

  expDate(event) {
    this.setState({ expDate: event.target.value });
  }

  cardCvv(event) {
    this.setState({ cardCvv: event.target.value });
  }

  condition(event) {
    this.setState({ condition: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    // Call blockSlot instead of just logging
    this.blockSlot();
  }

  resetForm() {
    this.setState({
      fullname: "",
      email: "",
      dateofbirth: "",
      phoneno: "",
      gender: "",
      hospital: "",
      service: "",
      date: new Date().toISOString().split("T")[0], // Reset to today
      doctor: "",
      remarks: "",
      cardName: "",
      cardNumber: "",
      expDate: "",
      cardCvv: "",
      condition: "",
      selectedSlot: null,
      availableSlots: [],
    });
  }

  render() {
    return (
      <div className="sidebar-style-9">
        <div className="section">
          <div className="container">
            <form onSubmit={this.handleSubmit} method="GET">
              <div className="row">
                <div className="col-lg-8">
                  <div className="sigma_form style-7">
                    <div className="form-block">
                      <h4>Your Information:</h4>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <i className="fal fa-user" />
                            <input
                              type="text"
                              value={this.state.fullname}
                              onChange={this.fullname}
                              placeholder="Patient Name"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <i className="fal fa-envelope" />

                            <input
                              type="email"
                              value={this.state.email}
                              onChange={this.email}
                              placeholder="Email"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <i className="fal fa-child" />
                            <input
                              type="text"
                              value={this.state.dateofbirth}
                              onChange={this.dateofbirth}
                              data-provide="datepicker"
                              placeholder="Date of Birth"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <i
                              className="fal fa-phone"
                              style={{ transform: "scaleX(-1)" }}
                            />
                            <input
                              type="text"
                              value={this.state.phoneno}
                              onChange={this.phoneno}
                              placeholder="Phone Number"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <i className="fal fa-venus-mars" />
                            <input
                              type="text"
                              value={this.state.gender}
                              onChange={this.gender}
                              placeholder="Gender"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-block">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <textarea
                              value={this.state.remarks}
                              onChange={this.remarks}
                              rows={7}
                              placeholder="Note To The Doctor(Optional)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="sidebar style-10 mt-5 mt-lg-0">
                    <div className="widget widget-booking">
                      <h5 className="widget-title">Booking Summary</h5>
                      <form>
                        <label>Select Date</label>
                        <div className="form-group">
                          <input
                            type="date"
                            name="date"
                            placeholder="Select Date"
                            value={this.state.date}
                            onChange={this.handleDateChange}
                            min={new Date().toISOString().split("T")[0]} // Prevent past dates
                          />
                        </div>
                      </form>
                      <label>Available Slots</label>
                      <div className="form-group d-flex flex-wrap gap-2">
                        {this.state.loadingSlots ? (
                          <p>Loading slots...</p>
                        ) : this.state.availableSlots.length > 0 ? (
                          this.state.availableSlots.map((slot) => (
                            <label key={slot.id} style={{ cursor: "pointer", margin: "5px" }}>
                              <input
                                type="radio"
                                name="slot"
                                value={slot.id}
                                checked={this.state.selectedSlot === slot.id}
                                onChange={() => this.handleSlotSelect(slot.id)}
                                style={{ display: "none" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  border: "1px solid #ddd",
                                  borderRadius: "6px",
                                  background: this.state.selectedSlot === slot.id ? "#007bff" : "#f8f9fa",
                                  color: this.state.selectedSlot === slot.id ? "white" : "black",
                                }}
                              >
                                {slot.time}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p>No available slots for this date.</p>
                        )}
                      </div>
                      <hr />
                      <ul>
                        <li className="d-flex align-items-center justify-content-between">
                          <button
                            type="submit"
                            className="sigma_btn btn-block btn-sm mt-4"
                            disabled={
                              this.state.isBooking || !this.state.selectedSlot
                            }
                          >
                            {this.state.isBooking ? "Booking..." : "Confirm"}
                            <i className="fal fa-arrow-right ms-3" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
