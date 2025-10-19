import React, { useEffect, useRef } from "react";
import "./Modal.css";

const Modal = ({ text, isActive, setIsActive, style, children }) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, setIsActive]);

  if (!isActive) return null;

  return (
    <div className="popup-overlay">
      <div ref={popupRef} className="popup-container" style={style}>
        <div className="popup-content" style={{ padding: "10px" }}>
          {children ? (
            children
          ) : typeof text === "string" ? (
            <p>{text}</p>
          ) : (
            text
          )}
        </div>
        <button
          className="popup-close-btn"
          onClick={() => setIsActive(false)}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
