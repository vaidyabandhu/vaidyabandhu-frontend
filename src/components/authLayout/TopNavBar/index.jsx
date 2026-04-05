import "../../../assets/css/Topbar.css";
import ProfileDropdown from "./components/ProfileDropdown";
import { useAuthContext } from "../../context";
import { useEffect, useState } from "react";

const isProfileActive = (profile = {}) => {
  const payload = profile?.data && typeof profile.data === "object" ? profile.data : profile;
  const primary =
    payload?.primary_member && typeof payload.primary_member === "object"
      ? payload.primary_member
      : payload?.primaryMember && typeof payload.primaryMember === "object"
        ? payload.primaryMember
        : {};

  const rawStatus =
    primary.is_active ??
    primary.active ??
    primary.isActive ??
    primary.membership_active ??
    payload.is_active ??
    payload.active ??
    payload.isActive ??
    payload.membership_active ??
    primary.status ??
    payload.status;

  if (typeof rawStatus === "boolean") return rawStatus;
  if (typeof rawStatus === "number") return rawStatus === 1;
  if (typeof rawStatus === "string") {
    const normalized = rawStatus.trim().toLowerCase();
    if (["true", "1", "active", "paid", "captured", "verified", "success", "completed", "enabled", "activated"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "inactive", "pending", "failed", "cancelled", "disabled"].includes(normalized)) {
      return false;
    }
  }
  return false;
};

const Topbar = () => {
  const { user } = useAuthContext();
  const [userType, setUserType] = useState(null);
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    console.log("[TopNavBar] Component mounted/updated");
    const userData = localStorage.getItem("userData");
    console.log("[TopNavBar] userData:", userData);
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log("[TopNavBar] Parsed:", parsed);
        setUserType(parsed.user_type);
        
        // Check if primary member is active
        const primaryActive = isProfileActive(parsed);
        
        console.log("[TopNavBar] primaryActive:", primaryActive);
        setShowProfile(primaryActive);
      } catch (error) {
        console.error("[TopNavBar] Error parsing user data:", error);
        setShowProfile(true); // fallback show
      }
    } else {
      console.log("[TopNavBar] No userData in localStorage");
      setShowProfile(false);
    }
  }, [user]);

  return (
    <header className="topbar">
      <div>
        {/* ✅ Only show hospital name if NOT front_desk */}
        {userType !== "front_desk" && (
          <div className="project-section">
            <span className="project-label">Hospital:</span>
            <span className="hospital-name">
              {user?.hospital_name || user?.selectedHostiptal?.description}
            </span>
          </div>
        )}
      </div>

      <div className="topbar-right">
        <div className="topbar-nav-right">
          {/* Show profile only when primary member is active */}
          {showProfile && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
