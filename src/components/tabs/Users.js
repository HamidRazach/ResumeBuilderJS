import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ViewProfile from "../Modals/ViewProfile";

import { styleComponent } from "../../constant/commonUtils";

import { height_action } from "../../Redux/HeightAction";
import { scroll_action } from "../../Redux/ScrollableAction";
import { users_data } from "../../Redux/ProfileAction";

import ViewAll from "../Dashoard/ViewAll";
import Calendar from "../Dashoard/Calander";
import DashboardTab from "./DashboardTab";

export default function Users(props) {
  const usersSelector = useSelector((state) => state.profileReducer);
  const [data, setData] = useState([]);
  const [modalShow2, setModalShow2] = useState(false);
  const [selecteduser, setSelectedUser] = useState("");
  const dispatch = useDispatch();
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const chooseUser = useSelector((state) => state.rootReducer);

  const handleDetailClick = (userId) => {
    setSelectedUser(userId.id);
    setModalShow2(true);
  };

  useEffect(() => {
    if (usersSelector?.usersData.length > 0) {
      setData(
        usersSelector?.usersData.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.contact,
          // score: roundAndFormatNumberString(user.score),
          payment_status: user.payment_status,
        }))
      );
    }
  }, [usersSelector]);

  useEffect(() => {
    dispatch(height_action(data, "list"));
    // eslint-disable-next-line
  }, [data]);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const container = containerRef.current;

  useEffect(() => {
    if (dataLength && container) {
      setTimeout(() => {
        if (container && container.scrollHeight > container.clientHeight) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [dataLength, container, data]);

  return (
    <>
      <div className={"line-chart-main-container-user"}>
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-sm-9 pe-4 progress-3">
              <DashboardTab
                listing={data}
                userAction={handleDetailClick}
                type={"profile"}
                styleComponent={styleComponent}
              />
            </div>

            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div className="mb-4">
                <Calendar />
              </div>
              <ViewAll />
            </div>
          </div>
        </div>
      </div>

      {modalShow2 && (
        <ViewProfile
          show={modalShow2}
          onHide={() => {
            setModalShow2(false);
            dispatch(users_data("", tokenSelector));
          }}
          selecteduser={selecteduser}
        />
      )}
    </>
  );
}
