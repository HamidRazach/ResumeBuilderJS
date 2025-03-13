import React from "react";

const Footer = (props) => {
  return (
    <div className="footer-block">
      <div className="next-page-btn-holder">
      {props.onbordingStep !== 1 &&
        <button
          className="btn btn-primary custm-back-btn"
          onClick={() => {
            props.setOnbordingStep(props.onbordingStep - 1);
          }}
        >
          
          Back
        </button>}
        <button
          className="btn btn-primary custm-next-btn"
          onClick={() => {
            props.handle();
          }}
        >
          {props.onbordingStep === 3 ? "Get Started" : " Next"}
        </button>
      </div>
    </div>
  );
};

export default Footer;
