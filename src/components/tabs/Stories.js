import React, { useState, useEffect } from "react";
import "./Stories.css";
import { Scrollbars } from "react-custom-scrollbars";
import Calendar from "../Dashoard/Calander";
import MaskUser from "../Dashoard/MaskUser";
import ViewAll from "../Dashoard/ViewAll";
import MiniCard from "../Dashoard/MiniCard";
import { cardlisting } from "../../constant/commonUtils";
import commonApi from "../../CommonApi/CommonServices";
import { useSelector } from "react-redux";
import { errorMessage, successMessage } from "../../Errors/Toast";
import SpinnerLoader from "../../webLoader/SpinnerLoader";

const Stories = (props) => {
  const { spinnerLoader, setSpinnerLoader } = props;
  const [faqData, setFaqData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  useEffect(() => {
    get_stories();
  }, []);

  const toggleCollapse = (index) => {
    const currentElement = document.getElementById(`faqCollapse-${index + 1}`);
    const activeElement =
      activeIndex !== null
        ? document.getElementById(`faqCollapse-${activeIndex + 1}`)
        : null;

    if (activeIndex === index) {
      // Slide Up
      currentElement.style.height = `${currentElement.scrollHeight}px`; // Set to full height first
      setTimeout(() => {
        currentElement.classList.add("slide-up");
        currentElement.style.height = "0"; // Collapse
      }, 10);
      setTimeout(() => {
        currentElement.classList.remove("show", "slide-up");
        currentElement.style.height = "auto";
        setActiveIndex(null);
      }, 500);
    } else {
      if (activeElement) {
        // Slide Up previous active element
        activeElement.style.height = `${activeElement.scrollHeight}px`; // Set to full height first
        setTimeout(() => {
          activeElement.classList.add("slide-up");
          activeElement.style.height = "0"; // Collapse previous
        }, 10);
        setTimeout(() => {
          activeElement.classList.remove("show", "slide-up");
          activeElement.style.height = "auto";
        }, 500);
      }

      // Slide Down new element
      currentElement.style.height = "0"; // Set initial height to 0
      currentElement.classList.add("show", "slide-down");
      setTimeout(() => {
        currentElement.style.height = `${currentElement.scrollHeight}px`; // Set to full height
      }, 10);
      setTimeout(() => {
        currentElement.style.height = "auto"; // Allow it to expand naturally
      }, 500);
      setActiveIndex(index);
    }
  };
  const handleEdit = (id) => {
    // Find the index of the FAQ item with the matching id
    const index = faqData.findIndex((faq) => faq.id === id);

    // Check if a matching FAQ was found
    if (index !== -1) {
      setEditIndex(index); // Set the index for editing
      setEditedAnswer(faqData[index].answer);
      // Set the current answer for editing
    } else {
      // console.error("FAQ item with the specified ID not found.");
    }
  };

  const handleSave = (id) => {

    if (!editedAnswer.trim()) {
      errorMessage("Please enter a valid answer.");
      return;
    }
    const updatedFaqData = faqData.map((item) =>
      item.id === id ? { ...item, answer: editedAnswer } : item
    );

    setFaqData(updatedFaqData); // Update the FAQ data with the new answer
    setEditIndex(null); // Reset the edit mode
    add_stories(editedAnswer, id);
  };

  const handleChange = (e) => {
    setEditedAnswer(e.target.value);
  };

  const add_stories = (ans, id) => {
    const formData = new FormData();
    formData.append("story_id", id);
    formData.append("response", ans);
    commonApi
      .add_stories(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const get_stories = () => {
    const formData = new FormData();

    commonApi
      .get_stories(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          setFaqData(res.users);
          setSpinnerLoader(false)
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  return (
    <>
      <div className="faq-section">
        <div className="container">
          <div className="row faq-tab">
            <div className="col-md-9 col-sm-9 pe-4 story-according">
              <section className="faq-page">
                <div className="position-relative faq" id="accordion">
                  <div className="faq-title text-center">
                    <h2>Story</h2>
                  </div>
                  {spinnerLoader && <SpinnerLoader color={"white"} />}
                  {faqData.length > 0 ? (
                    faqData.map((faq, index) => (
                      <div className="card" key={index}>
                        <div className="card-header" id={`faqHeading-${index + 1}`}>
                          <div className="mb-0">
                            <h5
                              className="faq-title"
                              onClick={() => toggleCollapse(index)}
                              data-toggle="collapse"
                              data-target={`#faqCollapse-${index + 1}`}
                              aria-expanded={activeIndex === index}
                              aria-controls={`faqCollapse-${index + 1}`}
                            >
                              <span className="badge">{index + 1}</span>{" "}
                              {faq.question}
                            </h5>
                          </div>
                        </div>
                        <div
                          id={`faqCollapse-${index + 1}`}
                          className={`collapse ${activeIndex === index ? "show slide-down" : ""
                            }`}
                          aria-labelledby={`faqHeading-${index + 1}`}
                          data-parent="#accordion"
                        >
                          <div className="card-body" style={{ padding: '10px 30px 10px 70px' }}>
                            {editIndex === index ? (
                              <div>
                                <textarea
                                  value={editedAnswer}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-control"
                                />
                                <button
                                  onClick={() => handleSave(faq.id)}
                                  className="btn btn-primary mt-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="scrollable-container">
                                <p>{faq.answer}</p>
                                <button
                                  onClick={() => handleEdit(faq.id)}
                                  className="btn btn-secondary mt-2"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center no-record-section-story">
                      <p className="font-weight-bold text-muted">No record found</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
            <div className="col-md-3 col-sm-3 mb-4 story-content ps-0">
              <div className="story-calander">
                <div className="story-cards">
                  <MiniCard cardlisting={[cardlisting[2]]} />
                </div>
                <div className="mb-4 story-min">
                  <Calendar />
                </div>
              </div>
              <div className="card-group-section">
                <div className="mb-4 viewall-stroy">
                  <ViewAll />
                </div>
                <MaskUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



export default Stories;
