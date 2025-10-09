import React, { Component } from "react";
import { Link } from "react-router-dom";

class Content extends Component {
  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired or not logged in. Please login again.");
      window.location.href = "/basic-details";
      return;
    }
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/profile/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please login again testing.");
        window.location.href = "/basic-details";
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
          doctorId: data.doctor || 245,
          hospitalId: data.hospital || 2,
        });

        // Fetch available slots after setting doctor and hospital IDs
        this.fetchAvailableSlots(data.doctor || 245, data.hospital || 2);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  fetchAvailableSlots = async (doctorId, hospitalId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
    console.log("testing the token", token);
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/basic-details";
      return;
    }

    // Set default date range (today to 30 days from now)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    const startDateStr = today.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/slots/slot/?start_date=${startDateStr}&end_date=${endDateStr}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        }
      );

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/basic-details";
        return;
      }

      const data = await response.json();
      if (response.ok) {
        // Store all slots data in state
        this.setState({ allSlotsData: data });
        // Process slots for the current date
        this.processSlotsForDate(this.state.date);
      } else {
        console.error("Failed to fetch slots:", data);
        this.setState({ availableSlots: [] });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      this.setState({ availableSlots: [] });
    }
  };

  processSlotsForDate = (selectedDate) => {
    const { allSlotsData } = this.state;
    
    if (!allSlotsData || allSlotsData.length === 0) {
      this.setState({ availableSlots: [] });
      return;
    }

    // Find the date object that matches the selected date
    const dateData = allSlotsData.find(item => item.date === selectedDate);
    
    if (dateData && dateData.slots) {
      // Process slots for the selected date
      const timeSlots = dateData.slots.map(slot => {
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
    const today = new Date().toISOString().split('T')[0]; // Set today as default date
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
      allSlotsData: [], // Store all slots data
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

  handleDateChange(event) {
    const selectedDate = event.target.value;
    this.setState({
      date: selectedDate,
      selectedSlot: null, // Reset selected slot when date changes
    }, () => {
      // Process slots for the new date after state update
      this.processSlotsForDate(selectedDate);
    });
  }

  handleSlotSelect(slotId) {
    this.setState({ selectedSlot: slotId });
  }

  blockSlot = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/basic-details";
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slot: this.state.selectedSlot,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please login again.");
        window.location.href = "/basic-details";
        return;
      }

      const data = await response.json();
      if (response.ok) {
        alert("Slot booked successfully!");
        this.resetForm();
        // Refresh available slots after booking
        this.fetchAvailableSlots(this.state.doctorId, this.state.hospitalId);
      } else {
        console.error("Failed to book slot:", data);
        alert("Failed to book slot. Please try again.");
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
      date: new Date().toISOString().split('T')[0], // Reset to today
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
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                          />
                        </div>
                      </form>
                      <label>Available Slots</label>
                      <div className="form-group d-flex flex-wrap gap-2">
                        {this.state.availableSlots.length > 0 ? (
                          this.state.availableSlots.map((slot) => (
                            <label
                              key={slot.id}
                              style={{
                                cursor: "pointer",
                                margin: "5px",
                              }}
                            >
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
                                  background:
                                    this.state.selectedSlot === slot.id
                                      ? "#007bff"
                                      : "#f8f9fa",
                                  color:
                                    this.state.selectedSlot === slot.id
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {slot.time}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p>No available slots for the selected date.</p>
                        )}
                      </div>
                      <hr />
                      <ul>
                        <li className="d-flex align-items-center justify-content-between">
                          <button
                            type="submit"
                            className="sigma_btn btn-block btn-sm mt-4"
                            disabled={this.state.isBooking || !this.state.selectedSlot}
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