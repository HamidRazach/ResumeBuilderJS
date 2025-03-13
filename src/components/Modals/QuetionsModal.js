import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import commonApi from "../../CommonApi/CommonServices";

import { useLocation } from "react-router-dom";
import MultiSelectDropDown from "../multiselectdropdown/MultiSelectDropDown";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { useDispatch, useSelector } from "react-redux";
import AnswerAddlisting from "../../CommonComponent/AnswerAddlisting";
import { getModalData } from "../../constant/commonUtils";
import { onBoarding_Data } from "../../Redux/OnboardingAction";
const QuetionsModal = (props) => {
  const [formData, setFormData] = useState({
    // gradesInvolved: "",
    weeksPerYear: "",
    hoursPerWeek: "",
    activityName: '',
  });
  const [validated, setValidated] = useState(false);
  const [gradesInvolved, setGradesInvolved] = useState(["9"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const dropdownRef = useRef(null);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const [activities, setActivities] = useState([])
  const dispatch = useDispatch()

  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    // if (location.pathname === "/onboarding") {
    //   const index = props.selectedQuestionArray?.findIndex(
    //     (item) => item.q_id === props.showData?.id
    //   );
    //   if (index !== -1) {

    //     const matchedQuestion = props.selectedQuestionArray[index];
    //     setFormData({

    //       weeksPerYear: matchedQuestion.weeks,
    //       hoursPerWeek: matchedQuestion.hours,
    //     });
    //     setGradesInvolved(matchedQuestion.grade);
    //   }
    // }

    // if (props.questionDetailEdit) {
    //   setFormData({
    //     activityName: props.questionDetailEdit?.answer,
    //     weeksPerYear: props.questionDetailEdit?.weeks,
    //     hoursPerWeek: props.questionDetailEdit?.hours,
    //   });
    //   setGradesInvolved(props.questionDetailEdit?.grades.split(","));
    // }
    if (props.questionDetailEdit && props.questionDetailEdit.length > 0) {
      const newActivities = props.questionDetailEdit.map((item) => ({
        activityName: item.answer,
        weeksPerYear: item.weeks,
        hoursPerWeek: item.hours,
        gradesInvolved: item.grades,
        id: item.id
      }));

      setActivities(newActivities);
    }

    if (props.showData) {
      const newActivities = props.showData.answers.map((item) => ({
        activityName: item.answer,
        weeksPerYear: item.weeks,
        hoursPerWeek: item.hours,
        gradesInvolved: item.grades,
        id: item.id
      }));

      setActivities(newActivities);
    }

    // if (location.pathname !== "/onboarding" && !props.questionDetailEdit) {
    //   setFormData({
    //     activityName: "",
    //     weeksPerYear: "",
    //     hoursPerWeek: "",
    //   });
    //   setGradesInvolved(["9"]);
    // }


    // if(props.questionDetailEdit){
    //   setFormData({
    //     activityName: props.showData?.title
    //   })
    // }

    // eslint-disable-next-line
  }, [props.questionDetailEdit, props.showData]);

  useEffect(() => {
    setFormData({
      activityName: props.showData?.title
    })
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();

      setValidated(true);
    } else {
      e.preventDefault();
      // setIsDisable(true);
      setValidated(false);
      answer_questions();
    }
  };


  const handleReset = () => {
    setFormData({
      // gradesInvolved: "",
      weeksPerYear: "",
      hoursPerWeek: "",
      activityName: ""
    });
    setGradesInvolved(["9"]);
  };

  const answer_questions = () => {
    const payload = new FormData();

    payload.append("q_id", props.showData?.id ? props.showData?.id : ""); // Assuming props.showData.id exists and is valid
    payload.append(
      "grade",
      gradesInvolved?.length > 0 ? gradesInvolved.toString(",") : gradesInvolved
    );
    payload.append("weeks", formData.weeksPerYear);
    payload.append("hours", formData.hoursPerWeek); // This seems to be correct assuming it represents hours per week
    payload.append(
      "label",
      location.pathname === "/onboarding"
        ? "playground"
        : location.pathname === "/saved"
          ? props.showData?.label
          : location.pathname.replace(/\//g, "")
    );

    payload.append('activity', formData.activityName);

    commonApi
      .answer_questions(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {

          if (
            (location.pathname === "/journey" ||
              location.pathname === "/playground") &&
            !props.questionDetailEdit
          ) {
            const filteredQuestions = props.questionsListing.filter(
              (item) => item.id !== props.showData?.id
            );

            // Now filteredQuestions contains only the items where the ID matches someIdToMatch
            props.setQuestions(filteredQuestions);
          }

          if (location.pathname === "/saved") {
            props.saved_questions_Listing();
          }
          successMessage(res.message);
          handleReset();

          const updatedActivity = getModalData(res.data, activities, props.questionsListing.id);

          setActivities(updatedActivity)

          props.answersArray(props.showData, res.data)

        } else {
          errorMessage(res.message);
          setIsDisable(false);
        }
      })
      .catch((err) => {
        setIsDisable(false);
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const deleteAnswer = (dataArray, questionId, answerId) => {
    // Find the object in the array that matches the given question id
    const existingDataIndex = dataArray.findIndex(item => item.id === questionId);

    if (existingDataIndex !== -1) {
      const existingData = dataArray[existingDataIndex];

      // Check if answers array exists and has length
      if (existingData.answers && existingData.answers.length > 0) {
        // Find the index of the answer that matches the given answerId
        const answerIndex = existingData.answers.findIndex(answer => answer.id === answerId);

        if (answerIndex !== -1) {
          // Remove the answer from the answers array
          existingData.answers.splice(answerIndex, 1);

          // After deleting, check if answers array is empty
          if (existingData.answers.length === 0) {
            // Remove the entire data object if no answers are left
            dataArray.splice(existingDataIndex, 1);
          }
          if(props.type === 'onboarding'){

            dispatch(onBoarding_Data(dataArray));
          }
        }
      }
    }
  }

  const delete_answer = (data) => {
    const payload = new FormData();

    payload.append('answer_id', data.id);

    commonApi
      .delete_answer(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          successMessage(res.message)

          const updatedActivities = activities.filter((item) => item.id !== data.id);
          setActivities(updatedActivities);

          deleteAnswer(props.answers, props.showData?.id, data.id);

        } else {
          errorMessage(res.message);
          setIsDisable(false);
        }
      })
      .catch((err) => {
        setIsDisable(false);
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  return (
    <Modal
      id="custom-modal"
      className="custom-modal1 question-modal-block"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h4>{props.showData?.title}</h4>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            handleReset();
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        {/* <p>{props.showData?.description}</p> */}

        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="custom-form-modal"
        >
          <p>Share your level of participation</p>

          <>
            <div className="form-group form-group1">
              <div className="form-group-contain">
                <Form.Label htmlFor="grades">Grades Involved</Form.Label>
                <button
                  style={{ width: "-webkit-fill-available" }}
                  className="btn btn-secondary dropdown-toggle custom-multiselect-dropdwn question-multiple-btn"
                  type="button"
                  id="multiSelectDropdown"
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                >
                  {gradesInvolved?.length > 0
                    ? gradesInvolved.toString(",")
                    : "gradesInvolved"}
                </button>
                <MultiSelectDropDown
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  setGradesInvolved={setGradesInvolved}
                  gradesInvolved={gradesInvolved}
                  dropdownRef={dropdownRef}
                />
              </div>
              <div className="form-group-contain">
                <Form.Group
                  controlId="weeksPerYear"
                  className="competition-modal-fields"
                >
                  <Form.Label>Activity Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Activity Name"
                    name="activityName"
                    value={formData.activityName}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    {"Activity Name is required"}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </>

          <div className="form-group form-group1 qmodal-three-fields-block">
            <div className="form-group-contain">
              <Form.Group
                controlId="weeksPerYear"
                className="competition-modal-fields"
              >
                <Form.Label>Weeks/Year</Form.Label>
                <Form.Control
                  type="number"
                  required
                  placeholder="Weeks"
                  name="weeksPerYear"
                  min={1}
                  max={52}
                  value={formData.weeksPerYear}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {formData.weeksPerYear
                    ? "Please enter value 1 to 52"
                    : "Weeks and year is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="form-group-contain form-group-contain-hours-week-pannel">
              <Form.Group
                controlId="hoursPerWeek"
                className="competition-modal-fields"
              >
                <Form.Label>Hours/Week</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min={1}
                  max={40}
                  placeholder="Hours"
                  name="hoursPerWeek"
                  value={formData.hoursPerWeek}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {formData.hoursPerWeek
                    ? "Please enter value 1 to 40"
                    : "Hours and week is required."}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="form-group-contain form-group-contain-sbmt-btn-holder">
              <Button variant="primary" type="submit" disabled={isDisable}>
                {props.questionDetailEdit ? "Edit" : "Add"}
              </Button>
            </div>
          </div>
          <AnswerAddlisting
            activities={activities}
            setActivities={setActivities}
            handleDelete={delete_answer}
            type={'normal_questions'}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default QuetionsModal;
