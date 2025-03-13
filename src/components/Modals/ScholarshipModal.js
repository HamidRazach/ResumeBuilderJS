import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import RichEditor from "./RichEditor";
import { errorMessage, successMessage } from "../../Errors/Toast";
import commonApi from "../../CommonApi/CommonServices";
import { useSelector } from "react-redux";
import { checkDevice, checkDollar, FirstStepList, formatAwardWorth, formatDeadline, updateQuestions } from "../../constant/commonUtils";

const ScholarshipModal = (props) => {
  const { questionDetail, scholarshipQuestions, setScholarshipQuestions } = props;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    offered_by: "",
    award_worth: "",
    deadline: "",
    grade_level: "",
    category: "",
  });

  useEffect(() => {

    checkDevice()
    if (questionDetail.id) {
      setFormData({
        title: questionDetail.title,
        description: questionDetail.description,
        link: questionDetail.link,
        offered_by: questionDetail.offered_by,
        award_worth: questionDetail.award_worth && formatAwardWorth(questionDetail.award_worth),
        deadline: formatDeadline(questionDetail.deadline),
        grade_level: questionDetail.grade_level,
        category: questionDetail.category,
      });
    }
  }, [questionDetail]);

  const [validated, setValidated] = useState(false);

  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'award_worth') {
      // Filter out any invalid characters (including e, E, +, -)
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      if(numericValue){
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    }

    }else{
      console.log(value, 'valuevaluevalue')
      console.log(e, 'eeee')
      setFormData({
        ...formData,
        [name]: value,
      });
    }

   
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      description: content,
    });
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;

    if (
      form.checkValidity() === false ||
      !formData.description ||
      formData.description === "<p><br></p>" ||
      formData.description === " "
    ) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else if (formData.description === "<br>") {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      e.preventDefault();
      setValidated(false);
      if (questionDetail.id) {
        update_scholarship();
      } else {
        add_scholarship();
      }
      props.onHide();
    }
    setValidated(true);
  };

  const add_scholarship = () => {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("link", formData.link);
    payload.append("description", formData.description);
    payload.append("offered_by", formData.offered_by);
    payload.append("award_worth", checkDollar(formData.award_worth));
    payload.append("deadline", formData.deadline);
    payload.append("grade_level", formData.grade_level);
    payload.append("category", formData.category);

    commonApi
      .add_scholarship(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message);
          setScholarshipQuestions((prevData) => [
            res.data,
            ...prevData
            ]);
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const update_scholarship = () => {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("link", formData.link);
    payload.append("description", formData.description);
    payload.append("offered_by", formData.offered_by);
    payload.append("award_worth", checkDollar(formData.award_worth));
    payload.append("deadline", formData.deadline);
    payload.append("grade_level", formData.grade_level);
    payload.append("category", formData.category);
    payload.append("scholarship_id", questionDetail.id);

    commonApi
      .update_scholarship(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {

          const updateUniversity =  updateQuestions(res.data, scholarshipQuestions, 'scholarship')
          setScholarshipQuestions(updateUniversity)
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
  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Function to get today's date + 5 years in YYYY-MM-DD format
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() + 5));
    return maxDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <Modal
      id="newfrommodal"
      className="custom-modal1 custom-modal2 resume-modal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h4>
            {questionDetail.id ? "Update Scholarship" : "Add Scholarship"}
          </h4>
        </Modal.Title>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="link-section"
        >
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter news title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              pattern="^\S.*"
                 autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.title
                ? "Please avoid space in start"
                : "Please provide a title"}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formLink">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter news link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid link.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="formDescription"
            className="Description-section"
          >
            <Form.Label>Description</Form.Label>
            <RichEditor
              value={formData.description}
              name="description-form"
              onChange={handleEditorChange}
              className="description-form"
              autocomplete='off'
            />
            {validated && !formData.description ? (
              <div className="invalid-feedback d-block">
                Please provide a description
              </div>
            ) : (
              validated &&
              formData.description === "<br>" && (
                <div className="invalid-feedback d-block">
                  Please provide a description
                </div>
              )
            )}
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Offered </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Offered"
              name="offered_by"
              value={formData.offered_by}
              onChange={handleChange}
              required
              pattern="^\S.*"
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.offered_by
                ? "Please avoid space in start"
                : "Please provide a offered"}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Award Worth</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Award Worth"
              name="award_worth"
              value={formData.award_worth}
              onChange={handleChange}
              required
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.award_worth
                ? "Please provide a valid award worth"
                : "Please provide a award worth"}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Deadline </Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter Deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={getTodayDate()} // Set the minimum date to today's date
              max={getMaxDate()} // Set the maximum date to 5 years from now
              required
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.deadline ?
              'Please provide a valid deadline'
              :
              'Please provide a deadline'
                }
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Grade Level</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Grade Level"
              name="grade_level"
              value={formData.grade_level}
              onChange={handleChange}
              required
              pattern="^\S.*"
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.grade_level
                ? "Please avoid space in start"
                : "Please provide a grade"}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              pattern="^\S.*"
              autocomplete='off'
            />
            <Form.Control.Feedback type="invalid">
              {formData.category
                ? "Please avoid space in start"
                : "Please provide a category"}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="mt-3">
            {questionDetail.id ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ScholarshipModal;
