import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

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
  const [hoveredTitle, setHoveredTitle] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const sectionStyle = {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
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
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#4a5568",
    maxWidth: "900px",
    margin: "25px auto 50px",
    lineHeight: "1.5",
    fontWeight: "400",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0, 77, 79, 0.08)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "1px solid rgba(0, 122, 126, 0.1)",
    position: "relative",
    overflow: "hidden",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(30px)",
    transitionDelay: `${Math.random() * 0.3}s`,
  };

  const iconContainerStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "transparent", // Removed background color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "25px",
    boxShadow: "none", // Removed box shadow
    transition: "all 0.3s ease",
  };

  const imageStyle = {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  };

  const titleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#003d3f",
    marginBottom: "15px",
    lineHeight: "1.3",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    paddingBottom: "10px",
  };

  const titleUnderline = {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: "0",
    transform: "translateX(-50%) scaleX(0)",
    width: "60px",
    height: "3px",
    background: "#007a7e",
    borderRadius: "2px",
    transition: "transform 0.3s ease",
  };

  const pointsContainer = {
    width: "100%",
    maxHeight: "0",
    overflow: "hidden",
    transition:
      "max-height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease",
    opacity: 0,
    marginTop: "10px",
  };

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

  return (
    <div style={sectionStyle}>
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

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={false}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingBottom: "60px",
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
                style={cardStyle}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <div style={iconContainerStyle}>
                  <img 
                    src={service.image} 
                    alt={`${service.title} icon`} 
                    style={imageStyle}
                  />
                </div>

                <h3
                  style={{
                    ...titleStyle,
                    ...(hoveredTitle === idx && {
                      color: "#007a7e",
                    }),
                  }}
                  onMouseEnter={() => setHoveredTitle(idx)}
                  onMouseLeave={() => setHoveredTitle(null)}
                >
                  {service.title}
                  <span
                    style={{
                      ...titleUnderline,
                      ...(hoveredTitle === idx && {
                        transform: "translateX(-50%) scaleX(1)",
                      }),
                    }}
                  ></span>
                </h3>

                <div
                  style={{
                    ...pointsContainer,
                    ...(hoveredTitle === idx && {
                      maxHeight: "300px",
                      opacity: 1,
                    }),
                  }}
                >
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
      </div>
    </div>
  );
};

export default ServicesPreview;