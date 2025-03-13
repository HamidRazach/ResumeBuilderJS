import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function GenderChange(props) {
  const profileSelector = useSelector((state) => state.profileReducer);
  const chooseAdmin = useSelector((state) => state.rootReducer);
  const userType = chooseAdmin?.user?.user_type;


  const handleClose = () => {
    props.setSubId(profileSelector?.profileData?.gender);
    props.onHide();
  };

  const handleSave = () => {
    props.onSave();
    props.onHide();
  };

  return (
    <>
      <Modal
        id="change_gender"
        className="custom-modal1 custom-modal2 custom-modal3"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <h4>Gender Change Confirmation</h4>
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              props.onHide();
            }}
          ></i>
        </Modal.Header>

        <Modal.Body>
          <div className="modal-tab-block">
            {userType === "user" ?
            <p>
              Are you sure you want to change the gender? This will reset the
              answer of sportsmanship.
            </p>
            :
            <p>
              Are you sure you want to change the user's gender? 
              This will reset the user's sportsmanship.</p>
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            No Thanks
          </Button>
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GenderChange;
