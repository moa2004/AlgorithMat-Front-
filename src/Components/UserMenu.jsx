import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // إغلاق عند النقر خارج القائمة أو الضغط على Escape
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    window.localStorage.removeItem("userAuth");
    console.log(navigate);
    // Use full reload redirect to ensure state reset
    window.location.assign("/Home");
    // Alternative: window.location.href = "/Home";
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-info">
        {/* زر منفصل للتحكم بالقائمة */}
        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          title={open ? "Close menu" : "Open menu"}
        >
          {/* سهم أنيق (SVG) */}
          <svg
            className="chevron"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className={`dropdown ${open ? "show" : "hide"}`} role="menu">
        <button className="dropdown-item" onClick={handleLogout}>
          {/* أيقونة خروج (SVG) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginInlineEnd: 8 }}
          >
            <path
              d="M9 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17l5-5-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}
