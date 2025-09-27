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
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

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
  }

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
    console.log("Form submitted with data:", this.state);
    // You can add form submission logic here if needed
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
                    {/* Booking Widget */}
                    <div className="widget widget-booking">
                      <h5 className="widget-title">Booking Summary</h5>
                      <hr />
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
                      <div className="form-group">
                        {[
                          "08:30 AM",
                          "09:00 AM",
                          "10:30 AM",
                          "02:00 PM",
                          "04:00 PM",
                        ].map((slot, index) => (
                          <div key={index}>
                            <input
                              type="radio"
                              id={`slot-${index}`}
                              name="slot"
                              value={slot}
                            />
                            <label
                              htmlFor={`slot-${index}`}
                              style={{ marginLeft: "5px" }}
                            >
                              {slot}
                            </label>
                          </div>
                        ))}
                      </div>

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
