import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import SliderSlick from "../slider/SliderSlick";
import {
  DropDownValues,
  universityDropDownList,
  SubDropDown,
} from "../../constant/commonUtils";
import ShowResumeModel from "../Modals/ShowResumeModel";
import { useSelector } from "react-redux";

const Header = ({
  dropdownId,
  setdropdownId,
  subId,
  setSubId,
  setModalShow2,
  dashboardData,
  setHeaderText,
  headerText,
  setShowModelNews,
}) => {
  const location = useLocation();
  const [showModel, setShowModel] = useState(false);
  // const [showModelNews, setShowModelNews] = useState(false);
  const adminSelector = useSelector((state) => state.rootReducer);

  const handleDropdownChange = (id) => {
    setdropdownId(id);
  };
  const handleSubDropdownChange = (id) => {
    setSubId(id);
  };
  const downloadResume = () => {
    setShowModel(true);
  };
  const openNewsModel = () => {
    setShowModelNews(true);
  };
  useEffect(() => {
    setHeaderText("Activities and Roles");
    // eslint-disable-next-line
  }, [location?.pathname]);

  return (
    <>
      {location.pathname !== "/users" && (
        <div className={`header-holder ${location.pathname === '/dashboard' ? 'dasboard-page' : ''}`}>
          <div className="select-field-block d-flex align-items-center col-lg-11">
            {location?.pathname === "/dashboard" && (
              <>
                {dashboardData?.user_details && (
                  <SliderSlick
                    headerText={headerText}
                    setHeaderText={setHeaderText}
                    dashboardData={dashboardData}
                  />
                )}
                <div className="ideal-header">
                  {headerText}
                  <span>Points</span>
                </div>
              </>
            )}
            <div
              className={
                location?.pathname === "/universities"
                  ? "header-custom-from-select-field universities-slect-field-holder"
                  : "header-custom-from-select-field"
              }
            >
              {location?.pathname !== "/dashboard" &&
                location?.pathname !== "/universities" && 
                location.pathname !== "/news" &&(
                  <div className="custom-form-slect-field">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {dropdownId &&
                          DropDownValues.find((item) => item.id === dropdownId)
                            ?.title}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {DropDownValues.map((item, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => handleDropdownChange(item.id)}
                          >
                            {item.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              {location?.pathname === "/universities" && (
                <div className="custom-form-slect-field">
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {dropdownId &&
                        universityDropDownList.find(
                          (item) => item.id === dropdownId
                        )?.title}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {universityDropDownList.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleDropdownChange(item.id)}
                        >
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
              {location?.pathname !== "/universities" &&
                location?.pathname !== "/dashboard" && 
                location.pathname !== "/news" &&(
                  <div className="custom-form-slect-field">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {subId &&
                          SubDropDown.find((item) => item.id === subId)?.title}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {SubDropDown.map((item, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => handleSubDropdownChange(item.id)}
                          >
                            {item.title}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}

              {/* {location?.pathname === "/universities" && !(location?.pathname === "/universities" && adminSelector?.user?.user_type === "admin") && (
              <div className="ideal-header">
                Ideal Score<span>{university_score.score}</span>
              </div>
            )} */}
            </div>

            <div className="head-btn-container">
              {adminSelector?.user?.user_type === "admin" &&
              location.pathname === "/universities" ? (
                <Button
                  variant="success"
                  className="adminBtn"
                  onClick={() => {
                    setModalShow2(true);
                  }}
                >
                  Add College
                </Button>
              ) : // adminSelector?.user?.user_type === "admin" &&
              location.pathname === "/news" ? (
                <>
                  <Button
                    variant="warning"
                    className="custom-resume-btn"
                    onClick={() => {
                      openNewsModel();
                    }}
                  >
                    Add News
                  </Button>
                </>
              ) : adminSelector?.user?.user_type !== "admin" &&
                adminSelector?.user?.payment_status !== false ? (
                <Button
                  variant="warning"
                  className="custom-resume-btn"
                  onClick={() => {
                    downloadResume();
                  }}
                >
                  Preview Resume
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
      {showModel && (
        <ShowResumeModel show={showModel} onHide={() => setShowModel(false)} />
      )}
     
    </>
  );
};

export default Header;
