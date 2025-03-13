import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { useSelector } from "react-redux";

const JoinModal = (props) => {

  const [validated, setValidated] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [isValidInput, setIsValidInput] = useState(true);

  const tokenSelector = useSelector(state=> state.rootReducer?.user?.token);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      let isValidEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      
      // let isValidNumber = /^\+?1?\d{10}$/.test(value) || // US phone number with country code
      //                     /^\+?92?\d{10}$/.test(value) || // Pakistan phone number with country code
      //                     /^923\d{9}$|^03\d{9}$/.test(value) || // Pakistan phone number without country code
      //                     /^\d{10}$/.test(value); // US phone number without country code
      
      setIsValidInput(isValidEmail);
    }
  
    setProfileData({ ...profileData, [name]: value });
  };


  const handleClear = () => {
    setProfileData({
      name: "",
      email: "",
    });
  };


  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false || !isValidInput)  {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      view_profile_info();
    }
  };

  useEffect(()=>{
    if(props.show){
    setProfileData({
      name: "",
      email: "",
    })
    setValidated(false);
  }
    },[props.show])


    useEffect(()=>{
      if(profileData.email === ""){
        setIsValidInput(true)
      }
    },[profileData.email])

  const view_profile_info = () => {
    const formData = new FormData();

    formData.append("name", profileData.name);
    formData.append("email", profileData.email);

    commonApi
    .newsletter(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {

          successMessage("Successfully Submit");
          handleClear();
          props.onHide();
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

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
            {/* <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title> */}
            <h4>View Profile</h4>
           <i className="fa-solid fa-xmark" onClick={()=>{
             handleClear();
             props.onHide();
           }}></i>
           
          </Modal.Header>
      <Modal.Body>
        <div className="modal-tab-block">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="form-group">
              <Form.Label id="name1">Name</Form.Label>
              <Form.Control
                htmlFor="name1"
                required
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleInputChange}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Name is required.
              </Form.Control.Feedback>
            </div>
            <div className="form-group" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                htmlFor="email"
                type="email"
                required
                placeholder="Email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                isInvalid={!isValidInput}
                autoComplete="off"
              />
                 <Form.Control.Feedback type="invalid">
                {profileData.email ?
               "Email is invalid!" : "Email is required!"}
              </Form.Control.Feedback>
            </div>
            <div className="form-group">
              <Button type="submit" className="btn btn-primary">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
      
    </Modal>
  );
};

export default JoinModal;
