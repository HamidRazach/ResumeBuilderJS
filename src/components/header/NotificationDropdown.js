import React, { useEffect, useRef, useState } from "react";
import { no_notification_icon, notification_icon } from "../../constant/images";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import commonApi from "../../CommonApi/CommonServices";
import {
  get_notification,
} from "../../Redux/notificationActions";
import { useLocation } from "react-router-dom";
const NotificationDropdown = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const choice = useSelector((state) => state.rootReducer?.user);
  const notifications = useSelector((state) => state.notification_reducer?.notificationListing);
  const dispatch = useDispatch();
  const chooseUser = choice?.user_type;


  const menuRef = useRef(null);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const [status, setStatus] = useState(
    notifications && notifications.length > 0 &&
      notifications && notifications[0].status === 'no'
      ? true
      : false
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (
      notifications && notifications.length > 0 &&
        notifications && notifications[0].status === "no"
        ? true
        : false
    ) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [location.pathname, notifications]);

  const read_notification = () => {
    commonApi
      .read_notification("", choice?.token)
      .then((res) => {
        if (res.status === 200 && res.success === true) {

          setStatus(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  useEffect(() => {
    if (isOpen) {
      if(notifications && notifications.length > 0 && notifications[0].status === 'no'){
      read_notification()
      }
    } else {
      dispatch(get_notification(choice?.token));
    }
  }, [isOpen]);


  return (
    <li ref={menuRef} className="nav-item dropdown">
      <a
        className="nav-link d-flex flex-column align-items-center justify-content-center profile_icons as-link"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <img
          src={status ? notification_icon : no_notification_icon}
          alt="Notifications"
          style={{ width: 24, height: 24 }}
        />
        <IoIosArrowDown />
      </a>

      <div
        className={`dropdown-menu ${chooseUser === "admin" && "admin-notification"
          } ${isOpen ? "show" : ""} `}
      >

{notifications && notifications.length > 0 &&
        <div className="notification-title">  <h3 className="text-center">Notifications</h3></div>
}
        <div className={`${notifications && notifications.length > 0 ? 'notication-title' : ' no-record-notication-title'}`}>
          {notifications && notifications.length > 0 ? (
            notifications.map((item, index) => (
              <a
                className="dropdown-item"
                href={item.link}
                target="_blank"   
                key={index}
                onClick={()=>setIsOpen(!isOpen)}
              >
                {item.notification}
              </a>
            ))
          ) : (
            <span className="dropdown-item">No notifications</span>
          )}
        </div>
      </div>
    </li>
  );
};

export default NotificationDropdown;
