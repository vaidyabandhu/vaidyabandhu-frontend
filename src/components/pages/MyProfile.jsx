import React, { useRef, useState } from "react";
import { Mail, Phone, MapPin, Droplet } from "lucide-react";

const MyProfile = () => {
  // Example: pull from state or context
  const patient = {
    full_name: "Aravind Kumar",
    email: "aravind.kumar@example.com",
    contact_number: "+91 9876543210",
    place: "123, Health , Pashdbc City, Mland",
    blood_group: "O+",
    patient_id: "PAT123456",
    photo: null,
  };
  
  const cardRef = useRef(null);
  const [isFront, setIsFront] = useState(true);
  
  const handleDownload = async () => {
    // Mock download functionality
    alert(`Downloading ${patient.full_name}_HealthCard.pdf`);
  };
  
  // Inline styles — optimized for alignment and reusability
  const styles = {
    profilePage: {
      padding: "30px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    headerCard: {
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginBottom: "30px",
      backgroundColor: "white",
    },
    avatarWrapper: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: "#eee",
      overflow: "hidden",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid  #e0e0e0",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    healthCard: {
      width: "480px",
      height: "350px",
      borderRadius: "12px",
      margin: "0 auto",
      background: "#F5F9FA",
      border: "1px solid #CCCCCC",
      boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.1)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "Poppins, sans-serif",
      display: "flex",
      flexDirection: "column",
      padding: "0px",
    },
    front: {
      color: "#4A4A4A",
    },
    back: {
      background: "#fdfdfd",
      color: "#333",
      fontSize: "12px",
      lineHeight: "1.4",
      padding: "15px",
    },
    toggleBtn: {
      marginTop: "20px",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
      marginTop: "20px",
    },
    logoContainer: {
      width: "40px",
      height: "40px",
      marginRight: "15px",
    },
    verticalLine: {
      width: "1px",
      height: "40px",
      borderLeft: "1px solid #00000038",
      marginRight: "-30px",
      marginLeft: "55px",
    },
    titleContainer: {
      flex: 1,
    },
    titleText: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      fontSize: "18px",
      lineHeight: "100%",
      letterSpacing: "0%",
      color: "#095D7E",
      margin: 0,
      textAlign: "center",
    },
    subtitleText: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "100%",
      letterSpacing: "0%",
      color: "#095D7E",
      margin: "4px 0 0 0",
      textAlign: "center",
    },
    horizontalLine: {
      width: "100%",
      height: "1px",
      backgroundColor: "#00000038",
      margin: "10px 0",
    },
    cardContent: {
      display: "flex",
      marginTop: "10px",
      marginLeft: "18px",
      flex: 1,
    },
    cardDetails: {
      flex: 3,
      paddingRight: "15px",
      paddingLeft: "15px",
    },
    cardPhoto: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    photoContainer: {
      width: "80px",
      height: "100px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      overflow: "hidden",
      background: "#f9f9f9",
      backgroundColor: "#ddd",
    },
    photoNameText: {
      fontSize: "12px",
      fontWeight: 600,
      color: "#095D7E",
      textAlign: "center",
      marginTop: "10px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
    detailRowAligned: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
      fontSize: "13px",
      fontFamily: "Poppins, sans-serif",
    },
    labelText: {
      fontWeight: 600,
      color: "#095D7E",
      marginRight: "5px",
      whiteSpace: "nowrap",
    },
    valueText: {
      color: "#4A4A4A",
      fontWeight: 500,
      textAlign: "left",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "200px",
    },
    bloodGroupText: {
      color: "#FF0000",
      fontWeight: 600,
      textAlign: "left",
      whiteSpace: "nowrap",
    },
    blueStrip: {
      backgroundColor: "#046877",
      color: "white",
      padding: "10px 38px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
    },
    stripItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      flex: 1,
    },
    stripLabel: {
      fontSize: "10px",
      fontWeight: 600,
      opacity: 0.9,
      marginBottom: "2px",
      color: "#E7E7E7",
    },
    stripValue: {
      fontSize: "12px",
      fontWeight: 500,
    },
    stripVerticalLine: {
      width: "1px",
      height: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      margin: "0 53px",
    },
    // Back side styles
    backContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontSize: "7px",
      color: "#333",
      position: "relative",
      padding: "0",
    },
    cashbackBadge: {
      position: "absolute",
      top: "60px",
      right: "15px",
      backgroundColor: "#046877",
      color: "white",
      padding: "8px 12px",
      borderRadius: "20px",
      fontSize: "8px",
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: "1.1",
      width: "140px",
      zIndex: 10,
    },
    benefitsSection: {
      marginBottom: "0px",
      paddingTop: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    benefitsTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "5px",
      textTransform: "uppercase",
    },
    benefitsList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    benefitItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "2px",
      fontSize: "8px",
      lineHeight: "1",
    },
    checkMark: {
      color: "#28a745",
      marginRight: "6px",
      fontSize: "8px",
      fontWeight: "bold",
      flexShrink: 0,
    },
    sectionDivider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#ccc",
      margin: "6px 0",
    },
    termsSection: {
      marginBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    termsTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "5px",
      textTransform: "uppercase",
    },
    termsList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    termItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "1px",
      fontSize: "7px",
      lineHeight: "1.2",
    },
    bullet: {
      color: "#095D7E",
      marginRight: "5px",
      fontSize: "7px",
      flexShrink: 0,
    },
    instructionsSection: {
      marginBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    instructionsTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "2px",
      textTransform: "uppercase",
    },
    instructionsList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    instructionItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "1px",
      fontSize: "7px",
      lineHeight: "1.2",
    },
    priceTag: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      fontSize: "36px",
      fontWeight: "bold",
      color: "#046877",
    },
    bottomBanner: {
      position: "absolute",
      bottom: "2px",
      left: 0,
      right: 0,
      backgroundColor: "#046877",
      color: "white",
      padding: "6px 0",
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
      margin: "-17px",
    },
    companyName: {
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1px",
    },
    tagline: {
      fontSize: "8px",
      textAlign: "center",
      fontStyle: "poppins",
    },
    // New style for background image
    backgroundImage: {
      position: "absolute",
      top: "55%",
      left: "54%",
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "72px",
      opacity: 1.2,
      zIndex: 0,
    },
  };
  
  return (
    <div style={styles.profilePage}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div style={{ marginBottom: "30px" }}>
          <div style={styles.headerCard}>
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "0 0 200px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  {/* Display image and name below */}
                  <div style={styles.avatarWrapper}>
                    <img
                      src="assets/img/image.png"
                      alt={patient.full_name}
                      style={styles.avatarImg}
                    />
                  </div>
                  {/* Name Below Photo */}
                  <div
                    style={{
                      marginTop: "10px",
                      textAlign: "center",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "18px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#095D7E",
                    }}
                  >
                    Aravind Kumar
                  </div>
                </div>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <h2 style={{ marginBottom: "15px", color: "#333" }}>
                    {patient.full_name}
                  </h2>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Mail
                      size={16}
                      style={{ marginRight: "8px", color: "#666" }}
                    />
                    {patient.email}
                  </p>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Phone
                      size={16}
                      style={{ marginRight: "8px", color: "#666" }}
                    />
                    {patient.contact_number}
                  </p>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <MapPin
                      size={16}
                      style={{
                        marginRight: "8px",
                        color: "#666",
                        flexShrink: 0,
                      }}
                    />
                    <span>{patient.place}</span>
                  </p>
                  <p style={{ display: "flex", alignItems: "center" }}>
                    <Droplet
                      size={16}
                      style={{ marginRight: "8px", color: "#666" }}
                    />
                    Blood Group: {patient.blood_group}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Health Card */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                ...styles.healthCard,
                ...(isFront ? styles.front : styles.back),
              }}
              ref={cardRef}
            >
              {isFront ? (
                <>
                  {/* Background Image */}
                  <img
                    src="assets/img/vb-background.png"
                    alt="Vaidya Bandhu Background"
                    style={styles.backgroundImage}
                  />
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.logoContainer}>
                      <img
                        src="assets/img/vb-logo.png"
                        alt="Vaidya Bandhu Logo"
                        style={{
                          width: "40px",
                          height: "40px",
                          marginLeft: "28px",
                        }}
                      />
                    </div>
                    <div style={styles.verticalLine}></div>
                    <div style={styles.titleContainer}>
                      <div style={styles.titleText}>VAIDYA BANDHU</div>
                      <div style={styles.subtitleText}>
                        HEALTHCARE MEMBERSHIP CARD
                      </div>
                    </div>
                  </div>
                  {/* Horizontal Line */}
                  <div style={styles.horizontalLine}></div>
                  {/* Card Content */}
                  <div style={styles.cardContent}>
                    <div style={styles.cardDetails}>
                      <div style={styles.detailRowAligned}>
                        <span style={styles.labelText}>MEMBERSHIP ID:</span>
                        <span style={styles.valueText}>VB12345678</span>
                      </div>
                      <div style={styles.detailRowAligned}>
                        <span style={styles.labelText}>VALID TILL:</span>
                        <span style={styles.valueText}>12/2025</span>
                      </div>
                      <div style={styles.detailRowAligned}>
                        <span style={styles.labelText}>CONTACT:</span>
                        <span style={styles.valueText}>
                          {patient.contact_number}
                        </span>
                      </div>
                      <div style={styles.detailRowAligned}>
                        <span style={styles.labelText}>BLOOD GROUP:</span>
                        <span style={styles.bloodGroupText}>
                          {patient.blood_group}
                        </span>
                      </div>
                      <div style={styles.detailRowAligned}>
                        <span style={styles.labelText}>ADDRESS:</span>
                        <span style={styles.valueText}>{patient.place}</span>
                      </div>
                    </div>
                    <div style={styles.cardPhoto}>
                      <div style={styles.photoContainer}>
                        <img
                          src="assets/img/image.png"
                          alt={patient.full_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={styles.photoNameText}>
                        {patient.full_name}
                      </div>
                    </div>
                  </div>
                  {/* Full-width Blue Strip at the Bottom */}
                  <div style={styles.blueStrip}>
                    <div style={styles.stripItem}>
                      <div style={styles.stripLabel}>WHATSAPP/HELPLINE</div>
                      <div style={styles.stripValue}>+91 8958593589</div>
                    </div>
                    <div style={styles.stripVerticalLine}></div>
                    <div style={styles.stripItem}>
                      <div style={styles.stripLabel}>EMAIL ID</div>
                      <div style={styles.stripValue}>
                        support@vaidyabandhu.com
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.backContainer}>
                  {/* Cashback Badge */}
                  <div style={styles.cashbackBadge}>
                    10% CASHBACK ON YOUR
                    <br />
                    TOTAL HOSPITAL BILL
                    <br />
                    <span style={{ fontSize: "5px" }}>
                      EXCLUDING PHARMACY AND IMPLANTS
                    </span>
                  </div>
                  {/* Benefits Section */}
                  <div style={styles.benefitsSection}>
                    <div style={styles.benefitsTitle}>
                      BENEFITS OF THIS CARD
                    </div>
                    <ul style={styles.benefitsList}>
                      <li style={styles.benefitItem}>
                        <span style={styles.checkMark}>✓</span>
                        <span>
                          Save 10% to 40% on surgeries, treatments, and
                          diagnostics Services.
                        </span>
                      </li>
                      <li style={styles.benefitItem}>
                        <span style={styles.checkMark}>✓</span>
                        <span>
                          Get 10% Cashback: Send your bill to Vaidya Bandhu via
                          WhatsApp or Email. Cashback will be credited to your
                          account within 7 working days.
                        </span>
                      </li>
                      <li style={styles.benefitItem}>
                        <span style={styles.checkMark}>✓</span>
                        <span>
                          Free surgeries under certain in need through our
                          social programs.
                        </span>
                      </li>
                      <li style={styles.benefitItem}>
                        <span style={styles.checkMark}>✓</span>
                        <span>
                          Call our helpline from 9 AM to 6 PM for free medical
                          advice.
                        </span>
                      </li>
                      <li style={styles.benefitItem}>
                        <span style={styles.checkMark}>✓</span>
                        <span>
                          We help you choose the right doctor, hospital, or
                          diagnostic center.
                        </span>
                      </li>
                    </ul>
                    {/* Section Divider */}
                    <div style={styles.sectionDivider}></div>
                  </div>
                  {/* Terms & Conditions Section */}
                  <div style={styles.termsSection}>
                    <div style={styles.termsTitle}>TERMS & CONDITIONS</div>
                    <ul style={styles.termsList}>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          VALIDITY: CARD IS VALID FOR 1 YEAR FROM THE DATE OF
                          ISSUE.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          NON-TRANSFERABLE: USE IS LIMITED TO THE REGISTERED
                          INDIVIDUAL ONLY.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          DISCOUNTS AVAILABLE ON CONSULTATIONS, TREATMENTS,
                          SURGERIES, DIAGNOSTICS, AND MORE AT PARTNER CENTERS.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          BOOKING REQUIRED: CONTACT OUR TEAM BEFORE VISITING ANY
                          FACILITY TO AVAIL BENEFITS.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          CARD DELIVERY: CARD WILL BE DELIVERED TO YOU POST
                          MEMBERSHIP CONFIRMATION.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          LOST CARD: DUPLICATE CAN BE ISSUED WITH A SMALL
                          REISSUE FEE.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          VALID LOCATIONS: BENEFITS APPLICABLE ONLY AT PARTNER
                          HOSPITALS, DOCTORS, CLINICS, AND LABS.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          NO CASH VALUE: BENEFITS ARE NON-REDEEMABLE FOR CASH.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          MISUSE: MISUSE OF BENEFITS MAY RESULT IN MEMBERSHIP
                          CANCELLATION.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          THE CARD DOES NOT COVER EMERGENCY SERVICES UNLESS
                          PRE-APPROVED.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          IF THE MEMBERSHIP CARD IS NOT USED WITHIN ONE YEAR
                          MEMBERS MUST INFORM US THROUGH THE HELPLINE NUMBER FOR
                          THE FREE RENEWAL.
                        </span>
                      </li>
                      <li style={styles.termItem}>
                        <span style={styles.bullet}>•</span>
                        <span>
                          DISCOUNTS MAY VARY BASED ON LOCATION, SERVICE TYPE,
                          AND AVAILABILITY.
                        </span>
                      </li>
                    </ul>
                    {/* Section Divider */}
                    <div style={styles.sectionDivider}></div>
                  </div>
                  {/* Instructions Section */}
                  <div style={styles.instructionsSection}>
                    <div style={styles.instructionsTitle}>
                      INSTRUCTIONS TO USE
                    </div>
                    <ul style={styles.instructionsList}>
                      <li style={styles.instructionItem}>
                        <span style={styles.bullet}>•</span>
                        <span>CALL OR WHATSAPP US AT +91 9535863589</span>
                      </li>
                      <li style={styles.instructionItem}>
                        <span style={styles.bullet}>•</span>
                        <span>SHARE YOUR MEMBERSHIP ID AND ISSUE</span>
                      </li>
                      <li style={styles.instructionItem}>
                        <span style={styles.bullet}>•</span>
                        <span>GET INSTANT HELP FROM VAIDYA BANDHU TEAM</span>
                      </li>
                    </ul>
                  </div>
                  {/* Price Tag */}
                  <div style={styles.priceTag}>49/-</div>
                  {/* Bottom Banner */}
                  <div style={styles.bottomBanner}>
                    <div style={styles.companyName}>
                      VAIDYA BANDHU (A UNIT OF MV COMPANYON HEALTHCARE PRIVATE
                      LIMITED)
                    </div>
                    <div style={styles.tagline}>
                      "SERVING WITH CARE & COMMITMENT"
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={styles.toggleBtn}>
              <button
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setIsFront(!isFront)}
              >
                {isFront ? "Show Back" : "Show Front"}
              </button>
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleDownload}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;