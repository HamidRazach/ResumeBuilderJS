import React, { useEffect, useRef, useState } from "react";
import {
  womenImg,
  pathFinderLogo,
  menImg,
  notification_icon,
} from "../../constant/images";
import "../../assets/css/custom.css";
// import { Button } from "react-bootstrap";
import ViewProfile from "../Modals/ViewProfile";
import { useSelector } from "react-redux";
import DropdownTopBar from "./dropdownTopBar";
import NotificationDropdown from "../header/NotificationDropdown";
import { successMessage } from "../../Errors/Toast";
import commonApi from "../../CommonApi/CommonServices";
// import { Button } from "react-bootstrap";
// import { decryptData } from "../../Secure_data";

// const logout = () => {
//   localStorage.clear();
//   window.location.replace("/login");
// };

const Topbar = (props) => {
  const genderSelector = useSelector((state) => state.rootReducer);
  const tokenSelector = genderSelector?.user?.token
  // const userName = useSelector(
  //   (state) => state.profileReducer?.profileData?.name
  // );
  const userName = useSelector(
    (state) => state.userProfileReducer?.user_profile_data?.name
  );
  const menuRef = useRef(null);

  const [dropdownValue, setDropdownValue] = useState("");
  const [modalShow2, setModalShow2] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [genderofProfile, setGenderofProfile] = useState(
    // localStorage.getItem("gender") === "male" ? true : false
    genderSelector?.user?.gender === "male" ? true : false
  );


  // const [pricingData, setPricingData] = useState({
  //   grade: "",
  //   id: "",
  //   price: "",
  //   type: "",
  // });

  // const pricingSelector = useSelector(state=>state.payment_reducer)

  // const handle = () => {
  //   setPricingData({
  //     grade: pricingSelector?.data?.grade,
  //     id: pricingSelector?.data?.id,
  //     price: pricingSelector?.data?.price,
  //     type: pricingSelector?.data?.type,
  //   })
  // };

  const items = genderSelector?.user?.user_type === 'user' ? ["Academic", "Personal", "Logout"] : ["Logout"];

  const handleSelect = (id) => {
    if (id === "Logout") {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      setDropdownValue(id);
      setModalShow2(true);
    }
  };


  const notifications = [
    { message: "You have a new message", link: "/messages" },
    { message: "Your order is ready", link: "/orders" },
    { message: "You have a new message", link: "/messages" },
    { message: "Your order is ready", link: "/orders" },
    { message: "You have a new message", link: "/messages" },
    { message: "Your order is ready", link: "/orders" },
    { message: "You have a new message", link: "/messages" },
    { message: "Your order is ready", link: "/orders" },

  ];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };



  return (
    // <div className="main-top-bar" style={{ minHeight: "72px" }}>

    //   <div className="logo-holder">
    //     <img src={pathFinderLogo} alt="path-finder-logo" />
    //   </div>

    //   <div className="img-holder">
    //     {genderSelector?.user?.user_type !== "admin" && (
    //       <div className="custom-profile-btn">
    //         <img
    //           src={genderofProfile ? menImg : womenImg}
    //           alt="women"
    //           onClick={() => {
    //             setModalShow2(true);
    //           }}
    //         />
    //       </div>
    //     )}
    //     <div
    //       className="menu_Icon"
    //       onClick={() => {
    //         props.setMenuToggle(!props.menuToggle);
    //       }}
    //     >
    //       <i className="fa-solid fa-bars"></i>
    //     </div>
    //     {/* <Button type="button" variant="outline-success"
    //     onClick={()=>handle()}
    //     >
    //       Pricing Data
    //     </Button> */}
    //   </div>

    //   {modalShow2 && (
    //     <ViewProfile
    //       show={modalShow2}
    //       onHide={() => setModalShow2(false)}
    //       setGenderofProfile={setGenderofProfile}
    //       genderofProfile={genderofProfile}
    //       type="OwnProfile"
    //     />
    //   )}
    // </div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" >
        <img src={pathFinderLogo} alt="Logo" />
      </a>
      
      <div
        className="menu_Icon as-link"
        onClick={() => {
          props.setMenuToggle(!props.menuToggle);
        }}
      >
        <i className="fa-solid fa-bars"></i>
      </div>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item" id="profile-dropdown">
            <a className="nav-link" >
              {/* <img
                src={notification_icon}
                alt="Notifications"
                style={{ width: 24, height: 24 }}
              /> */}
                   {genderSelector?.user?.user_type !== "admin" &&
              <NotificationDropdown />}
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle as-link"
              // href="#"
              id="userDropdown"
              role="button"
             
            ><div className="username">
                {genderSelector?.user?.user_type !== "admin" && (

                  <img
                    onClick={() => {
                      setModalShow2(true);
                    }}
                    src={genderofProfile ? menImg : womenImg}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: 30, height: 30 }}
                  />
                )}

                <div 
                className="username"
                 ref={menuRef} 
                 onClick={() => {
                  toggleDropdown();
                }}>

                <p style={{ margin: '0px' }}>{userName}</p>
                <i
              className={`fa-solid ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}
              style={{ color: "#85888a" }}
            ></i>

              </div>
              </div>
              
            </a>
            {showDropdown && (
              <DropdownTopBar
                items={items}
                onSelect={handleSelect}
                setIsOpen={setShowDropdown}
                isOpen={showDropdown}
                menuRef={menuRef}
              />
            )}
          </li>
        </ul>
      </div>
      {modalShow2 && (
        <ViewProfile
          show={modalShow2}
          onHide={() => {setModalShow2(false);setDropdownValue('')}}
          setGenderofProfile={setGenderofProfile}
          genderofProfile={genderofProfile}
          type="OwnProfile"
          tabValuePreSelect={dropdownValue}
        />
      )}
    </nav>
  );
};

export default Topbar;
