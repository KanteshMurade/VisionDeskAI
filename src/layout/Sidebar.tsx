import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaRobot,
  FaCamera,
  FaBrain,
  FaPuzzlePiece,
  FaCog,
  FaComments,
} from "react-icons/fa";

const menu = [
  { name: "Dashboard", path: "/", icon: <FaHome /> },
  { name: "AI Providers", path: "/providers", icon: <FaRobot /> },
  { name: "OCR", path: "/ocr", icon: <FaCamera /> },
  { name: "Memory", path: "/memory", icon: <FaBrain /> },
  { name: "Plugins", path: "/plugins", icon: <FaPuzzlePiece /> },
  { name: "Settings", path: "/settings", icon: <FaCog /> },
  { name: "Chat", path: "/chat", icon: <FaComments /> },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#111827",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>VisionDesk AI</h2>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </aside>
  );
}
