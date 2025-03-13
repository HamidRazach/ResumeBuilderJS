import React, { useState } from "react";
import { fixTooltip, truncateText } from "../../constant/commonUtils";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
const TooltipButton = ({ icon, tooltipText, index, adminJourney }) => {
  const iS_Admin = useSelector((state) => state.rootReducer.user?.user_type);
  const [showTooltip, setShowTooltip] = useState(true);
  // const sanitizedText = tooltipText.replace(/<\/?[^>]+(>|$)/g, "");
  const sanitizedText = tooltipText
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, " "); // Remove all HTML entities like &nbsp;, &amp;, etc.

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Button with Icon */}
      <button
        className="btn p-0"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ background: "none", border: "none", margin: "0px" }}
      >
        <IoMdInformationCircleOutline
          style={{
            width: "25px",
            height: "auto",
            color: "rgba(1, 146, 166, 1)",
          }}
        />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: index === 0 ? "-320%" : "95%",
            left: window.innerWidth <= 480 && !adminJourney ? "50px" : window.innerWidth <= 480 && adminJourney ? '10px' : "180px",
            transform: "translateX(-50%)",
            marginBottom: "10px",
            backgroundColor: "#fff",
            color: "#000",
            fontSize: "14px",
            padding: "10px",
            borderRadius: "4px",
            zIndex: 1000,
            whiteSpace: "normal",
            border: "1px solid white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: window.innerWidth <= 480 ? "300px" : "450px",
            maxWidth: window.innerWidth <= 480 ? "300px" : "500px",
            overflow: "visible",
            textAlign: "left",
          }}
        >
          { truncateText(sanitizedText,450,2)  }

          {/* Tooltip Arrow */}
          <div
            style={{
              position: "absolute",
              bottom: index === 0 ? "65px" : "-10px",
              left:
                index === 0 && window.innerWidth > 480
                  ? "10%"
                  // : index === 0 || (window.innerWidth <= 480 && !adminJourney)
                  //   ? "10%"
                  //   : index === 0 || (window.innerWidth <= 480 && adminJourney)
                  //     ? "51%"
                      : "15%",
              transform: index === 0 ? "rotate(180deg)" : "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #fff",
              zIndex: 9999,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
