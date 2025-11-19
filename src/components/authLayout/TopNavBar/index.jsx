import "../../../assets/css/Topbar.css";
import ProfileDropdown from "./components/ProfileDropdown";
import { useAuthContext } from "../../context";
import { useEffect, useState } from "react";

const Topbar = () => {
  const { user } = useAuthContext();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserType(parsed.user_type);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
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
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
