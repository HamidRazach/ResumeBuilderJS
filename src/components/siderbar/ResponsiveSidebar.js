import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Logout } from "../../Redux/LoginAction";
import {
  grid_icon,
  map_icon,
  logout_icon_svg,
  menImg,
  news_icon_svg,
  student_icon,
  Group_icon,
  clip_icon,
  user_icon,
  womenImg,
} from "../../constant/images";
import { IoNewspaperSharp } from "react-icons/io5";
import { get_notification } from "../../Redux/notificationActions";
import DropdownTopBar from "./dropdownTopBar";
import ViewProfile from "../Modals/ViewProfile";

const ResponsiveSidebar = (props) => {
  const location = useLocation();
  const adminSelector = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const genderSelector = useSelector(
    (state) => state.rootReducer
  );

  const items = ["Academic", "Personal"];
  const [modalShow2, setModalShow2] = useState(false);

  const [genderofProfile, setGenderofProfile] = useState(
    // localStorage.getItem("gender") === "male" ? true : false
    genderSelector?.user?.gender === "male" ? true : false
  );
  const [dropdownValue, setDropdownValue] = useState("");

  const userName = useSelector(
    (state) => state.userProfileReducer?.user_profile_data?.name
  );


  const [activeMenu, setActiveMenu] = useState(
    location?.pathname === "/journey"
      ? 1
      : location?.pathname === "/story" &&
        adminSelector?.user?.user_type === "user"
        ? 2
        : location?.pathname === "/universities" &&
          adminSelector?.user?.user_type === "admin"
          ? 2
          : location?.pathname === "/universities" &&
            adminSelector?.user?.user_type === "user"
            ? 3
            : location?.pathname === "/users" &&
              adminSelector?.user?.user_type === "admin"
              ? 4
              : location.pathname === "/scholarship" &&
                adminSelector?.user?.user_type === "admin"
                ? 3
                : location.pathname === "/scholarship" &&
                  adminSelector?.user?.user_type === "user"
                  ? 4
                  : location?.pathname === "/news"
                    ? 5
                    : location?.pathname === "/dashboard" && 0
  );


  const handleSelect = (id) => {
    if (id === "Logout") {
      localStorage.clear();
      window.location.href = "/login";
    } else {
      setDropdownValue(id);
      setModalShow2(true);
    }
  };
  const navigate = useNavigate();

  const Adminmenu = [
    { name: "Dashboard", img: grid_icon },
    { name: "Journey", img: map_icon },
    { name: "Universities", img: student_icon },
    { name: "Scholarship", img: Group_icon },
    { name: "Profile", img: user_icon },
    { name: "News", img: news_icon_svg },
    { name: "Logout", img: logout_icon_svg },
  ];
  const Usermenu = [
    { name: "Dashboard", img: grid_icon },
    { name: "Journey", img: map_icon },
    { name: "Story", img: clip_icon },
    { name: "Universities", img: student_icon },
    { name: "Scholarship", img: Group_icon },
    { name: "News", img: news_icon_svg },
    { name: "Logout", img: logout_icon_svg },
  ];

  const handleLogout = () => {
    // dispatch(Logout())
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleItemClick = (index) => {
    setActiveMenu(index);
    switch (index) {
      case 0:
        navigate("/dashboard");
        break;
      case 1:
        navigate("/journey");
        break;
      case 2:
        navigate("/universities");
        break;
      case 3:
        navigate("/scholarship");
        break;
      case 4:
        navigate("/users");
        break;
      case 5:
        navigate("/news");
        break;
      case 6:
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleItemClickUser = (index) => {
    setActiveMenu(index);
    switch (index) {
      case 0:
        navigate("/dashboard");
        break;
      case 1:
        navigate("/journey");
        break;
      case 2:
        navigate("/story");
        break;
      case 3:
        navigate("/universities");
        break;
      case 4:
        navigate("/scholarship");
        break;
      case 5:
        navigate("/news");
        break;
      case 6:
        handleLogout();
        break;
      default:
        break;
    }
  };

  const decesionMenu =
    adminSelector?.user?.user_type === "admin" ? Adminmenu : Usermenu;

  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const { pathname } = location;
    const { user_type } = adminSelector?.user;

    if (pathname === "/dashboard") setActiveMenu(0);
    else if (pathname === "/journey") setActiveMenu(1);
    else if (pathname === "/story" && user_type !== "admin") setActiveMenu(2);
    else if (pathname === "/universities" && user_type === "admin") setActiveMenu(2);
    else if (pathname === "/scholarship" && user_type === "admin") setActiveMenu(3);
    else if (pathname === "/universities" && user_type === "user") setActiveMenu(3);
    else if (pathname === "/scholarship" && user_type === "user") setActiveMenu(4);
    else if (pathname === "/users" && user_type === "admin") setActiveMenu(4);
    else if (pathname === "/news") setActiveMenu(5);

    dispatch(get_notification(adminSelector?.user?.token));
    // eslint-disable-next-line
  }, [location.pathname]);




  return (
    <>
      {width > 999 && (
        <div className="MainCustomSidebarr">
          <ListGroup as="ul" className="list-group-flush text-start">
            {decesionMenu.map((item, index) => (
              <ListGroup.Item
                key={index}
                className="border-0 bg-transparent"
                as="li"
                active={activeMenu === index}
                onClick={() => {
                  if (adminSelector?.user?.user_type === "admin") {
                    handleItemClick(index);
                  } else {
                    handleItemClickUser(index);
                  }
                }}
              >
                <img src={item.img}
                  style={{
                    width: ['Logout', 'News'].includes(item.name) && '18px',
                  marginLeft: item.name === 'Logout' ? '3px' : item.name === 'News' && '3px',
                  marginRight: item.name === 'Logout' ? '13px' : item.name === 'News' && '13px'
                  }}
                  alt="img" />
                {item.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      <div
        id="mobile-navbar"
        className={`MainCustomSidebarr ${props.menuToggle ? "open" : "closed"}`}
        style={{ maxHeight: (showDropdown && props.menuToggle) && '410px' }}
      >
        <ListGroup as="ul" className="list-group-flush text-start">
          {decesionMenu.map((item, index) => (
            <ListGroup.Item
              key={index}
              className="border-0 bg-transparent"

              as="li"
              active={activeMenu === index}
              onClick={() => {
                if (adminSelector?.user?.user_type === "admin") {
                  handleItemClick(index);
                  props.setMenuToggle(false);
                } else {
                  handleItemClickUser(index);
                  props.setMenuToggle(false);
                  setShowDropdown(false)
                }
              }}
            >
              <img
                style={{
                  width: ['Logout', 'News'].includes(item.name) && '18px',
                  marginLeft: item.name === 'Logout' ? '3px' : item.name === 'News' && '3px',
                  marginRight: item.name === 'Logout' ? '13px' : item.name === 'News' && '13px'
                }}
                src={item.img} alt="img" />
              {item.name}
            </ListGroup.Item>
          ))}
          {genderSelector?.user?.user_type === "user" &&
            <ListGroup.Item className="border-0 bg-transparent profile-responsive" as="li">
              <div>
                <img
                  onClick={() => {
                    setModalShow2(true);
                  }}
                  src={genderofProfile ? menImg : womenImg} alt="img" 
                  style={{marginRight:'6px'}}/>

                <span onClick={() => {
                  setShowDropdown(!showDropdown)
                }}> {userName}</span>
              </div>
              {adminSelector?.user?.user_type === "user" &&
                <div className="profile_arrow" onClick={() => {
                  setShowDropdown(!showDropdown)
                }}>
                  <i
                    className={`fa-solid ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                    style={{ color: "#85888a" }}
                  ></i>
                </div>
              }
            </ListGroup.Item>
          }
          {showDropdown && (
            <DropdownTopBar
              items={items}
              onSelect={handleSelect}
              setIsOpen={setShowDropdown}
              isOpen={showDropdown}
              type={'sideBar'}
            />
          )}
        </ListGroup>

        {modalShow2 && (
          <ViewProfile
            show={modalShow2}
            onHide={() => { setDropdownValue(''); setModalShow2(false) }}
            setGenderofProfile={setGenderofProfile}
            genderofProfile={genderofProfile}
            type="OwnProfile"
            tabValuePreSelect={dropdownValue}
          />
        )}

      </div >
    </>
  );
};

export default ResponsiveSidebar;
