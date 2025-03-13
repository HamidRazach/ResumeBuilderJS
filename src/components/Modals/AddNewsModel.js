
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import RichEditor from "./RichEditor";
import { errorMessage, successMessage } from "../../Errors/Toast";
import commonApi from "../../CommonApi/CommonServices";
import { useSelector } from "react-redux";
import { updateQuestions } from "../../constant/commonUtils";

const AddNewsModel = (props) => {
  const {questionDetail, handleNews} = props;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
  });


  useEffect(()=>{
    if(questionDetail){
      setFormData({
        title: questionDetail.title,
        description: questionDetail.description,
        link: questionDetail.link,
    });
    }
  },[questionDetail])

  const [validated, setValidated] = useState(false);

  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditorChange = (content) => {
      setFormData({
        ...formData,
        description: content,
      });
    
  };


  const handleSubmit = (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false || !formData.description || formData.description === '<p><br></p>' || formData.description === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);

    } else if(formData.description === '<br>'){

  e.preventDefault();
  e.stopPropagation();
  setValidated(true);
    }else {
      e.preventDefault();
      setValidated(false);
      if(questionDetail.id){
        update_news()
      }else{
        add_news()
      }
      props.onHide();
    }
    setValidated(true);
  };

  const add_news = () => {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("link", formData.link);
    payload.append("description", formData.description);
    
    commonApi
      .add_news(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message)
          handleNews(res?.data, 'add')
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };


  const update_news = () => {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("link", formData.link);
    payload.append("description", formData.description);
    payload.append("news_id", questionDetail.id);
    
    commonApi
      .update_news(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
        handleNews(res.data, 'update')
        successMessage(res.message)
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
      id="newfrommodal"
      className="custom-modal1 custom-modal2 resume-modal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
        <h4>{questionDetail.id ? "Update News" : "Add News"}</h4>
        </Modal.Title>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="link-section">
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
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
            {formData.title ?
            "Please avoid space in start"
            : 'Please provide a title'}
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
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid link.
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Form.Group controlId="formDescription" className="Description-section">
            <Form.Label>Description</Form.Label>
            <RichEditor
              value={formData.description}
              onChange={handleEditorChange}
              className="description-form"
            />
            {!formData.description && validated && (
              <div className="invalid-feedback d-block">
                Please provide a description.
              </div>
            )}
          </Form.Group> */}


          <Form.Group controlId="formDescription" className="Description-section">
            <Form.Label>Description</Form.Label>
            <RichEditor
              value={formData.description}
              name="description-form"
              onChange={handleEditorChange}
              className="description-form"
            />
            {validated && !formData.description ? (
            <div className="invalid-feedback d-block">
            Please provide a description
            </div>
            )
          :  (validated && formData.description === '<br>') &&
          (
          <div className="invalid-feedback d-block">
            Please provide a description
            </div>
          )}
          </Form.Group>



          <Button type="submit" className="mt-3">
          {questionDetail.id ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewsModel;
