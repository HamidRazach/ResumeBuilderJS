import React, { useState, useEffect } from "react";
import Footer from "../footer/Footer";
import { pathFinderLogo } from "../../constant/images";
import { useLocation, useNavigate } from "react-router-dom";
import commonApi from "../../CommonApi/CommonServices";
import {
  FirstStepList,
  getColleges,
  scholarshipDropdown,
  ScndStepList,
  statusChange,
} from "../../constant/commonUtils";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { useDispatch, useSelector } from "react-redux";
import { onBoarding } from "../../Redux/LoginAction";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";
import { url_action } from "../../Redux/URLAction";
// import { AutoComplete } from "rsuite";
import {
  FormControl,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { onBoarding_Data } from "../../Redux/OnboardingAction";
import DropdownDashboard from "../tabs/DropdownDashboard";
import {
  add_colleges_Action,
  add_remove_colleges_Action,
  remove_colleges_Action,
  update_status_Action,
} from "../../Redux/CollegesAction";
import { pricing_type } from "../../Redux/PricingAction";
import { video_model } from "../../Redux/VideoModelAction";

const Onboarding = () => {
  const [onbordingStep, setOnbordingStep] = useState(1);
  const [onboardingQuestion, setOnboardingQuestion] = useState([]);
  const [stepOneSelectedId, setStepOneSelectedId] = useState("");
  const [stepTwoSelectedId, setStepTwoSelectedId] = useState("");
  const [step3to6SelectedIds, setStep3to6SelectedIds] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [questionDetail, setQuestionDetail] = useState({});
  const [selectedQuestionArray, setSelectedQuestionArray] = useState([]);
  const [modalShow1, setModalShow1] = useState(false);
  const [step1SelectedIds, setStep1SelectedIds] = useState([]);
  const [step2SelectedIds, setStep2SelectedIds] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // List of suggestions from API
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const user_grade = useSelector((state) => state.payment_reducer);
  const answers = useSelector((state) => state.OnboardingReducer.data);
  const collegesData = useSelector((state) => state.CollegesReducer.data);
  const grade = user_grade?.type?.grade;

  const navigate = useNavigate();

  const handleStep3to6SelectedIds = (id) => {
    // Check if the ID already exists in the array
    if (!step3to6SelectedIds.includes(id)) {
      // If not, push the ID into the array
      setStep3to6SelectedIds((prevIds) => [...prevIds, id]);
    }
  };
  const handleStep1SelectedIds = (item) => {
    // Set the state to an array containing only the new ID
    setStep1SelectedIds([item.id]);
  };
  const handleStep2SelectedIds = (item) => {
    // Set the state to an array containing only the new ID
    setStep2SelectedIds([item.id]);
  };

  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  useEffect(() => {
    // questions_onboard();
    dispatch(url_action(location.pathname));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setSearchQuery("")
    setDropdownVisible(false)
    // eslint-disable-next-line
  }, [onbordingStep]);

  // useEffect(() => {
  //   if (onbordingStep === 3) {
  //     search_onboard_questions();
  //   } else {
  //     setPageNumber(1);
  //     // search_onboard_colleges();
  //   }

  //   // eslint-disable-next-line
  // }, [searchQuery]);


  const handle = (id) => {
    if (onbordingStep === 3) {
      navigate("/journey");
      dispatch(onBoarding());
      dispatch(video_model(false));
    } else {
      if (!id && stepOneSelectedId === "" && onbordingStep === 1) {
        errorMessage("Please select one ");
      } else {
        setOnbordingStep(onbordingStep + 1);
      }
    }
  };

  const onboard = (scndid, firstId) => {
    const formData = new FormData();

    // Append the fields from the data object to the FormData object
    formData.append("grade", firstId);
    formData.append("college_preference", scndid);

    commonApi
      .onboard(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          if (!grade) {
            handle(firstId, scndid);
          }
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const search_onboard_colleges = (page, search) => {
    const formData = new FormData();

    formData.append("search", search);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);

    commonApi
      .search_universities(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];
          const filteredQuestions =
            fetchedData.length > 0
              ? fetchedData.filter(
                (question) =>
                  !collegesData.some((answer) => answer.id === question.id)
              )
              : [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (filteredQuestions.length > 0) {
                setSuggestions((prevData) => [
                  ...prevData,
                  ...filteredQuestions,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setSuggestions(filteredQuestions);
              setPageNumber(page); // Reset page number for next page fetch
            }
            setDropdownVisible(true);
          } else if (filteredQuestions.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setSuggestions([]);
            setDropdownVisible(false);
          } else if (filteredQuestions.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
          }
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const search_onboard_questions = (search) => {
    const formData = new FormData();

    formData.append("search", search);

    commonApi
      .search_onboard_questions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          if (res.questions.length > 0) {
            const filteredQuestions = res?.questions.filter(
              (question) => !answers.some((item) => item.id === question.id)
            );

            if (filteredQuestions) {
              setSuggestions(filteredQuestions);
            }

            setDropdownVisible(true);
          } else {
            setDropdownVisible(false);
          }
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleOpenModel = (item) => {
    if (item.category === "sportsmanship") {
      setQuestionDetail(item);
      setModalShow1(true);
    } else {
      setQuestionDetail(item);
      setModalShow(true);
    }

    if (!step3to6SelectedIds.includes(item.id)) {
      // If not, push the ID into the array
      save_question(item.id);
    }
  };

  useEffect(() => {
    if (grade) {
      setStep1SelectedIds([grade]);
      setStepOneSelectedId(grade);
      onboard("", grade);
    }
    // eslint-disable-next-line
  }, [grade]);

  const handleSearchChange = (value) => {
    if (onbordingStep === 3) {
      search_onboard_questions(value);
    } else {
      setPageNumber(1);
      search_onboard_colleges(1, value);
    }
    setSearchQuery(value);
    // if (value.trim() !== "") {
    //   // search_onboard_questions();
    // } else {
    //   setSuggestions([]);
    // }
  };

  const handleSelectSuggestion = (value) => {
    setSearchQuery("");
    setSuggestions([]);
    setDropdownVisible(false);
    if (onbordingStep === 3) {
      handleOpenModel(value);
    } else {
      select_university(value, "add");
    }
  };

  const step1 = () => {
    return (
      <div className="competitive-boxes">
        {FirstStepList.map((item, index) => (
          <div
            className={`competitive-box ${step1SelectedIds.includes(item.id) ? "active_tab" : ""
              }`}
            key={index}
            onClick={() => {
              setStepOneSelectedId(item.id);
              handle(item.id);
              onboard(stepTwoSelectedId, item.id);
              handleStep1SelectedIds(item);
              dispatch(pricing_type("", "", item.id));
            }}
          >
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    );
  };

  const step3 = (item, index) => {
    return (
      <>
        <div
          style={{
            position: 'relative',
            display: 'block',
          }}>
          <span className="icon-rounded"
            onClick={() => {
              select_university(item, "remove");
            }}
            style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '5px 7px',
              lineHeight: '10px',
              borderRadius: '15px',
            }}
          ><i class="fa-solid fa-xmark"></i></span>
          <div
            className={`course-section ${"active"}`}
            key={index}
            style={{ maxWidth: "400px", width: "400px" }}
          >
            <p
              className="two-line-text"
              onClick={() => {
                // Step3to6SelectedIds(item.id);
                // handleOpenModel(item);

              }}
            >
              {/* {fixOnboardingTitle(item.title)} */}
              {item.title}
            </p>

            <DropdownDashboard
              type="onboarding"
              dropdownListing={scholarshipDropdown}
              dropdownSelectedId={item}
              handleDropdownChange={handleDropdownChange}
              placeholder="ddd"
              itemName={"title"}
            />
          </div>
        </div>
      </>
    );
  };

  const handleScroll = (e) => {
    if (onbordingStep === 3) {
      return false;
    }
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      search_onboard_colleges(pageNumber + 1, searchQuery);
      // Call the function to load more data or handle pagination
    }
  };

  const step2 = (item, index) => {
    return (
      <><div
        style={{
          position: 'relative',
          display: 'block',

        }}>
        <span className="icon-rounded"
          onClick={() => {
            delete_answer(item)
          }}
          style={{
            position: 'absolute',
            top: '-12px',
            left: '-12px',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '5px 7px',
            lineHeight: '10px',
            borderRadius: '15px',
          }}
        ><i class="fa-solid fa-xmark"></i></span>

        <div
          className={`course-section onboarding-screen-section ${"active"}`}

          key={index}
          style={{ maxWidth: "400px", width: "400px", height: '80px', cursor: 'pointer' }}
        >

          <p className="two-line-text"
            onClick={() => {
              // Step3to6SelectedIds(item.id);
              handleOpenModel(item);
            }}
          >
            {/* {fixOnboardingTitle(item.title)} */}
            {item.title}
          </p>
        </div>
      </div>
      </>
    );
  };

  const handleDropdownChange = (id, selectedValue) => {
    status_change_scholarship(selectedValue, id);
    dispatch(update_status_Action(id, selectedValue));
  };

  const status_change_scholarship = (status, id) => {
    const formData = new FormData();

    formData.append("subject_id", id);
    formData.append("status", status);
    formData.append("type", "university");

    commonApi
      .status_change_colleges_scholarship(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  // const step3 = (item, index) => {



  //   return (
  //     <div
  //       onClick={() => {
  //         // Step3to6SelectedIds(item.id);
  //         // handleOpenModel(item);
  //       }}
  //       className={`course-section ${"active"
  //         }`}
  //       key={index}
  //     >
  //       {item.title}
  //     </div>
  //   );
  // };

  const save_question = (question_id) => {

    const formData = new FormData();

    formData.append("question_id", question_id);
    formData.append("label", "playground");

    commonApi
      .save_question(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          handleStep3to6SelectedIds(question_id);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleDataPush = (newData, answerData) => {
    const updatedAnswers = [...answers]; // Create a copy of the answers state

    // Check if array has any items
    if (updatedAnswers.length > 0) {
      // Find if the item with the same id already exists
      const existingData = updatedAnswers.find(
        (item) => item.id === newData.id
      );

      if (existingData) {
        // Check if the answers array exists and has length
        if (existingData.answers && existingData.answers.length > 0) {
          // Check if the answers array already contains the answer with the same answer_id
          const answerIndex = existingData.answers.findIndex(
            (ans) => ans.id === answerData.id
          );

          if (answerIndex !== -1) {
            // If answer with the same answer_id exists, replace it
            existingData.answers[answerIndex] = answerData;
          } else {
            // If answer_id does not exist, push the new answer
            existingData.answers.push(answerData);
          }
        } else {
          // If the answers array is empty or does not exist, push the first answer
          existingData.answers = [answerData];
        }
      } else {
        // If the item doesn't exist, add the answer to the answers array and push the whole object
        newData.answers.push(answerData);
        updatedAnswers.push(newData);
      }
    } else {
      // If the array has no items, push the answer to the answers array and add the whole object
      newData.answers.push(answerData);
      updatedAnswers.push(newData);
    }
    dispatch(onBoarding_Data(updatedAnswers));
  };

  const select_university = (data, type) => {
    const formData = new FormData();

    formData.append("university_id", data.id);

    commonApi
      .select_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          if (type === "remove") {
            dispatch(remove_colleges_Action(data.id));
          } else {
            dispatch(add_colleges_Action(data));
          }

          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };



  // const getAnswerIds = (data) => {
  //   return data.answers.map(answer => answer.id);
  // };
  const delete_answer = (data) => {

    // const answerIds = getAnswerIds(data);



    const payload = new FormData();

    payload.append('question_id', data.id);

    commonApi
      .delete_answers(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          successMessage(res.message)

          const updatedActivities = answers.filter((item) => item.id !== data.id);
          dispatch(onBoarding_Data(updatedActivities));

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
    <>
      <div className="on-boarding-screens">
        <div className="leadership-block green-screen">
          <div className="leadership-block-contain">
            <div className="leadership-block-holder">
              <div className="logo-holder">
                <img src={pathFinderLogo} alt="path-finder-logo" />
              </div>
            </div>
            <div className="leadership-txt-contain">
              <h3>
                {" "}
                {
                  onbordingStep === 1
                    ? "Let’s start with the basics"
                    : onbordingStep === 2
                      ? "Share your dream schools"
                      : "Share more about your experience"
                  // : onbordingStep === 4
                  // ? "Share more about your Scholarship experience"
                  // : onbordingStep === 5
                  // ? "Share more about your Citizenship experience"
                  // : onbordingStep === 6
                  // ? "Share more about your Sportsmanship experience"
                  // : "Leadership"
                }
              </h3>
              {/* {onbordingStep !== 1 && <h3>Share your dream schools</h3>} */}
            </div>
            <div className="next-line-holder">
              <span className={onbordingStep === 1 && "active"}></span>
              <span className={onbordingStep === 2 && "active"}></span>
              <span className={onbordingStep === 3 && "active"}></span>
              {/* <span className={onbordingStep === 4 && "active"}></span>
              <span className={onbordingStep === 5 && "active"}></span>
              <span className={onbordingStep === 6 && "active"}></span> */}
            </div>

            <div className="skip-holder mt-4">
              <h4>
                {" "}
                {onbordingStep === 1
                  ? "What year are you in high school?"
                  : onbordingStep === 2
                    ? "What type of colleges are you interested in?"
                    : "Please answers so we can suggest you colleges"}
              </h4>

              <strong
                className="as-link"
                onClick={() => {
                  if (onbordingStep !== 1) {
                    handle();
                  }
                }}
              >
                {onbordingStep !== 1 && " Skip"}
              </strong>
            </div>

            <>
              {onbordingStep === 1 && step1()}

              {(onbordingStep === 3 || onbordingStep === 2) && (
                <div
                  className="autocomplete-search-container"
                  style={{
                    maxWidth: "500px",
                    minWidth: "500px",
                    margin: "auto",
                    position: "relative",
                    paddingBottom: "10px",
                  }}
                >
                  <InputGroup>
                    <FormControl
                      type="text"
                      placeholder={
                        onbordingStep === 2
                          ? "Search for colleges you would like to attend"
                          : "Search for questions you would like to answers"
                      }
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)} // Update query on user input
                      aria-label="Search"
                    />
                  </InputGroup>

                  {isDropdownVisible && suggestions.length > 0 && (
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        margin: 0,
                        marginTop: "0px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        position: "absolute",
                        width: "100%",
                        maxHeight: "200px", // Set maximum height for scroll
                        overflowY: "auto", // Enable vertical scrolling
                        zIndex: 1000,
                      }}
                      onScroll={handleScroll}
                    >
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.id}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ddd",
                            cursor: "pointer",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          {suggestion.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="course-slection-block mt-3">
                {onbordingStep === 2 &&
                  collegesData &&
                  collegesData.length > 0 &&
                  collegesData?.map((step, index) => step3(step, index))}

                {onbordingStep === 3 &&
                  answers &&
                  answers.length > 0 &&
                  answers?.map((step, index) => step2(step, index))}
                {/* {onbordingStep === 3 &&
                  answers?.length > 0 &&
                  answers?.map((step, index) =>
                    step3(step, index)
                  )} */}

                {/* {onbordingStep === 4 &&
                  onboardingQuestion &&
                  onboardingQuestion?.scholarship?.map((step, index) =>
                    step3(step, index)
                  )} */}
                {/* {onbordingStep === 5 &&
                  onboardingQuestion &&
                  onboardingQuestion?.citizenship?.map((step, index) =>
                    step3(step, index)
                  )} */}
                {/* {onbordingStep === 6 &&
                  onboardingQuestion &&
                  onboardingQuestion?.sportsmanship?.map((step, index) =>
                    step3(step, index)
                  )} */}
              </div>
            </>
          </div>
        </div>
        <Footer
          setOnbordingStep={setOnbordingStep}
          onbordingStep={onbordingStep}
          handle={handle}
        />
      </div>
      {modalShow && (
        <QuetionsModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
          showData={questionDetail}
          answersArray={handleDataPush}
          // deleteAnswer={deleteAnswer}
          // answers={answers}
          answers={answers}
          questionsListing={suggestions}
          // Step3to6SelectedIds={handleStep3to6SelectedIds}
          // setSelectedQuestionArray={setSelectedQuestionArray}
          selectedQuestionArray={selectedQuestionArray}
          type='onboarding'
        />
      )}
      {modalShow1 && (
        <SportsmanshipModal
          show={modalShow1}
          onHide={() => {
            setModalShow1(false);
          }}
          showData={questionDetail}
          answersArray={handleDataPush}
          answers={answers}
          questionsListing={suggestions}
          // Step3to6SelectedIds={handleStep3to6SelectedIds}
          setSelectedQuestionArray={setSelectedQuestionArray}
          selectedQuestionArray={selectedQuestionArray}
        />
      )}
    </>
  );
};

export default Onboarding;
