import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Topbar from "../siderbar/Topbar";
import ResponsiveSidebar from "../siderbar/ResponsiveSidebar";
import Header from "../header/Header";
import { useLocation } from "react-router-dom";
import Journey from "../tabs/Journey";
import PlayGround from "../tabs/PlayGround";
import Universities from "../tabs/Universities";
import Settings from "../settings/Settings";
import Dashboard from "../tabs/Dashboard";
import {
  DropDownValues,
  savedChange,
  scholarshipDropdown,
  SubDropDown,
  universityDropDownList,
} from "../../constant/commonUtils";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage } from "../../Errors/Toast";
import Users from "../tabs/Users";
import { useDispatch, useSelector } from "react-redux";
import { user_profile_info, users_data } from "../../Redux/ProfileAction";
import PaymentProccessing from "../tabs/PaymentProccessing";
import { resume_profile_data } from "../../Redux/ResumeAction";
import AddCollege from "../Modals/AddCollege";
import { scroll_action } from "../../Redux/ScrollableAction";
import Stories from "../tabs/Stories";
import News from "../tabs/News";
import AddNewsModel from "../Modals/AddNewsModel";
import Scholarship from "../tabs/Scholarship";
import { get_user_info } from "../../Redux/userProfileAction";

const MainScreen = () => {
  const location = useLocation();
  const [dropdownId, setdropdownId] = useState(
    location.pathname === "/universities"
      ? universityDropDownList[0].id
      : DropDownValues[0].id
  );
  const [subId, setSubId] = useState(SubDropDown[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [scholarshipQuestions, setScholarshipQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [universityListing, setUniversityListing] = useState([]);
  const [tabtype, setTabtype] = useState("discovered");
  const [modalShow2, setModalShow2] = useState(false);
  const [spinnerLoader, setSpinnerLoader] = useState(false);
  const [settingQuestion, setSettingQuestion] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [dashBoradScore, setDashBoradScore] = useState("");
  const [headerText, setHeaderText] = useState("Activities and Roles");
  const [menuToggle, setMenuToggle] = useState(false);
  const [university_score, setUniversity_score] = useState([]);
  const [newsListing, setNewsListing] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const adminSelector = useSelector((state) => state.rootReducer);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const pathParts = location.pathname.split("/").filter(Boolean);

  const [showModelNews, setShowModelNews] = useState(false);

  let route, paymentId;
  if (pathParts.length >= 2 && pathParts[0] === "payment") {
    route = pathParts[0]; // 'payment'
    paymentId = pathParts[1]; // 'pi_3PHQGnL5MmXwVUFI0cWm7lZO'
  } else {
    // If the URL structure is not as expected, navigate to a safe default
    route = "";
    paymentId = "";
  }

  const dispatch = useDispatch();

  useEffect(() => {
    setQuestions([]);
    setSelectedQuestions([]);
    setUniversityListing([]);
    // setSettingQuestion([])
   
    setTimeout(() => {
      if (
        location.pathname !== "/settings" &&
        location.pathname !== "/dashboard" &&
        tabtype !== "select" &&
        location.pathname !== "/universities" &&
        location.pathname !== "/users" &&
        location.pathname !== "/news" &&
        location.pathname !== "/scholarship" &&
        location.pathname !== "/story" &&
        adminSelector?.user?.user_type !== "admin" 
      ) {
        get_questions();

        // if ( adminSelector?.user?.user_type === "admin" && location.pathname === "/journey" ) {

        // }else{
        //   get_questions();
        // }
      } else if (location.pathname === "/saved") {
        saved_questions_Listing();
      } else if (location.pathname === "/news" && location.pathname !== '/story') {
        get_news();
      }
      if (tabtype === "select" && location.pathname !== "/universities" && location.pathname !== "/scholarship") {
        selected_questions_listing();
      }
      // if (tabtype === "select" && location.pathname === "/scholarship") {
      //   selected_scholarships();
      // }
      if (
        location.pathname === "/universities" &&
        dropdownId !== "scholarship"
      ) {
        get_university();
      }
      if (
        location.pathname === "/journey" &&
        adminSelector?.user?.user_type === "admin"
      ) {
        get_setting_questions();
      }
      if (location.pathname === "/dashboard") {
        dashboard();
      }
    }, 1000);
    // eslint-disable-next-line
  }, [location.pathname, dropdownId, subId, searchQuery, tabtype]);

  useEffect(() => {
    if (location.pathname === "/users") {
      dispatch(users_data("", tokenSelector));
      setTimeout(() => {
        setSpinnerLoader(false);
      }, 1500);
    }
    // eslint-disable-next-line
  }, [location.pathname]);
  useEffect(() => {
    dispatch(get_user_info(tokenSelector));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(resume_profile_data("", tokenSelector));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location.pathname === "/scholarship") {
      get_scholarships();
    }
  }, [location.pathname, searchQuery]);

  const get_university = () => {
    const formData = new FormData();

    formData.append("group", dropdownId);
    // formData.append("subcategory", subId);
    formData.append("search", searchQuery);
   
    commonApi
      .get_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setUniversityListing(res.data);
          setUniversity_score(res);
          setTimeout(() => {
            setSpinnerLoader(false)
          }, 1000);
          // setSpinnerLoader(false);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  const dashboard = () => {
    commonApi
      .dashboard("", tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setDashboardData(res.user_info);
          setDashBoradScore(res.user_score);
          setSpinnerLoader(false);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  const get_setting_questions = () => {
    const formData = new FormData();

    formData.append("cat", dropdownId);
    formData.append("subcat", subId);

    commonApi
      .setting_questions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          // if (settingQuestion.length === 0) {
            setSettingQuestion(res.questions);
          // }
         setTimeout(() => {
          setSpinnerLoader(false);
         }, 1500);
         
        } else {
          setSettingQuestion([]);
          // console.log("error");
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  useEffect(() => {
    setSpinnerLoader(true);
    setSearchQuery("");
  }, [location.pathname, dropdownId, subId, tabtype]);

  useEffect(() => {
    setSearchQuery("");
    setSubId(SubDropDown[0].id);
    setdropdownId(
      location.pathname === "/universities"
        ? universityDropDownList[0].id
        : DropDownValues[0].id
    );
    setTabtype("discovered");
  }, [location.pathname]);

  const selected_questions_listing = () => {
    const formData = new FormData();

    formData.append("category", dropdownId);
    formData.append("subcategory", subId);
    formData.append("search", searchQuery);
    formData.append("label", location.pathname.replace(/\//g, ""));

    commonApi
      .selected_questions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setSelectedQuestions(res?.data);
          setSpinnerLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const get_questions = () => {
    const formData = new FormData();

    formData.append("cat", dropdownId);
    formData.append("subcat", subId);
    formData.append("search", searchQuery);
    // formData.append("state", location.pathname.replace(/\//g, ""));

    commonApi
      .get_questions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setQuestions(res.questions);
          setSpinnerLoader(false);
        } else {
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const get_news = () => {
    const formData = new FormData();

    formData.append("search_query", searchQuery);

    commonApi
      .get_news(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          setNewsListing(res.data);
          setTimeout(() => {
            setSpinnerLoader(false);
          }, 500);
          
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };


  const get_scholarships = () => {
    const formData = new FormData();

    formData.append("search_query", searchQuery);

    commonApi
      .get_scholarships(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          setScholarshipQuestions(res.data);
          setTimeout(() => {
            setSpinnerLoader(false)
          }, 1000);
          // setSpinnerLoader(false);
        }
        if (!res.success) {
          setScholarshipQuestions([]);
          setSpinnerLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  // const select_scholarships = (scholar_id) => {
  //   const formData = new FormData();

  //   formData.append("scholarship_id", scholar_id);
  
  //   commonApi
  //     .select_scholarships(formData, tokenSelector)
  //     .then((res) => {
  //       if (res.status === 200 && res.success) {
  //         successMessage(res.message)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Err", err);
  //       return { type: "error", message: err.message };
  //     });
  // };

  

  const saved_questions_Listing = () => {
    const formData = new FormData();

    formData.append("category", dropdownId);
    formData.append("subcategory", subId);
    formData.append("search", searchQuery);

    commonApi
      .saved_questions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          setSavedQuestions(res.data);
          // setSpinnerLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const save_question = (item, type, label) => {
    // alert('')
    const formData = new FormData();

    formData.append("question_id", item.id);
    formData.append(
      "label",
      label ? label : location.pathname.replace(/\//g, "")
    );

    commonApi
      .save_question(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          if (type === "filterItem") {
            saved_questions_Listing();
          } else {
            const savedUnsavedQuestions = savedChange(questions, item, res.is_saved);

            setQuestions(savedUnsavedQuestions);
          }

          successMessage(res.message);
        } else {
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  // const select_university = (uni_id) => {
  //   const formData = new FormData();

  //   formData.append("university_id", uni_id);

  //   commonApi
  //     .select_university(formData, tokenSelector)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         get_university();
  //         successMessage(res.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Err", err);
  //       return { type: "error", message: err.message };
  //     });
  // };

  // const dataLength = height?.length < 4 && location.pathname !== "/dashboard";
  // const windowheightLength = windowHeight > 607;

  // const [height, setHeight] = useState(window.innerHeight);

  // const handleResize = () => {
  //   setHeight(window.innerHeight);
  // };

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);

  //   // Cleanup function to remove the event listener when component unmounts
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // const responsive_height = height > 896;

  // const containerRef = useRef(null);
  // const [isScrollable, setIsScrollable] = useState(false);
  // const container = containerRef.current;

  // useEffect(() => {
  //   if (dataLength) {
  //     if (container) {
  //       setTimeout(() => {
  //         if (container.scrollHeight > container.clientHeight) {
  //           setIsScrollable(true);
  //         } else {
  //           setIsScrollable(false);
  //         }
  //       }, 100);
  //     }
  //   }
  // }, [dataLength, container]);


  // const scrollRef = useRef({});
  // const contentRef = useRef(null);

  // const handleScroll = (event) => {
  //   const { scrollTop } = event.currentTarget;
  //   const currentTab = location.pathname;
  //   scrollRef.current[currentTab] = scrollTop;
  // };

  // useEffect(() => {
  //   const currentTab = location.pathname;
  //   const savedScrollPosition = scrollRef.current[currentTab];

  //   if (savedScrollPosition !== undefined) {
  //     window.scrollTo(0, savedScrollPosition);
  //   }

  //   // If the current tab is a non-scrollable tab, reset the scroll position to the top
  //   if (["/playground", "/settings", "/dashboard", "/users", "/payment"].includes(currentTab)) {
  //     window.scrollTo(0, 0);
  //   }
  // }, [location.pathname]);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   window.location.reload();
  // };

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;
  const reduxData =
    windowDimensions.width < 380
      ? dataLength?.length < 2 && location.pathname !== "/dashboard"
      : windowDimensions.width < 600
        ? dataLength?.length < 3 && location.pathname !== "/dashboard"
        : dataLength?.length < 4 && location.pathname !== "/dashboard";

  const scroll = useSelector((state) => state.scrollable_reducer);
  const scrolldata = scroll?.data?.scroll;

  const containerRef = useRef();

  useEffect(() => {
    const resetScroll = () => {
      if (tabtype === "discovered" && containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else if (tabtype === "select" && containerRef.current) {
        containerRef.current.scrollTop = 0;
      } else if (tabtype === "saved" && containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    };

    resetScroll();
    // eslint-disable-next-line
  }, [tabtype, containerRef.current, location.pathname, dropdownId, subId]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight > clientHeight) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line
  }, []);

  const isSmallScreen =
    windowDimensions.width === 1024 &&
    windowDimensions.height === 1366 &&
    location.pathname === "/dashboard";

  const overflowData =
    (spinnerLoader ||
      scrolldata === false ||
      reduxData === true ||
      isSmallScreen) &&
    location.pathname !== "/dashboard" && location.pathname !== "/story";

  const hanleAddNews = (data) => {
    setNewsListing((prevData) => [data, ...prevData]);
  };


  const hideTooltip =()=>{
    const popoverElement = document.getElementById("popover-basic");
    
    if (popoverElement) {

      popoverElement.style.display = "none"; // Reset to default on unmount
    }
  }
  useEffect(() => {
    // Select the main scrollable container by its ID
    const outerMainScrollContainer = document.getElementById('outer-main-scroll'); // Your main container id

    // Add the scroll event listener to the main container
    if (outerMainScrollContainer) {
      outerMainScrollContainer.addEventListener('scroll', hideTooltip);
    }

    // Clean up the event listener on unmount
    return () => {
      if (outerMainScrollContainer) {
        outerMainScrollContainer.removeEventListener('scroll', hideTooltip);
      }
    };
  }, []);

  return (
    <div
      className={location.pathname === "/dashboard" ? 'main-app-wrapper dashbaord-page' : "main-app-wrapper"}
      ref={containerRef}
      id='outer-main-scroll'
      style={{
        overflowY:
          "auto",
      }}
    >
      <Topbar setMenuToggle={setMenuToggle} menuToggle={menuToggle} />
      <Container fluid className="pe-0 ps-0">
        <Row className="MainCustomRow">
          <Col
            xxl={2}
            xl={2}
            lg={2}
            md={12}
            sm={12}
            xs={12}
            className="sticky-lg-top sticky-md-top sticky-sm-top custom-sticky-side"
            style={{
              height:
                windowDimensions.width === 1024 &&
                  windowDimensions.height === 1366
                  ? "100vh"
                  : "",
            }}
          >
            <ResponsiveSidebar
              menuToggle={menuToggle}
              setMenuToggle={setMenuToggle}
            />
          </Col>
          <Col
            xxl={10}
            xl={10}
            lg={10}
            md={12}
            sm={12}
            xs={12}
            className="side-main-content"
          >
            {/* {
              location.pathname !== "/dashboard" 
              // adminSelector?.user?.user_type === "admin"
              &&
              route !== "payment" &&
              location.pathname !== "/story" && (
                //  route === "payment" && paymentId !== ''
                <Header
                  setdropdownId={setdropdownId}
                  dropdownId={dropdownId}
                  subId={subId}
                  setSubId={setSubId}
                  setModalShow2={setModalShow2}
                  dashboardData={dashboardData}
                  setHeaderText={setHeaderText}
                  headerText={headerText}
                  university_score={university_score}
                  setShowModelNews={setShowModelNews}
                />
              )} */}

            {/* {location.pathname === "/journey" &&
              adminSelector?.user?.user_type === "user" && (
                <Journey
                  heading="Select All Roles and Activities that Apply"
                  para="When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here's a list of participations and accomplishments that can help bolster their application and the peroid"
                  title="Title"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  save_question={save_question}
                  questions={questions}
                  selectedQuestions={selectedQuestions}
                  setQuestions={setQuestions}
                  tabtype={tabtype}
                  setTabtype={setTabtype}
                  spinnerLoader={spinnerLoader}
                  selected_questions_listing={selected_questions_listing}
                  dropdownId={dropdownId}
                  subId={subId}
                />
              )} */}
            {/* {location.pathname === "/saved" && (
              <Saved
                heading="Select All Roles and Activities that Apply"
                para="When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here's a list of participations and accomplishments that can help bolster their application"
                title="Title"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                savedQuestions={savedQuestions}
                save_question={save_question}
                spinnerLoader={spinnerLoader}
                // saved_questions_Listing={saved_questions_Listing}
              />
            )} */}
            {(
              location.pathname === "/journey") &&
              adminSelector?.user?.user_type === "user" && (
                <PlayGround
                  heading="Select All Roles and Activities that Apply"
                  para="When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here's a list of participations and accomplishments that can help bolster their application"
                  title="Title"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  questions={questions}
                  save_question={save_question}
                  selectedQuestions={selectedQuestions}
                  setQuestions={setQuestions}
                  tabtype={tabtype}
                  setTabtype={setTabtype}
                  spinnerLoader={spinnerLoader}
                  selected_questions_listing={selected_questions_listing}
                  dropdownId={dropdownId}
                  setdropdownId={setdropdownId}
                  savedQuestions={savedQuestions}
                  subId={subId}
                  DropDownValues={DropDownValues}
                  get_questions={get_questions}
                />
              )}

            {(location.pathname === "/scholarship") &&
             (
                <Scholarship
                  heading="Select All Roles and Activities that Apply"
                  para="When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here's a list of participations and accomplishments that can help bolster their application"
                  title="Title"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  questions={scholarshipQuestions}
                  save_question={save_question}
                  selectedQuestions={selectedQuestions}
                  setQuestions={setScholarshipQuestions}
                  tabtype={tabtype}
                  setTabtype={setTabtype}
                  spinnerLoader={spinnerLoader}
                  // selected_questions_listing={selected_scholarships}
                  // select_scholarships={select_scholarships}
                  dropdownId={dropdownId}
                  // setStatusDropdown={setStatusDropdown}
                  // statusDropdown={statusDropdown}
                  savedQuestions={savedQuestions}
                  subId={subId}
                  setSubId={setSubId}
                  setdropdownId={setdropdownId}
                  setSpinnerLoader={setSpinnerLoader}
                />
              )}
            {location.pathname === "/universities" && (
              <Universities
                heading="Select All Roles and Activities that Apply"
                para="These schools typically emphasize the whole person in their admissions processes, highly valuing essays, extracurricular activities, and letters of recommendation. If you don’t see your prospective college, choose one of a similar level."
                title="University or College"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                // selectedQuestions={selectedQuestions}
                universityListing={universityListing}
                // select_university={select_university}
                get_university={get_university}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
                tabtype={tabtype}
                setTabtype={setTabtype}
                spinnerLoader={spinnerLoader}
                dropdownId={dropdownId}
                setdropdownId={setdropdownId}
                universityDropDownList={universityDropDownList}
              />
            )}
            {location.pathname === "/journey" &&
              adminSelector?.user?.user_type === "admin" && (
                <Settings
                  heading="Select All Roles and Activities that Apply"
                  para="These schools typically emphasize the whole person in their admissions processes, highly valuing essays, extracurricular activities, and letters of recommendation. If you don’t see your prospective college, choose one of a similar level."
                  title="Title"
                  settingQuestion={settingQuestion}
                  dropdownId={dropdownId}
                  setdropdownId={setdropdownId}
                  setSettingQuestion={setSettingQuestion}
                  spinnerLoader={spinnerLoader}
                />
              )}
            {location.pathname === "/dashboard" && (
              <Dashboard
                spinnerLoader={spinnerLoader}
                dashboardData={dashboardData}
                setHeaderText={setHeaderText}
                headerText={headerText}
                dashBoradScore={dashBoradScore}
              />
            )}
            {location.pathname === "/users" && (
              <Users spinnerLoader={spinnerLoader} />
            )}
            {location.pathname === "/story" && (
              <Stories setSpinnerLoader={setSpinnerLoader} spinnerLoader={spinnerLoader} />
            )}
            {location.pathname === "/news" && (
              <News
                spinnerLoader={spinnerLoader}
                heading="Select All Roles and Activities that Apply"
                para="When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here's a list of participations and accomplishments that can help bolster their application"
                title="Title"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                questions={newsListing}
                // save_question={save_question}
                // selectedQuestions={selectedQuestions}
                setQuestions={setNewsListing}
                // tabtype={tabtype}
                // setTabtype={setTabtype}
                // spinnerLoader={spinnerLoader}
                // selected_questions_listing={selected_questions_listing}
                dropdownId={dropdownId}
                // savedQuestions={savedQuestions}
                subId={subId}
                hanleAddNews={hanleAddNews}
              />
            )}
            {route === "payment" && paymentId !== "" && <PaymentProccessing />}
            {modalShow2 && (
              <AddCollege
                show={modalShow2}
                onHide={() => setModalShow2(false)}
                get_university={get_university}
              />
            )}
            {/* {showModelNews && (
              <AddNewsModel
                show={showModelNews}
                onHide={() => setShowModelNews(false)}
                hanleEditNews={(data) => {
                  // hanleAddNews(data);
                }}
              />
            )} */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainScreen;
