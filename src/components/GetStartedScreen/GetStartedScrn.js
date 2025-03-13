import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Dropdown } from "react-bootstrap";
import { pathFinderLogo } from "../../constant/images";
import { NavLink } from "react-router-dom";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../../Errors/Toast";
import { useDispatch } from "react-redux";
import { login, signUp } from "../../Redux/LoginAction";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { checkDeviceAndBrowser } from "../../constant/commonUtils";

const GetStartedScrn = () => {
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const history = useNavigate();
  const location = useLocation();

  const Gender = [
    {
      title: "Female",
      id: "female",
    },
    {
      title: "Male",
      id: "male",
    },
  ];
  const [validated, setValidated] = useState(false);
  const [showLogin, setShowLogin] = useState("login");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isValidInput, setIsValidInput] = useState(true);
  const [subId, setSubId] = useState(Gender[0].id);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      let isValidEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value
      );
      setIsValidInput(isValidEmail);
    }

    setLoginForm({ ...loginForm, [name]: value });
  };

  const handle = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (
      form.checkValidity() === false ||
      (!passwordMatch && showLogin !== "login") ||
      !isValidInput
    ) {
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(false);
      if (!showForgotPassword && showLogin === "login") {
        Login();
      } else {
        if (showForgotPassword) {
          forgot_password();
        } else {
          signup();
        }
      }
    }
  };

  const signup = () => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the fields from the data object to the FormData object
    formData.append("name", loginForm.name);
    formData.append("contact", loginForm.email);
    formData.append("password", loginForm.password);
    formData.append("confirm_password", loginForm.confirmPassword);
    formData.append("gender", subId);

    // Make the API call using the FormData object
    commonApi
      .signup(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("gender", subId);

          dispatch(signUp(subId, res.token));

          history("/onboarding");
        } else {
          errorMessage(res.message);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };
  const Login = () => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the fields from the data object to the FormData object
    formData.append("contact", loginForm.email);
    formData.append("password", loginForm.password);

    // Make the API call using the FormData object
    commonApi
      .login(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          // Handle success

          localStorage.setItem("token", res.token);
          localStorage.setItem("user_type", res.user_type);
          localStorage.setItem("gender", res.gender);
          localStorage.setItem("payment_status", res.payment_status);
          localStorage.setItem("onboarding", res.onboarding);

          dispatch(
            login(
              res.gender,
              res.user_type,
              res.onboarding,
              res.payment_status,
              res.token
            )
          );
          if (res.user_type === "admin") {
            history("/journey");
          } else {
            if (res.onboarding === true) {
              if (res.payment_status === true) {
                history("/journey");
              } else {
                history("/playground");
              }
            } else {
              history("/onboarding");
            }
          }
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const forgot_password = () => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append("email", loginForm.email);

    // Make the API call using the FormData object
    commonApi
      .forgot_password(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message);

          setShowForgotPassword(false);
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  useEffect(() => {
    if (location.state && location.state?.type === "signup") {
      setShowLogin("signup");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setLoginForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
    setValidated(false);
  }, [showLogin]);

  useEffect(() => {
    if (loginForm.password !== loginForm.confirmPassword) {
      if (loginForm.password && loginForm.confirmPassword) {
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    } else {
      setPasswordMatch(true);
    }
  }, [loginForm.password, loginForm.confirmPassword]);

  const handleSubDropdownChange = (id) => {
    setSubId(id);
  };

  const CustomDropdownItem = ({ children, onClick }) => (
    <a
      onClick={onClick}
      className="dropdown-item"
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex="0"
    >
      {children}
    </a>
  );


  // const [initialWindowHeight, setInitialWindowHeight] = useState(window.innerHeight);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const currentWindowHeight = window.innerHeight;

  //     // If the height is less than the initial height, the keyboard is likely open
  //     if (currentWindowHeight < initialWindowHeight) {
  //       // Adjust page content or scroll the window (e.g., to remove the extra space)
  //       window.scrollTo(0, document.body.scrollHeight);
  //     }

  //     // Update the initial window height whenever the resize event occurs
  //     setInitialWindowHeight(currentWindowHeight);
  //   };

  //   // Add the event listener for window resize
  //   window.addEventListener('resize', handleResize);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [initialWindowHeight]);
  

  // const checkDeviceAndBrowser = () => {
  //   const userAgent = navigator.userAgent.toLowerCase();
  
  //   // Check if the device is iPhone
  //   const isIOS = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
  
  //   // Check if the browser is Safari
  //   const isSafari = userAgent.includes("safari") && !userAgent.includes("chrome");
  
  //   // Check if an input field is currently focused
  //   // const isInputFocused = document.activeElement && document.activeElement.tagName === 'INPUT';
  
  //   // If all conditions are true, return true, otherwise return false

  //   if(isIOS){
  //     if(isSafari){
  //         const className = [isInputFocused ? 'hidden' : 'auto']
        

  //     }

  //   }
  //   // if (isIOS && isSafari && isInputFocused) {
  //   //   alert('')
  //   // }else{
  //   //   alert('4')
  //   // }
  
  //   return false;
  // };

  
  
  // const [isInputFocused, setIsInputFocused] = useState(false);
  // const [checkBrowser, setCheckBrowser] = useState(false);

  // console.log(checkBrowser, 'checkBrowsercheckBrowsercheckBrowser')
  // console.log(isInputFocused, 'isInputFocusedisInputFocusedisInputFocused')

  // useEffect(() => {
  //   const browserCheck = checkDeviceAndBrowser();
  //   setCheckBrowser(browserCheck);
  //   console.log(browserCheck, 'checkBrowsercheckBrowsercheckBrowsercheckBrowser');
  // }, [isInputFocused]); // Only run when isInputFocused changes

  // const [isFocused, setIsFocused] = useState(false);
  const emailInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const passInputRef = useRef(null);
  const conPasswordInputRef = useRef(null);

  
  // const userAgent = navigator.userAgent

  // let checkSafri = false;

  
  // const handleTouchStart = (event) => {


  //   if(checkSafri){
  //   if(emailInputRef.current && !emailInputRef.current.contains(event.target)){
  //     emailInputRef && emailInputRef.current.blur();
  //   }else if(passInputRef.current && !passInputRef.current.contains(event.target)){
  //     passInputRef && passInputRef.current.blur();
  //   }else if(nameInputRef.current && !nameInputRef.current.contains(event.target)){
  //     nameInputRef && nameInputRef.current.blur();
  //   }else if(conPasswordInputRef.current && !conPasswordInputRef.current.contains(event.target)){
  //     conPasswordInputRef && conPasswordInputRef.current.blur(); 
  //   }
  // }
  // };

  // if (userAgent) {
  //   checkSafri = checkDeviceAndBrowser()
  // }
 

  // useEffect(() => {


  //   // Add touch event listener to the document
  //   document.addEventListener('touchstart', handleTouchStart);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('touchstart', handleTouchStart);
  //   };
  // }, []); 

  return (
    <>
      <div className="main-app-wrappers">
        <div className="container">
          <div className="row gets-started-block">

            <div className={
              showLogin === "login"
                ? "gets-login-contain col-6 pe-0 ps-0"
                
                : "gets-login-contain col-6 pe-0 ps-0"
            }
            >
              <div className="get-login-screens">
                <div className="logo-holder">
                  <img src={pathFinderLogo} alt="path-finder-logo" />
                </div>
                <div className="get-started-info-holder">
                  <h1>
                    {showLogin === "login" ? "Welcome Back!" : "Let’s Get Started"}
                  </h1>
                  <p>
                    {" "}
                    {showLogin === "login"
                      ? "Let’s get started"
                      : "Your dream school is around the corner"}
                  </p>
                </div>
              </div>
            </div>

            <div className={`gets-started-form-contain pe-0 ps-0 col-6 ${showForgotPassword && "forget-page"}`}>
              <div className="gets-started-holder gets-started-form-holder">
                <div className="form-holder">
                  <Form noValidate validated={validated} onSubmit={handle}>
                    <h2>
                      {showForgotPassword && "Forget Password"}
                      {!showForgotPassword && showLogin === "login"
                        ? "Login"
                        : !showForgotPassword && "Tell us a little about you"}
                    </h2>
                    {showForgotPassword ? (
                      <div className="form-group get-started-form">
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                          ref={emailInputRef}
                          // id="email"
                          type="email"
                          name="email"
                          required
                          placeholder=""
                          autoComplete="off"
                          value={loginForm.email}
                          onChange={handleInputChange}
                          isInvalid={!isValidInput}
                          // onFocus={handleFocus}
                          // onBlur={handleBlur}
                          // style={{ width: '100%', padding: '10px', borderRadius: '5px' }}

                        />
                        <Form.Control.Feedback type="invalid">
                          {loginForm.email
                            ? "Email is invalid."
                            : "Email is required."}
                        </Form.Control.Feedback>
                      </div>
                    ) : (
                      <>
                        {showLogin !== "login" && (
                          <div className="form-group get-started-form">
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control
                              // id="name"
                              ref={nameInputRef}
                              name="name"
                              type="text"
                              pattern="^\S.*"
                              required={showLogin !== "login" ? true : false}
                              value={loginForm.name}
                              placeholder=""
                              autoComplete="off"
                              onChange={handleInputChange}
                            />

                            <Form.Control.Feedback type="invalid">
                              {loginForm.name
                                ? "Please avoid space in start."
                                : " Name is required."}
                            </Form.Control.Feedback>
                          </div>
                        )}

                        <div className="form-group get-started-form">
                          <Form.Label htmlFor="email">Email</Form.Label>
                          <Form.Control
                            // id="email"
                            ref={emailInputRef}
                            type="email"
                            name="email"
                            required
                            placeholder=""
                            autoComplete="off"
                            value={loginForm.email}
                            onChange={handleInputChange}
                            isInvalid={!isValidInput}
                          />
                          <Form.Control.Feedback type="invalid">
                            {loginForm.email
                              ? "Email is invalid."
                              : "Email is required."}
                          </Form.Control.Feedback>
                        </div>

                        <div className="form-group get-started-form">
                          <Form.Label htmlFor="password">Password</Form.Label>
                          <Form.Control
                            // id="name"
                            ref={passInputRef}
                            name="password"
                            type="password"
                            required
                            // pattern="^\S.*"
                            value={loginForm.password}
                            placeholder=""
                            autoComplete="off"
                            onChange={handleInputChange}
                          />

                          <Form.Control.Feedback type="invalid">
                            {loginForm.password
                              ? "Please avoid space in start."
                              : "Password is required."}
                          </Form.Control.Feedback>
                        </div>

                        {showLogin !== "login" && (
                          <div className="form-group get-started-form">
                            <Form.Label htmlFor="name">
                              Confirm Password
                            </Form.Label>
                            <Form.Control
                              // id="name"
                              ref={conPasswordInputRef}
                              name="confirmPassword"
                              type="password"
                              required={showLogin !== "login" ? true : false}
                              value={loginForm.confirmPassword}
                              placeholder=""
                              autoComplete="off"
                              onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type="invalid">
                              Confirm password is required.
                            </Form.Control.Feedback>
                            {!passwordMatch && (
                              <div className="error_notice">
                                Passwords do not match!
                              </div>
                            )}
                          </div>
                        )}
                        {showLogin !== "login" && (
                          <div className="custom-form-slect-field get-started-form">
                            <Form.Label htmlFor="gender">Gender</Form.Label>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="success"
                                id="dropdown-basic"
                              >
                                {subId &&
                                  Gender.find((item) => item.id === subId)?.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {Gender.map((item, index) => (
                                  <Dropdown.Item
                                    as={CustomDropdownItem}
                                    key={index}
                                    onClick={() =>
                                      handleSubDropdownChange(item.id)
                                    }
                                  >
                                    {item.title}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        )}
                      </>
                    )}
                    {showLogin === "login" ? (
                      <NavLink
                        className="account-anchor"
                        onClick={() => {
                          if (showLogin === "login") {
                            setIsValidInput(true);
                            setValidated(false);
                            setShowForgotPassword(!showForgotPassword);
                            setLoginForm({
                              name: "",
                              email: "",
                              password: "",
                              confirmPassword: "",
                              gender: "",
                            });
                            // setIsValidInput(true);
                            // setShowLogin("");
                          } else {
                            setIsValidInput(true);
                            setValidated(false);

                            // setShowLogin("login");
                          }
                        }}
                      >
                        {showForgotPassword ? "Login?" : "Forget password?"}
                      </NavLink>
                    ) : (
                      ""
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary gets-form-btn"
                    >
                      Next
                    </button>
                    {!showForgotPassword ? (
                      <NavLink
                        className="account-anchor"
                        onClick={() => {
                          if (showLogin === "login") {
                            setIsValidInput(true);
                            setValidated(false);
                            setShowLogin("");
                          } else {
                            setIsValidInput(true);
                            setValidated(false);
                            setShowLogin("login");
                          }
                        }}
                      >
                        {showLogin === "login"
                          ? "I don’t have an account"
                          : "I have an account"}
                      </NavLink>
                    ) : (
                      ""
                    )}
                  </Form>

                  {/* {!showForgotPassword ? (
                    <NavLink
                      className="account-anchor"
                      onClick={() => {
                        if (showLogin === "login") {
                          setIsValidInput(true);
                          setValidated(false);
                          setShowLogin("");
                        } else {
                          setIsValidInput(true);
                          setValidated(false);
                          setShowLogin("login");
                        }
                      }}
                    >
                      {showLogin === "login"
                        ? "I don’t have an account"
                        : "I have an account"}
                    </NavLink>
                  ) : (
                    ""
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStartedScrn;
