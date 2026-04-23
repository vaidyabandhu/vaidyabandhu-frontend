import React, { useMemo, useState } from "react";
import workprocessData from "../../../data/workprocess.json";

const PROCESS_VIDEO_ID = "MxAB93ylwKM";

const cleanText = (value = "") =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const toCompactLine = (value = "") => {
  const cleaned = cleanText(value);
  if (!cleaned) return "";
  if (cleaned.length <= 70) return cleaned;
  return `${cleaned.slice(0, 67).trim()}...`;
};

const Workprocess = () => {
  const [showVideo, setShowVideo] = useState(false);

  const steps = useMemo(
    () =>
      workprocessData.map((item, index) => ({
        id: item.id,
        index: index + 1,
        title: cleanText(item.title),
        copy: toCompactLine(item.points[0]),
      })),
    []
  );

  return (
    <section className="vb-section" id="how-it-works">
      <div className="vb-container">
        <span className="vb-pill">How It Works</span>
        <h2 className="vb-section-heading">3 Steps</h2>
        <p className="vb-section-subheading">
          Start your care journey in minutes.
        </p>

        <div className="vb-process-shell">
          <div className="vb-steps-grid">
            {steps.map((step) => (
              <article className="vb-step-card" key={step.id}>
                <div className="vb-step-index">0{step.index}</div>
                <div>
                  <h3 className="vb-step-title">{step.title}</h3>
                  <p className="vb-step-copy">{step.copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div
            className="vb-process-video"
            onClick={() => setShowVideo(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setShowVideo(true);
              }
            }}
            aria-label="Play step-by-step process video"
          >
            <img
              src={`https://img.youtube.com/vi/${PROCESS_VIDEO_ID}/hqdefault.jpg`}
              alt="Step-by-step process video thumbnail"
              loading="lazy"
            />
            <span className="vb-video-play" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 6L18 12L8 18V6Z" fill="currentColor" />
              </svg>
            </span>
            <p className="vb-process-caption">Watch The Complete Process</p>
          </div>
        </div>
      </div>

      {showVideo && (
        <div
          className="vb-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowVideo(false)}
        >
          <div className="vb-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="vb-modal-close"
              onClick={() => setShowVideo(false)}
              aria-label="Close process video"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${PROCESS_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Vaidya Bandhu process video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Workprocess;
