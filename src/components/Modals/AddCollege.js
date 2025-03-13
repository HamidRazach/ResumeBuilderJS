import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Dropdown, Tabs, Tab } from "react-bootstrap";
import { universityCreateType, updateQuestions } from "../../constant/commonUtils";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { useSelector } from "react-redux";
const AddCollege = (props) => {
  const [key, setKey] = useState("general");
  const [validated, setValidated] = useState(false);

  const buttonRef = useRef(null);
  // const [saveUniversityData, setSaveUniversityData] = useState([]);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const [collegeForm, setCollegeForm] = useState({
    title: "",
    group: universityCreateType[0].id,
    description: "",
    sc_roles: "",
    sc_honors: "",
    ld_roles: "",
    ld_honors: "",
    sp_roles: "",
    sp_honors: "",
    ct_roles: "",
    ct_honors: "",
  });
  const checkForZero = (value) => {
    return value && value !== "0" ? value : "";
  };

  useEffect(() => {
    if (props.selectedUniData?.id) {
      setCollegeForm({
        title: props.selectedUniData?.title || "",
        group: props.selectedUniData?.group || "",
        description: props.selectedUniData?.description || "",
        // sc_roles: checkForZero(props.selectedUniData?.sc_roles),
        // sc_honors: checkForZero(props.selectedUniData?.sc_honors),
        // ld_roles: checkForZero(props.selectedUniData?.ld_roles),
        // ld_honors: checkForZero(props.selectedUniData?.ld_honors),
        // sp_roles: checkForZero(props.selectedUniData?.sp_roles),
        // sp_honors: checkForZero(props.selectedUniData?.sp_honors),
        // ct_roles: checkForZero(props.selectedUniData?.ct_roles),
        // ct_honors: checkForZero(props.selectedUniData?.ct_honors),
      });
    }
  }, [props.selectedUniData]);

  const add_university_ques = () => {
    const formData = new FormData();

    formData.append("title", collegeForm.title);
    formData.append("group", collegeForm.group);
    formData.append("description", collegeForm.description);
    // formData.append("sc_roles", collegeForm.sc_roles);
    // formData.append("sc_honors", collegeForm.sc_honors);
    // formData.append("ld_roles", collegeForm.ld_roles);
    // formData.append("ld_honors", collegeForm.ld_honors);
    // formData.append("sp_roles", collegeForm.sp_roles);
    // formData.append("sp_honors", collegeForm.sp_honors);
    // formData.append("ct_honors", collegeForm.ct_honors);
    // formData.append("ct_roles", collegeForm.ct_roles);

    commonApi
      .add_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {

      props.setUniversityListing((prevData) => [
        res.data,
        ...prevData
        ]);
        

          // props.get_university(1);
          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const update_university = () => {
    const formData = new FormData();

    formData.append("university_id", props.selectedUniData?.id);
    formData.append("title", collegeForm.title);
    formData.append("group", collegeForm.group);
    formData.append("description", collegeForm.description);
    // formData.append("sc_roles", collegeForm.sc_roles);
    // formData.append("sc_honors", collegeForm.sc_honors);
    // formData.append("ld_roles", collegeForm.ld_roles);
    // formData.append("ld_honors", collegeForm.ld_honors);
    // formData.append("sp_roles", collegeForm.sp_roles);
    // formData.append("sp_honors", collegeForm.sp_honors);
    // formData.append("ct_honors", collegeForm.ct_honors);
    // formData.append("ct_roles", collegeForm.ct_roles);

    commonApi
      .update_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          const updateUniversity =  updateQuestions(res.data, props.universityListing, 'universities')
          props.setUniversityListing(updateUniversity)
          // props.get_university(1);
          successMessage(res.message);
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleClick = () => {
    // Check if the ref is assigned to an element
    if (buttonRef.current) {
      // Trigger the click event
      buttonRef.current.click();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || value.startsWith("0")) {
      setCollegeForm({ ...collegeForm, [name]: "" });
    } else {
      setCollegeForm({ ...collegeForm, [name]: value.trimStart() });
    }
  };

  const handleClear = () => {
    setCollegeForm({
      title: "",
      group: universityCreateType[0].id,
      description: "",
      sc_roles: "",
      sc_honors: "",
      ld_roles: "",
      ld_honors: "",
      sp_roles: "",
      sp_honors: "",
      ct_roles: "",
      ct_honors: "",
    });
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);

      if (
        key === "values" &&
        (collegeForm.title === "" || collegeForm.description === "")
      ) {
        errorMessage("Please fill general tab values!");
      } 
      // else if (
      //   key === "general" &&
      //   (collegeForm.sc_roles === "" ||
      //     collegeForm.sc_honors === "" ||
      //     collegeForm.ld_roles === "" ||
      //     collegeForm.ld_honors === "" ||
      //     collegeForm.sp_roles === "" ||
      //     collegeForm.sp_honors === "" ||
      //     collegeForm.ct_roles === "" ||
      //     collegeForm.ct_honors === "" ||
      //     validated)
      // ) {
      //   errorMessage("Please fill values tab!");
      // }
    } else {
      setValidated(false);
      if (props.selectedUniData?.id) {
        update_university();
      } else {
        add_university_ques();
      }

      handleClear();
      props.onHide();
    }
  };

  return (
    <Modal
      id="custommodal2"
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
        <h4>{props.selectedUniData?.id ? "Update college" : "Add College"}</h4>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            handleClear();
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-tab-block">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab
                eventKey="general"
                title={
                  <div>
                    <span>General</span>
                  </div>
                }
              >
                <>
                  {/* <Form noValidate validated={validated} onSubmit={handleSubmit}> */}
                  <div className="custom-tabs">
                    <div className="form-group">
                      <h5>Enter college details below</h5>
                      <Form.Label id="name1">Name</Form.Label>
                      <Form.Control
                        htmlFor="name1"
                        required
                        type="text"
                        placeholder="Type college name"
                        name="title"
                        value={collegeForm.title}
                        onChange={handleInputChange}
                        autocomplete='off'
                      />
                      <Form.Control.Feedback type="invalid">
                        Name is required.
                      </Form.Control.Feedback>
                    </div>
                    <div className="form-group">
                      <Form.Label id="group">Group</Form.Label>
                      <div className="custom-form-slect-field">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            {collegeForm?.group &&
                              universityCreateType.find(
                                (item) => item.id === collegeForm?.group
                              )?.title}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {universityCreateType.map((item, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() =>
                                  setCollegeForm({
                                    ...collegeForm,
                                    group: item.id,
                                  })
                                }
                              >
                                {item.title}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div
                      className="form-group"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>Short Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={collegeForm.description}
                        required
                        onChange={handleInputChange}
                        name="description"
                        autocomplete='off'
                      />
                      <Form.Control.Feedback type="invalid">
                        Description is required.
                      </Form.Control.Feedback>
                    </div>
                  </div>
                  <Button
                    style={{ display: "none" }}
                    ref={buttonRef}
                    type="submit"
                  >
                    add
                  </Button>
                </>
              </Tab>

              {/* <Tab
                eventKey="values"
                title={
                  <div>
                    <span>Values</span>
                  </div>
                }
              >
                <div className="value-modal-coustom2">
                  <div className="form-group form-group-numb-block">
                    <h5>Scholarship</h5>
                    <div className="form-numb-group-holder">
                      <div className="form-number-group">
                        <Form.Label>Roles and Activities</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="sc_roles"
                          value={collegeForm.sc_roles}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.sc_roles
                            ? "Please enter value from 1 to 100"
                            : "Roles and Activities are required."}
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-number-group">
                        <Form.Label>Honors and Awards</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="sc_honors"
                          value={collegeForm.sc_honors}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.sc_honors
                            ? "Please enter value from 1 to 100"
                            : "Honors and Awards are required."}
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                  <div className="form-group form-group-numb-block">
                    <h5>Leadership</h5>
                    <div className="form-numb-group-holder">
                      <div className="form-number-group">
                        <Form.Label>Roles and Activities</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="ld_roles"
                          value={collegeForm.ld_roles}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.ld_roles
                            ? "Please enter value from 1 to 100"
                            : "Roles and Activities are required."}
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-number-group">
                        <Form.Label>Honors and Awards</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="ld_honors"
                          value={collegeForm.ld_honors}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.ld_honors
                            ? "Please enter value from 1 to 100"
                            : " Honors and Awards are required."}
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                  <div className="form-group form-group-numb-block">
                    <h5>Citizenship</h5>
                    <div className="form-numb-group-holder">
                      <div className="form-number-group">
                        <Form.Label>Roles and Activities</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="ct_roles"
                          value={collegeForm.ct_roles}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.ct_roles
                            ? "Please enter value from 1 to 100"
                            : "Roles and Activities are required."}
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-number-group">
                        <Form.Label>Honors and Awards</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="ct_honors"
                          value={collegeForm.ct_honors}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.ct_honors
                            ? "Please enter value from 1 to 100"
                            : "Honors and Awards are required."}
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                  <div className="form-group form-group-numb-block">
                    <h5>Sportsmanship</h5>
                    <div className="form-numb-group-holder">
                      <div className="form-number-group">
                        <Form.Label>Roles and Activities</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="sp_roles"
                          value={collegeForm.sp_roles}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.sp_roles
                            ? "Please enter value from 1 to 100"
                            : "Roles and Activities are required."}
                        </Form.Control.Feedback>
                      </div>
                      <div className="form-number-group">
                        <Form.Label>Honors and Awards</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="number"
                          placeholder="0"
                          required
                          onChange={handleInputChange}
                          name="sp_honors"
                          value={collegeForm.sp_honors}
                          max={100}
                          min={1}
                        />
                        <span className="number-percent">Points</span>
                        <Form.Control.Feedback type="invalid">
                          {collegeForm.sp_honors
                            ? "Please enter value from 1 to 100"
                            : "Honors and Awards are required."}
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab> */}
            </Tabs>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            handleClick();
          }}
        >
          {props.selectedUniData?.id ? "Update" : "Add"}
        </Button>
        {/* <span className="add-another">Add Another</span> */}
      </Modal.Footer>
    </Modal>
  );
};

export default AddCollege;
