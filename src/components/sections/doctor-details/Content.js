import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "../../../helper/helper";
import { useFetch } from "../../hooks/usefetch";
import html2canvas from "html2canvas";


const Content = ({ detailId }) => {
  const {
    data: doctorData,
    loading,
    error,
  } = useFetch({
    method: "GET",
    request: "doctors/" + detailId,
  });

  // Handle loading and error states
  if (loading) {
    return <div className="p-4 text-center" style={{ height: '400px' }}>Loading doctor details…</div>;
  }
  if (error || !doctorData || !doctorData.data) {
    return (
      <div className="p-4 text-center text-danger" style={{ height: '500px' }}>
        Failed to load doctor details.
      </div>
    );
  }

  const item = doctorData.data;

  return (
    <div className="section sigma_post-details">
      <div className="container">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="sigma_post-details-inner">
              <div className="entry-content">
                {/* Doctor card */}
                <div className="sigma_team style-17 mb-0">
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <div className="sigma_team-thumb">
                        <img
                          src={
                            item.photo ||
                            process.env.PUBLIC_URL +
                              "/images/doctor-placeholder.jpg"
                          }
                          alt={item.full_name}
                        />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="sigma_team-body">
                        <h5>
                          <Link to={"/doctor-details?id=" + (item.id || "unknown")}>
                            {item.full_name}
                          </Link>
                        </h5>
                        <div className="sigma_rating">
                          {Rating(item.ratings || 5)}
                          <span className="ms-3">
                            ({item.reviews?.length || 0})
                          </span>
                        </div>
                        <div className="sigma_team-categories">
                          <Link
                            to={"/doctor-details?id=" + (item.id || "unknown")}
                            className="sigma_team-category"
                          >
                            {item.designation}
                          </Link>
                        </div>
                        <div className="qualifications mb-3">
                          <small className="text-muted">
                            <strong>{item.qualification}</strong>
                          </small>
                        </div>
                        <div className="sigma_team-info mt-4">
                          <span>
                            <i className="fal fa-user-md" />
                            {item.experience || "N/A"} Years Experience
                          </span>
                          {/* <span>
                            <i className="fal fa-phone" />
                            {item.hospital?.[0]?.mobile || "+91-XXXXXXXXXX"}
                          </span>
                          <span>
                            <i className="fal fa-at" />
                            {item.email || "Not Provided"}
                          </span> */}
                          <span>
                            <i className="fal fa-building" />
                            {item.hospital?.[0]?.hospital_name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Positions */}
                {/* <div className="current-positions my-4">
                  <h5 className="mb-3">Current Positions</h5>
                  <div className="row">
                    {item.hospital &&
                      item.hospital.map((hospital, index) => (
                        <div key={index} className="col-md-12 mb-2">
                          <div className="position-item d-flex align-items-center">
                            <i className="fal fa-hospital text-primary me-2"></i>
                            <span>
                              {hospital.hospital_name} - {hospital.address}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div> */}

                {/* Detail Navigation */}
                <div className="detail-menu-list">
                  <div className="row no-gutters">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "expertise", label: "Expertise" },
                      { id: "achievements", label: "Achievements" },
                      { id: "awards", label: "Awards" },
                    ].map((menu, i) => (
                      <div className="col-md-3" key={menu.id}>
                        <div className="menu nav-item">
                          <Link
                            to="#"
                            className={`nav-link p-0 ${i === 0 ? "active" : ""}`}
                            onClick={e => {
                              e.preventDefault();
                              document
                                .getElementById(menu.id)
                                .scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            {menu.label}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overview Section */}
                <div id="overview" className="mb-5">
                  <h4>About {item.full_name}</h4>
                  <p>{item.content}</p>
                  <div className="why-trust-section mt-4">
                    {/* <h5>Why Patients Trust {item.full_name}</h5> */}
                    <p>{item.notes || "—"}</p>
                  </div>
                </div>

                {/* Expertise Section */}
                <div id="expertise" className="mb-5">
                  <h4>Expertise & Specializations</h4>
                  <div className="row">
                    {item.speciality && item.speciality.length > 0 ? (
                      item.speciality.map((special, index) => (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="specialty-item d-flex align-items-center">
                            <i className="fal fa-check-circle text-success me-2"></i>
                            <span>{special.title}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-muted mb-3">
                        No specialties listed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievements Section */}
                <div id="achievements" className="mb-5">
                  <h4>Professional Achievements</h4>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <div className="achievement-card text-center p-4 border rounded">
                        {item.awards_achievements || "No achievements listed."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Awards Section */}
                <div id="awards" className="mb-5">
                  <h4>Awards & Recognitions</h4>
                  <div className="awards-list">
                    <div className="award-item mb-3 p-3 border-left border-primary">
                      <div className="award-text">
                        {item.talks_publications || "No awards."}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="spacer"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Start */}
          <div className="col-lg-4">
            <div className="sidebar style-10 mt-5 mt-lg-0">

              {/* Booking Summary Widget */}
              <div className="widget widget-form">
                <h5 className="widget-title">Booking Summary</h5>
                <div className="widget-inner">
                  <form>
                    <label>Date</label>
                    <div className="form-group">
                      <input
                        type="date"
                        name="date"
                        placeholder="Select Date"
                      />
                    </div>
                    <label>Time</label>
                    <div className="form-group mb-0">
                      <input type="time" name="time" placeholder="08:30 PM" />
                    </div>
                  </form>
                </div>
                <hr />
                <div className="widget-inner widget-service">
                  <form>
                    <button
                      type="button"
                      className="sigma_btn btn-block btn-sm"
                      onClick={async () => {
                        const token = window.localStorage.getItem('token');
                        if (!token) {
                          window.dispatchEvent(new CustomEvent('open-login-modal'));
                          return;
                        }
                        try {
                          const response = await fetch('https://admin.vaidyabandhu.com/api/user/profile/', {
                            method: 'GET',
                            headers: {
                              'Authorization': token,
                              'Content-Type': 'application/json',
                            },
                          });
                          const data = await response.json();
                          if (response.ok && data?.membership_id) {
                            window.location.href = '/appointment';
                          } else {
                            window.location.href = '/basic-details';
                          }
                        } catch (err) {
                          window.location.href = '/basic-details';
                        }
                      }}
                    >
                      Book Appointment
                      <i className="fal fa-arrow-right ms-3" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Get in Touch Widget */}
              <div className="widget">
                <h5 className="widget-title">Get in Touch</h5>
                <div className="widget-inner">
                  <form>
                    <div className="form-group">
                      <i className="fal fa-user" />
                      <input
                        type="text"
                        name="fname"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <i className="fal fa-envelope" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Message"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="sigma_btn btn-block btn-sm"
                    >
                      Send Message
                      <i className="fal fa-arrow-right ms-3" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Widget */}
              <div className="widget">
                <h5 className="widget-title">Contact</h5>
                <div className="widget-inner">
                  <div className="sigma_info style-24 p-0 shadow-none">
                    <div className="sigma_info-title">
                      <span className="sigma_info-icon bg-primary-1 text-white">
                        <i className="fal fa-phone" style={{ transform: "scaleX(-1.5)" }} />
                      </span>
                    </div>
                    <div className="sigma_info-description">
                      <h5>Our Phone</h5>
                      <p>
                        Phone No:{" "}
                        {item.hospital?.[0]?.mobile || "+91 8535853589"}
                      </p>
                    </div>
                  </div>
                  <div className="sigma_info style-24 p-0 shadow-none">
                    <div className="sigma_info-title">
                      <span className="sigma_info-icon bg-primary-1 text-white">
                        <i className="fal fa-envelope-open-text" />
                      </span>
                    </div>
                    <div className="sigma_info-description">
                      <h5>Our Email</h5>
                      <p>
                      
                        {item.email || "support@vaidyabandhu.com"}
                      </p>
                    </div>
                  </div>
                  <div className="sigma_info style-24 p-0 shadow-none mb-0">
                    <div className="sigma_info-title">
                      <span className="sigma_info-icon bg-primary-1 text-white">
                        <i className="fal fa-map-marker-alt" />
                      </span>
                    </div>
                    <div className="sigma_info-description">
                      <h5>Our Address</h5>
                       <p>
                        {item.address || "Bangalore"}
                      </p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar End */}
        </div>
      </div>
      {/* Inline style for visual tweaks */}
      <style>{`
        .achievement-card {
          transition: transform 0.3s ease;
        }
        .specialty-item, .position-item, .award-item {
          transition: background-color 0.3s ease;
        }
        .award-item {
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .quick-info-item {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .quick-info-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default Content;
