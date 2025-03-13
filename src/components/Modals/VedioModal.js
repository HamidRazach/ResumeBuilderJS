import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { video_model } from "../../Redux/VideoModelAction";

const VedioModal = (props) => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {
    if (props.show && videoRef.current) {
      const video = videoRef.current;
  
      video.play().catch((error) => {
        video.muted = true;  // Mute the video
        video.play().catch((e) => console.error("Failed to autoplay even after muting.", e));
      });
    }
  }, [props.show]);


  return (
    <Modal
      id="join-modal"
      className="custom-modal1 custom-modal2 custom-modal3"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <i className="fa-solid fa-xmark" onClick={() => {dispatch(video_model(true)); props.setShowModel(false) }}></i>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="ratio ratio-16x9">
            <video
              ref={videoRef}
              style={{ display: 'block', width: '100%' }}
              controls
            >
              <source src="https://app.thepathfinderhub.com/pathfinder-vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VedioModal;
