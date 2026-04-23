import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const YOUTUBE_SHORTS = [
  "https://youtube.com/shorts/NizGUNAIOus",
  "https://youtube.com/shorts/XjHFVJ-nJ_Q",
  "https://youtube.com/shorts/2DK1F7hYKyw",
  "https://youtube.com/shorts/V5nwPrSISOY",
  "https://youtube.com/shorts/y1tOPZyW_ZE",
  "https://youtube.com/shorts/306omKo4a4E",
  "https://youtube.com/shorts/53OtlqhIJlE",
];

const getYoutubeId = (url) => {
  const shortsMatch = url.match(/shorts\/([\w-]+)/);
  if (shortsMatch) return shortsMatch[1];

  const watchMatch = url.match(/[?&]v=([\w-]+)/);
  if (watchMatch) return watchMatch[1];

  return null;
};

const Testimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const cards = useMemo(
    () =>
      YOUTUBE_SHORTS.map((url, index) => ({
        id: index + 1,
        videoId: getYoutubeId(url),
      })).filter((item) => item.videoId),
    []
  );

  return (
    <section className="vb-section" id="doctor-video-testimonials">
      <div className="vb-container">
        <span className="vb-pill">Doctor Video Testimonials</span>
        <h2 className="vb-section-heading">Doctor Feedback</h2>
        <p className="vb-section-subheading">
          Real videos from our doctor feedback library.
        </p>

        <div className="vb-swiper-arrows">
          <button type="button" className="vb-swiper-arrow vb-test-prev" aria-label="Previous testimonials">
            <i className="far fa-arrow-left" />
          </button>
          <button type="button" className="vb-swiper-arrow vb-test-next" aria-label="Next testimonials">
            <i className="far fa-arrow-right" />
          </button>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={14}
          slidesPerView={1.15}
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          navigation={{
            prevEl: ".vb-test-prev",
            nextEl: ".vb-test-next",
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
                aria-label={`Play doctor testimonial video ${item.id}`}
              >
                <div className="vb-video-thumb">
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={`Doctor testimonial ${item.id}`}
                    loading="lazy"
                  />
                  <span className="vb-video-play" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M8 6L18 12L8 18V6Z" fill="currentColor" />
                    </svg>
                  </span>
                </div>
                {/* <div className="vb-video-meta">
                  <p className="vb-video-label">Doctor Testimonial #{item.id}</p>
                  <span className="vb-video-sub">Tap to watch</span>
                </div> */}
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
              title="Doctor testimonial video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
