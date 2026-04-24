import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const PATIENT_YOUTUBE_SHORTS = [
  "https://youtube.com/shorts/_1KoY_MktZ0",
  "https://youtube.com/shorts/1wSayy5Q5A8",
  "https://youtube.com/shorts/0ayY9LTxbhs",
  "https://youtube.com/shorts/uQ8ql-h-h7c",
  "https://youtube.com/shorts/A1GXQ5JRI2M",
  "https://youtube.com/shorts/yqx4M_G8te4",
];

const getYoutubeId = (url) => {
  const shortsMatch = url.match(/shorts\/([\w-]+)/);
  if (shortsMatch) return shortsMatch[1];

  const watchMatch = url.match(/[?&]v=([\w-]+)/);
  if (watchMatch) return watchMatch[1];

  return null;
};

const PatientTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const cards = useMemo(
    () =>
      PATIENT_YOUTUBE_SHORTS.map((url, index) => ({
        id: index + 1,
        videoId: getYoutubeId(url),
      })).filter((item) => item.videoId),
    []
  );

  return (
    <section className="vb-section vb-section-tight" id="patient-video-testimonials">
      <div className="vb-container">
        <span className="vb-pill">Patient Video Testimonials</span>
        <h2 className="vb-section-heading">Patient Feedback</h2>
        <p className="vb-section-subheading">
          Real patient videos shared through our feedback library.
        </p>

        <div className="vb-swiper-arrows">
          <button
            type="button"
            className="vb-swiper-arrow vb-patient-test-prev"
            aria-label="Previous patient testimonials"
          >
            <i className="far fa-arrow-left" />
          </button>
          <button
            type="button"
            className="vb-swiper-arrow vb-patient-test-next"
            aria-label="Next patient testimonials"
          >
            <i className="far fa-arrow-right" />
          </button>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={14}
          slidesPerView={1.15}
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          navigation={{
            prevEl: ".vb-patient-test-prev",
            nextEl: ".vb-patient-test-next",
          }}
          breakpoints={{
            540: { slidesPerView: 2, spaceBetween: 14 },
            900: { slidesPerView: 3, spaceBetween: 14 },
            1200: { slidesPerView: 4, spaceBetween: 14 },
          }}
          className="vb-video-swiper"
        >
          {cards.map((item) => (
            <SwiperSlide key={item.id}>
              <article
                className="vb-video-card"
                onClick={() => setActiveVideo(item.videoId)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setActiveVideo(item.videoId);
                  }
                }}
                aria-label={`Play patient testimonial video ${item.id}`}
              >
                <div className="vb-video-thumb">
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={`Patient testimonial ${item.id}`}
                    loading="lazy"
                  />
                  <span className="vb-video-play" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 6L18 12L8 18V6Z" fill="currentColor" />
                    </svg>
                  </span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {activeVideo && (
        <div
          className="vb-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
        >
          <div className="vb-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="vb-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video modal"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
              title="Patient testimonial video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientTestimonials;
