import React, { useEffect, useRef, useState } from "react";

import { cardlisting, styleComponent } from "../../constant/commonUtils";

import { scrollAdjust } from "../../constant/commonUtils";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";

import { height_action } from "../../Redux/HeightAction";
import { useDispatch, useSelector } from "react-redux";
import { scroll_action } from "../../Redux/ScrollableAction";
import VedioModal from "../Modals/VedioModal";
import DashboardTab from "./DashboardTab";
import MiniCard from "../Dashoard/MiniCard";
import ViewAll from "../Dashoard/ViewAll";
import Calendar from "../Dashoard/Calander";
import MaskUser from "../Dashoard/MaskUser";
const PlayGround = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [questionDetail, setQuestionDetail] = React.useState("");
  const [questionDetailEdit, setQuestionDetailEdit] = React.useState("");
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const displayVideo = useSelector((state) => state.video_model_reducer?.show);
  const adminSelector = useSelector((state) => state.rootReducer);

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
    selected_questions_listing,
    dropdownId,
    setdropdownId,
    subId,
    DropDownValues,
    get_questions
  } = props;

  const UnselectedArray = questions?.filter((item) => !item.selected);
  const savedArray = questions?.filter((item) => item.saved);


  if (questions.length > 0) {
    setTimeout(() => {
      scrollAdjust();
    }, 1500);
  }
  if (selectedQuestions.length > 0) {
    setTimeout(() => {
      scrollAdjust();
    }, 1500);
  }

  useEffect(() => {
    if (tabtype === "discovered") {
      dispatch(height_action(UnselectedArray, "discovered"));
    } else if (tabtype === "saved") {
      dispatch(height_action(savedArray, "saved"));
    } else if (tabtype === "select") {
      dispatch(height_action(selectedQuestions, "select"));
    }
    // eslint-disable-next-line
  }, [questions, tabtype, selectedQuestions]);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const container = containerRef.current;

  useEffect(() => {
    if (dataLength && container) {
      setTimeout(() => {
        if (container && container.scrollHeight > container.clientHeight) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [dataLength, container, questions, selectedQuestions]);

  useEffect(() => {
    if (!displayVideo) {
      setShowModel(true);
    
    }
  }, [displayVideo]);

  const handleCloseVideoModal = () => {
    localStorage.setItem("videoModalClosed", "true");
    setShowModel(false);
  };

  const handleUserAction = (item, type) => {
    if (type === "save") {
      save_question(item);
    } else {
      if (item.category === "sportsmanship") {
        setModalShow1(true);
        setQuestionDetail(item);
      } else {
        setQuestionDetail(item);
        setModalShow(true);
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
                tabs={[
                  { name: "Discovered", id: "discovered" },
                  { name: "Selected", id: "select" },
                  { name: "Saved", id: "save" },
                ]}
                setTabtype={setTabtype}
                tabType={tabtype}
                dropdownListing={DropDownValues}
                dropdownSelected={setdropdownId}
                dropdownSelectedId={dropdownId}
                listing={
                  tabtype === "discovered"
                    ? UnselectedArray
                    : tabtype === "save"
                    ? savedArray
                    : tabtype === "select" && selectedQuestions
                }
                userAction={handleUserAction}
                type={"journey"}
                setSearhQuery={setSearchQuery}
                searchQuery={searchQuery}
                styleComponent={styleComponent}
                spinnerLoader={spinnerLoader}
                paragraphs={[
                  {
                    title: "Title",
                    para: "When a rising senior is applying to colleges or universities, demonstrating a solid record of scholarship is essential. Here’s a list of participations and accomplishments that can help bolster their application and the peroid.",
                  },
                ]}
              />
            </div>

            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div className="">
                <MiniCard cardlisting={[cardlisting[2]]} />
              </div>
              <div className="mb-4">
                <Calendar />
              </div>
              <div className="card-group-section">
                <ViewAll />

                <MaskUser />
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalShow && (
        <QuetionsModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            if (tabtype === "select") {
              selected_questions_listing();
            }else if(tabtype === 'discovered'){
              get_questions()
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
            }else if(tabtype === 'discovered'){
              get_questions()
            }
          }}
          setQuestions={setQuestions}
          showData={questionDetail}
          questionsListing={questions}
          questionDetailEdit={tabtype === "select" ? questionDetailEdit : false}
        />
      )}

      {showModel && (
        <VedioModal
          show={showModel}
          onClose={handleCloseVideoModal}
          onHide={handleCloseVideoModal}
          setShowModel={setShowModel}
          backdrop="static"
          keyboard={false}
        />
      )}
    </>
  );
};

export default PlayGround;
