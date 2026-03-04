import React, { useState, useRef, useEffect } from "react";

const YOUTUBE_SHORTS = [
  "https://youtube.com/shorts/NizGUNAIOus",
  "https://youtube.com/shorts/XjHFVJ-nJ_Q",
  "https://youtube.com/shorts/2DK1F7hYKyw",
  "https://youtube.com/shorts/V5nwPrSISOY",
  "https://youtube.com/shorts/y1tOPZyW_ZE",
  "https://youtube.com/shorts/306omKo4a4E",
  "https://youtube.com/shorts/53OtlqhIJlE",
 
];

const DOCTOR_QUOTES = [
  "VaidyaBandhu helped me connect with more patients.",
  "The membership process was seamless and easy.",
  "I appreciate the premium support and resources.",
  "A trusted platform for healthcare professionals.",
  "Efficient appointment management and great UI.",
  "Highly recommended for doctors in India.",
  "Patient feedback is easy to track and manage.",
  "Secure and reliable payment gateway.",
  "Responsive design works perfectly on mobile.",
  "Excellent video testimonial integration.",
  "Profile creation after payment is a smart feature.",
  "Minimal, modern interface is a pleasure to use.",
  "Support team is always available and helpful.",
  "Easy navigation and intuitive layout.",
  "Clean, professional look for healthcare.",
  "Membership benefits are clearly explained.",
  "Fast onboarding and verification.",
  "Great for building patient trust.",
  "Simple, effective communication tools.",
  "Banner and floating buttons are visually consistent.",
  "SEO-friendly and accessible design.",
  "Testimonials carousel is engaging and modern.",
  "Video popup is clean and distraction-free.",
  "Logout and profile features are easy to use.",
  "Aadhaar and PAN removal improved privacy.",
];

