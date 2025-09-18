import React, { useEffect, useState } from 'react';

const LeadershipInline = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const baseTransition = "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)";

  return (
    <section
      className="leadership-inline" // Added a class name for better CSS targeting
      style={{
        paddingTop: '180px',
        paddingBottom: '40px',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        fontFamily: "Poppins",
        color: '#4a5568',
        lineHeight: '1.4',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "min(150px, 15vw)",
          height: "min(150px, 15vw)",
          backgroundColor: "rgba(0, 122, 126, 0.08)",
          borderRadius: "50%",
          filter: "blur(30px)",
          animation: "floatShape1 12s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1.5s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "min(180px, 18vw)",
          height: "min(180px, 18vw)",
          backgroundColor: "rgba(0, 122, 126, 0.05)",
          borderRadius: "50%",
          filter: "blur(35px)",
          animation: "floatShape2 14s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1.5s ease-out",
          zIndex: 0,
        }}
      ></div>

      <div
        className="container"
        style={{
          maxWidth: '1250px',
          margin: '0 auto',
          padding: '0 10px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="row" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* CEO Message */}
          <div
            style={{
              padding: '40px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(0, 77, 79, 0.1)',
              boxShadow: hoveredSection === 'ceo' ? '0 25px 60px rgba(0, 77, 79, 0.25)' : '0 12px 35px rgba(0, 77, 79, 0.12)',
              transition: baseTransition,
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0) scale(1)" : "translateY(50px) scale(0.98)",
              transitionDelay: '0.2s',
            }}
            onMouseEnter={() => setHoveredSection('ceo')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              style={{
                fontSize: 'clamp(22px, 4.5vw, 36px)',
                fontWeight: 800,
                color: '#004d4f',
                position: 'relative',
                paddingBottom: '20px',
                textAlign: 'center',
                marginBottom: '25px',
                fontFamily: "Poppins"
              }}
            >
              Message from the <span style={{ color: '#007a7e' }}>Founder</span>, Managing Director & CEO
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexDirection: 'row' }}>
              <img
                src="/assets/img/Ajith.jpg"
                alt="Dr. Ajith Ramaswamy"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '4px solid #007a7e',
                  boxShadow: '0 8px 20px rgba(0, 77, 79, 0.2)',
                  transition: baseTransition,
                  ...(hoveredSection === 'ceo' && { transform: 'scale(1.05)' }),
                  flexShrink: 0,
                  marginTop: '2px',
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/img/Ajith.jpg";
                }}
              />
              <div style={{ flexGrow: 1, textAlign: 'left' }}>
                <h3
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 24px)',
                    fontWeight: 600,
                    color: '#007a7e',
                    marginBottom: '8px',
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(15px)",
                    transition: `opacity 0.7s ease-out 0.4s, transform 0.7s ease-out 0.4s`,
                    fontFamily: "Poppins"
                  }}
                >
                  Dr. Ajith Ramaswamy
                </h3>
                <h5
                  style={{
                    color: '#5a6778',
                    marginBottom: '0',
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(15px)",
                    transition: `opacity 0.7s ease-out 0.5s, transform 0.7s ease-out 0.5s`,
                    fontFamily: "Poppins"
                  }}
                >
                  Founder, Managing Director & CEO – Vaidya Bandhu
                </h5>
              </div>
            </div>
            <p style={{
              fontFamily: "Poppins",
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568',
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 0.6s, transform 0.7s ease-out 0.6s`,
            }}>
              At Vaidya Bandhu, our vision is rooted in a powerful belief - Quality healthcare is not a privilege, but a fundamental right. As the Founder, Managing Director & CEO, my mission is to ensure that every individual, regardless of their financial background, has access to affordable, compassionate, and quality medical care.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 0.7s, transform 0.7s ease-out 0.7s`,
            }}>
              The seeds of Vaidya Bandhu were sown during a profoundly moving experience where I witnessed families struggle to afford life-saving treatment. That moment left a lasting impact on me - and sparked a deep resolve to challenge the status quo. I knew something had to change.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 0.8s, transform 0.7s ease-out 0.8s`,
            }}>
              When I met Mr. Subhashith Shetty, a like-minded entrepreneur and journalist, our shared vision of accessible healthcare aligned seamlessly. Together, we founded Vaidya Bandhu — not just as a platform, but as a movement committed to reducing the financial burden of healthcare. Our initiative offers 10% to 40% discounts on surgeries, diagnostics, and medical treatments — making quality healthcare significantly more affordable.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 0.9s, transform 0.7s ease-out 0.9s`,
            }}>
              But our mission goes beyond discounts. For patients facing extreme financial hardship, we are committed to offering free surgeries, with a target of 25 free surgeries in our first year - because care should never be denied due to cost.
            </p>
            <p
              style={{
                fontWeight: 700,
                color: '#007a7e',
                marginTop: '30px',
                padding: '20px',
                backgroundColor: 'rgba(0, 122, 126, 0.05)',
                borderLeft: '6px solid #007a7e',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: 'clamp(17px, 2.2vw, 19px)',
                lineHeight: '1.6',
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 1.0s, transform 0.8s ease-out 1.0s`,
                fontFamily: "Poppins",
              }}
            >
              Vaidya Bandhu is more than an organization. It is a promise. A promise to support patients, guide families, and stand beside every individual during their most vulnerable times. We are here to make healthcare not just accessible, but human again.
            </p>
            <p
              style={{
                fontWeight: 700,
                color: '#004d4f',
                marginTop: '30px',
                fontSize: 'clamp(18px, 2.5vw, 20px)',
                textAlign: 'center',
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 1.2s, transform 0.8s ease-out 1.2s`,
                fontFamily: "Poppins",
              }}
            >
              Thank you for believing in our mission. We are here to help, and we are here to make a difference.
            </p>
          </div>

          {/* COO Message */}
          <div
            style={{
              padding: '40px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(0, 77, 79, 0.1)',
              boxShadow: hoveredSection === 'coo' ? '0 25px 60px rgba(0, 77, 79, 0.25)' : '0 12px 35px rgba(0, 77, 79, 0.12)',
              transition: baseTransition,
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0) scale(1)" : "translateY(50px) scale(0.98)",
              transitionDelay: '0.8s',
            }}
            onMouseEnter={() => setHoveredSection('coo')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              style={{
                fontSize: 'clamp(32px, 4.5vw, 36px)',
                fontWeight: 800,
                color: '#004d4f',
                position: 'relative',
                paddingBottom: '20px',
                textAlign: 'center',
                marginBottom: '25px',
                fontFamily: "Poppins",
              }}
            >
              Message from the <span style={{ color: '#007a7e' }}>Founder</span>, Director & COO
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexDirection: 'row' }}>
              <img
                src={process.env.PUBLIC_URL + "/assets/img/Subhashith.jpeg"}
                alt="Dr. Ajith Ramaswamy"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '4px solid #007a7e',
                  boxShadow: '0 8px 20px rgba(0, 77, 79, 0.2)',
                  transition: baseTransition,
                  ...(hoveredSection === 'ceo' && { transform: 'scale(1.05)' }),
                  flexShrink: 0,
                  marginTop: '2px',
                }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/CCCCCC/666666?text=Dr+Img"; }}
              />
              <div style={{ flexGrow: 1, textAlign: 'left' }}>
                <h3
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 24px)',
                    fontWeight: 600,
                    color: '#007a7e',
                    marginBottom: '8px',
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(15px)",
                    transition: `opacity 0.7s ease-out 1.0s, transform 0.7s ease-out 1.0s`,
                    fontFamily: "Poppins",
                  }}
                >
                  Mr. Subhashith Shetty
                </h3>
                <h5
                  style={{
                    color: '#5a6778',
                    marginBottom: '0',
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    fontFamily: "Poppins",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(15px)",
                    transition: `opacity 0.7s ease-out 1.1s, transform 0.7s ease-out 1.1s`,
                  }}
                >
                  Founder, Director & COO – Vaidya Bandhu
                </h5>
              </div>
            </div>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 1.2s, transform 0.7s ease-out 1.2s`,
            }}>
              At Vaidya Bandhu, our mission is simple but transformative - to make healthcare accessible, affordable, and trustworthy for everyone. As a Founder, Director and COO, I am deeply committed to ensuring that every patient receives the best care possible, supported by a team that puts people above profit.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 1.3s, transform 0.7s ease-out 1.3s`,
            }}>
              The journey began when a close acquaintance of mine was admitted to a leading corporate hospital. What was expected to be a ₹10 lakh bill ballooned to ₹33 lakh after complications. Insurance covered only a portion, and despite exhausting all options - friends, family, loans - they received no financial relief from the hospital. Even a basic 10% discount could have eased their pain, but it never came.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 1.4s, transform 0.7s ease-out 1.4s`,
            }}>
              It was heartbreaking, and more importantly, it was avoidable. If they had reached out earlier, I could have directed them to a hospital through our network that offers the same quality care at significantly reduced rates.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 1.5s, transform 0.7s ease-out 1.5s`,
            }}>
              This experience stayed with me. I shared it with Dr. Ajith, whose compassionate nature and healthcare expertise made him the perfect partner to bring this idea to life. Together, we founded Vaidya Bandhu - a platform committed to bridging the gap between affordability and quality healthcare.
            </p>
            <p style={{
              marginBottom: '15px', fontSize: 'clamp(16px, 2vw, 18px)', color: '#4a5568', fontFamily: "Poppins",
              opacity: animated ? 1 : 0, transform: animated ? "translateY(0)" : "translateY(15px)", transition: `opacity 0.7s ease-out 1.5s, transform 0.7s ease-out 1.5s`,
            }}>
              Along with offering 10% to 40% discounts on medical treatments and diagnostics, we are committed to providing 25 free surgeries in our first year to patients who are in dire financial need. Because for us, it’s not just about discounts - it’s about dignity, access, and saving lives.
            </p>

            <p
              style={{
                fontWeight: 700,
                color: '#007a7e',
                marginTop: '30px',
                padding: '20px',
                backgroundColor: 'rgba(0, 122, 126, 0.05)',
                borderLeft: '6px solid #007a7e',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: 'clamp(17px, 2.2vw, 19px)',
                lineHeight: '1.6',
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 1.6s, transform 0.8s ease-out 1.6s`,
                fontFamily: "Poppins",
              }}
            >
              Today, many people feel that healthcare is no longer about care, but about commerce. But that’s not the whole truth. Not every doctor is chasing profit. Not every hospital is built for business. There are still many who chose this noble profession to heal, to serve, and to stand by those in need. At Vaidya Bandhu, we’re here to prove that healthcare can be ethical, affordable, and full of heart.
            </p>
            <p
              style={{
                fontWeight: 700,
                color: '#004d4f',
                marginTop: '30px',
                fontSize: 'clamp(18px, 2.5vw, 20px)',
                textAlign: 'center',
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 1.8s, transform 0.8s ease-out 1.8s`,
                fontFamily: "Poppins",
              }}
            >
              Thank you for trusting Vaidya Bandhu. We are here to stand by your side - every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes for the floating background shapes */}
      <style>
        {`
          @keyframes floatShape1 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(25px, 25px) rotate(7deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes floatShape2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-25px, -25px) rotate(-7deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }

          /* --- Responsive adjustments to fix spacing issue --- */

          /* Targets the main section to adjust padding on smaller screens */
          @media (max-width: 768px) {
            .leadership-inline {
              /* Increased top padding to prevent overlap and ensure proper spacing */
              padding-top: 80px !important;
              padding-bottom: 40px !important;
            }

            div[style*="padding: 40px"] { /* Card padding */
              padding: 30px !important;
            }
            h2[style*="font-size: clamp(22px, 4.5vw, 36px)"] { /* Section titles */
              font-size: clamp(28px, 5.5vw, 36px) !important;
              padding-bottom: 15px !important;
            }
            h2 span[style*="bottom: 12px"] { /* Underline position */
              bottom: 8px !important;
            }
            h2 span[style*="bottom: 0"] { /* Underline position */
              bottom: -2px !important;
            }
            p[style*="font-size: clamp(16px, 2vw, 18px)"],
            p[style*="font-size: clamp(17px, 2.2vw, 19px)"],
            p[style*="font-size: clamp(18px, 2.5vw, 20px)"] { /* Paragraphs */
              font-size: clamp(16px, 2.8vw, 18px) !important;
            }
            h3[style*="font-size: clamp(20px, 2.5vw, 24px)"] { /* Name */
              font-size: clamp(18px, 3vw, 22px) !important;
            }
            h5[style*="font-size: clamp(15px, 1.8vw, 17px)"] { /* Designation */
              font-size: clamp(14px, 2.5vw, 16px) !important;
            }
            div[style*="gap: 30px"] { /* Gap between sections */
                gap: 40px !important;
            }
            div[style*="display: flex"][style*="flex-direction: row"] { /* Photo/Name container */
              flex-direction: column !important;
              text-align: center !important;
            }
            div[style*="flex-grow: 1"][style*="text-align: left"] { /* Name/Designation text container */
              text-align: center !important;
            }
          }

          @media (max-width: 480px) {
            .leadership-inline {
              padding-top: 163px !important;
              padding-bottom: 30px !important;
            }
            div[style*="padding: 40px"] { /* Card padding */
              padding: 20px !important;
            }
            h2[style*="font-size: clamp(22px, 4.5vw, 36px)"] { /* Section titles */
              font-size: clamp(24px, 7vw, 30px) !important;
              padding-bottom: 12px !important;
            }
            h2 span[style*="bottom: 12px"] { /* Underline position */
              bottom: 6px !important;
              width: 70px !important;
            }
            h2 span[style*="bottom: 0"] { /* Underline position */
              bottom: -4px !important;
              width: 40px !important;
            }
            p[style*="font-size: clamp(16px, 2vw, 18px)"],
            p[style*="font-size: clamp(17px, 2.2vw, 19px)"],
            p[style*="font-size: clamp(18px, 2.5vw, 20px)"] { /* Paragraphs */
              font-size: clamp(15px, 3.5vw, 17px) !important;
            }
            h3[style*="font-size: clamp(20px, 2.5vw, 24px)"] { /* Name */
              font-size: clamp(16px, 4vw, 20px) !important;
            }
            h5[style*="font-size: clamp(15px, 1.8vw, 17px)"] { /* Designation */
              font-size: clamp(13px, 3vw, 15px) !important;
            }
            div[style*="gap: 30px"] { /* Gap between sections */
              gap: 30px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default LeadershipInline;
