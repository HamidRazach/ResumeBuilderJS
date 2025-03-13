import React from "react";
import { Modal } from "react-bootstrap";
import ResumeTempelate from "../header/ResumeTempelate";

const ShowResumeModel = (props) => {
  return (
    <Modal
      id="resume-pdf"
      className="custom-modal1 custom-modal2  resume-modal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        {/* <Modal.Title id="contained-modal-title-vcenter">
            </Modal.Title> */}
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <ResumeTempelate />
      </Modal.Body>
      {/* <Modal.Footer>
        <Button
          onClick={() => {
            handleClick();
          }}
        >
          Add
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default ShowResumeModel;
