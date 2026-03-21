import React, { useRef, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Droplet,
  User,
  IdCard,
  CreditCard,
  Hash,
  LogOut, Loader2, AlertCircle,
  UserPlus,
  Download,
  Eye,
  Crown,
  Users,
  Heart,
  UserCheck,
  Baby,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import LoginModal from "./LoginModal";

const API_BASE_URL = "https://admin.vaidyabandhu.com";

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

const normalizeIsActive = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "active", "paid", "captured", "verified", "success", "completed", "enabled"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "inactive", "pending", "failed", "cancelled", "disabled"].includes(normalized)) {
      return false;
    }
  }
  return fallback;
};

const toAbsoluteMediaUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizeMember = (member = {}) => {
  const statusRaw =
    member.is_active ??
    member.active ??
    member.isActive ??
    member.card_active ??
    member.status;

  return {
    ...member,
    full_name: pickFirst(member.full_name, member.name, member.member_name),
    age: pickFirst(member.age, member.member_age),
    gender: pickFirst(member.gender, member.sex),
    blood_group: pickFirst(member.blood_group, member.bloodGroup),
    relationship: pickFirst(member.relationship, member.relation),
    membership_id: pickFirst(member.membership_id, member.member_membership_id, member.card_id),
    start_date: pickFirst(member.start_date, member.membership_start_date, member.valid_from),
    end_date: pickFirst(member.end_date, member.membership_end_date, member.valid_to),
    mobile: pickFirst(member.mobile, member.mobile_number, member.phone, member.phone_number),
    address: pickFirst(member.address, member.full_address),
    profile_image: toAbsoluteMediaUrl(
      pickFirst(member.profile_image, member.photo, member.image, member.profile_photo)
    ),
    is_active: normalizeIsActive(statusRaw, false),
  };
};

const normalizePatient = (raw = {}) => {
  const statusRaw =
    raw.is_active ??
    raw.active ??
    raw.isActive ??
    raw.membership_active ??
    raw.status;

  const familyMembers = Array.isArray(raw.family_members)
    ? raw.family_members
    : Array.isArray(raw.familyMembers)
      ? raw.familyMembers
      : [];

  return {
    ...raw,
    full_name: pickFirst(raw.full_name, raw.name, raw.patient_name),
    age: pickFirst(raw.age, raw.patient_age),
    gender: pickFirst(raw.gender, raw.sex),
    blood_group: pickFirst(raw.blood_group, raw.bloodGroup),
    address: pickFirst(raw.address, raw.full_address, raw.location),
    pin_code: pickFirst(raw.pin_code, raw.pincode),
    mobile: pickFirst(raw.mobile, raw.mobile_number, raw.phone, raw.phone_number),
    email: pickFirst(raw.email, raw.email_id),
    Aadhar_number: pickFirst(raw.Aadhar_number, raw.aadhaar_number, raw.adhaar_number),
    pan_number: pickFirst(raw.pan_number, raw.pan),
    profile_image: toAbsoluteMediaUrl(
      pickFirst(raw.profile_image, raw.photo, raw.image, raw.profile_photo)
    ),
    membership_id: pickFirst(raw.membership_id, raw.member_id, raw.card_id),
    start_date: pickFirst(raw.start_date, raw.membership_start_date, raw.valid_from),
    end_date: pickFirst(raw.end_date, raw.membership_end_date, raw.valid_to),
    is_active: normalizeIsActive(statusRaw, false),
    family_members: familyMembers.map(normalizeMember),
  };
};

