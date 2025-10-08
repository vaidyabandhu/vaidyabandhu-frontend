import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const services = [
  {
    image: "/assets/img/icon1.png",
    title: "10% – 40% Discount on Surgeries",
    points: [
      "Access affordable surgeries across all departments",
      "Connect with top doctors and specialists",
      "Prioritizing your healing with post-recovery care",
    ],
  },
  {
    image: "/assets/img/icon2.png",
    title: "Save 10% to 40% on Diagnostic Tests",
    points: [
      "Discounts on MRI, CT Scan, Blood Tests",
      "Access partnered centers across Karnataka",
      "Accurate results with modern facilities",
    ],
  },
  {
    image: "/assets/img/icon3.png",
    title: "10% Cashback on Medical Bills",
    points: [
      "Send bills via WhatsApp or Email",
      "Cashback credited within 7 working days",
      "Valid on surgeries, treatments, and diagnostics",
    ],
  },
  {
    image: "/assets/img/icon4.png",
    title: "Your One-Stop Healthcare Solution",
    points: [
      "Consult experts across 80+ departments",
      "Find trusted doctors, hospitals, and labs",
      "Personalized medical support tailored to your needs",
    ],
  },
  {
    image: "/assets/img/icon5.png",
    title: "Get a Second Opinion from Experts",
    points: [
      "Unsure about a surgery or treatment plan?",
      "Consult top specialists to confirm options",
      "Avoid unnecessary surgeries with expert guidance",
    ],
  },
  {
    image: "/assets/img/icon6.png",
    title: "Consult a Doctor – For Medical Advice",
    points: [
      "Expert consultations anytime",
      "Discuss symptoms and health concerns",
      "Connect with experienced professionals",
    ],
  },
  {
    image: "/assets/img/icon7.png",
    title: "Free Surgeries for Underprivileged",
    points: [
      "Life-saving treatments for those in need",
      "Partnered with socially committed hospitals",
      "Continuous care and recovery support",
    ],
  },
];

