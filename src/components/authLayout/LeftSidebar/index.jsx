import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  BetweenHorizontalEnd,
  Waypoints,
} from "lucide-react";
import { useState } from "react";
import "../../../assets/css/LeftSidebar.css"; // or use Tailwind

const menuItems = [
  {
    name: "Slots",
    path: "/doc-slots",
    icon: <BetweenHorizontalEnd size={20} />,
  },
  {
    name: "Appointment",
    path: "/doc-appointment",
    icon: <Waypoints size={20} />,
  },
  {
    name: "Patient List",
    path: "/patient-list",
    icon: <LayoutDashboard size={20} />,
  },
];

const LeftSidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`sidebar pt-3 ${expanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-logo mb-4">
        <img
          src="/assets/img/logoo.png"
          alt="Logo"
          width={expanded ? 200 : 32}
        />
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {expanded && <span className="sidebar-label">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="collapse-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;