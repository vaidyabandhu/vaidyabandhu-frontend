import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const videoTestimonials = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/3JZ_D3ELwOQ",
  "https://www.youtube.com/embed/L_jWHffIx5E",
  "https://www.youtube.com/embed/fJ9rUzIMcZQ",
  "https://www.youtube.com/embed/YQHsXMglC9A",
  "https://www.youtube.com/embed/CevxZvSJLk8",
];

const getYouTubeId = (url) => {
  const parts = url.split("/embed/");
  return parts[1] || "";
};

class ClientTestimonials extends Component {
  state = {
    activeVideo: null,
  };

  openVideoPopup = (videoUrl) => {
    const videoUrlWithAutoplay = `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`;
    this.setState({ activeVideo: videoUrlWithAutoplay });
  };

  closeVideoPopup = () => {
    this.setState({ activeVideo: null });
  };

  render() {
    const { activeVideo } = this.state;

    return (
      <div className="section section-padding">
        <div className="container">
          <div className="section-title centered">
            {/* <h3 className="title">Your Health, Our Priority – Hear From Our Members</h3> */}
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 34px)",
                fontWeight: "800",
                fontFamily: "Poppins",
                color: "#004d4f",
                marginBottom: "10px",
                lineHeight: "1.3",
                // opacity: animated ? 1 : 0,
                // transform: animated ? "translateY(0)" : "translateY(30px)",
                // transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
              }}
            >
              Your Health, Our Priority
              <br />{" "}
              <span style={{ color: "#007a7e" }}> Hear From Our Members</span>
            </h2>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            style={{ paddingBottom: "35px" }}
          >
            {videoTestimonials.map((videoUrl, index) => (
              <SwiperSlide key={videoUrl + index}>
                <div
                  onClick={() => this.openVideoPopup(videoUrl)}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(videoUrl)}/hqdefault.jpg`}
                      alt={`Member video testimonial ${index + 1}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.25)",
                      }}
                    >
                      <span
                        className="fas fa-play"
                        style={{
                          color: "#fff",
                          fontSize: "32px",
                          background: "rgba(0, 122, 126, 0.85)",
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {activeVideo && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.75)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={this.closeVideoPopup}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "900px",
                  background: "#000",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="video-popup-close-btn"
                  type="button"
                  onClick={this.closeVideoPopup}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 2,
                    background: "#ff0000",
                    border: "none",
                    color: "#fff",
                    fontSize: "20px",
                    lineHeight: "1",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Close video popup"
                >
                  <i className="fas fa-times" />
                </button>
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
                  <iframe
                    src={activeVideo}
                    title="Member video testimonial"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          <style>
            {`
              .video-popup-close-btn:hover,
              .video-popup-close-btn:focus,
              .video-popup-close-btn:active {
                transform: none !important;
                box-shadow: none !important;
                background: #ff0000 !important;
                color: #fff !important;
              }
            `}
          </style>
        </div>
      </div>
    );
  }
}

export default ClientTestimonials;
