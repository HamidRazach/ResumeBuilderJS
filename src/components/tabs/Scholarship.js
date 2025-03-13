import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  OverlayTrigger,
  Popover,
  Table,
} from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import {
  cardlisting,
  convertObjectToString,
  scholarshipDropdown,
  statusChange,
  styleComponent,
  formatDeadline,
  getDaysUntilDeadline
} from "../../constant/commonUtils";
import {
  get_notification,
} from "../../Redux/notificationActions";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { scrollAdjust } from "../../constant/commonUtils";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";
import { data_error } from "../../constant/WebText";
import { height_action } from "../../Redux/HeightAction";
import { useDispatch, useSelector } from "react-redux";
import { scroll_action } from "../../Redux/ScrollableAction";
import VedioModal from "../Modals/VedioModal";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import Calendar from "../Dashoard/Calander";
import ViewAll from "../Dashoard/ViewAll";
import MaskUser from "../Dashoard/MaskUser";
import DashboardTab from "./DashboardTab";
import MiniCard from "../Dashoard/MiniCard";
import ScholarshipModal from "../Modals/ScholarshipModal";
import { frame3_icon } from "../../constant/images";
const Scholarship = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [questionDetail, setQuestionDetail] = React.useState("");
  const [questionDetailEdit, setQuestionDetailEdit] = React.useState("");
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const displayVideo = useSelector((state) => state.URL_reducer);
  const adminSelector = useSelector((state) => state.rootReducer);

  const [selectedFalseArray, setSelectedFalseArray] = useState([]);
  const [selectedTrueArray, setSelectedTrueArray] = useState([]);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const chooseUser = useSelector((state) => state.rootReducer);
  const [showAdminModal, setShowAdminModal] = React.useState(false);

  const [scholarshipData, setScholarshipData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownId, setdropdownId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [universityListing, setUniversityListing] = useState([]);
  const [tabtype, setTabtype] = useState("discovered");
  const [scholarshipQuestions, setScholarshipQuestions] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // useEffect(() => {
  //   if (questions?.length > 0) {
  //     const unSelectedData = questions.filter((item) => !item.selected);
  //     setSelectedFalseArray(unSelectedData);

  //     const selectedData = questions.filter((item) => item.selected);
  //     setSelectedTrueArray(selectedData);

  //   } else {
  //     setSelectedFalseArray([]);
  //     setSelectedTrueArray([]);

  //   }
  // }, [questions, searchQuery, tabtype]);

  useEffect(() => {
    setSearchQuery("");
  }, [tabtype]);

  useEffect(() => {
    setSpinnerLoader(true);

    if (tabtype === "discovered") {
      setScholarshipQuestions([])
      get_scholarships(1, searchQuery);
    } else {
      setScholarshipQuestions([])

      selected_scholarships(1, searchQuery);
    }
  }, [searchQuery, tabtype]);

  const [scrollLock, setScrollLock] = useState(false); // To prevent scroll trigger on tab switch

  useEffect(() => {
    // Reset page number and scroll position when switching tabs
    setPageNumber(1);
    setScrollLock(true); // Lock scroll for a brief moment when switching tabs
    document.getElementById("scroll-container-main").scrollTop = 0;

    // Unlock scroll after a small delay
    setTimeout(() => setScrollLock(false), 500);
  }, [tabtype]);

  let debounceTimer = null;

  const handleScroll = (e) => {
    if (scrollLock) return;

    const target = e.target;
  

    const tolerance = 5;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + tolerance;

    if (bottom) {
      clearTimeout(debounceTimer); // Clear the previous timer

      debounceTimer = setTimeout(() => {
        if (tabtype === "discovered") {
          get_scholarships(pageNumber + 1, searchQuery);
        } else {
          selected_scholarships(pageNumber + 1, searchQuery);
        }
      }, 300); // Adjust the debounce delay as needed
    }
  };
  const fetchMoreData = (e) => {
   
      clearTimeout(debounceTimer); // Clear the previous timer

      debounceTimer = setTimeout(() => {
        if (tabtype === "discovered") {
          get_scholarships(pageNumber + 1, searchQuery);
        } else {
          selected_scholarships(pageNumber + 1, searchQuery);
        }
      }, 300); // Adjust the debounce delay as needed
    }
  
  const get_scholarships = (page, search) => {
    const formData = new FormData();

    formData.append("search_query", search);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);

    commonApi
      .get_scholarships(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setScholarshipQuestions((prevData) => [
                  ...prevData,
                  ...fetchedData,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setScholarshipQuestions(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setScholarshipQuestions([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
          }
        }
        setSpinnerLoader(false);
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const selected_scholarships = (page, search) => {
    const formData = new FormData();

    // formData.append("group", dropdownId);
    // formData.append("subcategory", subId);
    formData.append("search_query", search);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    commonApi
      .selected_scholarships(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setScholarshipQuestions((prevData) => [
                  ...prevData,
                  ...fetchedData,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setScholarshipQuestions(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setScholarshipQuestions([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
          }
          setSpinnerLoader(false);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  // const dataPush = (questionId) => {

  //   if(tabtype === 'list'){

  //   const updatedQuestions = scholarshipQuestions.map((question) => {
  //     if (question.id === questionId) {
  //       return { ...question, selected: !question.selected, status: 'none'};
  //     }
  //     return question;
  //   });
  //   setScholarshipQuestions(updatedQuestions);
  // }else if(tabtype === 'select'){

  //   const updatedQuestions = scholarshipQuestions.map((question) => {
  //     if (question.id === questionId) {
  //       return { ...question, selected: !question.selected,status: 'none' };
  //     }
  //     return question;
  //   });
  //   setScholarshipQuestions(updatedQuestions);
  // }

  // };

  // if (selectedFalseArray.length > 0) {
  //   setTimeout(() => {
  //     scrollAdjust();
  //   }, 1500);
  // }
  // if (selectedTrueArray.length > 0) {
  //   setTimeout(() => {
  //     scrollAdjust();
  //   }, 1500);
  // }

  // useEffect(() => {
  //   if (tabtype === "list") {
  //     dispatch(height_action(selectedFalseArray, "list"));
  //   }
  //   // else if (tabtype === "saved") {
  //   //   dispatch(height_action(savedArray, "saved"))
  //   // }
  //   else if (tabtype === "select") {
  //     dispatch(height_action(selectedTrueArray, "select"));
  //   }
  //   // eslint-disable-next-line
  // }, [questions, tabtype]);

  // const reduxHeight = useSelector((state) => state.height_reducer);
  // const dataLength = reduxHeight?.data?.data;

  // const containerRef = useRef(null);
  // const container = containerRef.current;

  // useEffect(() => {
  //   if (dataLength && container) {
  //     setTimeout(() => {
  //       if (container && container.scrollHeight > container.clientHeight) {
  //         dispatch(scroll_action(true));
  //       } else {
  //         dispatch(scroll_action(false));
  //       }
  //     }, 100);
  //   }
  //   // eslint-disable-next-line
  // }, [dataLength, container, questions]);

  const status_change_scholarship = (status, id) => {
    const formData = new FormData();

    formData.append("subject_id", id);
    formData.append("status", status);
    formData.append("type", "scholarship");

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

  const handleDropdownChange = (id, selectedValue) => {
    const updateArray = statusChange(selectedValue, scholarshipQuestions, id);
    setScholarshipQuestions(updateArray);
    status_change_scholarship(selectedValue, id);
  };

  const delete_scholarship = (id) => {
    const payload = new FormData();

    payload.append("id", id);

    commonApi
      .delete_scholarship(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          const newquestions = scholarshipQuestions?.filter(
            (item, index) => item.id !== id
          );
          setScholarshipQuestions(newquestions);

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

  const handleShowModel = (item) => {
    if (item) {
      setScholarshipData(item);
      setShowAdminModal(true);
    } else {
      setShowAdminModal(true);
    }
  };

  // const hanleEditNews = (data, type) => {
  //   if (type === 'update') {
  //     // setQuestions((prevData) =>
  //     //   prevData.map((item) => item.id === data.id ? data : item)

  //     // );
  //     setScholarshipQuestions((prevData) => {
  //       // Remove the item if it exists
  //       const filteredData = prevData.filter((item) => item.id !== data.id);

  //       // Add the edited item to the start of the array
  //       return [data, ...filteredData];
  //     });
  //   } else {
  //     setScholarshipQuestions((prevData) => [data, ...prevData]);
  //   }
  // }

  const select_scholarships = (scholar_id) => {
    const formData = new FormData();

    formData.append("scholarship_id", scholar_id);

    commonApi
      .select_scholarships(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          const filterAnswers =
            scholarshipQuestions &&
            scholarshipQuestions.length > 0 &&
            scholarshipQuestions?.filter(
              (items, index) => items.id !== scholar_id
            );
          setScholarshipQuestions(filterAnswers);

          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleUserAction = (item, type) => {
    if (chooseUser?.user?.user_type === "user") {
      if (type === "select") {
        select_scholarships(item.id);

        const getDeadline = formatDeadline(item.deadline);
        const gteDiffernence = getDaysUntilDeadline(getDeadline);

        if (gteDiffernence <= 10 && gteDiffernence >= 0) {
          dispatch(get_notification(tokenSelector));

        } else {

        }

      }
    } else {
      if (type === "select") {
        handleShowModel(item);
      } else if (type === "delete") {
        delete_scholarship(item.id);
      }
    }
  };

  return (
    <>
      <div className={"line-chart-main-container-user"}>
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-sm-9 pe-4 progress-3">
              <DashboardTab
                handleScroll={handleScroll}
                tabs={
                  chooseUser?.user?.user_type === "user"
                    ? [
                        { name: "Discovered", id: "discovered" },
                        { name: "Selected", id: "select" },
                      ]
                    : [{ name: "Discovered", id: "discovered" }]
                }
                setTabtype={setTabtype}
                tabType={tabtype}
                listing={
                  scholarshipQuestions
                  // chooseUser === 'admin' ?
                  //   questions :
                  //   (tabtype === "list"
                  //     ? selectedFalseArray
                  //     : tabtype === "select" && selectedTrueArray)
                }
                userAction={handleUserAction}
                type={"scholarship"}
                setSearhQuery={setSearchQuery}
                searchQuery={searchQuery}
                handleDropdownChange={handleDropdownChange}
                group={"scholarship"}
                nameClasss={"journey"}
                styleComponent={styleComponent}
                userType={chooseUser?.user?.user_type}
                spinnerLoader={spinnerLoader}
                fetchMoreData={fetchMoreData}
              />
            </div>
            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div>
                <MiniCard
                  handleShowModel={handleShowModel}
                  cardlisting={
                    chooseUser?.user?.user_type === "user"
                      ? [cardlisting[2]]
                      : [{ uperName: "Add Scholarship", img: frame3_icon }]
                  }
                />
              </div>
              <div className="mb-4">
                <Calendar />
              </div>
              <div className="card-group-section">
                <ViewAll />
                {adminSelector?.user?.user_type !== "admin" && <MaskUser />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {modalShow && (
        <QuetionsModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            if (tabtype === "select") {
              selected_questions_listing();
            }
          }}
          showData={questionDetail}
          setQuestions={setQuestions}
          questionsListing={questions}
          questionDetailEdit={tabtype === "select" ? questionDetailEdit : false}
        />
      )}
      {modalShow1 && (
        <SportsmanshipModal
          show={modalShow1}
          onHide={() => {
            setModalShow1(false);
            if (tabtype === "select") {
              props.selected_questions_listing();
            }
          }}
          setQuestions={setQuestions}
          showData={questionDetail}
          questionsListing={questions}
          questionDetailEdit={tabtype === "select" ? questionDetailEdit : false}
        />
      )} */}

      {showAdminModal && (
        <ScholarshipModal
          show={showAdminModal}
          onHide={() => {
            setShowAdminModal(false);
            setScholarshipData([]);
          }}
          // hanleEditNews={(data, type) => { hanleEditNews(data, type) }}
          questionDetail={scholarshipData && scholarshipData}
          setScholarshipQuestions={setScholarshipQuestions}
          scholarshipQuestions={scholarshipQuestions}
        />
      )}
    </>
  );
};

export default Scholarship;