const MyProfile = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    full_name: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    pin_code: "",
    mobile: "",
    email: "",
    Aadhar_number: "",
    pan_number: "",
    profile_image: "",
    membership_id: "",
    start_date: "",
    end_date: "",
    is_active: false,
    family_members: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [downloading, setDownloading] = useState(false);
  const [downloadingMemberId, setDownloadingMemberId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  // Toggle card flip
  const toggleCardFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Get relationship icon and color
  const getRelationshipDetails = (relationship) => {
    const relationshipMap = {
      spouse: { icon: Heart, color: '#E91E63', label: 'Spouse', bgColor: '#FCE4EC' },
      son: { icon: Baby, color: '#2196F3', label: 'Son', bgColor: '#E3F2FD' },
      daughter: { icon: Baby, color: '#9C27B0', label: 'Daughter', bgColor: '#F3E5F5' },
      father: { icon: UserCheck, color: '#4CAF50', label: 'Father', bgColor: '#E8F5E9' },
      mother: { icon: UserCheck, color: '#FF9800', label: 'Mother', bgColor: '#FFF3E0' },
      grandfather: { icon: Users, color: '#795548', label: 'Grandfather', bgColor: '#EFEBE9' },
      grandmother: { icon: Users, color: '#C2185B', label: 'Grandmother', bgColor: '#FCE4EC' },
      relative: { icon: Users, color: '#512DA8', label: 'Relative', bgColor: '#F3E5F5' },
      friend: { icon: UserCheck, color: '#00BCD4', label: 'Friend', bgColor: '#E0F2F1' },
      neighbour: { icon: Users, color: '#FF5722', label: 'Neighbour', bgColor: '#FFEBEE' },
      employee: { icon: UserCheck, color: '#607D8B', label: 'Employee', bgColor: '#ECEFF1' },
      brother: { icon: Users, color: '#2196F3', label: 'Brother', bgColor: '#E3F2FD' },
      sister: { icon: Users, color: '#E91E63', label: 'Sister', bgColor: '#FCE4EC' },
      others: { icon: Users, color: '#9E9E9E', label: 'Others', bgColor: '#F5F5F5' },
    };
    return relationshipMap[relationship?.toLowerCase()] || { icon: Users, color: '#9E9E9E', label: 'Family', bgColor: '#F5F5F5' };
  };

  const formatAppointmentDateOnly = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return 'N/A';
    }

    try {
      // Split by " - " and take the first part
      const firstPart = timeString.split(' - ')[0]?.trim();
      if (!firstPart) return 'N/A';

      // Extract YYYY-MM-DD part
      const dateOnly = firstPart.split(' ')[0];
      if (!dateOnly) return 'N/A';

      const date = new Date(dateOnly);
      return isNaN(date.getTime())
        ? 'Invalid Date'
        : date.toLocaleDateString('en-IN');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatTimeIST = (isoString) => {
    if (!isoString || typeof isoString !== 'string') return 'N/A';

    try {
      // Remove trailing +00:00 if present and treat as UTC
      const cleaned = isoString.replace('+00:00', '').trim();
      const utcDate = new Date(cleaned + 'Z'); // Force UTC

      if (isNaN(utcDate.getTime())) return 'N/A';

      // Format in 12-hour with 2-digit padding and proper AM/PM
      return utcDate.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata', // Explicitly IST
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Extract Start Time
  const formatAppointmentStartTime = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(' - ');
    if (parts.length < 2) return 'N/A';
    return formatTimeIST(parts[0].trim());
  };

  // Extract End Time
  const formatAppointmentEndTime = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(' - ');
    if (parts.length < 2) return 'N/A';
    return formatTimeIST(parts[1].trim());
  };

  // Full Range
  const formatAppointmentTimeRange = (timeString) => {
    const start = formatAppointmentStartTime(timeString);
    const end = formatAppointmentEndTime(timeString);
    if (start === 'N/A' || end === 'N/A') return 'N/A';
    return `${start} - ${end}`;
  };

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
          const normalizedData = normalizePatient(data);
          localStorage.setItem("userData", JSON.stringify(normalizedData));
          setPatient(normalizedData);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (activeTab !== 'appointments') return;

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const parsed = JSON.parse(storedUserData);
          } catch (e) {
            console.log("Invalid userData in localStorage");
          }
        }

        if (!token) {
          setError("Authentication token missing. Please log in again.");
          setLoading(false);
          return;
        }

        if (!patient?.id) {
          setError("User information not loaded yet. Please wait or refresh.");
          setLoading(false);
          return;
        }

        const userId = patient.id;
        const response = await fetch(
          `https://admin.vaidyabandhu.com/api/appointment/?user=${userId}`,
          {
            method: 'GET',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const slots = data.slots || data.results || data || [];

        const transformedAppointments = slots.map((appt, index) => ({
          slno: index + 1,
          doctorName: appt.doctor_name || 'Not Assigned',
          hospitalName: appt.hospital_name || 'Not Specified',
          reason: appt.reason || appt.description || 'Consultation',
          time: appt.time || 'N/A',
          bookedDate: appt.created_at || 'N/A',
          status: appt.status || 'pending',
        }));

        setAppointments(transformedAppointments);

        if (transformedAppointments.length === 0) {
          setError("No appointments found.");
        }

      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, patient?.id]);

  // membership card download handler
  const handleDownload = async (membershipId = null, memberName = null) => {
    const effectiveMembershipId = membershipId || patient.membership_id || null;
    const isPrimaryRequest = !membershipId || membershipId === patient.membership_id;

    if (isPrimaryRequest) {
      setDownloading(true);
    } else if (effectiveMembershipId) {
      setDownloadingMemberId(effectiveMembershipId);
    } else {
      setDownloading(true);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      const downloadEndpoints = [];
      if (effectiveMembershipId) {
        downloadEndpoints.push(
          `${API_BASE_URL}/api/user/card/pdf/?membership_id=${encodeURIComponent(effectiveMembershipId)}`
        );
      }
      downloadEndpoints.push(`${API_BASE_URL}/api/user/card/pdf/`);

      let lastError = new Error("Failed to download membership card");

      for (const endpoint of [...new Set(downloadEndpoints)]) {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
          lastError = new Error(`Download failed (${response.status})`);
          continue;
        }

        const contentDisposition = response.headers.get("Content-Disposition");
        const contentType = response.headers.get("Content-Type") || "";
        const blob = await response.blob();
        const looksLikePdf =
          contentType.toLowerCase().includes("application/pdf") ||
          (blob.type || "").toLowerCase().includes("application/pdf") ||
          /filename=/i.test(contentDisposition || "");

        if (!looksLikePdf) {
          const maybeError = await blob.text().catch(() => "");
          lastError = new Error(maybeError || "Invalid membership card file");
          continue;
        }

        const name = memberName || patient.full_name || "user";
        let filename = `${name}_HealthCard.pdf`;

        if (contentDisposition) {
          const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
          const directMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
          if (utfMatch?.[1]) {
            filename = decodeURIComponent(utfMatch[1]);
          } else if (directMatch?.[1]) {
            filename = directMatch[1];
          }
        }

        saveAs(blob, filename);
        return;
      }

      throw lastError;
    } catch (error) {
      console.error("Error downloading membership card:", error);
      alert(error?.message || "Failed to download membership card. Please try again later.");
    } finally {
      setDownloading(false);
      setDownloadingMemberId(null);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");

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
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      background: "#F5F9FA",
      border: "1px solid #CCCCCC",
      boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.1)",
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
    downloadButton: {
      backgroundColor: downloading ? "#6c757d" : "#007bff",
      color: "white",
      border: "none",
      padding: isMobile ? "8px 16px" : "10px 20px",
      borderRadius: "5px",
      cursor: downloading ? "not-allowed" : "pointer",
      fontSize: isMobile ? "14px" : "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: downloading ? 0.7 : 1,
    },
    // Member cards grid styles
    cardsSection: {
      width: "100%",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
      paddingBottom: "12px",
      borderBottom: "2px solid #095D7E",
    },
    sectionHeaderIcon: {
      width: "32px",
      height: "32px",
      color: "#095D7E",
    },
    sectionHeaderTitle: {
      fontSize: isMobile ? "20px" : "24px",
      fontWeight: 700,
      color: "#095D7E",
      margin: 0,
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(480px, 1fr))",
      gap: isMobile ? "24px" : "32px",
      justifyItems: "center",
    },
    memberCardWrapper: {
      width: isMobile ? "300px" : "480px",
      maxWidth: "520px",
      perspective: "1000px",
      position: "relative",
      margin: "0 auto",
      paddingTop: "16px",
    },
    memberCardInner: {
      position: "relative",
      width: "100%",
      height: isMobile ? "200px" : "350px",
      transition: "transform 0.6s ease-in-out",
      transformStyle: "preserve-3d",
    },
    memberCardFlipped: {
      transform: "rotateY(180deg)",
    },
    cardFace: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    },
    cardFaceBack: {
      transform: "rotateY(180deg)",
    },
    memberBadge: {
      position: "absolute",
      top: isMobile ? "-10px" : "-12px",
      left: isMobile ? "15px" : "20px",
      padding: isMobile ? "4px 12px" : "6px 16px",
      borderRadius: "20px",
      fontSize: isMobile ? "10px" : "12px",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      zIndex: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    primaryBadge: {
      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      color: "#5D4E00",
    },
    familyBadge: {
      background: "#fff",
      border: "2px solid",
    },
    statusBadge: {
      position: "absolute",
      top: isMobile ? "-10px" : "-12px",
      right: isMobile ? "15px" : "20px",
      padding: isMobile ? "4px 10px" : "6px 12px",
      borderRadius: "20px",
      fontSize: isMobile ? "9px" : "11px",
      fontWeight: 600,
      zIndex: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    activeBadge: {
      background: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
    },
    inactiveBadge: {
      background: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      fontWeight: 700,
    },
    cardActions: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "8px" : "12px",
      marginTop: "16px",
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      padding: isMobile ? "10px 16px" : "12px 24px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 600,
      transition: "all 0.2s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    viewButton: {
      background: "#fff",
      color: "#095D7E",
      border: "2px solid #095D7E",
    },
    downloadActionButton: {
      background: "linear-gradient(135deg, #095D7E 0%, #046877 100%)",
      color: "#fff",
    },
    emptyFamilyCard: {
      width: "100%",
      maxWidth: "520px",
      height: isMobile ? "200px" : "280px",
      borderRadius: "16px",
      border: "2px dashed #ccc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      background: "#fafafa",
      padding: "24px",
    },
    emptyIcon: {
      width: isMobile ? "48px" : "64px",
      height: isMobile ? "48px" : "64px",
      color: "#bbb",
    },
    emptyText: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#888",
      textAlign: "center",
    },
    addMemberButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: isMobile ? "12px 20px" : "14px 28px",
      background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0,122,126,0.3)",
      transition: "all 0.3s ease",
    },
  };

  const tabStyles = {
    tabContainer: {
      display: 'flex',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    },
    tabButton: {
      padding: isMobile ? '10px 16px' : '12px 24px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      color: '#fff',
      position: 'relative',
      transition: 'color 0.3s ease',
    },
    activeTab: {
      color: '#0dcaf0',
    },
    activeIndicator: {
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      width: '100%',
      height: '3px',
      backgroundColor: '#095D7E',
      borderRadius: '2px 2px 0 0',
    },
    tableHeaderStyle: {
      padding: '14px 12px',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: '600',
    },

    tableCellStyle: {
      padding: '14px 12px',
      fontSize: '15px',
      color: '#333',
    },
  };

  const canDownloadPrimaryCard = Boolean(patient.membership_id) && patient.is_active === true;

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
        <h3>My Appointments</h3>
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
        {/* tabs */}
        <div style={tabStyles.tabContainer}>
          <button
            style={{
              ...tabStyles.tabButton,
              ...(activeTab === 'profile' ? tabStyles.activeTab : {}),
            }}
            onClick={() => setActiveTab('profile')}
          >
            Profile
            {activeTab === 'profile' && <div style={tabStyles.activeIndicator} />}
          </button>

          <button
            style={{
              ...tabStyles.tabButton,
              ...(activeTab === 'appointments' ? tabStyles.activeTab : {}),
            }}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
            {activeTab === 'appointments' && <div style={tabStyles.activeIndicator} />}
          </button>
        </div>

        {activeTab === 'profile' && (
          <div style={styles.cardsSection}>
            {/* Primary Member Section */}
            <div style={{ marginBottom: isMobile ? "40px" : "48px" }}>
              <div style={styles.sectionHeader}>
                <Crown style={styles.sectionHeaderIcon} />
                <h2 style={styles.sectionHeaderTitle}>Primary Member</h2>
              </div>

              <div style={styles.cardsGrid}>
                {/* Primary Member Card */}
                <div style={styles.memberCardWrapper}>
                  {/* Primary Badge */}
                  <div style={{ ...styles.memberBadge, ...styles.primaryBadge }}>
                    <Crown size={isMobile ? 12 : 14} />
                    Primary Member
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    ...styles.statusBadge,
                    ...(patient.is_active ? styles.activeBadge : styles.inactiveBadge)
                  }}>
                    {patient.is_active ? 'Active' : 'Inactive'}
                  </div>

                  <div
                    style={{
                      ...styles.memberCardInner,
                      ...(flippedCards['primary'] ? styles.memberCardFlipped : {})
                    }}
                  >
                    {/* Front Card */}
                    <div
                      style={{
                        ...styles.healthCard,
                        ...styles.front,
                        ...styles.cardFace,
                      }}
                    >
                      <img
                        src="assets/img/vb-background.png"
                        alt="Vaidya Bandhu Background"
                        style={styles.backgroundImage}
                      />
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
                      <div style={styles.horizontalLine}></div>
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
                              {" "}{patient.membership_id || " "}
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
                            <span style={styles.labelText}>AGE / GENDER:</span>
                            <span
                              style={{
                                ...styles.valueText,
                                maxWidth: isMobile ? "100px" : "200px",
                                fontSize: isMobile ? "8px" : "13px",
                              }}
                            >
                              {patient.age || "—"} / {patient.gender || "—"}
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
                                whiteSpace: "normal",
                                lineHeight: isMobile ? "1.1" : "normal",
                                overflow: "visible",
                                textOverflow: "unset",
                                wordBreak: "break-word",
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
                      style={{
                        ...styles.healthCard,
                        ...styles.back,
                        ...styles.cardFace,
                        ...styles.cardFaceBack,
                      }}
                    >
                      <div style={styles.backContainer}>
                        <div style={styles.cashbackBadge}>
                          10% CASHBACK ON YOUR
                          <br />
                          TOTAL HOSPITAL BILL
                          <br />
                          <span style={{ fontSize: isMobile ? "3px" : "5px" }}>
                            EXCLUDING PHARMACY AND IMPLANTS
                          </span>
                        </div>
                        <div style={styles.benefitsSection}>
                          <div style={styles.benefitsTitle}>BENEFITS OF THIS CARD</div>
                          <ul style={styles.benefitsList}>
                            <li style={styles.benefitItem}>
                              <span style={styles.checkMark}>✓</span>
                              <span>Save 10% to 40% on surgeries, treatments, and diagnostics Services.</span>
                            </li>
                            <li style={styles.benefitItem}>
                              <span style={styles.checkMark}>✓</span>
                              <span>Get 10% Cashback: Send your bill to Vaidya Bandhu via WhatsApp or Email.</span>
                            </li>
                            <li style={styles.benefitItem}>
                              <span style={styles.checkMark}>✓</span>
                              <span>Free surgeries under certain in need through our social programs.</span>
                            </li>
                            <li style={styles.benefitItem}>
                              <span style={styles.checkMark}>✓</span>
                              <span>Call our helpline from 9 AM to 6 PM for free medical advice.</span>
                            </li>
                            <li style={styles.benefitItem}>
                              <span style={styles.checkMark}>✓</span>
                              <span>We help you choose the right doctor, hospital, or diagnostic center.</span>
                            </li>
                          </ul>
                          <div style={styles.sectionDivider}></div>
                        </div>
                        <div style={styles.termsSection}>
                          <div style={styles.termsTitle}>TERMS & CONDITIONS</div>
                          <ul style={styles.termsList}>
                            <li style={styles.termItem}>
                              <span style={styles.bullet}>•</span>
                              <span>VALIDITY: CARD IS VALID FOR 1 YEAR FROM THE DATE OF ISSUE.</span>
                            </li>
                            <li style={styles.termItem}>
                              <span style={styles.bullet}>•</span>
                              <span>NON-TRANSFERABLE: USE IS LIMITED TO THE REGISTERED INDIVIDUAL ONLY.</span>
                            </li>
                            <li style={styles.termItem}>
                              <span style={styles.bullet}>•</span>
                              <span>DISCOUNTS AVAILABLE ON CONSULTATIONS, TREATMENTS, SURGERIES, DIAGNOSTICS.</span>
                            </li>
                            <li style={styles.termItem}>
                              <span style={styles.bullet}>•</span>
                              <span>BOOKING REQUIRED: CONTACT OUR TEAM BEFORE VISITING ANY FACILITY.</span>
                            </li>
                          </ul>
                          <div style={styles.sectionDivider}></div>
                        </div>
                        <div style={styles.instructionsSection}>
                          <div style={styles.instructionsTitle}>INSTRUCTIONS TO USE</div>
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
                        <div style={styles.priceTag}>49/-</div>
                        <div style={styles.bottomBanner}>
                          <div style={styles.companyName}>
                            VAIDYA BANDHU (A UNIT OF MY COMPANYON HEALTHCARE PRIVATE LIMITED)
                          </div>
                          <div style={styles.tagline}>"SERVING WITH CARE & COMMITMENT"</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.cardActions}>
                    <button
                      style={{ ...styles.actionButton, ...styles.viewButton }}
                      onClick={() => toggleCardFlip('primary')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#095D7E";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#095D7E";
                      }}
                    >
                      <Eye size={16} />
                      {flippedCards['primary'] ? 'View Front' : 'View Back'}
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.downloadActionButton,
                        opacity: (!canDownloadPrimaryCard || downloading) ? 0.5 : 1,
                        cursor: (!canDownloadPrimaryCard || downloading) ? "not-allowed" : "pointer",
                      }}
                      onClick={() => canDownloadPrimaryCard && handleDownload(patient.membership_id, patient.full_name)}
                      disabled={downloading || !canDownloadPrimaryCard}
                      onMouseEnter={(e) => {
                        if (!downloading && canDownloadPrimaryCard) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(9,93,126,0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                      }}
                      title={!patient.membership_id ? "Membership ID not generated yet" : !patient.is_active ? "Membership is inactive" : ""}
                    >
                      {downloading ? (
                        <>
                          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          {canDownloadPrimaryCard ? "Download PDF" : "Inactive"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Members Section */}
            <div style={{ marginBottom: isMobile ? "40px" : "48px" }}>
              <div style={styles.sectionHeader}>
                <Users style={styles.sectionHeaderIcon} />
                <h2 style={styles.sectionHeaderTitle}>Family Members</h2>
              </div>

              <div style={styles.cardsGrid}>
                {patient.family_members && patient.family_members.length > 0 ? (
                  patient.family_members.map((member, index) => {
                    const relationDetails = getRelationshipDetails(member.relationship);
                    const RelationIcon = relationDetails.icon;
                    const memberKey = member.id ?? member.membership_id ?? `${member.full_name || "member"}-${index}`;
                    const cardId = `family-${memberKey}`;
                    const isMemberInactive = member.is_active === false;
                    const canDownloadMemberCard = Boolean(member.membership_id) && !isMemberInactive;
                    const isDownloadingThis = downloadingMemberId === member.membership_id;

                    return (
                      <div key={memberKey} style={styles.memberCardWrapper}>
                        {/* Relationship Badge */}
                        <div style={{
                          ...styles.memberBadge,
                          ...styles.familyBadge,
                          borderColor: relationDetails.color,
                          backgroundColor: relationDetails.bgColor,
                          color: relationDetails.color,
                        }}>
                          <RelationIcon size={isMobile ? 12 : 14} />
                          {relationDetails.label}
                        </div>

                        {/* Status Badge */}
                        <div style={{
                          ...styles.statusBadge,
                          ...(member.is_active ? styles.activeBadge : styles.inactiveBadge)
                        }}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </div>

                        <div
                          style={{
                            ...styles.memberCardInner,
                            ...(flippedCards[cardId] ? styles.memberCardFlipped : {}),
                          }}
                        >
                          {/* Front Card */}
                          <div
                            style={{
                              ...styles.healthCard,
                              ...styles.front,
                              ...styles.cardFace,
                              ...(isMemberInactive && {
                                opacity: 0.6,
                                filter: 'grayscale(40%)',
                              }),
                            }}
                          >
                            <img
                              src="assets/img/vb-background.png"
                              alt="Vaidya Bandhu Background"
                              style={styles.backgroundImage}
                            />
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
                            <div style={styles.horizontalLine}></div>
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
                                    {" "}{member.membership_id || " "}
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
                                    {formatDate(member.start_date)} to{" "}
                                    {formatDate(member.end_date)}
                                  </span>
                                </div>
                                <div style={styles.detailRowAligned}>
                                  <span style={styles.labelText}>AGE / GENDER:</span>
                                  <span
                                    style={{
                                      ...styles.valueText,
                                      maxWidth: isMobile ? "100px" : "200px",
                                      fontSize: isMobile ? "8px" : "13px",
                                    }}
                                  >
                                    {member.age || "—"} / {member.gender || "—"}
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
                                    {member.blood_group || "—"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    ...styles.detailRowAligned,
                                    marginBottom: isMobile ? "3px" : "15px",
                                  }}
                                >
                                  <span style={styles.labelText}>RELATIONSHIP:</span>
                                  <span
                                    style={{
                                      ...styles.valueText,
                                      maxWidth: isMobile ? "100px" : "200px",
                                      fontSize: isMobile ? "8px" : "13px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {member.relationship || "—"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    ...styles.detailRowAligned,
                                    marginBottom: isMobile ? "3px" : "15px",
                                  }}
                                >
                                  <span style={styles.labelText}>PRIMARY HOLDER:</span>
                                  <span
                                    style={{
                                      ...styles.valueText,
                                      maxWidth: isMobile ? "100px" : "200px",
                                      fontSize: isMobile ? "8px" : "13px",
                                    }}
                                  >
                                    {patient.full_name || "—"}
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
                                  {member.profile_image ? (
                                    <img
                                      src={member.profile_image}
                                      alt={member.full_name}
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
                                  {member.full_name || " "}
                                </div>
                              </div>
                            </div>
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
                            style={{
                              ...styles.healthCard,
                              ...styles.back,
                              ...styles.cardFace,
                              ...styles.cardFaceBack,
                              ...(isMemberInactive && {
                                opacity: 0.6,
                                filter: 'grayscale(40%)',
                              }),
                            }}
                          >
                            <div style={styles.backContainer}>
                              <div style={styles.cashbackBadge}>
                                10% CASHBACK ON YOUR
                                <br />
                                TOTAL HOSPITAL BILL
                                <br />
                                <span style={{ fontSize: isMobile ? "3px" : "5px" }}>
                                  EXCLUDING PHARMACY AND IMPLANTS
                                </span>
                              </div>
                              <div style={styles.benefitsSection}>
                                <div style={styles.benefitsTitle}>BENEFITS OF THIS CARD</div>
                                <ul style={styles.benefitsList}>
                                  <li style={styles.benefitItem}>
                                    <span style={styles.checkMark}>✓</span>
                                    <span>Save 10% to 40% on surgeries, treatments, and diagnostics Services.</span>
                                  </li>
                                  <li style={styles.benefitItem}>
                                    <span style={styles.checkMark}>✓</span>
                                    <span>Get 10% Cashback: Send your bill to Vaidya Bandhu via WhatsApp or Email.</span>
                                  </li>
                                  <li style={styles.benefitItem}>
                                    <span style={styles.checkMark}>✓</span>
                                    <span>Free surgeries under certain in need through our social programs.</span>
                                  </li>
                                  <li style={styles.benefitItem}>
                                    <span style={styles.checkMark}>✓</span>
                                    <span>Call our helpline from 9 AM to 6 PM for free medical advice.</span>
                                  </li>
                                </ul>
                                <div style={styles.sectionDivider}></div>
                              </div>
                              <div style={styles.termsSection}>
                                <div style={styles.termsTitle}>TERMS & CONDITIONS</div>
                                <ul style={styles.termsList}>
                                  <li style={styles.termItem}>
                                    <span style={styles.bullet}>•</span>
                                    <span>VALIDITY: CARD IS VALID FOR 1 YEAR FROM THE DATE OF ISSUE.</span>
                                  </li>
                                  <li style={styles.termItem}>
                                    <span style={styles.bullet}>•</span>
                                    <span>NON-TRANSFERABLE: USE IS LIMITED TO THE REGISTERED INDIVIDUAL ONLY.</span>
                                  </li>
                                  <li style={styles.termItem}>
                                    <span style={styles.bullet}>•</span>
                                    <span>DISCOUNTS AVAILABLE ON CONSULTATIONS, TREATMENTS, SURGERIES.</span>
                                  </li>
                                </ul>
                                <div style={styles.sectionDivider}></div>
                              </div>
                              <div style={styles.instructionsSection}>
                                <div style={styles.instructionsTitle}>INSTRUCTIONS TO USE</div>
                                <ul style={styles.instructionsList}>
                                  <li style={styles.instructionItem}>
                                    <span style={styles.bullet}>•</span>
                                    <span>CALL OR WHATSAPP US AT +91 8535 8535 89</span>
                                  </li>
                                  <li style={styles.instructionItem}>
                                    <span style={styles.bullet}>•</span>
                                    <span>SHARE YOUR MEMBERSHIP ID AND ISSUE</span>
                                  </li>
                                </ul>
                              </div>
                              <div style={styles.priceTag}>49/-</div>
                              <div style={styles.bottomBanner}>
                                <div style={styles.companyName}>
                                  VAIDYA BANDHU (A UNIT OF MY COMPANYON HEALTHCARE PRIVATE LIMITED)
                                </div>
                                <div style={styles.tagline}>"SERVING WITH CARE & COMMITMENT"</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.cardActions}>
                          <button
                            style={{ ...styles.actionButton, ...styles.viewButton }}
                            onClick={() => toggleCardFlip(cardId)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#095D7E";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#fff";
                              e.currentTarget.style.color = "#095D7E";
                            }}
                          >
                            <Eye size={16} />
                            {flippedCards[cardId] ? 'View Front' : 'View Back'}
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.downloadActionButton,
                              opacity: (isDownloadingThis || !canDownloadMemberCard) ? 0.5 : 1,
                              cursor: (isDownloadingThis || !canDownloadMemberCard) ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => canDownloadMemberCard && handleDownload(member.membership_id, member.full_name)}
                            disabled={isDownloadingThis || !canDownloadMemberCard}
                            onMouseEnter={(e) => {
                              if (!isDownloadingThis && canDownloadMemberCard) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(9,93,126,0.4)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                            }}
                            title={!member.membership_id ? "Membership ID not generated yet" : isMemberInactive ? "Membership is inactive" : ""}
                          >
                            {isDownloadingThis ? (
                              <>
                                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                {canDownloadMemberCard ? 'Download PDF' : 'Inactive'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty State - No Family Members */
                  <div style={styles.emptyFamilyCard}>
                    <Users style={styles.emptyIcon} />
                    <p style={styles.emptyText}>
                      No family members added yet.<br />
                      Add family members to create health cards for them.
                    </p>
                    <button
                      style={styles.addMemberButton}
                      onClick={() => navigate("/basic-details?mode=add-members")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,122,126,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,122,126,0.3)";
                      }}
                    >
                      <UserPlus size={20} />
                      Add Family Members
                    </button>
                  </div>
                )}
              </div>

              {/* Add More Family Members Button (when members exist) */}
              {patient.family_members && patient.family_members.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                  <button
                    style={styles.addMemberButton}
                    onClick={() => navigate("/basic-details?mode=add-members")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,122,126,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,122,126,0.3)";
                    }}
                  >
                    <UserPlus size={20} />
                    Add More Family Members
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
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
                <LogOut size={isMobile ? 16 : 20} style={{ marginRight: "8px" }} />
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <h2 style={styles.sectionTitle}>My Appointments</h2>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader2 style={{ width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                <p>Loading appointments...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                <AlertCircle style={{ width: '40px', height: '40px' }} />
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && appointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                <p>No appointments found.</p>
              </div>
            )}

            {!loading && !error && appointments.length > 0 && (
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#095D7E', color: 'white' }}>
                    <th style={tabStyles.tableHeaderStyle}>Sl. No</th>
                    <th style={tabStyles.tableHeaderStyle}>Doctor Name</th>
                    <th style={tabStyles.tableHeaderStyle}>Hospital Name</th>
                    <th style={tabStyles.tableHeaderStyle}>Time</th>
                    <th style={tabStyles.tableHeaderStyle}>Appointment Date</th>
                    <th style={tabStyles.tableHeaderStyle}>Booked On</th>
                    <th style={tabStyles.tableHeaderStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.slno} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tabStyles.tableCellStyle}>{appt.slno}</td>
                      <td style={tabStyles.tableCellStyle}>{appt.doctorName}</td>
                      <td style={tabStyles.tableCellStyle}>{appt.hospitalName}</td>
                      <td style={tabStyles.tableCellStyle}>{formatAppointmentTimeRange(appt.time)}</td>
                      <td style={tabStyles.tableCellStyle}>
                        {formatAppointmentDateOnly(appt.time)}
                      </td>
                      <td style={tabStyles.tableCellStyle}>
                        {new Date(appt.bookedDate).toLocaleDateString('en-IN')}
                      </td>
                      <td style={tabStyles.tableCellStyle}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          backgroundColor:
                            appt.status === 'confirmed' ? '#d4edda' :
                              appt.status === 'pending' ? '#fff3cd' :
                                appt.status === 'cancelled' ? '#f8d7da' : '#e2e3e5',
                          color:
                            appt.status === 'confirmed' ? '#155724' :
                              appt.status === 'pending' ? '#856404' :
                                appt.status === 'cancelled' ? '#721c24' : '#383d41',
                        }}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyProfile;
