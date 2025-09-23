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
        alert("Session expired. Please login again.");
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
          // Set default doctor and hospital IDs
          doctorId: data.doctor || 245, // Default to 245 if not provided
          hospitalId: data.hospital || 2, // Default to 2 if not provided
        });
        
        // Fetch available slots after setting doctor and hospital IDs
        this.fetchAvailableSlots(data.doctor || 245, data.hospital || 2);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  // New method to fetch available slots
  fetchAvailableSlots = async (doctorId, hospitalId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/basic-details";
      return;
    }

    // Set default date range (today to 30 days from now)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);
    
    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/slots/slot/?doctor_id=${doctorId}&hospital_id=${hospitalId}&start_date=${startDateStr}&end_date=${endDateStr}`,
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
        alert("Session expired. Please login again.");
        window.location.href = "/basic-details";
        return;
      }
      
      const data = await response.json();
      if (response.ok) {
        // Process slots to extract time slots
        const timeSlots = this.processSlots(data);
        this.setState({ availableSlots: timeSlots });
      } else {
        console.error("Failed to fetch slots:", data);
        this.setState({ availableSlots: [] });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      this.setState({ availableSlots: [] });
    }
  };

  // New method to process slots and extract time slots
  processSlots = (slots) => {
    if (!slots || slots.length === 0) return [];
    
    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      const date = new Date(slot.start_time).toISOString().split('T')[0];
      if (!slotsByDate[date]) {
        slotsByDate[date] = [];
      }
      slotsByDate[date].push(slot);
    });
    
    // For simplicity, we'll just extract time slots for the first date
    const firstDate = Object.keys(slotsByDate)[0];
    if (!firstDate) return [];
    
    return slotsByDate[firstDate].map(slot => {
      const startTime = new Date(slot.start_time);
      return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      dateofbirth: "",
      phoneno: "",
      gender: "",
      hospital: "",
      service: "",
      date: "",
      doctor: "",
      remarks: "",
      cardName: "",
      cardNumber: "",
      expDate: "",
      cardCvv: "",
      condition: "",
      // New state variables
      doctorId: "", 
      hospitalId: "", 
      availableSlots: [], // To store available time slots
    };
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
    // Bind new methods
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  
  // New method to handle date change
  handleDateChange(event) {
    const selectedDate = event.target.value;
    this.setState({ date: selectedDate });
    
    // Fetch slots for the selected date
    if (selectedDate && this.state.doctor && this.state.hospital) {
      this.fetchSlotsForDate(selectedDate);
    }
  }
  
  // New method to fetch slots for a specific date
  fetchSlotsForDate = async (selectedDate) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/basic-details";
      return;
    }

    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/slots/slot/?doctor_id=${this.state.doctor}&hospital_id=${this.state.hospital}&start_date=${selectedDate}&end_date=${selectedDate}`,
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
        alert("Session expired. Please login again.");
        window.location.href = "/basic-details";
        return;
      }
      
      const data = await response.json();
      if (response.ok) {
        // Process slots to extract time slots
        const timeSlots = data.map(slot => {
          const startTime = new Date(slot.start_time);
          return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        this.setState({ availableSlots: timeSlots });
      } else {
        console.error("Failed to fetch slots:", data);
        this.setState({ availableSlots: [] });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      this.setState({ availableSlots: [] });
    }
  };

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
    this.resetForm();
    console.log(
      this.state.fullname,
      this.state.email,
      this.state.dateofbirth,
      this.state.phoneno,
      this.state.gender,
      this.state.hospital,
      this.state.service,
      this.state.date,
      this.state.doctor,
      this.state.remarks,
      this.state.cardName,
      this.state.cardNumber,
      this.state.expDate,
      this.state.cardCvv,
      this.state.condition
    );
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
      date: "",
      doctor: "",
      remarks: "",
      cardName: "",
      cardNumber: "",
      expDate: "",
      cardCvv: "",
      condition: "",
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
                        {/* <div className="col-12">
                          <div className="form-group">
                            <select
                              value={this.state.hospital}
                              onChange={this.hospital}
                            >
                              <option value="">Select Hospital</option>
                              <option value="2">Hospital 1</option>
                              <option value="3">Hospital 2</option>
                              <option value="4">Hospital 3</option>
                            </select>
                          </div>
                        </div> */}
                        {/* <div className="col-12">
                          <div className="form-group">
                            <select value={this.state.service} onChange={this.service}>
                              <option value="">Select Service</option>
                              <option value="2">Service 1</option>
                              <option value="3">Service 2</option>
                              <option value="4">Service 3</option>
                            </select>
                          </div>
                        </div> */}
                        {/* <div className="col-12">
                          <div className="form-group">
                            <i className="fal fa-calendar-alt" />
                            <input 
                              type="date" 
                              value={this.state.date} 
                              onChange={this.handleDateChange}
                              data-provide="datepicker" 
                              placeholder="Select Date" 
                            />
                          </div>
                        </div> */}
                        {/* <div className="col-12">
                          <div className="form-group">
                            <i className="fal fa-user-md" />
                            <input 
                              type="text" 
                              value={this.state.doctor} 
                              onChange={this.doctor} 
                              placeholder="Select Doctor" 
                            />
                          </div>
                        </div> */}
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
                    {/* Booking Widget */}
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
                          />
                        </div>
                      </form>
                      {/* Available Slots */}
                      <label>Available Slots</label>
                      <div className="form-group d-flex flex-wrap gap-2">
                        {this.state.availableSlots.length > 0 ? (
                          this.state.availableSlots.map((slot, index) => (
                            <label
                              key={index}
                              style={{
                                cursor: "pointer",
                                margin: "5px",
                              }}
                            >
                              <input
                                type="radio"
                                name="slot"
                                value={slot}
                                style={{ display: "none" }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  border: "1px solid #ddd",
                                  borderRadius: "6px",
                                  background: "#f8f9fa",
                                }}
                              >
                                {slot}
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
                          >
                            Confirm
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