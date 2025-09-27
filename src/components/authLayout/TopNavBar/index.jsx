import "../../../assets/css/Topbar.css";
import ProfileDropdown from "./components/ProfileDropdown";
import { useAuthContext } from "../../context";

const Topbar = () => {
  const { user } = useAuthContext();

  return (
    <header className="topbar">
      <div>
        <div className="project-section">
          <span className="project-label">Hospital:</span>
          <span className="hospital-name">
            {user?.hospital_name || user?.selectedHostiptal?.description || "Not available"}
          </span>
        </div>
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