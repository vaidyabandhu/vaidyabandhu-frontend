import React, { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image-more";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import {
  Mail,
  Phone,
  MapPin,
  Droplet,
  User,
  IdCard,
  CreditCard,
  Hash,
  LogOut,
} from "lucide-react";

const MyProfile = () => {
  const [patient, setPatient] = useState({
    full_name: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    pin_code: "",
    mobile: "",
    // alternate_number: "",
    email: "",
    Aadhar_number: "",
    pan_number: "",
    profile_image: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://admin.vaidyabandhu.com/api/user/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Helper: convert image URL to Base64
  const getBase64ImageFromUrl = async (url) => {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownload = async () => {
    const front = document.getElementById("card-front");
    const back = document.getElementById("card-back");

    if (!front || !back) {
      alert("Both sides of the card not found!");
      return;
    }

    try {
      const frontImg = await domtoimage.toPng(front, {
        cacheBust: true,
        useCORS: true,
        backgroundColor: null,
      });
      const backImg = await domtoimage.toPng(back, {
        cacheBust: true,
        useCORS: true,
        backgroundColor: null,
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const frontWidth = front.offsetWidth;
      const frontHeight = front.offsetHeight;
      const backWidth = back.offsetWidth;
      const backHeight = back.offsetHeight;

      const gap = 20;
      canvas.width = Math.max(frontWidth, backWidth);
      canvas.height = frontHeight + backHeight + gap;

      ctx.fillStyle = "#F5F9FA";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const frontImage = new Image();
      frontImage.src = frontImg;
      await new Promise((resolve) => {
        frontImage.onload = resolve;
      });
      const frontX = (canvas.width - frontWidth) / 2;
      ctx.drawImage(frontImage, frontX, 0, frontWidth, frontHeight);

      const backImage = new Image();
      backImage.src = backImg;
      await new Promise((resolve) => {
        backImage.onload = resolve;
      });
      const backX = (canvas.width - backWidth) / 2;
      ctx.drawImage(backImage, backX, frontHeight + gap, backWidth, backHeight);

      // Final merged image
      const combinedImg = canvas.toDataURL("image/png");

      // --- FIX: PDF page size = image size (no extra white background) ---
      // Convert px to mm (1 px ≈ 0.264583 mm)
      const pxToMm = (px) => px * 0.264583;
      const imgWidthMm = pxToMm(canvas.width);
      const imgHeightMm = pxToMm(canvas.height);

      // Create PDF with same size as the image
      const pdf = new jsPDF({
        orientation: imgWidthMm > imgHeightMm ? "landscape" : "portrait",
        unit: "mm",
        format: [imgWidthMm, imgHeightMm], // Custom size exactly matching the card
      });

      // Add image to fill the page
      pdf.addImage(combinedImg, "PNG", 0, 0, imgWidthMm, imgHeightMm);

      pdf.save(`${patient.full_name || "user"}_HealthCard.pdf`);
    } catch (error) {
      console.error("Oops, something went wrong!", error);
      alert("Failed to download PDF.");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");

    // Remove all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(
        /=.*/,
        "=;expires=" + new Date(0).toUTCString() + ";path=/"
      );
    });
    setShowLogoutModal(false);
    window.location.href = "/";
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return " ";
    return dateString.split("T")[0].split("-").reverse().join("-");
  };

  // Responsive styles
  const isMobile = windowWidth < 768;

  // Inline styles — optimized for alignment and reusability
  const styles = {
    profilePage: {
      padding: isMobile ? "15px" : "30px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    mainContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      gap: isMobile ? "20px" : "30px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    leftColumn: {
      flex: "1",
      minWidth: "300px",
    },
    rightColumn: {
      flex: isMobile ? "1" : "0 0 480px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    personalInfoCard: {
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "white",
      padding: isMobile ? "16px" : "24px",
      height: "fit-content",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    infoIcon: {
      width: "20px",
      marginRight: "12px",
      color: "#095D7E",
      flexShrink: 0,
    },
    infoLabel: {
      fontWeight: 600,
      color: "#095D7E",
      fontSize: isMobile ? "16px" : "20px",
      marginRight: "8px",
      whiteSpace: "nowrap",
    },
    infoValue: {
      color: "#4A4A4A",
      fontWeight: 500,
      fontSize: isMobile ? "14px" : "18px",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    },
    sectionTitle: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: 600,
      color: "#095D7E",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "1px solid #eee",
    },
    healthCard: {
      width: isMobile ? "300px" : "480px",
      height: isMobile ? "200px" : "350px",
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
      marginBottom: "20px", // Added space between cards
    },
    front: {
      color: "#4A4A4A",
    },
    back: {
      background: "#fdfdfd",
      color: "#333",
      fontSize: isMobile ? "10px" : "12px",
      lineHeight: "1.4",
      padding: isMobile ? "10px" : "15px",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: isMobile ? "8px" : "15px",
      marginTop: isMobile ? "10px" : "20px",
    },
    logoContainer: {
      width: isMobile ? "25px" : "40px",
      height: isMobile ? "25px" : "40px",
      marginRight: isMobile ? "8px" : "15px",
    },
    verticalLine: {
      width: "1px",
      height: isMobile ? "25px" : "40px",
      borderLeft: "1px solid #00000038",
      marginRight: isMobile ? "-15px" : "-30px",
      marginLeft: isMobile ? "33px" : "55px",
    },
    titleContainer: {
      flex: 1,
    },
    titleText: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
      fontSize: isMobile ? "12px" : "18px",
      lineHeight: "100%",
      letterSpacing: "0%",
      color: "#095D7E",
      margin: 0,
      textAlign: "center",
    },
    subtitleText: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      fontSize: isMobile ? "8px" : "14px",
      lineHeight: "100%",
      letterSpacing: "0%",
      color: "#095D7E",
      margin: "2px 0 0 0",
      textAlign: "center",
    },
    horizontalLine: {
      width: "100%",
      height: "1px",
      backgroundColor: "#00000038",
      margin: isMobile ? "3px 0" : "10px 0",
    },
    cardContent: {
      display: "flex",
      marginTop: isMobile ? "3px" : "10px",
      marginLeft: isMobile ? "8px" : "18px",
      flex: 1,
    },
    cardDetails: {
      flex: 3,
      paddingRight: isMobile ? "3px" : "15px",
      paddingLeft: isMobile ? "3px" : "15px",
    },
    cardPhoto: {
      flex: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    photoContainer: {
      width: isMobile ? "50px" : "80px",
      height: isMobile ? "60px" : "100px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      overflow: "hidden",
      background: "#f9f9f9",
      backgroundColor: "#ddd",
    },
    photoNameText: {
      fontSize: isMobile ? "8px" : "14px",
      fontWeight: 600,
      color: "#095D7E",
      textAlign: "center",
      marginTop: isMobile ? "3px" : "10px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "break-word",
    },
    detailRowAligned: {
      display: "flex",
      alignItems: "center",
      marginBottom: isMobile ? "5px" : "15px",
      fontSize: isMobile ? "9px" : "13px",
      fontFamily: "Poppins, sans-serif",
    },
    labelText: {
      fontWeight: 600,
      color: "#095D7E",
      marginRight: "3px",
      whiteSpace: "nowrap",
    },
    valueText: {
      color: "#4A4A4A",
      fontWeight: 500,
      textAlign: "left",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: isMobile ? "70px" : "200px",
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
      padding: isMobile ? "8px 12px" : "10px 38px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      bottom: isMobile ? "0" : "0",
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
      fontSize: isMobile ? "6px" : "10px",
      fontWeight: 600,
      opacity: 0.9,
      marginBottom: "1px",
      color: "#E7E7E7",
      textAlign: "left",
    },
    stripValue: {
      fontSize: isMobile ? "7px" : "12px",
      fontWeight: 500,
      textAlign: "left",
    },
    stripVerticalLine: {
      width: "1px",
      height: isMobile ? "15px" : "30px",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      margin: isMobile ? "0 25px" : "0 53px",
    },
    // Back side styles
    backContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontSize: isMobile ? "6px" : "7px",
      color: "#333",
      position: "relative",
      padding: "0",
    },
    cashbackBadge: {
      position: "absolute",
      top: isMobile ? "30px" : "60px",
      right: isMobile ? "8px" : "15px",
      backgroundColor: "#046877",
      color: "white",
      padding: isMobile ? "4px 6px" : "8px 12px",
      borderRadius: "20px",
      fontSize: isMobile ? "5px" : "8px",
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: "1.1",
      width: isMobile ? "80px" : "140px",
      zIndex: 10,
    },
    benefitsSection: {
      marginBottom: "0px",
      paddingTop: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    benefitsTitle: {
      fontSize: isMobile ? "8px" : "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "3px",
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
      marginBottom: isMobile ? "0.5px" : "2px",
      fontSize: isMobile ? "5px" : "8px",
      lineHeight: "1",
    },
    checkMark: {
      color: "#28a745",
      marginRight: isMobile ? "2px" : "6px",
      fontSize: isMobile ? "5px" : "8px",
      fontWeight: "bold",
      flexShrink: 0,
    },
    sectionDivider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#ccc",
      margin: isMobile ? "2px 0" : "6px 0",
    },
    termsSection: {
      marginBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    termsTitle: {
      fontSize: isMobile ? "8px" : "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "3px",
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
      marginBottom: isMobile ? "0.3px" : "1px",
      fontSize: isMobile ? "4px" : "7px",
      lineHeight: "1.2",
    },
    bullet: {
      color: "#095D7E",
      marginRight: isMobile ? "2px" : "5px",
      fontSize: isMobile ? "4px" : "7px",
      flexShrink: 0,
    },
    instructionsSection: {
      marginBottom: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    instructionsTitle: {
      fontSize: isMobile ? "8px" : "12px",
      fontWeight: "bold",
      color: "#095D7E",
      marginBottom: "1px",
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
      marginBottom: isMobile ? "0.3px" : "1px",
      fontSize: isMobile ? "4px" : "7px",
      lineHeight: "1.2",
    },
    priceTag: {
      position: "absolute",
      bottom: isMobile ? "12px" : "20px",
      right: isMobile ? "12px" : "20px",
      fontSize: isMobile ? "20px" : "36px",
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
      padding: isMobile ? "5px 0" : "6px 0",
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
      margin: isMobile ? "-12px" : "-17px",
    },
    companyName: {
      fontSize: isMobile ? "5px" : "10px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1px",
    },
    tagline: {
      fontSize: isMobile ? "4px" : "8px",
      textAlign: "center",
      fontStyle: "poppins",
    },
    // New style for background image
    backgroundImage: {
      position: "absolute",
      top: "55%",
      left: "54%",
      transform: "translate(-50%, -50%)",
      width: isMobile ? "120px" : "200px",
      height: isMobile ? "43px" : "72px",
      opacity: 1.2,
      zIndex: 0,
    },
    // Logout button styles
    logoutButton: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: isMobile ? "8px 16px" : "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "500",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
      marginTop: "15px",
    },
    logoutButtonHover: {
      backgroundColor: "#c82333",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
    logoutIcon: {
      marginRight: "8px",
    },
    // Loading and error styles
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    },
    errorContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      color: "#dc3545",
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      background: "white",
      padding: isMobile ? "15px" : "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      maxWidth: isMobile ? "90%" : "400px",
      width: "90%",
      textAlign: "center",
    },
    modalTitle: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "bold",
      marginBottom: isMobile ? "10px" : "15px",
      color: "#095D7E",
    },
    modalButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: isMobile ? "15px" : "20px",
    },
    modalButton: {
      padding: isMobile ? "6px 12px" : "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    cancelButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    confirmButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "20px" }}>Loading profile data...</p>
      </div>
    );
  }

  // Show error state if there was an error fetching data
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {showLogoutModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.confirmButton }}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={styles.profilePage}>
        <div style={styles.mainContainer}>
          {/* Left Column - Personal Information */}
          <div style={styles.leftColumn}>
            <div style={styles.personalInfoCard}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>

              <div style={styles.infoRow}>
                <User style={styles.infoIcon} />
                <span style={styles.infoLabel}>Full Name:</span>
                <span style={styles.infoValue}>{patient.full_name || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <User style={styles.infoIcon} />
                <span style={styles.infoLabel}>Age:</span>
                <span style={styles.infoValue}>{patient.age || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <User style={styles.infoIcon} />
                <span style={styles.infoLabel}>Gender:</span>
                <span style={styles.infoValue}>{patient.gender || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <Droplet style={styles.infoIcon} />
                <span style={styles.infoLabel}>Blood Group:</span>
                <span style={styles.infoValue}>
                  {patient.blood_group || " "}
                </span>
              </div>

              <div style={styles.infoRow}>
                <MapPin style={styles.infoIcon} />
                <span style={styles.infoLabel}>Address:</span>
                <span style={styles.infoValue}>{patient.address || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <MapPin style={styles.infoIcon} />
                <span style={styles.infoLabel}>Pincode:</span>
                <span style={styles.infoValue}>{patient.pin_code || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <Phone style={styles.infoIcon} />
                <span style={styles.infoLabel}>Mobile Number:</span>
                <span style={styles.infoValue}>{patient.mobile || " "}</span>
              </div>

              {/* <div style={styles.infoRow}>
                <Phone style={styles.infoIcon} />
                <span style={styles.infoLabel}>Alternate Number:</span>
                <span style={styles.infoValue}>
                  {patient.alternate_number || " "}
                </span>
              </div> */}

              <div style={styles.infoRow}>
                <Mail style={styles.infoIcon} />
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{patient.email || " "}</span>
              </div>

              <div style={styles.infoRow}>
                <IdCard style={styles.infoIcon} />
                <span style={styles.infoLabel}>Aadhar Number:</span>
                <span style={styles.infoValue}>{patient.aadhaar_number}</span>
              </div>

              <div style={styles.infoRow}>
                <CreditCard style={styles.infoIcon} />
                <span style={styles.infoLabel}>PAN Number:</span>
                <span style={styles.infoValue}>{patient.pan_number}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Health Card */}
          <div style={styles.rightColumn}>
            {/* Front Card */}
            <div
              id="card-front"
              style={{
                ...styles.healthCard,
                ...styles.front,
              }}
            >
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
                      width: "100%",
                      height: "100%",
                      marginLeft: isMobile ? "10px" : "28px",
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
              <div
                style={{
                  ...styles.cardContent,
                  ...(isMobile && {
                    marginLeft: 0,
                    alignItems: "flex-start",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }),
                }}
              >
                <div
                  style={{
                    ...styles.cardDetails,
                    ...(isMobile && {
                      flex: 1,
                      paddingRight: "8px",
                      paddingLeft: "0",
                    }),
                  }}
                >
                  <div style={styles.detailRowAligned}>
                    <span style={styles.labelText}>MEMBERSHIP ID:</span>
                    <span
                      style={{
                        ...styles.valueText,
                        maxWidth: isMobile ? "100px" : "200px",
                        fontSize: isMobile ? "8px" : "13px",
                      }}
                    >
                      {" "}
                      {patient.membership_id || " "}
                    </span>
                  </div>
                  <div style={styles.detailRowAligned}>
                    <span style={styles.labelText}>VALIDITY:</span>
                    <span
                      style={{
                        ...styles.valueText,
                        maxWidth: isMobile ? "100px" : "200px",
                        fontSize: isMobile ? "8px" : "13px",
                        whiteSpace: isMobile ? "normal" : "nowrap",
                      }}
                    >
                      {formatDate(patient.start_date)} to{" "}
                      {formatDate(patient.end_date)}
                    </span>
                  </div>

                  <div style={styles.detailRowAligned}>
                    <span style={styles.labelText}>CONTACT:</span>
                    <span
                      style={{
                        ...styles.valueText,
                        maxWidth: isMobile ? "100px" : "200px",
                        fontSize: isMobile ? "8px" : "13px",
                      }}
                    >
                      {patient.mobile || " "}
                    </span>
                  </div>
                  <div style={styles.detailRowAligned}>
                    <span style={styles.labelText}>BLOOD GROUP:</span>
                    <span
                      style={{
                        ...styles.bloodGroupText,
                        fontSize: isMobile ? "8px" : "13px",
                      }}
                    >
                      {patient.blood_group || " "}
                    </span>
                  </div>
                  <div
                    style={{
                      ...styles.detailRowAligned,
                      marginBottom: isMobile ? "3px" : "15px",
                    }}
                  >
                    <span style={styles.labelText}>ADDRESS:</span>
                    <span
                      style={{
                        ...styles.valueText,
                        maxWidth: isMobile ? "100px" : "200px",
                        fontSize: isMobile ? "8px" : "13px",
                        whiteSpace: "normal", // ✅ allows wrapping
                        lineHeight: isMobile ? "1.1" : "normal",
                        overflow: "visible", // ✅ prevents clipping
                        textOverflow: "unset", // ✅ no dots
                        wordBreak: "break-word", // ✅ breaks long words if needed
                      }}
                    >
                      {patient.address || " "}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    ...styles.cardPhoto,
                    ...(isMobile && {
                      flex: "none",
                      width: "70px",
                      marginLeft: "5px",
                    }),
                  }}
                >
                  <div style={styles.photoContainer}>
                    {patient.profile_image ? (
                      <img
                        src={patient.profile_image}
                        alt={patient.full_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        <User size={isMobile ? 15 : 24} color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      ...styles.photoNameText,
                      fontSize: isMobile ? "8px" : "14px",
                      maxWidth: isMobile ? "70px" : "100%",
                      lineHeight: isMobile ? "1.1" : "normal",
                    }}
                  >
                    {patient.full_name || " "}
                  </div>
                </div>
              </div>
              {/* Full-width Blue Strip at the Bottom */}
              <div style={styles.blueStrip}>
                <div style={styles.stripItem}>
                  <div style={styles.stripLabel}>WHATSAPP HELPLINE</div>
                  <div
                    style={{
                      ...styles.stripValue,
                      fontSize: isMobile ? "7px" : "12px",
                    }}
                  >
                    +91 8535 8535 89
                  </div>
                </div>
                <div style={styles.stripVerticalLine}></div>
                <div style={styles.stripItem}>
                  <div style={styles.stripLabel}>EMAIL ID</div>
                  <div
                    style={{
                      ...styles.stripValue,
                      fontSize: isMobile ? "7px" : "12px",
                    }}
                  >
                    support@vaidyabandhu.com
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div
              id="card-back"
              style={{
                ...styles.healthCard,
                ...styles.back,
              }}
            >
              <div style={styles.backContainer}>
                {/* Cashback Badge */}
                <div style={styles.cashbackBadge}>
                  10% CASHBACK ON YOUR
                  <br />
                  TOTAL HOSPITAL BILL
                  <br />
                  <span style={{ fontSize: isMobile ? "3px" : "5px" }}>
                    EXCLUDING PHARMACY AND IMPLANTS
                  </span>
                </div>
                {/* Benefits Section */}
                <div style={styles.benefitsSection}>
                  <div style={styles.benefitsTitle}>BENEFITS OF THIS CARD</div>
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
                      <span className="whitespace: nowrap">
                        Get 10% Cashback: Send your bill to Vaidya Bandhu via
                        WhatsApp or Email. Cashback will be credited to your
                        account within 7 working days.
                      </span>
                    </li>
                    <li style={styles.benefitItem}>
                      <span style={styles.checkMark}>✓</span>
                      <span>
                        Free surgeries under certain in need through our social
                        programs.
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
                        LOST CARD: DUPLICATE CAN BE ISSUED WITH A SMALL REISSUE
                        FEE.
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
                        DISCOUNTS MAY VARY BASED ON LOCATION, SERVICE TYPE, AND
                        AVAILABILITY.
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
                      <span>CALL OR WHATSAPP US AT +91 8535 8535 89</span>
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
                    VAIDYA BANDHU (A UNIT OF MY COMPANYON HEALTHCARE PRIVATE
                    LIMITED)
                  </div>
                  <div style={styles.tagline}>
                    "SERVING WITH CARE & COMMITMENT"
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons Container */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "20px",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: isMobile ? "8px 16px" : "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: isMobile ? "14px" : "16px",
                }}
                onClick={handleDownload}
              >
                Download PDF
              </button>
            </div>

            {/* Logout Button */}
            <button
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <svg
                style={{ marginRight: "8px" }}
                xmlns="http://www.w3.org/2000/svg"
                width={isMobile ? "16" : "20"}
                height={isMobile ? "16" : "20"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
