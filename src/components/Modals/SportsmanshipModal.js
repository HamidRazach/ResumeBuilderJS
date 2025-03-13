import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import {
  femaleSports,
  getModalData,
  maleSport,
  participationLevel,
} from "../../constant/commonUtils";
import { useLocation } from "react-router-dom";
import MultiSelectDropDown from "../multiselectdropdown/MultiSelectDropDown";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage, errorMessage } from "../../Errors/Toast";
import AnswerAddlisting from "../../CommonComponent/AnswerAddlisting";
import { useSelector } from "react-redux";
const SportsmanshipModal = (props) => {
  const location = useLocation();
  const genderSelector = useSelector(state => state.rootReducer)

  const [dropdownId, setdropdownId] = useState(
    genderSelector?.user?.gender === "male"
      ? maleSport[0].id
      : femaleSports[0].id
  );
  const [gradesInvolved, setGradesInvolved] = useState(["9"]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  // const [participationLevelId, setParticipationLevelId] = useState(
  //   props.questionDetailEdit
  //     ? props.questionDetailEdit?.sport
  //     : participationLevel[0].id
  // );
  const [participationLevelId, setParticipationLevelId] = useState(participationLevel[0].id);
  const [validated, setValidated] = useState(false);
  const dropdownRef = useRef(null);

  const tokenSelector = useSelector(state => state.rootReducer?.user?.token);
  const [activities, setActivities] = useState([]);


  const buttonRef = useRef(null);

  const [formData, setFormData] = useState({
    activityName: "",
    weeksPerYear: "",
    hoursPerWeek: "",
  });
  const handleDropdownChange = (id) => {
    setdropdownId(id);
  };
  const handleDropdownPart = (id) => {
    setParticipationLevelId(id);
  };

  const SuggestedList =
    genderSelector?.user?.gender === "male" ? maleSport : femaleSports;


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || value.startsWith("0")) {
      setFormData({
        ...formData,
        [name]: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


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
      setValidated(false);
      // setIsDisable(true);
      answer_questions();
    }
  };


  const handleReset = () => {
    setFormData({
      activityName: "",
      weeksPerYear: "",
      hoursPerWeek: "",
    });
    setGradesInvolved(["9"]);
  };

  useEffect(() => {
    // if (location.pathname === "/onboarding") {
    //   const index = props.selectedQuestionArray?.findIndex(
    //     (item) => item.q_id === props.showData?.id
    //   );

    //   if (index !== -1) {
    //     // If ID exists, set form data with values from selectedQuestionArray
    //     const matchedQuestion = props.selectedQuestionArray[index];
    //     setFormData({
    //       // gradesInvolved: matchedQuestion.grade,
    //       weeksPerYear: matchedQuestion.weeks,
    //       hoursPerWeek: matchedQuestion.hours,
    //     });
    //     setGradesInvolved(matchedQuestion.grade);
    //     setParticipationLevelId(matchedQuestion.level);
    //     setdropdownId(matchedQuestion.sport);
    //     // setdropdownId(id);
    //   }
    // }

    // if (props.questionDetailEdit) {
    //   setFormData({
    //     // gradesInvolved: props.questionDetailEdit?.grades,
    //     weeksPerYear: props.questionDetailEdit?.weeks,
    //     hoursPerWeek: props.questionDetailEdit?.hours,
    //   });
    //   setGradesInvolved(props.questionDetailEdit?.grades.split(","));
    //   setParticipationLevelId(props.questionDetailEdit?.level);
    //   setdropdownId(props.questionDetailEdit?.sport);

    // }


    if (props.questionDetailEdit && props.questionDetailEdit.length > 0) {
      const newActivities = props.questionDetailEdit.map((item) => ({
        activityName: item.answer,
        weeksPerYear: item.weeks,
        hoursPerWeek: item.hours,
        gradesInvolved: item.grades,
        id: item.id,
        participationLevelId: item.accomplishment,
        dropdownId: item.sport,
      }));

      setActivities(newActivities);
    }


    if (props.showData) {
      const newActivities = props.showData.answers.map((item) => ({
        activityName: item.answer,
        weeksPerYear: item.weeks,
        hoursPerWeek: item.hours,
        gradesInvolved: item.grades,
        id: item.id,
        participationLevelId: item.accomplishment,
        dropdownId: item.sport,
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
    //   // setParticipationLevelId('');
    //   // setdropdownId(props.questionDetailEdit?.level);
    // }
    // eslint-disable-next-line 
  }, [props.questionDetailEdit, props.showData]);
  const answer_questions = () => {
    const payload = new FormData();

    payload.append("q_id", props.showData?.id ? props.showData?.id : ""); // Assuming props.showData.id exists and is valid
    payload.append(
      "grade",
      gradesInvolved?.length > 0 ? gradesInvolved.toString(",") : gradesInvolved
    );
    payload.append("weeks", formData.weeksPerYear);
    payload.append("hours", formData.hoursPerWeek); // This seems to be correct assuming it represents hours per week
    payload.append("sport", dropdownId); // This seems to be correct assuming it represents hours per week
    payload.append("level", participationLevelId); // This seems to be correct assuming it represents hours per week
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
          // if (location.pathname === "/onboarding") {
          //   const newQuestion = {
          //     q_id: props.showData?.id,
          //     grade: gradesInvolved,
          //     weeks: formData.weeksPerYear,
          //     hours: formData.hoursPerWeek,
          //     label: "plaground",
          //     level: participationLevelId,
          //     sport: dropdownId,
          //   };

          //   // Check if the ID already exists
          //   const index = props.selectedQuestionArray.findIndex(
          //     (item) => item.q_id === newQuestion.q_id
          //   );

          //   if (index !== -1) {
          //     // If ID exists, replace the object
          //     props.setSelectedQuestionArray((prevIds) => {
          //       const newArray = [...prevIds];
          //       newArray[index] = newQuestion;
          //       return newArray;
          //     });
          //   } else {
          //     // If ID doesn't exist, push the new object
          //     props.setSelectedQuestionArray((prevIds) => [
          //       ...prevIds,
          //       newQuestion,
          //     ]);
          //   }
          // }
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
          setIsDisable(false)

        }
      })
      .catch((err) => {
        setIsDisable(false);
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

  //  const deleteActivity = (data) => {
  //   const updatedActivities = activities.filter((item) => item.id !== data.id);
  //   setActivities(updatedActivities);
  //   delete_answer(data.id)
  // };

  useEffect(() => {

    if (props.showData.title) {
      setFormData({
        activityName: props.showData.title
      })
    }
  }, [props.showData])



  return (
    <Modal
      className="custom-modal1 custom-modal2 question-modal-block"
      id="sportmanship-modal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        {/* <Modal.Title id="contained-modal-title-vcenter">
            </Modal.Title> */}
        <h4>{props.showData.title}</h4>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            handleReset();
            props.onHide();
          }}
        ></i>
      </Modal.Header>
      <Modal.Body>
        <p>{props.showData.description}</p>
        <div className="sportmanship-from">

          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="custom-form-modal"
          >

            <div className="form-group form-group1">
              <div className="form-group-contain">
                <Form.Label htmlFor="sport">Type</Form.Label>
                <div className="custom-form-slect-field">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dropdownId &&
                        SuggestedList.find((item) => item.id === dropdownId)
                          ?.title}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {SuggestedList.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleDropdownChange(item.id)}
                        >
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="form-group-contain">
                <Form.Group
                  controlId="weeksPerYear"
                  className="competition-modal-fields"
                >
                  <Form.Label>Sport</Form.Label>
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

            <div className="form-group form-group1 Involved-from">
              <div className="form-group-contain">


                <div className="form-group">
                  <Form.Label htmlFor="grades">Grades Involved</Form.Label>
                  <button
                    style={{ width: "-webkit-fill-available" }}
                    className="btn btn-secondary dropdown-toggle custom-multiselect-dropdwn"
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

              </div>
              <div className="form-group-contain">
                <Form.Label htmlFor="Accomplishment">
                  Participation Level
                </Form.Label>
                <div className="custom-form-slect-field">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="Accomplishment">
                      {participationLevelId &&
                        participationLevel.find(
                          (item) => item.id === participationLevelId
                        )?.title}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {participationLevel.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleDropdownPart(item.id)}
                        >
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="form-group form-group1 sprtsmodal-three-fields-block">
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
          </Form>
        </div>
        <AnswerAddlisting
          activities={activities}
          setActivities={setActivities}
          handleDelete={delete_answer}

        />

      </Modal.Body>
      {/* <Modal.Footer>
        <Button
          onClick={() => {
            handleClick();
          }}
          disabled={isDisable}

        >
          Add
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default SportsmanshipModal;
