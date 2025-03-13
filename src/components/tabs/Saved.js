import React, { useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiSolidBookmark } from "react-icons/bi";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import { data_error } from "../../constant/WebText";
import QuetionsModal from "../Modals/QuetionsModal";
import SportsmanshipModal from "../Modals/SportsmanshipModal";

const Saved = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);

  const [questionDetail, setQuestionDetail] = useState({});
  const {
    heading,
    para,
    title,
    searchQuery,
    setSearchQuery,
    savedQuestions,
    save_question,
    spinnerLoader,
    saved_questions_Listing,
  } = props;

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

  return (
    <>
      {spinnerLoader && <SpinnerLoader />}
      <div className="row main-tabs-block position-relative">
        <div className="col-xxl-11 col-xl-11 col-lg-11 col-md-11 main-tabs-contain">
          <div className="saved-content-tab">
            <div className="setting-txt-holder">
              <h4>Saved Roles and Activities</h4>
            </div>
            <div className="main-search-blocks">
              <div className="search-input-holder">
                <Form.Control
                  size="lg"
                  type="search"
                  value={searchQuery}
                  className="search-input"
                  placeholder="Search..."
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="our-custom-tab-content">
            <h4>{heading}</h4>
            <p>{para}</p>
            {savedQuestions?.length > 0 && <h3>{title}</h3>}
            <div className="setting-listing-holder scrolled">
              {savedQuestions && savedQuestions?.length > 0 ? (
                savedQuestions?.map((question, index) => (
                  <>
                    <div className="tabs-custom-listing-holder" key={index}>
                      <div className="circle-icon-holder" >
                        <h4>
                          {question.title}
                          <span>
                            <OverlayTrigger
                              trigger={["hover", "focus"]}
                              placement="top"
                              overlay={popover(question.description)}
                            >
                              <span>
                                {" "}
                                <AiOutlineExclamationCircle />
                              </span>
                            </OverlayTrigger>
                          </span>
                        </h4>
                      </div>
                      <div className="bookmark-icon-holder">
                        <span
                          onClick={() =>
                            save_question(
                              question.id,
                              "filterItem",
                              question.label
                            )
                          }
                          className="active"
                        >
                          <BiSolidBookmark />
                        </span>
                        <Button
                          variant="primary"
                          className="custm-selct-icon-btn"
                          size="md"
                          onClick={() => {
                            if (question.category === "sportsmanship") {
                              setQuestionDetail(question);
                              setModalShow1(true);
                            } else {
                              setQuestionDetail(question);
                              setModalShow(true);
                            }
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="text-center empty-text-holder">
                  <h3>{data_error}</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalShow && (
        <QuetionsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          showData={questionDetail}
          saved_questions_Listing={saved_questions_Listing}
          // questionsListing={questions}
          // questionDetailEdit={tabtype === "select" ? questionDetailEdit : false}
        />
      )}
      {modalShow1 && (
        <SportsmanshipModal
          show={modalShow1}
          onHide={() => setModalShow1(false)}
          showData={questionDetail}
          saved_questions_Listing={saved_questions_Listing}
        />
      )}
    </>
  );
};

export default Saved;
