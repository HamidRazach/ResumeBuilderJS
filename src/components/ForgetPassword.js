import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { pathFinderLogo } from "../constant/images";
import { useNavigate, useLocation } from "react-router-dom";
import commonApi from "../CommonApi/CommonServices";
import { errorMessage, successMessage } from "../Errors/Toast";
const ForgetPassword = () => {
  const [loginForm, setLoginForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const showLogin = "login"

  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const isValidInput = true;

  const history = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  // Split the pathname using "/" as the delimiter
  const parts = pathname.split("/");

  // Get the last part of the pathname, which contains the token
  const token = parts[parts.length - 1];


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setLoginForm({ ...loginForm, [name]: value });
  };

  const handle = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false || !passwordMatch || !isValidInput) {
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();

      setValidated(false);
      reset_password();
    }
  };

  useEffect(() => {
    authenticate_token();
    // eslint-disable-next-line
  }, []);

  const authenticate_token = () => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append("token", token);

    // Make the API call using the FormData object
    commonApi
      .authenticate_token(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          // history("/");
        } else {
          errorMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const reset_password = () => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append("token", token);
    formData.append("new_password", loginForm.password);
    formData.append("confirm_password", loginForm.confirmPassword);

    // Make the API call using the FormData object
    commonApi
      .reset_password(formData)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage("Password has been updated successfully");
          history("/login");
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

  return (
    <div className="main-app-wrappers">
      <div className="container">
        <div className="row gets-started-block">
          <div className={
            showLogin === "login"
              ? "gets-login-contain col-6 pe-0 ps-0"
              : "gets-started-contain col-6 pe-0 ps-0"
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
          <div className="gets-started-form-contain pe-0 ps-0 col-6">
            <div className="get-login-screens">
              <div className="form-holder">
                <Form noValidate validated={validated} onSubmit={handle}>
                  <h2>Enter your password</h2>

                  <div className="form-group get-started-form">
                    <Form.Label htmlFor="name">New Password</Form.Label>
                    <Form.Control
                      // id="name"
                      name="password"
                      type="password"
                      required
                      pattern="^\S.*"
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

                  <div className="form-group get-started-form">
                    <Form.Label htmlFor="name">Confirm Password</Form.Label>
                    <Form.Control
                      // id="name"
                      name="confirmPassword"
                      type="password"
                      required={true}
                      value={loginForm.confirmPassword}
                      placeholder=""
                      autoComplete="off"
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Confirm password is required.
                    </Form.Control.Feedback>
                    {!passwordMatch && (
                      <div className="error_notice">Passwords do not match!</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary gets-form-btn">
                    Next
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgetPassword;
