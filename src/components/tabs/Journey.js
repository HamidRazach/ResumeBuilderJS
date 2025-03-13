import React, { useEffect, useRef, useState } from "react";
import { Button, Form, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import { convertObjectToString } from "../../constant/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import PricingModal from "../Modals/PricingModal";
import { data_error, payment_error_message } from "../../constant/WebText";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";
import { height_action } from "../../Redux/HeightAction";
import { scroll_action } from "../../Redux/ScrollableAction";

const Journey = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [questionDetailEdit, setQuestionDetailEdit] = useState("");
  const {
    title,
    searchQuery,
    setSearchQuery,
    questions,
    save_question,
    selectedQuestions,
    tabtype,
    setTabtype,
    spinnerLoader,
    setQuestions,
    dropdownId,
    subId
  } = props;
  const [questionDetail, setQuestionDetail] = useState({});
  const pricingSelector = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const popover = (description) => {
    return (
      <Popover id="popover-basic">
        <Popover.Body>{description}</Popover.Body>
      </Popover>
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleId = (itemId) => {
    save_question(itemId);
  };

  useEffect(() => {
    if (pricingSelector?.user?.payment_status === false) {
      setShowModel(true);
    }
    // eslint-disable-next-line
  }, []);

  const UnselectedArray = props.questions?.filter((item) => !item.selected);
  const savedArray = props.questions?.filter((item) => item.saved);
  const PaymentStatus = pricingSelector?.user?.payment_status;

  useEffect(()=>{
    if(tabtype === "list"){
    dispatch(height_action(UnselectedArray, "list"))
    }else if(tabtype === "saved"){
      dispatch(height_action(savedArray, "saved"))
    }else if(tabtype === "select"){
      dispatch(height_action(selectedQuestions, "select"))
    }
    // eslint-disable-next-line
  },[props.questions, tabtype, selectedQuestions])


  const reduxHeight = useSelector((state)=>state.height_reducer); 
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const container = containerRef.current;

  useEffect(() => {
    if (dataLength && (container)) {
      setTimeout(() => {
        if (
          (container && (container.scrollHeight > container.clientHeight))) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [dataLength, container, tabtype, props.questions, selectedQuestions]);


  return (
    <>
      {spinnerLoader && <SpinnerLoader />}

      <div className="row main-tabs-block position-relative">
        <div className="col-xxl-11 col-xl-11 col-lg-11 col-md-11 main-tabs-contain">
          <div className="playground_tab_holder">
            <div className="main-search-blocks journey-search">
              <div className="search-input-holder">
                <Form.Control
                  size="lg"
                  type="search"
                  value={searchQuery}
                  className="search-input"
                  placeholder="Search..."
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
              </div>
            </div>
            <ul className="nav-tabs list-unstyled d-flex">
              <li className="nav-item as-link">
                <a
                  href={() => false}
                  className={
                    tabtype === "list" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => {
                    setTabtype("list");
                  }}
                >
                  <span>List</span>
                </a>
              </li>
              <li className="nav-item as-link">
                <a
                  href={() => false}
                  className={
                    tabtype === "select" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => {
                    setTabtype("select");
                  }}
                >
                  <span>Selected</span>
                </a>
              </li>
              <li className="nav-item as-link">
                <a
                  href={() => false}
                  className={
                    tabtype === "saved" ? "nav-link active" : "nav-link"
                  }
                  onClick={() => {
                    setTabtype("saved");
                  }}
                >
                  <span>Saved</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="playground-tab">

          <h4>
            {((tabtype === "list" || tabtype === "saved") && subId === "roles_activites") ? "Select All Roles and Activities that Apply" :
            ((tabtype === "list" || tabtype === "saved") && subId === "honors_awards") ? "Select All Honors and Awards that Apply" :
            (tabtype === "select" && subId === "roles_activites") ? "Review Selected Roles and Activities" :
            (tabtype === "select" && subId === "honors_awards") ? "Review Selected Honors and Awards" :
            ""}
          </h4>

            <p>
              When a rising senior is applying to colleges or universities,
              demonstrating a solid record of scholarship is essential. Here's a
              list of participations and accomplishments that can help bolster
              their application
            </p>

            {tabtype === "select" && (
              <>
                {selectedQuestions.length > 0 ? (
                  <div className="table-responsive all-tabs-table-holder Journey-tabs-table">
                    <Table
                      style={{ padding: "0px" }}
                      className="alltabs-list-table table"
                    >
                      <thead>
                        {selectedQuestions?.length > 0 && (
                          <tr>
                            <th>{title}</th>
                            <th>Participation Frequency</th>
                          </tr>
                        )}
                      </thead>

                      {/* <div className="Journey-responsive"> */}
                        <tbody className="Journey-responsive" ref={containerRef}>
                          {/* PaymentStatus */}
                          {selectedQuestions &&
                            selectedQuestions?.length > 0 &&
                            selectedQuestions &&
                            selectedQuestions?.map((question, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="circle-icon-holder">
                                    <h4>
                                      {question.title}
                                      {/* <span> */}
                                      {/* <span> */}
                                      <OverlayTrigger
                                        trigger={["hover", "focus"]}
                                        placement="top"
                                        overlay={popover(question.description)}
                                      >
                                        <span>
                                          <AiOutlineExclamationCircle />
                                        </span>
                                      </OverlayTrigger>
                                      {/* </span> */}
                                      {/* </span> */}
                                    </h4>
                                  </div>
                                </td>

                                <td className="journey-section">
                                  <div className="bookmark-group">
                                    <h4> {convertObjectToString(question)}</h4>
                                  </div>
                                  <div className="bookmark-icon-holder">
                                    <button
                                      type="button"
                                      className="custm-selct-icon-btn btn btn-primary btn-md"
                                      onClick={() => {
                                        if (dropdownId === "sportsmanship") {
                                          setModalShow1(true);
                                          setQuestionDetail(question);
                                          setQuestionDetailEdit(question);
                                        } else {
                                          setQuestionDetail(question);
                                          setQuestionDetailEdit(question);
                                          setModalShow(true);
                                        }
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      {/* </div> */}
                    </Table>
                  </div>
                ) : (
                  spinnerLoader && <div className="no_data_found"></div>
                )}
                {!spinnerLoader &&
                  selectedQuestions &&
                  selectedQuestions.length === 0 && (
                    <div className="text-center empty-text-holder">
                      <h3>
                        {!PaymentStatus ? payment_error_message : data_error}
                      </h3>
                    </div>
                  )}
              </>
            )}
            {tabtype === "list" && (
              <>
                {UnselectedArray.length > 0 ? (
                  <div className="table-responsive all-tabs-table-holder Journey-tabs-table">
                    <Table
                      style={{ padding: "0px" }}
                      className="alltabs-list-table table"
                    >
                      <thead>
                        {UnselectedArray?.length > 0 && (
                          <tr>
                            <th>{title}</th>
                            <th></th>
                          </tr>
                        )}
                      </thead>

                      {/* <div className="Journey-responsive"> */}
                        <tbody className="Journey-responsive" ref={containerRef}>
                          {UnselectedArray &&
                            UnselectedArray?.length > 0 &&
                            UnselectedArray &&
                            UnselectedArray?.map((question, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="circle-icon-holder">
                                    <h4>
                                      {question.title}
                                      {/* <span> */}
                                      {/* <span> */}
                                      <OverlayTrigger
                                        trigger={["hover", "focus"]}
                                        placement="top"
                                        overlay={popover(question.description)}
                                      >
                                        <span>
                                          <AiOutlineExclamationCircle />
                                        </span>
                                      </OverlayTrigger>
                                      {/* </span> */}
                                      {/* </span> */}
                                    </h4>
                                  </div>
                                </td>

                                <td>
                                  <div className="bookmark-icon-holder">
                                    <span
                                      className={question.saved ? "active" : undefined}
                                      onClick={() => handleId(question.id)}
                                    >
                                      {question.saved ? (
                                        <BiSolidBookmark />
                                      ) : (
                                        <BiBookmark />
                                      )}
                                    </span>
                                    <Button
                                      variant="primary"
                                      className="custm-selct-icon-btn"
                                      size="md"
                                      onClick={() => {
                                        if (dropdownId === "sportsmanship") {
                                          setModalShow1(true);
                                          setQuestionDetail(question);
                                        } else {
                                          setQuestionDetail(question);
                                          setModalShow(true);
                                        }
                                      }}
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      {/* </div> */}
                    </Table>
                  </div>
                ) : (
                  spinnerLoader && <div className="no_data_found"></div>
                )}

                {!spinnerLoader &&
                  UnselectedArray &&
                  UnselectedArray.length === 0 && (
                    <div className="text-center empty-text-holder">
                      <h3>
                        {!PaymentStatus ? payment_error_message : data_error}
                      </h3>
                    </div>
                  )}
              </>
            )}

            {tabtype === "saved" && (
              <>
                {savedArray.length > 0 ? (
                  <div className="table-responsive all-tabs-table-holder Journey-tabs-table">
                    <Table
                      style={{ padding: "0px" }}
                      className="alltabs-list-table table"
                    >
                      <thead>
                        {savedArray?.length > 0 && (
                          <tr>
                            <th>{title}</th>
                            <th></th>
                          </tr>
                        )}
                      </thead>
                      {/* <Scrollbars
                      id="set_my_scroll_window"
                      style={{
                        width: "100%",
                        height:
                          savedArray && savedArray?.length > 0
                            ? heightContent
                            : 0,
                      }}
                      className="custom-vertical-scroll-tbl"
                    > */}
                      {/* <div className="Journey-responsive"> */}
                        <tbody className="Journey-responsive" ref={containerRef}>
                          {savedArray &&
                            savedArray?.length > 0 &&
                            savedArray &&
                            savedArray?.map((question, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="circle-icon-holder">
                                    <h4>
                                      {question.title}

                                      {/* <span> */}
                                      <OverlayTrigger
                                        trigger={["hover", "focus"]}
                                        placement="top"
                                        overlay={popover(question.description)}
                                      >
                                        <span>
                                          <AiOutlineExclamationCircle />
                                        </span>
                                      </OverlayTrigger>
                                      {/* </span> */}
                                      {/* </span> */}
                                    </h4>
                                  </div>
                                </td>

                                <td>
                                  <div className="bookmark-icon-holder">
                                    <span
                                      className={question.saved ? "active" : undefined}
                                      onClick={() => handleId(question.id)}
                                    >
                                      {question.saved ? (
                                        <BiSolidBookmark />
                                      ) : (
                                        <BiBookmark />
                                      )}
                                    </span>
                                    <Button
                                      variant="primary"
                                      className="custm-selct-icon-btn"
                                      size="md"
                                      onClick={() => {
                                        if (dropdownId === "sportsmanship") {
                                          setModalShow1(true);
                                          setQuestionDetail(question);
                                        } else {
                                          setQuestionDetail(question);
                                          setModalShow(true);
                                        }
                                      }}
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      {/* </div> */}
                      {/* </Scrollbars> */}
                    </Table>
                  </div>
                ) : (
                  spinnerLoader && <div className="no_data_found"></div>
                )}

                {!spinnerLoader && savedArray && savedArray.length === 0 && (
                  <div className="text-center empty-text-holder">
                    <h3>
                      {!PaymentStatus ? payment_error_message : data_error}
                    </h3>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {modalShow && (
        <QuetionsModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            if (tabtype === "select") {
              props.selected_questions_listing();
            }
          }}
          title={"Share your level of participation"}
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
      )}

      {/* <CustomModalTwo show={modalShow2} onHide={() => setModalShow2(false)} /> */}

      <PricingModal
        show={showModel}
        onClose={() => setShowModel(false)}
        setShowModel={setShowModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModel(false)}
      />
    </>
  );
};

export default Journey;