function getYoutubeId(url) {
  const match = url.match(/shorts\/([\w-]+)/);
  return match ? match[1] : null;
}

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVideoId, setModalVideoId] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragging, setDragging] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % YOUTUBE_SHORTS.length);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    setDragging(true);
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) setActiveIndex((prev) => (prev - 1 + YOUTUBE_SHORTS.length) % YOUTUBE_SHORTS.length);
      else setActiveIndex((prev) => (prev + 1) % YOUTUBE_SHORTS.length);
      setDragging(false);
    }
  };
  const handleTouchEnd = () => setDragging(false);

  const handleMouseDown = (e) => {
    setDragStartX(e.clientX);
    setDragging(true);
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) setActiveIndex((prev) => (prev - 1 + YOUTUBE_SHORTS.length) % YOUTUBE_SHORTS.length);
      else setActiveIndex((prev) => (prev + 1) % YOUTUBE_SHORTS.length);
      setDragging(false);
    }
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseLeaveDrag = () => setDragging(false);

  const handleCardClick = (idx) => {
    setModalVideoId(getYoutubeId(YOUTUBE_SHORTS[idx]));
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalVideoId(null);
  };

  const getVisibleCards = () => {
    let cardsToShow = 4;
    if (window.innerWidth < 600) cardsToShow = 2;
    else if (window.innerWidth < 991) cardsToShow = 3;
    const cards = [];
    for (let i = -Math.floor(cardsToShow / 2); i <= Math.floor(cardsToShow / 2); i++) {
      if (cardsToShow === 2 && i === 0) continue;
      let idx = (activeIndex + i + YOUTUBE_SHORTS.length) % YOUTUBE_SHORTS.length;
      cards.push({ idx, url: YOUTUBE_SHORTS[idx] });
    }
    return cards;
  };

  return (
    <section className="section section-padding" style={{ background: '#f8f9fa', padding: '32px 0' }}>
      <div className="container">
        <h2 style={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '2.2rem',
          color: '#007a7e',
          marginBottom: 32,
          letterSpacing: '0.02em',
          textShadow: '0 2px 8px #007a7e11',
        }}>What Our Doctors Say</h2>
        <div
          className="testimonial-swiper"
          style={{ position: 'relative', width: '100%', overflow: 'visible', minHeight: 220 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeaveDrag}
          tabIndex={0}
        >
          <div
            className="testimonial-cards d-flex justify-content-center align-items-center"
            style={{ gap: 24, width: '100%', minHeight: 220, transition: 'all 0.4s' }}
          >
            {getVisibleCards().map(({ idx, url }, i) => {
              const videoId = getYoutubeId(url);
              let cardW = 260, cardH = 340;
              if (window.innerWidth < 600) { cardW = 320; cardH = 200; }
              else if (window.innerWidth < 991) { cardW = 180; cardH = 220; }
              return (
                <article
                  key={idx}
                  className={`testimonial-card${i === Math.floor(getVisibleCards().length/2) ? ' active' : ''}`}
                  tabIndex={0}
                  style={{
                    width: cardW,
                    height: cardH,
                    borderRadius: 24,
                    boxShadow: i === Math.floor(getVisibleCards().length/2) ? '0 12px 36px #007a7e33, 0 2px 8px #007a7e11' : '0 2px 12px #007a7e11',
                    background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
                    cursor: 'pointer',
                    transform: i === Math.floor(getVisibleCards().length/2) ? 'scale(1.08)' : 'scale(0.95)',
                    opacity: i === Math.floor(getVisibleCards().length/2) ? 1 : 0.7,
                    transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: i === Math.floor(getVisibleCards().length/2) ? 2 : 1,
                    outline: 'none',
                    padding: 0,
                    overflow: 'hidden',
                    border: '1.5px solid #b2ebf2',
                  }}
                  onClick={() => handleCardClick(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(idx); }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    borderRadius: 24,
                    boxShadow: 'none',
                    border: 'none',
                    padding: 0,
                  }}>
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt="Doctor Testimonial Video"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 24,
                        objectFit: 'cover',
                        boxShadow: '0 2px 16px #00bcd44a',
                        border: 'none',
                        display: 'block',
                        filter: 'brightness(0.97) saturate(1.1)',
                        transition: 'filter 0.3s',
                      }}
                      loading="lazy"
                    />
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.18)',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px #007a7e22',
                      padding: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2.5px solid #fff',
                    }}>
                      <svg width="38" height="38" fill="#fff" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#ff0000"/><polygon points="10,8 16,12 10,16" fill="#fff"/></svg>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        {modalOpen && (
          <div
            className="testimonial-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleCloseModal}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            <div
              className="testimonial-modal-content"
              style={{
                background: 'transparent',
                borderRadius: 0,
                padding: 0,
                boxShadow: 'none',
                maxWidth: '900px',
                width: '90vw',
                maxHeight: '90vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#ff0000',
                  border: 'none',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  cursor: 'pointer',
                  zIndex: 2,
                  fontSize: 28,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px #ff000033',
                  transition: 'none',
                  outline: 'none',
                  padding: 0,
                }}
                aria-label="Close video"
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="14" r="14" fill="#ff0000"/>
                  <line x1="9" y1="9" x2="19" y2="19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="19" y1="9" x2="9" y2="19" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
              <div style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', background: '#000', position: 'relative', borderRadius: 0, margin: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                  title="Doctor Testimonial Video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }}
                />
              </div>
            </div>
          </div>
        )}
        <style>{`
          .testimonial-card { box-shadow: 0 2px 8px #007a7e11; transition: all 0.4s; border-radius: 24px !important; padding: 0 !important; background: transparent !important; }
          .testimonial-card.active { box-shadow: 0 12px 36px #007a7e33, 0 2px 8px #007a7e11; z-index: 2; }
          .testimonial-card img { border-radius: 24px !important; }
          .testimonial-modal-overlay { animation: fadeIn 0.2s; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .testimonial-modal-content { background: transparent !important; border-radius: 0 !important; padding: 0 !important; box-shadow: none !important; }
          .testimonial-modal-content button svg { display: block; margin: auto; }
          .testimonial-modal-content div[style*='aspect-ratio'] { margin: 0 !important; border-radius: 0 !important; }
          @media (max-width: 991px) {
            .testimonial-modal-content { max-width: 98vw !important; }
          }
          @media (max-width: 600px) {
            .testimonial-cards { gap: 8px !important; }
            .testimonial-card { width: 98vw !important; min-width: 0 !important; max-width: 98vw !important; height: 180px !important; border-radius: 18px !important; }
            .testimonial-card img { width: 100% !important; height: 100% !important; border-radius: 18px !important; }
            .testimonial-modal-content { max-width: 100vw !important; border-radius: 0 !important; padding: 0 !important; }
            .testimonial-modal-content button { top: 8px !important; right: 8px !important; width: 32px !important; height: 32px !important; font-size: 20px !important; }
            .testimonial-modal-content div[style*='aspect-ratio'] { margin: 0 !important; border-radius: 0 !important; }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Testimonials;