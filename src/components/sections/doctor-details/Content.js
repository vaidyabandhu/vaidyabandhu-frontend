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
    return (
      <div className="p-4 text-center" style={{ height: "400px" }}>
        Loading doctor details…
      </div>
    );
  }
  if (error || !doctorData || !doctorData.data) {
    return (
      <div className="p-4 text-center text-danger" style={{ height: "500px" }}>
        Failed to load doctor details.
      </div>
    );
  }

  const item = doctorData.data;

  // Extract hospital addresses with safety checks
  const hospitalAddresses =
    item?.hospital
      ?.map((h) => h.address)
      .filter((addr) => addr && addr.trim() !== "") || [];
  const addressString =
    hospitalAddresses.length > 0
      ? hospitalAddresses.join(", ")
      : "Not specified";

  // Process fellowship membership from string to array
  const fellowshipItems = item.fellowship_membership
    ? item.fellowship_membership
        .split("•")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
    : [];

  // Process field expertise
  const fieldExpertiseItems = item.field_expertise
    ? item.field_expertise
        .split("•")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
    : [];

  // Process awards and achievements
  const awardsAchievementsItems = item.awards_achievements
    ? item.awards_achievements
        .split("•")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
    : [];

  // Process talks and publications
  const talksPublicationsItems = item.talks_publications
    ? item.talks_publications
        .split("•")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim())
    : [];

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

                    <div className="col-md-8 d-flex flex-column justify-content-between">
                      <div className="sigma_team-body ">
                        <h5>
                          <Link
                            to={"/doctor-details?id=" + (item.id || "unknown")}
                          >
                            <i className="fas fa-user-md me-2"></i>
                            {item.full_name}
                          </Link>
                        </h5>

                        <div className="mt-2">
                          <span style={{ fontSize: "18px", color: "#6c757d" }}>
                            <i className="fas fa-hospital me-2"></i>
                            {item.hospital && item.hospital.length > 0
                              ? item.hospital.map((h) => h.name).join(", ")
                              : "N/A"}
                          </span>
                        </div>

                        <div className="qualifications mt-2">
                          <small className="text-muted">
                            <i className="fas fa-graduation-cap me-2"></i>
                            <strong>{item.qualification}</strong>
                          </small>
                        </div>

                        <div
                          className="sigma_team-categories"
                          style={{ marginTop: "8px" }}
                        >
                          <span
                            className="sigma_team-category"
                            style={{ color: "#686A6F" }}
                          >
                            <i className="fas fa-user-tie me-2"></i>
                            {item.designation}
                          </span>
                        </div>

                        {item.department_name && (
                          <div className="department-info mt-1 mb-2">
                            <span
                              style={{ fontSize: "18px", color: "#6c757d" }}
                            >
                              <i className="fas fa-building me-2"></i>
                              {item.department_name}
                            </span>
                          </div>
                        )}

                        <div className="sigma_team-categories">
                          <i
                            className="fas fa-stethoscope me-2"
                            style={{ color: "#686A6F" }}
                          ></i>
                          {item.speciality
                            ?.slice(0, 3)
                            .map((specialityItem, index) => (
                              <span
                                key={index}
                                className="sigma_team-category"
                                style={{
                                  color: "#686A6F",
                                  cursor: "default",
                                }}
                              >
                                {specialityItem.title}
                                {index !==
                                  Math.min(2, item.speciality.length - 1) &&
                                  ", "}
                              </span>
                            ))}

                          {item.speciality?.length > 3 && " ..."}
                        </div>

                        <div className="sigma_team-info mt-2">
                          <span>
                            <i className="fas fa-user-md me-2"></i>
                            {item.experience || "N/A"} Years Experience
                          </span>

                          {/* Address section added here */}
                          <span>
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {addressString}
                          </span>
                        </div>
                      </div>

                      {/* Right aligned button */}
                      <div className="d-flex justify-content-end mt-3 pe-3 pb-3">
                        <button
                          type="button"
                          className="sigma_btn btn-sm"
                          onClick={async () => {
                            const token = window.localStorage.getItem("token");
                            if (!token) {
                              window.dispatchEvent(
                                new CustomEvent("open-login-modal")
                              );
                              return;
                            }
                            try {
                              const response = await fetch(
                                "https://admin.vaidyabandhu.com/api/user/profile/",
                                {
                                  method: "GET",
                                  headers: {
                                    Authorization: token,
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              const data = await response.json();
                              if (response.ok) {
                                if (data?.is_active === false) {
                                  window.location.href = "/basic-details";
                                } else if (data?.is_active === true) {
                                  window.location.href = "/appointment";
                                } else {
                                  window.location.href = "/basic-details";
                                }
                              } else {
                                window.location.href = "/basic-details";
                              }
                            } catch (err) {
                              window.location.href = "/basic-details";
                            }
                          }}
                        >
                          <i className="fas fa-calendar-check me-2"></i>
                          Book Appointment
                          <i className="fas fa-arrow-right ms-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Navigation */}
                <div className="detail-menu-list">
                  <div className="row no-gutters">
                    {[
                      { id: "overview", label: "Field expertise" },
                      { id: "expertise", label: "Fellowship membership" },
                      { id: "achievements", label: "Awards achievements" },
                      { id: "awards", label: "Talks publications" },
                    ].map((menu, i) => (
                      <div className="col-md-3" key={menu.id}>
                        <div className="menu nav-item">
                          <Link
                            to="#"
                            className={`nav-link p-0 ${
                              i === 0 ? "active" : ""
                            }`}
                            onClick={(e) => {
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
                  <h4>Field expertise</h4>
                  <div className="row">
                    {fieldExpertiseItems.length > 0 ? (
                      fieldExpertiseItems.map((expertise, index) => (
                        <div key={index} className="col-md-12 mb-3">
                          {expertise
                            .split(".") // split by full stop
                            .filter((point) => point.trim() !== "") // remove empty ones
                            .map((point, subIndex) => (
                              <div
                                key={`${index}-${subIndex}`}
                                className="specialty-item d-flex align-items-start mb-1"
                              >
                                <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                <span>{point.trim()}</span>
                              </div>
                            ))}
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-muted mb-3">
                        No field expertise listed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Expertise Section */}
                <div id="expertise" className="mb-5">
                  <h4>Fellowship & Memberships</h4>
                  <div className="row">
                    {fellowshipItems.length > 0 ? (
                      fellowshipItems.map((fellowship, index) => (
                        <div key={index} className="col-md-12 mb-3">
                          <div className="specialty-item d-flex align-items-start">
                            <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                            <span> {fellowship}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-muted mb-3">
                        No fellowship memberships listed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievements Section */}
                <div id="achievements" className="mb-5">
                  <h4>Awards & Achievements</h4>
                  <div className="row">
                    {awardsAchievementsItems.length > 0 ? (
                      awardsAchievementsItems.map((achievement, index) => (
                        <div key={index} className="col-md-12 mb-3">
                          {achievement
                            .split("●") // split into bullet points
                            .filter((point) => point.trim() !== "") // remove empties
                            .map((point, subIndex) => (
                              <div
                                key={`${index}-${subIndex}`}
                                className="specialty-item d-flex align-items-start mb-1"
                              >
                                <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                <span>{point.trim()}</span>
                              </div>
                            ))}
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-muted mb-3">
                        No awards or achievements listed.
                      </div>
                    )}
                  </div>
                </div>

                {/* Awards Section */}
                <div id="awards" className="mb-5">
                  <h4>Talks & Publications</h4>
                  <div className="row">
                    {talksPublicationsItems.length > 0 ? (
                      talksPublicationsItems.map((publication, index) => (
                        <div key={index} className="col-md-12 mb-3">
                          {publication
                            .split("●") // split into points
                            .filter((point) => point.trim() !== "") // remove empty ones
                            .map((point, subIndex) => (
                              <div
                                key={`${index}-${subIndex}`}
                                className="specialty-item d-flex align-items-start mb-1"
                              >
                                <i className="fas fa-check-circle text-success me-2 mt-1"></i>
                                <span>{point.trim()}</span>
                              </div>
                            ))}
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-muted mb-3">
                        No talks or publications listed.
                      </div>
                    )}
                  </div>
                </div>

                <div className="spacer"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Start */}
          <div className="col-lg-4">
            <div className="sidebar style-10 mt-5 mt-lg-0">
              {/* Get in Touch Widget */}
              <div className="widget">
                <h5 className="widget-title">
                  <i className="fas fa-envelope me-2"></i>Get in Touch
                </h5>
                <div className="widget-inner">
                  <form>
                    <div className="form-group">
                      <i className="fas fa-user" />
                      <input
                        type="text"
                        name="fname"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <i className="fas fa-envelope" />
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
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                      <i className="fas fa-arrow-right ms-3" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Widget */}
              <div className="widget">
                <h5 className="widget-title">
                  <i className="fas fa-address-book me-2"></i>Contact
                </h5>
                <div className="widget-inner">
                  <div className="sigma_info style-24 p-0 shadow-none">
                    <div className="sigma_info-title">
                      <span className="sigma_info-icon bg-primary-1 text-white">
                        <i
                          className="fas fa-phone"
                          style={{ transform: "scaleX(-1.5)" }}
                        />
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
                        <i className="fas fa-envelope-open-text" />
                      </span>
                    </div>
                    <div className="sigma_info-description">
                      <h5>Our Email</h5>
                      <p>{item.email || "support@vaidyabandhu.com"}</p>
                    </div>
                  </div>
                  <div className="sigma_info style-24 p-0 shadow-none mb-0">
                    <div className="sigma_info-title">
                      <span className="sigma_info-icon bg-primary-1 text-white">
                        <i className="fas fa-map-marker-alt" />
                      </span>
                    </div>
                    <div className="sigma_info-description">
                      <h5>Our Address</h5>
                      <p>{item.address || "Bangalore"}</p>
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
