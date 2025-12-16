import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Stethoscope, Calendar, Languages, Award, Hospital, MapPin,
    Phone, Mail, Loader2, AlertCircle
} from 'lucide-react';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userInfo = localStorage.getItem('userInfo');

                let authData;
                try {
                    authData = JSON.parse(userInfo);
                } catch (e) {
                    console.error("Invalid JSON in localStorage");
                    navigate('/login', { replace: true });
                    return;
                }

                const doctorId = authData?.doctor_id;
                const token = authData.token;

                if (!doctorId || !token) {
                    navigate('/login', { replace: true });
                    return;
                }

                const response = await fetch(`https://admin.vaidyabandhu.com/api/doctors/${doctorId}/`);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setDoctorData(data?.data);
            } catch (err) {
                setError(err.message);
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {

    })

    const isMobile = windowWidth < 768;
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
            marginBottom: "20px",
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
        }
    };

    if (loading) {
        return (
            <div style={styles.profilePage}>
                <div style={styles.mainContainer}>
                    <div style={styles.card}>
                        <div style={styles.loadingContainer}>
                            <Loader2 style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite' }} />
                            <p style={{ fontSize: '18px' }}>Loading doctor profile...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.profilePage}>
                <div style={styles.mainContainer}>
                    <div style={styles.card}>
                        <div style={styles.errorContainer}>
                            <AlertCircle style={{ width: '48px', height: '48px' }} />
                            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Error Loading Profile</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No Data State (fallback if doctorData is null/undefined)
    if (!doctorData) {
        return (
            <div style={styles.profilePage}>
                <div style={styles.mainContainer}>
                    <div style={styles.card}>
                        <div style={styles.errorContainer}>
                            <AlertCircle style={{ width: '48px', height: '48px' }} />
                            <h3>No Data Available</h3>
                            <p>Doctor information could not be loaded.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const hospital = doctorData.hospital?.[0] || null;
    const speciality = doctorData.speciality?.[0] || null;

    return (
        <>
            <div style={styles.profilePage}>
                <div style={styles.mainContainer}>
                    <div style={styles.leftColumn}>
                        <div style={styles.personalInfoCard}>
                            <h2 style={styles.sectionTitle}>Personal Information</h2>

                            <div style={styles.infoRow}>
                                <User style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Full Name:</span>
                                <span style={styles.infoValue}>{doctorData.full_name || 'Not Available'}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <Stethoscope style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Qualification:</span>
                                <span style={styles.infoValue}>
                                    {doctorData.qualification || doctorData.educational_degrees || 'Not Available'}
                                </span>
                            </div>

                            <div style={styles.infoRow}>
                                <Calendar style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Experience:</span>
                                <span style={styles.infoValue}>
                                    {doctorData.experience ? `${doctorData.experience} years` : 'Not Available'}
                                </span>
                            </div>

                            <div style={styles.infoRow}>
                                <Award style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Speciality:</span>
                                <span style={styles.infoValue}>{speciality?.title || 'Not Available'}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <Languages style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Languages Spoken:</span>
                                <span style={styles.infoValue}>
                                    {doctorData.languages_spoken || 'Not Available'}
                                </span>
                            </div>

                            <div style={styles.infoRow}>
                                <Hospital style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Hospital:</span>
                                <span style={styles.infoValue}>{hospital?.name || 'Not Available'}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <MapPin style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Hospital Address:</span>
                                <span style={styles.infoValue}>
                                    {hospital?.address?.trim() || 'Not Available'}
                                </span>
                            </div>

                            <div style={styles.infoRow}>
                                <MapPin style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Location:</span>
                                <span style={styles.infoValue}>{hospital?.city || 'Not Available'}</span>
                            </div>

                            <div style={styles.infoRow}>
                                <Mail style={styles.infoIcon} />
                                <span style={styles.infoLabel}>Contact Email:</span>
                                <span style={styles.infoValue}>
                                    {doctorData.email || hospital?.email || 'Not Available'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DoctorProfile;