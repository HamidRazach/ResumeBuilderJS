import React, { useEffect, useRef, useState } from "react";
import { Button, Form, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import {
  cardlisting,
  convertObjectToString,
  DropDownValues,
  getPlainText,
  styleComponent,
  updateQuestions,
} from "../../constant/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import PricingModal from "../Modals/PricingModal";
import { data_error, payment_error_message } from "../../constant/WebText";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";
import { height_action } from "../../Redux/HeightAction";
import { scroll_action } from "../../Redux/ScrollableAction";
import AddNewsModel from "../Modals/AddNewsModel";
import { frame3_icon, redBucket } from "../../constant/images";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import DashboardTab from "./DashboardTab";
import MaskUser from "../Dashoard/MaskUser";
import ViewAll from "../Dashoard/ViewAll";
import Calendar from "../Dashoard/Calander";
import MiniCard from "../Dashoard/MiniCard";

const News = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  const [questionDetailEdit, setQuestionDetailEdit] = useState("");
  const {
    title,
    // questions,
    save_question,
    selectedQuestions,
    // hanleAddNews,
  } = props;
  const [questionDetail, setQuestionDetail] = useState({});
  const userSelector = useSelector((state) => state.rootReducer);
  const [tabtype, setTabtype] = useState("discovered");
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);

  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const chooseUser = useSelector((state) => state.rootReducer);

  const [dropdownId, setdropdownId] = useState(DropDownValues[0].id);
  const [newsListing, setNewsListing] = useState([]);
  const [pageNumber, setPageNumber] = useState([]);
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const popover = (description) => {
    return (
      <Popover id="popover-basic">
        <Popover.Body>{getPlainText(description)}</Popover.Body>
      </Popover>
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleId = (itemId) => {
    save_question(itemId);
  };

  //   useEffect(() => {
  //     if (pricingSelector?.user?.payment_status === false) {
  //       setShowModel(true);
  //     }
  //     // eslint-disable-next-line
  //   }, []);

  // const UnselectedArray = questions;

  // useEffect(() => {
  //   if (tabtype === "discovered") {
  //     dispatch(height_action(UnselectedArray, "discovered"));
  //   }
  //   // else if(tabtype === "saved"){
  //   //   dispatch(height_action(savedArray, "saved"))
  //   // }else if(tabtype === "select"){
  //   //   dispatch(height_action(selectedQuestions, "select"))
  //   // }
  //   // eslint-disable-next-line
  // }, [props.questions, tabtype, selectedQuestions]);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const container = containerRef.current;

  const get_news = (page, search) => {
    const formData = new FormData();

    // formData.append("group", dropdownId);
    // formData.append("subcategory", subId);
    formData.append("search_query", search);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    commonApi
      .get_news(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setNewsListing((prevData) => [...prevData, ...fetchedData]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setNewsListing(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setNewsListing([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
          }
        }
        setSpinnerLoader(false);
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  const [scrollLock, setScrollLock] = useState(false); // To prevent scroll trigger on tab switch

  useEffect(() => {
    // Reset page number and scroll position when switching tabs
    setPageNumber(1);
    setScrollLock(true); // Lock scroll for a brief moment when switching tabs
    document.getElementById("scroll-container-main").scrollTop = 0;

    // Unlock scroll after a small delay
    setTimeout(() => setScrollLock(false), 500);
  }, [searchQuery]);

  let debounceTimer = null;

  const handleScroll = (e) => {
    if (scrollLock) return;

    const target = e.target;
    console.log(
      "scrollHeight:",
      target.scrollHeight,
      "scrollTop:",
      target.scrollTop,
      "clientHeight:",
      target.clientHeight
    );

    const tolerance = 5;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + tolerance;

    if (bottom) {
      clearTimeout(debounceTimer); // Clear the previous timer

      debounceTimer = setTimeout(() => {
        get_news(pageNumber + 1,searchQuery);
        setPageNumber(pageNumber + 1);
      }, 300); // Adjust the debounce delay as needed
    }
  };

  const fetchMoreData = (e) => {
   
      clearTimeout(debounceTimer); // Clear the previous timer

      debounceTimer = setTimeout(() => {
        get_news(pageNumber + 1,searchQuery);

      }, 300); // Adjust the debounce delay as needed
    }
  useEffect(() => {
    // if (adminSelector?.user?.user_type === "user") {
    setSpinnerLoader(true);
    setPageNumber(1);
    get_news(1, searchQuery);

    // }
    // eslint-disable-next-line
  }, [tabtype, searchQuery]);

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
  // }, [dataLength, container, tabtype, props.questions, selectedQuestions]);

  const delete_news = (id) => {
    const payload = new FormData();

    payload.append("news_id", id);

    commonApi
      .delete_news(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          const newquestions = newsListing.filter(
            (item, index) => item.id !== id
          );
          setNewsListing(newquestions);

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

  const openModal = () => {
    setShowNewsModal(true);
  };

  // const hanleEditNews = (data) => {
  //   setNewsListing((prevData) => {
  //     // Remove the item if it exists
  //     const filteredData = prevData.filter((item) => item.id !== data.id);

  //     // Add the edited item to the start of the array
  //     return [data, ...filteredData];
  //   });
  // };
  const handleNews = (data, type) => {
    if (chooseUser?.user?.user_type === "admin") {
      if (type === "add") {
        setNewsListing((prevData) => [data, ...prevData]);
      } else {
        const updateNews = updateQuestions(data, newsListing, "news");
        setNewsListing(updateNews);
      }
    }
  };

  const handleUserAction = (item, type) => {
    if (chooseUser?.user?.user_type === "admin") {
      if (type === "select") {
        setShowNewsModal(true);
        setQuestionDetail(item);
      } else if (type === "delete") {
        delete_news(item.id);
      }
    } else {
      if (type === "select") {
        // setShowNewsModal(true);
        // setQuestionDetail(item);
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
                tabs={[{ name: "Discovered", id: "discovered" }]}
                setTabtype={setTabtype}
                tabType={tabtype}
                listing={newsListing}
                userAction={handleUserAction}
                type={"news"}
                setSearhQuery={setSearchQuery}
                searchQuery={searchQuery}
                userType={chooseUser?.user?.user_type}
                group={"news"}
                styleComponent={styleComponent}
                spinnerLoader={spinnerLoader}
                fetchMoreData={fetchMoreData}
              />
            </div>

            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div>
                <MiniCard
                  handleShowModel={openModal}
                  cardlisting={
                    userSelector?.user?.user_type === "user"
                      ? [cardlisting[2]]
                      : [{ uperName: "Add News", img: frame3_icon }]
                  }
                />
              </div>
              <div className="new-card-group-section">
                <div className="mb-4">
                  <Calendar />
                </div>

                {userSelector?.user?.user_type === "user" && <MaskUser />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalShow1 && (
        <SportsmanshipModal
          show={modalShow1}
          onHide={() => {
            setModalShow1(false);
            if (tabtype === "select") {
              props.selected_questions_listing();
            }
          }}
          setQuestions={setNewsListing}
          showData={questionDetail}
          questionsListing={newsListing}
          questionDetailEdit={tabtype === "select" ? questionDetailEdit : false}
        />
      )}

      <PricingModal
        show={showModel}
        onClose={() => setShowModel(false)}
        setShowModel={setShowModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModel(false)}
      />

      {showNewsModal && (
        <AddNewsModel
          show={showNewsModal}
          onHide={() => {
            setShowNewsModal(false);
            setQuestionDetail({});
          }}
          handleNews={handleNews}
          // hanleEditNews={(data) => {
          //   hanleEditNews(data);
          // }}
          // hanleAddNews={hanleAddNews}
          questionDetail={questionDetail ? questionDetail : {}}
        />
      )}
    </>
  );
};

export default News;
