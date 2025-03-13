import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import {
  landingPhoto1,
  laptopImg,
  pathFinderLogo,
  progressChartImg1,
  progressImg1,
  footerlogo,
  backgroundVideo,
  holisticImg,
  resumeWorkImg,
  landingPageVideo,
} from "../../constant/images";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import "../../assets/css/custom.css";
import JoinModal from "../Modals/JoinModal";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { pricing_data, pricing_type } from "../../Redux/PricingAction";
import { useDispatch, useSelector } from "react-redux";
import { AnnuallyData } from "../../AnnuallyData";
import { OneTimeData } from "../../OneTimeData";
const LandingPage = () => {
  const [key, setKey] = useState("one-time");
  const [fadeIn, setFadeIn] = useState(false);
  const [userType, setUserType] = useState("freshman");
  const [showModel, setShowModel] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
  });
  const [validated, setValidated] = useState(false);
  const [isValidInput, setIsValidInput] = useState(true);
  const [pakages, setPakages] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      let isValidEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value
      );

      setIsValidInput(isValidEmail);
    }

    setProfile({ ...profile, [name]: value });
  };

  const view_profile_info = () => {
    const formData = new FormData();

    formData.append("name", "");
    formData.append("email", profile.email);

    commonApi
      .newsletter(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage("Successfully Submit");
          handleClear();
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleClear = () => {
    setProfile({
      email: "",
    });
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false || !isValidInput) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      view_profile_info();
      // handleClear();
    }
  };

  const closeNavbar = () => {
    var navbarToggler = document.querySelector(".navbar-toggler");
    var navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarToggler.classList.contains("collapsed")) {
      navbarCollapse.classList.remove("show");
    } else {
      navbarToggler.classList.add("collapsed");
      navbarCollapse.classList.remove("show");
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const styles = `
      .landingpage-wrapper::-webkit-scrollbar {
        width: 8px;
      }
      .landingpage-wrapper::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 8px;
      }
      .landingpage-wrapper::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 8px;
      }
      .landingpage-wrapper {
        overflow-y: auto;
       position: relative;
       overflow-x: hidden;
       height: 100dvh;
      }
     
`;

  // const handleGetStarted = (data) => {
  //   setUserType(data);
  //   dispatch(pricing_data(data));
  // };

  const all_packages = () => {
    commonApi
      .all_packages()
      .then((res) => {
        if (res.status === 200) {
          setPakages(res.packages);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const freshman_annually_data =
    pakages &&
    pakages?.freshman &&
    pakages?.freshman?.length > 0 &&
    pakages?.freshman.filter((item) => item.type === "anually");

  const freshman_onetime_data =
    pakages &&
    pakages?.freshman &&
    pakages?.freshman?.length > 0 &&
    pakages?.freshman.filter((item) => item.type === "one_time");

  const softmore_annually__data =
    pakages &&
    pakages?.sophomore &&
    pakages?.sophomore?.length > 0 &&
    pakages?.sophomore.filter((item) => item.type === "anually");

  const softmore_onetime_data =
    pakages &&
    pakages?.sophomore &&
    pakages?.sophomore?.length > 0 &&
    pakages?.sophomore.filter((item) => item.type === "one_time");

  const junior_annually_data =
    pakages &&
    pakages?.junior &&
    pakages?.junior?.length > 0 &&
    pakages?.junior.filter((item) => item.type === "anually");

  const junior_onetime_data =
    pakages &&
    pakages?.junior &&
    pakages?.junior?.length > 0 &&
    pakages?.junior.filter((item) => item.type === "one_time");

  const senior_data =
    pakages &&
    pakages?.senior &&
    pakages?.senior?.length > 0 &&
    pakages?.senior.filter((item) => item.type === "one_time");

  useEffect(() => {
    if (userType === "senior") {
      setKey("one-time");
    } else {
      setKey("one-time");
    }
  }, [userType]);

  useEffect(() => {
    dispatch(pricing_type(""));
    all_packages();
    // eslint-disable-next-line
  }, []);

  const handle = (price, type, grade) => {
    setUserType(grade);
    dispatch(pricing_type(price, type, grade));
    navigate("/login", { state: { type: "signup" } });
  };

  const vidRef = useRef();

  useEffect(() => { vidRef.current.play(); }, []);
  useEffect(() => {
    // Trigger fade-in animation whenever the active tab changes
    setFadeIn(true);
    const timer = setTimeout(() => setFadeIn(false), 500); // Duration of the animation

    return () => clearTimeout(timer);
  }, [key]);

  return (
    <>
      <div className="landingpage-wrapper">
        {/* <div className="landing-page-contain"> */}
        <div className="landing-page-bg-wrapper">
          <video className="bg-video" autoPlay muted loop>
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="video-content-wrapper">
            <Container className="custom-nav-container">
              <Row className="nav-wrapper">
                <Col
                  xxl={12}
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="logo-holder"
                >
                  <nav className="navbar navbar-expand-lg">
                    <div className="container">
                      <a className="navbar-brand" href={() => false}>
                        <img src={pathFinderLogo} alt="path-finder-logo" />
                      </a>
                      <button
                        className="navbar-toggler collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                      </button>

                      <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                      >
                        <ul className="navbar-nav ms-auto align-items-center" id="landingpage-specific-nav">
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="#about"
                              onClick={() => closeNavbar()}
                            >
                              About
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="#feature"
                              onClick={() => closeNavbar()}
                            >
                              Features
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="#pricing"
                              onClick={() => closeNavbar()}
                            >
                              Pricing
                            </a>
                          </li>
                          <li className="nav-item">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                navigate("/login", {
                                  state: { type: "login" },
                                });
                              }}
                            >
                              Get Started
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                </Col>
              </Row>
              <Row className="dream-info-block">
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                  <div className="dream-info-holder">
                    <h1>Empower Your Student to Excel in College Admissions</h1>
                    <p>
                      College acceptance today demands more than just stellar
                      standardized test scores in our interconnected world.
                    </p>

                    <button
                      className="btn btn-primary landing-custom-btn"
                      onClick={() => {
                        navigate("/login", {
                          state: { type: "login" },
                        });
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </Col>
                <Col>
                  <div className="laptop-img-holder">
                    <img src={laptopImg} alt="laptopImg" />
                  </div>
                </Col>
              </Row>
            </Container>
            <Row
              className="green-rect-curve-area-holder"
              id="about"
              style={{ margin: 0 }}
            >
              <Col
                className="pe-0 ps-0"
                xxl={12}
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
              >
                <div className="green-rect-curve-area">
                  <h2>
                    Highlight Your Student's Decision-Making and Problem-Solving
                    Skills
                  </h2>
                  <p>
                    PathFinderHub is a cutting-edge web application designed to
                    map and track your student's journey to college acceptance.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div class="container youtube-vid-contain">
          <div class="ratio ratio-16x9">
            <video
              ref={vidRef}
              width="560"
              height="315"
              src='https://app.thepathfinderhub.com/pathfinder-vid.mp4'
              title="Video player"
              controls
              autoPlay
              muted
              loop
            ></video>
          </div>
        </div>

        <Container>
          <Row className="landing-page-info-block align-items-center">
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className="landingpage-info-holder">
                <h2>Adapting to a Changing Landscape</h2>
                <p>
                  As colleges increasingly move away from relying solely on
                  standardized test scores, it's crucial to emphasize your
                  student's holistic achievements.
                </p>
                <button
                  className="btn btn-primary landing-custom-btn"
                  onClick={() => {
                    navigate("/login", {
                      state: { type: "login" },
                    });
                  }}
                >
                  Get Started
                </button>
              </div>
            </Col>
            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="landing-info-img-holder"
            >
              <img src={landingPhoto1} alt="landingPhoto1" />
            </Col>
          </Row>
          <Row className="landing-page-info-block landing-page-info-block1 align-items-center">
            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="landing-info-img-holder"
            >
              <img src={holisticImg} alt="holisticImg" />
            </Col>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className="landingpage-info-holder landingpage-info-holder1">
                <h2>Understanding a “Holistic” Profile</h2>

                <p>
                  {" "}
                  A holistic profile provides a comprehensive view of a student,
                  considering multiple dimensions and aspects to create a
                  complete picture of their “Whole-Person” attributes.
                </p>

                <button
                  className="btn btn-primary landing-custom-btn"
                  onClick={() => {
                    navigate("/login", {
                      state: { type: "login" },
                    });
                  }}
                >
                  Get Started
                </button>
              </div>
            </Col>
          </Row>
          <Row className="progress-img-block align-items-center" id="feature">
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className="landingpage-info-holder landingpage-info-holder1 landingpage-info-holder2">
                <h2>PathFinderHub’s Eight Predictive Dimensions</h2>
                <div className="landing-dimensions">
                  <p>
                    Navigating the path to college acceptance can be
                    overwhelming. PathFinderHub simplifies this process by
                    highlighting activities and awards that colleges value most.
                  </p>
                  {/* <ol>
                    <li>Scholarship - Roles and Activities</li>
                    <li>Scholarship - Honors and Awards</li>
                    <li> Leadership - Roles and Activities</li>
                    <li>Leadership - Honors and Awards</li>
                    <li>Citizenship - Roles and Activities</li>
                    <li>Citizenship - Honors and Awards</li>
                    <li>Sportsmanship - Roles and Activities</li>
                    <li>Sportsmanship - Honors and Awards</li>
                  </ol> */}
                </div>
              </div>
            </Col>
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className="progress-img-block-holder position-relative">
                <img src={progressImg1} alt="" />
                {/* <div className="chart-score-block">
                  <div className="chart-score-holder">
                    <span>Leadership</span>
                    <h4>28</h4>
                  </div>
                  <div className="chart-score-holder">
                    <span>Scholarship</span>
                    <h4>53</h4>
                  </div>
                  <div className="chart-score-holder">
                    <span>Citizenship</span>
                    <h4>72</h4>
                  </div>
                  <div className="chart-score-holder">
                    <span>Sportsmanship</span>
                    <h4>80</h4>
                  </div>
                </div>
                <div className="bar-chart-img-holder">
                  <img src={progressChartImg1} alt="" />
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
        <Row className="test-scenarios-block">
          <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className="test-scenarios-holder">
              <h2>How PathFinderHub Works</h2>
              <ol>
                <li>
                  <strong>Choose a College Category</strong>Select a category
                  that aligns with the student’s holistic attributes.
                </li>
                <li>
                  <strong>Create a Profile</strong> Input the student’s relevant
                  activities and awards.
                </li>
                <li>
                  <strong>Understand and Adjust</strong> Assess where your
                  student stands and follow tailored suggestions to stay on the
                  right path.
                </li>
                <li>
                  <strong>Export and Upload</strong> Generate a polished resume
                  ready for college admissions applications.
                </li>
              </ol>
              <button
                className="btn btn-primary landing-custom-btn"
                onClick={() => {
                  navigate("/login", {
                    state: { type: "login" },
                  });
                }}
              >
                Get Started
              </button>
            </div>
            <></>
          </Col>
        </Row>
        <Container>
          <Row className="landing-page-info-block align-items-center landing-page-info-last-block">
            <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className="landingpage-info-holder">
                <h2>
                  Use a Resume that
                  <br /> Stands Out
                </h2>
                <p>
                  The formatting and content of your resume are crucial in the
                  college admissions process. Our data-driven approach ensures
                  that your resume stands out and captures the attention of
                  admissions officers.
                </p>
              </div>
            </Col>
            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              className="landing-info-img-holder"
            >
              <img src={resumeWorkImg} alt="resumeWorkImg" />
            </Col>
          </Row>
          <Row className="pricing-block" id="pricing">
            <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
              <div className="pricing-info-block">
                <h2>Pricing</h2>
                <p>Choose your current year</p>
                <div className="course-slection-block">
                  <div
                    className={
                      userType === "freshman"
                        ? "course-section active d-flex justify-content-center as-link"
                        : "course-section d-flex justify-content-center as-link"
                    }
                    onClick={() => {
                      setUserType("freshman");
                    }}
                  >
                    Freshman
                  </div>
                  <div
                    className={
                      userType === "sophomore"
                        ? "course-section active d-flex justify-content-center as-link"
                        : "course-section  d-flex justify-content-center as-link"
                    }
                    onClick={() => {
                      setUserType("sophomore");
                    }}
                  >
                    Sophomore
                  </div>
                  <div
                    className={
                      userType === "junior"
                        ? "course-section active d-flex justify-content-center as-link"
                        : "course-section  d-flex justify-content-center as-link"
                    }
                    onClick={() => {
                      setUserType("junior");
                    }}
                  >
                    Junior
                  </div>
                  <div
                    className={
                      userType === "senior"
                        ? "course-section active d-flex justify-content-center as-link"
                        : "course-section  d-flex justify-content-center as-link"
                    }
                    onClick={() => {
                      setKey('one-time')
                      setUserType("senior");
                    }}
                  >
                    Senior
                  </div>
                </div>
                <p>Payment Frequency</p>
                <Tabs
                  id="controlled-tab-example1"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-2"
                >
                  {userType !== "senior" && (
                    <Tab
                      eventKey="annually"
                      title={
                        <div>
                          <span>Annually</span>
                        </div>
                      }
                    >
                      <div>
                        {/* {userType === "freshman" && (
                          <div className={fadeIn ? "fade-in-delayed" : ""}>
                            <AnnuallyData
                              data={freshman_annually_data}
                              handle={handle}
                              grade={"freshman"}
                            />
                          </div>
                        )}
                        {userType === "junior" && (
                          <div className={fadeIn ? "fade-in-delayed" : ""}>
                            <AnnuallyData
                              data={junior_annually_data}
                              handle={handle}
                              grade={"junior"}
                            />
                          </div>
                        )}
                        {userType === "sophomore" && (
                          <div className={fadeIn ? "fade-in-delayed" : ""}>
                            <AnnuallyData
                              data={softmore_annually__data}
                              handle={handle}
                              grade={"sophomore"}
                            />
                          </div>
                        )} */}

            <div className={fadeIn ? "fade-in-delayed" : ""}>
                <AnnuallyData
                  data={
                  userType === "sophomore" ? softmore_annually__data :
                  userType === "junior" ? junior_annually_data :
                  userType === "freshman" && freshman_annually_data 
                  }
                  handle={handle}
                  grade={
                    userType === "sophomore" ? 'sophomore' :
                    userType === "junior" ? 'junior' :
                    userType === "freshman" && 'freshman' 
                  }
                />
              </div>
              
                      </div>
                    </Tab>
                  )}
                  <Tab
                    eventKey="one-time"
                    tabClassName={userType === "senior" && 'senior-onetime'}
                    title={
                      <div>
                        <span>One Time</span>
                      </div>
                    }
                  >
                    <div>
                      {/* {userType === "freshman" && (
                        <div className={fadeIn ? "fade-in-delayed" : ""}>
                          <OneTimeData
                            data={freshman_onetime_data}
                            handle={handle}
                            grade={"freshman"}
                          />
                        </div>
                      )}
                      {userType === "junior" && (
                        <div className={fadeIn ? "fade-in-delayed" : ""}>
                          <OneTimeData
                            data={junior_onetime_data}
                            handle={handle}
                            grade={"junior"}
                          />
                        </div>
                      )}
                      {userType === "sophomore" && (
                        <div className={fadeIn ? "fade-in-delayed" : ""}>
                          <OneTimeData
                            data={softmore_onetime_data}
                            handle={handle}
                            grade={"sophomore"}
                          />
                        </div>
                      )}
                      {userType === "senior" && (
                        <div className={fadeIn ? "fade-in-delayed" : ""}>
                          <OneTimeData
                            data={senior_data}
                            handle={handle}
                            grade={"senior"}
                          />
                        </div>
                      )} */}

              <div className={fadeIn ? "fade-in-delayed" : ""}>
                <AnnuallyData
                  data={
                    userType === "senior" ? senior_data :
                    userType === "sophomore" ? softmore_onetime_data :
                    userType === "junior" ? junior_onetime_data :
                    userType === "freshman" && freshman_onetime_data 
                  }
                  handle={handle}
                  grade={
                    userType === "senior" ? 'senior' :
                    userType === "sophomore" ? 'sophomore' :
                    userType === "junior" ? 'junior' :
                    userType === "freshman" && 'freshman' 
                  }
                />
              </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="landing-page-footer">
          <div className="footer-top">
            <Container>
              <Row>
                <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                  <div className="logo-holder">
                    <a href={() => false}>
                      <img src={footerlogo} alt="" />
                    </a>
                  </div>
                  <p>
                    PathFinder helps students plan and execute the optimal path
                    to college acceptance.
                  </p>
                </Col>
                <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                  <div className="list-holder">
                    <ul className="list-unstyled">
                      <li>
                        <a href="#about">About</a>
                      </li>
                      <li>
                        <a href="#feature">Features</a>
                      </li>
                      <li>
                        <a href="#pricing">Pricing</a>
                      </li>
                      <li>
                        <a href="/login">Get Started</a>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                  <div className="foot-submit-holder">
                    <h3>Stay Posted with Updates</h3>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <Form.Control
                        htmlFor="email"
                        type="email"
                        required
                        placeholder="Email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        isInvalid={!isValidInput}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {!isValidInput
                          ? "Email is invalid!"
                          : "Email is required!"}
                      </Form.Control.Feedback>
                      <button
                        type="submit"
                        className="btn btn-primary landing-custom-btn submit-btn"
                      >
                        Submit
                      </button>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="footer-bottom">
            <p>All Rights Reserved 2024. PathFinder LLC</p>
          </div>
        </div>
        <JoinModal show={showModel} onHide={() => setShowModel(false)} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    </>

    // </div>
  );
};

export default LandingPage;
