import React, { useState } from "react";
import ShowResumeModel from "../Modals/ShowResumeModel";
import PricingModal from "../Modals/PricingModal";
import { useSelector } from "react-redux";

const MiniCard = ({ cardlisting, handleShowModel }) => {
  const [showModel, setShowModel] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const payment_status = useSelector(
    (state) => state.rootReducer?.user?.payment_status
  );

  return (
    <div className="container">
      <div
        className={
          cardlisting.length === 1
            ? "row feauture-section"
            : "row justify-content-center feauture-section"
        }
      >
        {cardlisting.map((item, index) => (
          <div
            className={
              item?.uperName.includes("Add Collage") ||
              item?.uperName.includes("Preview Resume") ||
              item?.uperName.includes("Add News") ||
              item?.uperName.includes("Add Scholarship")
                ? `${
                    cardlisting.length === 1
                      ? "mb-4 as-link"
                      : "col-md-3 col-sm-6 mb-4 as-link"
                  }`
                : "col-md-3 col-sm-6 mb-4"
            }
            key={index}
          >
            <div
              className="feature-card"
              onClick={() => {
                if (item.uperName === "Preview Resume") {
                  if (payment_status === true) {
                    setShowModel(true);
                  } else {
                    setShowPayment(true);
                  }
                } else if (
                  item.uperName === "Add Collage" ||
                  item.uperName === "Add News" ||
                  item.uperName === "Add Scholarship"
                ) {
                  handleShowModel();
                }
              }}
            >
              <div className="feature-icon">
                <img src={item.img} alt="frame-icon" />
              </div>
              <div className="feature-heading">
                <h5>
                  {item.uperName}
                  {window.innerWidth <= 768 && item.lowerName && ' '+item.lowerName}
                </h5>
                {item.lowerName && window.innerWidth > 768 && (
                  <h5>{item.lowerName}</h5>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPayment && (
        <PricingModal
          show={showPayment}
          onClose={() => setShowPayment(false)}
          setShowModel={setShowPayment}
          backdrop="static"
          keyboard={false}
          onHide={() => setShowPayment(false)}
        />
      )}

      {showModel && (
        <ShowResumeModel show={showModel} onHide={() => setShowModel(false)} />
      )}
    </div>
  );
};

export default MiniCard;