const ServicesPreview = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleSwiperInit = (swiper) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const sectionStyle = {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
    textAlign: "center",
    fontFamily: "'Poppins",
    position: "relative",
    overflow: "hidden",
  };

  const headingStyle = {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: "800",
    color: "#004d4f",
    marginBottom: "15px",
    lineHeight: "1.2",
    position: "relative",
    display: "inline-block",
  };

  const headingUnderline = {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: "-10px",
    transform: "translateX(-50%)",
    width: "100px",
    height: "5px",
    background: "linear-gradient(90deg, #007a7e, #00a8a8)",
    borderRadius: "3px",
  };

  const subHeadingStyle = {
    fontSize: "clamp(16px, 2vw, 22px)",
    color: "#4a5568",
    maxWidth: "900px",
    margin: "25px auto 50px",
    lineHeight: "1.5",
    fontWeight: "400",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  };

  const cardStyle = (index) => ({
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: hoveredIndex === index 
      ? "0 15px 40px rgba(0, 77, 79, 0.15)" 
      : "0 10px 30px rgba(0, 77, 79, 0.08)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: hoveredIndex === index 
      ? "1px solid rgba(0, 122, 126, 0.3)" 
      : "1px solid rgba(0, 122, 126, 0.1)",
    position: "relative",
    overflow: "hidden",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(30px)",
    transitionDelay: `${Math.random() * 0.3}s`,
    cursor: "pointer",
  });

  const iconContainerStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "25px",
    boxShadow: "none",
    transition: "all 0.3s ease",
  };

  const imageStyle = {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  };

  const titleStyle = (index) => ({
    fontSize: "22px",
    fontWeight: "700",
    color: hoveredIndex === index ? "#007a7e" : "#003d3f",
    marginBottom: "15px",
    lineHeight: "1.3",
    transition: "all 0.3s ease",
    position: "relative",
    paddingBottom: "10px",
  });

  const titleUnderline = (index) => ({
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: "0",
    transform: hoveredIndex === index 
      ? "translateX(-50%) scaleX(1)" 
      : "translateX(-50%) scaleX(0)",
    width: "60px",
    height: "3px",
    background: "#007a7e",
    borderRadius: "2px",
    transition: "transform 0.3s ease",
  });

  const pointsContainer = (index) => ({
    width: "100%",
    maxHeight: hoveredIndex === index ? "300px" : "0",
    overflow: "hidden",
    transition: "max-height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease",
    opacity: hoveredIndex === index ? 1 : 0,
    marginTop: "10px",
  });

  const pointsList = {
    listStyle: "none",
    padding: "0",
    margin: "0",
    textAlign: "left",
  };

  const pointItem = {
    fontSize: "16px",
    color: "#4a5568",
    marginBottom: "12px",
    paddingLeft: "28px",
    position: "relative",
    lineHeight: "1.4",
  };

  const pointBullet = {
    position: "absolute",
    left: "0",
    top: "5px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#007a7e",
  };

  const navigationButtonStyle = (disabled) => ({
    width: "40px",
    height: "40px",
    background: disabled ? "rgba(0, 77, 79, 0.4)" : "rgba(0, 77, 79, 0.8)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    zIndex: 10,
    transition: "all 0.3s ease",
    boxShadow: disabled ? "none" : "0 4px 15px rgba(0, 77, 79, 0.2)",
    opacity: disabled ? 0.5 : 1,
  });

  const prevButtonStyle = (disabled) => ({
    ...navigationButtonStyle(disabled),
    position: isMobile ? "relative" : "absolute",
    top: isMobile ? "auto" : "50%",
    transform: isMobile ? "none" : "translateY(-50%)",
    left: isMobile ? "auto" : "-55px",
    marginRight: isMobile ? "10px" : "0",
  });

  const nextButtonStyle = (disabled) => ({
    ...navigationButtonStyle(disabled),
    position: isMobile ? "relative" : "absolute",
    top: isMobile ? "auto" : "50%",
    transform: isMobile ? "none" : "translateY(-50%)",
    right: isMobile ? "auto" : "-55px",
    marginLeft: isMobile ? "10px" : "0",
  });

  const navigationContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: isMobile ? "20px" : "0",
  };

  // Custom styles for pagination dots
  const paginationStyles = `
    .swiper-pagination-bullet {
      background-color: rgba(0, 89, 99, 0.3);
      opacity: 1;
    }
    .swiper-pagination-bullet-active {
      background-color: #005963;
    }
  `;

  return (
    <div style={sectionStyle}>
      <style>{paginationStyles}</style>
      <div style={{ position: "relative", zIndex: "2" }}>
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: "#004d4f",
            textAlign: "center",
            marginBottom: "8px",
            lineHeight: "1.3",
            fontFamily: "Poppins",
          }}
        >
          Our <span style={{ color: "#007a7e" }}>Services</span>
        </h2>

        <p style={subHeadingStyle}>
          Vaidya Bandhu offers dependable healthcare services, including expert
          doctor consultations and big discounts on treatments, tests, and
          surgeries. Making quality healthcare simple, ethical, accessible, and
          affordable for everyone.
        </p>

        <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto" }}>
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={25}
            slidesPerView={1}
            centeredSlides={true}
            loop={false}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ 
              clickable: true, 
              dynamicBullets: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            onInit={handleSwiperInit}
            onSlideChange={handleSlideChange}
            style={{
              paddingBottom: isMobile ? "30px" : "60px",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: false,
              },
            }}
          >
            {services.map((service, idx) => (
              <SwiperSlide key={idx}>
                <div
                  style={cardStyle(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div style={iconContainerStyle}>
                    <img 
                      src={service.image} 
                      alt={`${service.title} icon`} 
                      style={imageStyle}
                    />
                  </div>

                  <h3 style={titleStyle(idx)}>
                    {service.title}
                    <span style={titleUnderline(idx)}></span>
                  </h3>

                  <div style={pointsContainer(idx)}>
                    <ul style={pointsList}>
                      {service.points.map((point, pIdx) => (
                        <li style={pointItem} key={pIdx}>
                          <span style={pointBullet}></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {isMobile ? (
            <div style={navigationContainerStyle}>
              <div 
                ref={prevButtonRef}
                className="swiper-button-prev-custom" 
                style={prevButtonStyle(isBeginning)}
                onClick={handlePrev}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              
              <div 
                ref={nextButtonRef}
                className="swiper-button-next-custom" 
                style={nextButtonStyle(isEnd)}
                onClick={handleNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={prevButtonRef}
                className="swiper-button-prev-custom" 
                style={prevButtonStyle(isBeginning)}
                onClick={handlePrev}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              
              <div 
                ref={nextButtonRef}
                className="swiper-button-next-custom" 
                style={nextButtonStyle(isEnd)}
                onClick={handleNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPreview;