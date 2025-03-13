import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Dropdown, Tabs, Tab } from "react-bootstrap";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage, errorMessage } from "../../Errors/Toast";
import { useDispatch, useSelector } from "react-redux";
import { user_profile_info, users_data } from "../../Redux/ProfileAction";
import GenderChange from "./GenderChange";
import { Gender_Change } from "../../Redux/LoginAction";
import { checkDevice, coverttestScores, formatTestScores } from "../../constant/commonUtils";
import AddListing from "../../CommonComponent/AddListing";
import { get_user_info } from "../../Redux/userProfileAction";

const ViewProfile = (props) => {
  const buttonRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const [validated, setValidated] = useState(false);
  const [scoreValidation, setScoreValidation] = useState(false);
  const [key, setKey] = useState(props.tabValuePreSelect ? props.tabValuePreSelect : 'Academic');
  const [isDisable, setIsDisable] = useState(false);
  const dispatch = useDispatch();
  const profileSelector = useSelector((state) => state.profileReducer);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const user_type = useSelector((state) => state.rootReducer?.user?.user_type);
  const [modalShow, setModalShow] = useState(false);
  const [miniTab, setMiniTab] = useState("sat");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    cgpa: "",
    interested: "",
    current_Year: "",
    // cgpa: "",
    school: "",
    rank: "",
    school_address: "",
    ethnicity: "",
    total: "",
    number: "",
    description: ""
  });

  const [listOfScores, setListOfScores] = useState([]);
  const [interestedData, setInterestedData] = useState([]);

  const [satData, setSatData] = useState([]);
  const [psatData, setPsatData] = useState([]);

  const [testScores, setTestScores] = useState({
    math: "",
    reading: "",
    total: "",
    date: "",
    type: miniTab,
  });

  const resetScores = ()=>{
    setScoreValidation(false);

    setTestScores({
      math: "",
      reading: "",
      total: "",
      date: "",
      type: miniTab,
    });
    
  }
  
  console.log(testScores, 'testScorestestScores')
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

  const [subId, setSubId] = useState(Gender[0].id);
  const [subIdConstant, setSubIdConstant] = useState(Gender[0].id);
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cgpa') {
      // Regular expression to allow up to 2 decimal places
      const decimalPattern = /^\d+(\.\d{0,2})?$/;

      // Allow empty values or numbers between 1 and 4 with up to 2 decimal places
      if (
        value === '' ||
        (parseFloat(value) >= 1 && parseFloat(value) <= 4 && decimalPattern.test(value))
      ) {
        setProfile({ ...profile, [name]: value });
      } else {
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleScoresChange = (e) => {
    const { name, value } = e.target;
    

    setTestScores((prevState) => {
      const updatedScores = { ...prevState, [name]: value };

      const mathScore = Number(updatedScores.math) || 0;
      const readingScore = Number(updatedScores.reading) || 0;
      const total = mathScore + readingScore;

      return { ...updatedScores, total };
    });
  };

  const handleScores = () => {

    if (miniTab === 'psat') {
      setPsatData((prev) => [
        { ...testScores, type: 'psat' },
        ...prev
      ])
    } else if (miniTab === 'sat') {
      setSatData((prev) => [
        { ...testScores, type: 'sat' },
        ...prev
      ])
    }

    // setListOfScores((prevList) => [
    //   { ...testScores, type: miniTab },
    //   ...prevList,
    // ]);
    setTestScores({
      math: "",
      reading: "",
      total: "",
      date: "",
      type: miniTab,
    });
  };

  const handleInterested = () => {
    if (profile.interested && profile.interested.trim() !== "") {
      setError(false);

      setInterestedData((prevList) => [...prevList, profile.interested]);

      setProfile((prev) => ({
        ...prev,
        interested: "",
      }));
    } else {
      setError(true);
    }
  };

  const handleDeleteScores = (index) => {

    if (miniTab === 'psat') {

      const updatedScores = psatData.filter((_, idx) => idx !== index);
      setPsatData(updatedScores);

    } else if (miniTab === 'sat') {
      const updatedScores = satData.filter((_, idx) => idx !== index);
      setSatData(updatedScores);
    }

    // if (listOfScores[index].type === miniTab) {
    //   const updatedScores = listOfScores.filter((_, idx) => idx !== index);
    //   setListOfScores(updatedScores);
    // }
  };

  const handleDeleteMajors = (index) => {
    const updatedMajors = interestedData.filter((_, idx) => idx !== index);
    setInterestedData(updatedMajors);
  };

  const handleClear = () => {
    setProfile({
      name: "",
      email: "",
      gender: "",
      address: "",
      cgpa: "",
      interested: "",
      current_Year: "",
      // cgpa: "",
      school: "",
      rank: "",
      school_address: "",
      ethnicity: "",
      total: "",
      description: "",
      number: ""
    });
  };

  useEffect(() => {
    if (props.selecteduser) {
      const formdata = new FormData();
      formdata.append("user_id", props.selecteduser);

      dispatch(user_profile_info(formdata, tokenSelector));
      dispatch(users_data("", tokenSelector));
    } else {
      dispatch(user_profile_info("", tokenSelector));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    checkDevice()

    if (profileSelector?.profileData) {
      setProfile({
        name: profileSelector?.profileData?.name,
        email: profileSelector?.profileData?.email,
        school: profileSelector?.profileData?.university_name,
        school_address: profileSelector?.profileData?.university_address,
        ethnicity: profileSelector?.profileData?.ethnicity,
        address: profileSelector?.profileData?.address,
        cgpa: profileSelector?.profileData?.cgpa === '0.00' ? '' : profileSelector?.profileData?.cgpa,
        interested: profileSelector?.profileData?.interested_majors,
        current_Year: profileSelector?.profileData?.current_year,
        rank: profileSelector?.profileData?.class_rank,
        number: profileSelector?.profileData?.phone,
        description: profileSelector?.profileData?.description,
      });
      setSubId(profileSelector?.profileData?.gender);
      setSubIdConstant(profileSelector?.profileData?.gender);

      setInterestedData(profileSelector?.profileData?.interested_majors);


      const satListing = profileSelector?.profileData?.test_scores && coverttestScores(profileSelector?.profileData?.test_scores.filter((item) => item.type === 'sat'))
      const psatListing = profileSelector?.profileData?.test_scores && coverttestScores(profileSelector?.profileData?.test_scores.filter((item) => item.type === 'psat'))

      // const scores = coverttestScores(profileSelector?.profileData?.test_scores)

      // setListOfScores(scores);

      setPsatData(psatListing)
      setSatData(satListing)

      setProfile((prev) => ({
        ...prev,
        interested: "",
      }));
    }

    // eslint-disable-next-line
  }, [profileSelector]);


  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);

      setKey('Personal')

      // if (key === "Academic" || validated) {
      //   setKey('Personal')
      // } 
      // else if (key === "Personal" || validated) {
      //   setKey('Academic')
      // }

    } else {
      if (subIdConstant !== subId) {
        setValidated(false);
        setModalShow(true);
      } else {
        setValidated(false);
        setIsDisable(true);
        update_user_info();
      }
    }
  };

  const handleScoresValidation = (event) => {
    event.preventDefault(); // Stop form submission
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      // If the form is invalid
      event.stopPropagation(); // Stop the event from bubbling further
      setScoreValidation(true); // Show validation feedback in UI
    } else {
      // Form is valid, proceed with custom logic
      setScoreValidation(false); // Reset validation flag
      handleScores(); // Call the function that handles score submission
    }
  };

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };

  useEffect(() => {
    // if (props.selecteduser) {
    //   setIsDisable(true);
    // }
    // eslint-disable-next-line
  }, [profileSelector]);

  const update_user_info = () => {

    const scores = formatTestScores(psatData, satData)

    const payload = {
      user_id: props.selecteduser,
      name: profile?.name,
      gender: subId,
      university_name: profile.school,
      university_address: profile?.school_address,
      cgpa: profile?.cgpa,
      email: profile?.email,
      address: profile?.address,
      phone: profile?.number,
      current_year: profile?.current_Year,
      class_rank: profile?.rank,
      interested_majors: interestedData,
      ethnicity: profile.ethnicity,
      description: profile?.description,
      test_scores: scores,
    }
// console.log('=-===========>payload',payload)
// console.log('=-===========>profile',profile)
    // return false 

    commonApi
      .update_user_info(payload, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message);

          if (user_type === 'user') {
            dispatch(Gender_Change(res?.user_info?.gender, tokenSelector));

            dispatch(get_user_info(tokenSelector))

          }

          // dispatch(user_profile_info("", tokenSelector));

          localStorage.setItem("gender", subId);

          if (props.type === "OwnProfile") {
            props.setGenderofProfile(subId === "male" ? true : false);
          }

          handleClear();
          props.onHide();
        } else {
          errorMessage(res.message);
          setIsDisable(false);
        }
      })
      .catch((err) => {
        setIsDisable(false);
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleSubDropdownChange = (id) => {
    setSubId(id);
  };


  return (
    <>
      <Modal
        id="view-modal"
        className="custom-modal1 custom-modal2 custom-modal3"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          {/* <Modal.Title id="contained-modal-title-vcenter">
            </Modal.Title> */}
          <h4>View Profile</h4>
          <i
            className="fa-solid fa-xmark"
            onClick={() => {
              handleClear()
              props.onHide();
            }}
          ></i>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-tab-block">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
              >
                <Tab
                  eventKey="Academic"
                  title={
                    <div>
                      <span>Academic</span>
                    </div>
                  }
                >
                  <>
                    {/* <Form noValidate validated={validated} onSubmit={handleSubmit}> */}
                    <div className="Profile-from">
                      <div className="current-year-section d-flex">
                        <div className="form-group">
                          <Form.Label id="name1">Current Year</Form.Label>
                          <Form.Control
                            htmlFor="Current Year"
                            // required
                            pattern="^\S.*"
                            type="number"
                            placeholder="Current Year"
                            name="current_Year"
                            value={profile.current_Year}
                            onChange={handleInputChange}
                            autocomplete='off'
                          // id={props.selecteduser ? "email-input-disabled" : ""}
                          // readOnly={props.selecteduser ? true : false}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please avoid space in start.
                          </Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                          <Form.Label id="name1">GPA</Form.Label>
                          <Form.Control
                            htmlFor="cgpa"
                            // required
                            pattern="^\S.*"
                            type="number"

                            step="0.01"
                            placeholder="GPA"
                            name="cgpa"
                            value={profile.cgpa}
                            onChange={handleInputChange}
                            autocomplete='off'
                          // id={props.selecteduser ? "email-input-disabled" : ""}
                          // readOnly={props.selecteduser ? true : false}
                          />
                          <Form.Control.Feedback type="invalid">
                            Invalid gpa
                          </Form.Control.Feedback>
                        </div>
                      </div>
                      <div className="univeriy-cgp">
                        <div className="form-group">
                          <Form.Label id="name1">High School Name</Form.Label>
                          <Form.Control
                            htmlFor="School"
                            // required
                            pattern="^\S.*"
                            type="text"
                            placeholder="High School Name"
                            name="school"
                            value={profile.school}
                            onChange={handleInputChange}
                            autocomplete='offfffffffffffff'
                            // id={props.selecteduser ? "email-input-disabled" : ""}
                          // readOnly={props.selecteduser ? true : false}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please avoid space in start.
                          </Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                          <Form.Label id="name1">Class Rank</Form.Label>
                          <Form.Control
                            htmlFor="University Address"
                            // required
                            pattern="^\S.*"
                            type="text"
                            placeholder="Class Rank"
                            name="rank"
                            value={profile.rank}
                            onChange={handleInputChange}
                            autocomplete='off'
                          // id={props.selecteduser ? "email-input-disabled" : ""}
                          // readOnly={props.selecteduser ? true : false}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please avoid space in start.
                          </Form.Control.Feedback>
                        </div>
                      </div>
                      <div className="form-group High-School-from">
                        <Form.Label id="name1">High School Address</Form.Label>
                        <Form.Control
                          htmlFor="school_address"
                          // required
                          pattern="^\S.*"
                          type="text"
                          placeholder="High School Address"
                          name="school_address"
                          value={profile.school_address}
                          onChange={handleInputChange}

                          autocomplete='off'
                          // id={props.selecteduser ? "email-input-disabled" : ""}
                        // readOnly={props.selecteduser ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please avoid space in start.
                        </Form.Control.Feedback>
                      </div>
                    </div>
                  </>
                </Tab>
                <Tab
                  eventKey="Personal"
                  title={
                    <div>
                      <span>Personal</span>
                    </div>
                  }
                >
                  <div className="Education-from">
                    <div
                      className="form-group name-from"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      {/* <h4>View Profile</h4> */}
                      <Form.Label id="name1">Name</Form.Label>
                      <Form.Control
                        htmlFor="name1"
                        required
                        type="text"
                        placeholder="Name"
                        name="name"
                        pattern="^\S.*"
                        autocomplete='off'
                        // id={props.selecteduser ? "email-input-disabled" : ""}
                        value={profile.name}
                        // readOnly={props.selecteduser ? true : false}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {profile.name
                          ? "Please avoid space in start."
                          : "Name is required."}
                      </Form.Control.Feedback>
                    </div>
                    <div className="Email-section d-flex">
                      <div
                        className="form-group"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          htmlFor="email"
                          type="email"
                          placeholder="Email"
                          name="email"
                          // id="email-input-disabled"
                          value={profile.email}
                          // readOnly={true}
                          onChange={handleInputChange}
                          required
                          autocomplete='offrrrrrrrrrrrrrrrr'
                        />
                        <Form.Control.Feedback type="invalid">
                          {profile.email
                            ? "Invalid Email."
                            : "Email is required."}
                        </Form.Control.Feedback>
                      </div>
                      <div
                        className="form-group"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          htmlFor="number"
                          type="tel"
                          placeholder="Phone Number"
                          name="number"
                          pattern="[0-9]*"
                          // id="email-input-disabled"
                          value={profile.number}
                          // readOnly={true}
                          onChange={handleInputChange}
                          required
                          autoComplete="new-phonenumber"  // Use this to prevent autofill
                          />
                        <Form.Control.Feedback type="invalid">
                          {profile.number
                            ? "Enter valid number"
                            : "Phone number is required."}
                        </Form.Control.Feedback>
                      </div>
                    </div>
                    <div className="form-group address-from">
                      <Form.Label id="name1">Address</Form.Label>
                      <Form.Control
                        htmlFor="address"
                        // required
                        pattern="^\S.*"
                        type="text"
                        placeholder="Address"
                        name="address"
                        // id={props.selecteduser ? "email-input-disabled" : ""}
                        value={profile.address}
                        onChange={handleInputChange}
                        autoComplete="new-address"  // Use this to prevent autofill
                        // readOnly={props.selecteduser ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please avoid space in start.
                      </Form.Control.Feedback>
                    </div>
                    <div className="form-group description-from">
                      <label className="form-label" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="5"
                        name="description"
                        value={profile.description}
                        onChange={handleInputChange}
                        placeholder="Enter your description here"
                        autocomplete='off'
                      ></textarea>
                    </div>
                    <div className="general-section d-flex align-items-center">
                      <div className="form-group">
                        <Form.Label id="group">Gender</Form.Label>
                        <div className="custom-form-slect-field">
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              id="dropdown-basic"
                            // readOnly={props.selecteduser ? true : false}
                            // id="email-input-disabled"
                            >
                              {subId &&
                                Gender.find((item) => item.id === subId)?.title}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {Gender.map((item) => (
                                <Dropdown.Item
                                  key={item.id}
                                  onClick={() =>
                                    handleSubDropdownChange(item.id)
                                  }
                                  readOnly={true}
                                // disabled={true}
                                // id="email-input-disabled"
                                >
                                  {item.title}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="form-group">
                        <Form.Label id="name1">Ethnicity</Form.Label>
                        <Form.Control
                         autoComplete='ggggggggggggggggggg'
                          type="text"
                          className="form-control"
                          id="ethnicity"
                          pattern="^\S.*"
                          name="ethnicity"
                          placeholder="Enter your ethnicity"
                          value={profile.ethnicity}
                          onChange={handleInputChange}
                         
                        />
                        <Form.Control.Feedback type="invalid">
                          Please avoid space in start.
                        </Form.Control.Feedback>

                        {/* <label className="form-label" htmlFor="ethnicity">
                          Ethnicity
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="ethnicity"
                          placeholder="Enter your ethnicity"
                          value={profile.ethnicity}
                          onChange={handleInputChange}
                        /> */}
                      </div>
                    </div>
                  </div>
                  <Button
                    style={{ display: "none" }}
                    ref={buttonRef}
                    type="submit"
                  >
                    add
                  </Button>
                </Tab>
              </Tabs>
            </Form>
            {key === "Academic" && (
              <>
                <div className="Test-Sction d-flex">
                  <h4 className="mt-0">Test Scores</h4>
                  <div className="Test-button d-flex align-items-center">
                    <div
                      onClick={() => {
                        resetScores()
                        setMiniTab("sat");
                        
                      }}
                    >
                      <span className={miniTab === "sat" ? "active" : ""}>
                        Sat Score
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        resetScores()
                        setMiniTab("psat");
                        
                      }}
                    >
                      <span className={miniTab === "psat" ? "active" : ""}>
                        Psat Score
                      </span>
                    </div>
                  </div>

                  <Form
                    noValidate
                    validated={scoreValidation}
                    onSubmit={handleScoresValidation}
                  >
                    <div className="Reading-section d-flex">
                      <div className="form-group math-section">
                        <Form.Label htmlFor="math">Math</Form.Label>
                        <Form.Control
                          id="math"
                          type="number"
                          min={200}
                          max={800}
                          placeholder="Math"
                          name="math"
                          value={testScores.math}
                          onChange={handleScoresChange}
                          required
                          autocomplete='off'
                          onKeyPress={(e) => {
                            // Prevent 'e' and other unwanted characters
                            if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || e.key === '.') {
                              e.preventDefault();
                            }
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          200 to 800 max
                        </Form.Control.Feedback>
                      </div>

                      <div className="form-group">
                        <Form.Label htmlFor="reading">
                          Reading and Writing
                        </Form.Label>
                        <Form.Control
                          id="reading"
                          type="number"
                          min={1}
                          max={500}
                          placeholder="Reading and Writing"
                          name="reading"
                          value={testScores.reading}
                          onChange={handleScoresChange}
                          required
                          autocomplete='off'
                          onKeyPress={(e) => {
                            // Prevent 'e' and other unwanted characters
                            if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || e.key === '.') {
                              e.preventDefault();
                            }
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          1 to 500 max
                        </Form.Control.Feedback>
                      </div>

                      <div className="form-group">
                        <Form.Label htmlFor="total">Total</Form.Label>
                        <Form.Control
                          id="total"
                          type="number"
                          min={1}
                          max={1300}
                          placeholder="Total"
                          name="total"
                          value={testScores.total}
                          autocomplete='off'
                          // onChange={handleInputChange}
                          // required
                          readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                          1 to 1300 max
                        </Form.Control.Feedback>
                      </div>

                      <div className="form-group date-optional">
                        <Form.Label htmlFor="date">Date (optional)</Form.Label>
                        <Form.Control
                          id="date"
                          type="date"
                          placeholder="Date"
                          name="date"
                          value={testScores.date}
                          onChange={handleScoresChange}
                          autocomplete='off'
                        />
                      </div>

                      <Button type="submit">Add</Button>
                    </div>
                  </Form>

                  <AddListing
                    // scoresList={listOfScores}
                    type={"scores"}
                    miniTab={miniTab}
                    psatData={psatData}
                    satData={satData}
                    handleDeleteScores={handleDeleteScores}
                  />
                </div>
                <div className="Majors-section">
                  <div className="form-group">
                    <label className="form-label" htmlFor="interestedMajors">
                      Interested Majors
                    </label>
                    <input
                      type="text"
                      name="interested"
                      className="form-control"
                      id="interestedMajors"
                      placeholder="Enter your interested majors"
                      value={profile.interested}
                      onChange={handleInputChange}
                      autocomplete='off'
                    />

                    {error && (
                      <div className="invalid-feedback d-block">
                        This field is required
                      </div>
                    )}
                  </div>

                  <Button type="button" onClick={handleInterested}>
                    Add
                  </Button>
                </div>
                <AddListing
                  interestedData={interestedData}
                  type={"interesting"}
                  handleDeleteMajors={handleDeleteMajors}
                />
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              handleClick();
            }}
            disabled={isDisable}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {modalShow && (
        <GenderChange
          show={modalShow}
          onHide={() => setModalShow(false)}
          backdrop="static"
          keyboard={false}
          subId={subId}
          setSubId={setSubId}
          onSave={() => { update_user_info(); }}
        />
      )}
    </>
  );
};

export default ViewProfile;
