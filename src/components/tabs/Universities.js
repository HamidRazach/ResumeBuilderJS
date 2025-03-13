import React, { useEffect, useRef, useState } from "react";

import {
  cardlisting,
  statusChange,
  styleComponent,
  universityDropDownList,
} from "../../constant/commonUtils";
import { useDispatch, useSelector } from "react-redux";
import AddCollege from "../Modals/AddCollege";
import { height_action } from "../../Redux/HeightAction";
import { scroll_action } from "../../Redux/ScrollableAction";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage } from "../../Errors/Toast";
import Calendar from "../Dashoard/Calander";
import ViewAll from "../Dashoard/ViewAll";
import MaskUser from "../Dashoard/MaskUser";
import DashboardTab from "./DashboardTab";
import MiniCard from "../Dashoard/MiniCard";
import { frame3_icon } from "../../constant/images";

const Universities = (props) => {
  const {
    para,

    heading,
  } = props;
  const [modalShow2, setModalShow2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownId, setdropdownId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [spinnerLoader, setSpinnerLoader] = useState(1);
  const [universityListing, setUniversityListing] = useState([]);
  const [tabtype, setTabtype] = useState("discovered");
  const [selectedUniData, setSelectedUniData] = useState({});
  const userSelector = useSelector((state) => state.rootReducer);

  const dispatch = useDispatch();

  // const { universityListing, tabtype, setTabtype } = props;
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  // const selectedTrueArray = universityListing?.filter((item) => item.selected);
  // const selectedFalseArray = universityListing?.filter(
  //   (item) => !item.selected
  // );

  const [selectedFalseArray, setSelectedFalseArray] = useState([]);
  const [selectedTrueArray, setSelectedTrueArray] = useState([]);

  const [scrollLock, setScrollLock] = useState(false);  // To prevent scroll trigger on tab switch

  useEffect(() => {
  
    // Reset page number and scroll position when switching tabs
    setPageNumber(1);
    setScrollLock(true);  // Lock scroll for a brief moment when switching tabs
    document.getElementById('scroll-container-main').scrollTop = 0; 
  
  
    // Unlock scroll after a small delay
    setTimeout(() => setScrollLock(false), 500); 
  }, [tabtype,searchQuery]);
  
  let debounceTimer = null;

  const handleScroll = (e) => {
    if (scrollLock) return;
  
    const target = e.target;
    console.log('scrollHeight:', target.scrollHeight, 'scrollTop:', target.scrollTop, 'clientHeight:', target.clientHeight);
  
    const tolerance = 5;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + tolerance;
  
    if (bottom) {
      clearTimeout(debounceTimer); // Clear the previous timer
  
      debounceTimer = setTimeout(() => {
        if (tabtype === "discovered") {
          get_university(pageNumber + 1, searchQuery);
         
        } else {
          selected_university(pageNumber + 1, searchQuery);
        }
      }, 300); // Adjust the debounce delay as needed
    }
  };
  const fetchMoreData = () => {
   
      clearTimeout(debounceTimer); // Clear the previous timer
  
      debounceTimer = setTimeout(() => {
        if (tabtype === "discovered") {
          get_university(pageNumber + 1, searchQuery);
         
        } else {
          selected_university(pageNumber + 1, searchQuery);
        }
      }, 300); // Adjust the debounce delay as needed
    
  };

  const get_university = (page) => {
    const formData = new FormData();

    formData.append("group", dropdownId);
    // formData.append("subcategory", subId);
    formData.append("search", searchQuery);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    commonApi
      .get_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setUniversityListing((prevData) => [
                  ...prevData,
                  ...fetchedData,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setUniversityListing(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setUniversityListing([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
          
          }
        }
        setSpinnerLoader(false);
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };
  const selected_university = (page) => {
    const formData = new FormData();

    formData.append("group", dropdownId);
    // formData.append("subcategory", subId);
    formData.append("search", searchQuery);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    commonApi
      .selected_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setUniversityListing((prevData) => [
                  ...prevData,
                  ...fetchedData,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setUniversityListing(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setUniversityListing([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
         
          }
          setSpinnerLoader(false);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  // useEffect(() => {
  //   if (universityListing?.length > 0) {
  //     const unSelectedData = universityListing.filter((item) => !item.selected);
  //     setSelectedFalseArray(unSelectedData);

  //     const selectedData = universityListing.filter((item) => item.selected);
  //     setSelectedTrueArray(selectedData);
  //   } else {
  //     // Clear arrays when universityListing is empty
  //     setSelectedFalseArray([]);
  //     setSelectedTrueArray([]);
  //   }
  // }, [universityListing, searchQuery]);
  useEffect(() => {
    setSpinnerLoader(true);

    if (tabtype === "discovered") {
      
      get_university(1, "");
    } else {
      selected_university(1, "");
    }
  }, [tabtype, searchQuery]);

  

  // useEffect(() => {
  //   if (tabtype === "list") {
  //     dispatch(height_action(selectedFalseArray, "list"));
  //   } else if (tabtype === "select") {
  //     dispatch(height_action(selectedTrueArray, "select"));
  //   }
  //   // eslint-disable-next-line
  // }, [tabtype, universityListing]);

  const handleShowModel = (item) => {
    if (item) {
      setSelectedUniData(item);
      setModalShow2(true);
    } else {
      setModalShow2(true);
    }
  };

  const getTitleById = (id) => {
    // Find the object in ScndStepList where id matches the input id
    const matchingObject = universityDropDownList.find(
      (item) => item.id === id
    );

    // If a matching object is found, return its title
    if (matchingObject) {
      return matchingObject.title;
    } else {
      return "Title not found"; // Return a default value if no matching title is found
    }
  };

  useEffect(() => {
    setSearchQuery("");
    // eslint-disable-next-line
  }, [tabtype]);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const containerRef2 = useRef(null);
  const container = containerRef.current;
  const container2 = containerRef2.current;

  useEffect(() => {
    if (dataLength && (container || container2)) {
      setTimeout(() => {
        if (
          (container && container.scrollHeight > container.clientHeight) ||
          (container2 && container2.scrollHeight > container2.clientHeight)
        ) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [dataLength, container, container2, tabtype, universityListing]);

  const status_change_scholarship = (status, id) => {
    const formData = new FormData();

    formData.append("subject_id", id);
    formData.append("status", status);
    formData.append("type", "university");

    commonApi
      .status_change_colleges_scholarship(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleDropdownChange = (id, selectedValue) => {
    const updateArray = statusChange(selectedValue, universityListing, id);
    setUniversityListing(updateArray);
    status_change_scholarship(selectedValue, id);
  };

  const select_university = (item) => {
    const formData = new FormData();

    formData.append("university_id", item.id);

    commonApi
      .select_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
        const filterAnswers = universityListing && universityListing.length > 0 && universityListing?.filter((items, index)=> items.id !== item.id)         
        setUniversityListing(filterAnswers)
        successMessage(res.message);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  const handleUserAction = (item, type) => {
    if (userSelector?.user?.user_type !== "admin") {
      if (type === "select") {
        select_university(item);
      }
    } else {
      handleShowModel(item);
    }
  };

  return (
    <>
      <div className={"line-chart-main-container-user"}>
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-sm-9 pe-4 progress-3">
              <DashboardTab
                handleScroll={handleScroll}
                tabs={
                  userSelector?.user?.user_type === "user"
                    ? [
                        { name: "Discovered", id: "discovered" },
                        { name: "Selected", id: "select" },
                      ]
                    : [{ name: "Discovered", id: "discovered" }]
                }
                setTabtype={setTabtype}
                tabType={tabtype}
                dropdownListing={universityDropDownList}
                dropdownSelected={setdropdownId}
                dropdownSelectedId={dropdownId}
                listing={
                  universityListing
                  // userSelector?.user?.user_type !== "admin"
                  //   ? tabtype === "list"
                  //     ? selectedFalseArray
                  //     : tabtype === "select" && selectedTrueArray
                  //   : universityListing
                }
                userAction={handleUserAction}
                type={"universities"}
                setSearhQuery={setSearchQuery}
                searchQuery={searchQuery}
                userType={userSelector?.user?.user_type}
                getTitleById={getTitleById}
                handleDropdownChange={handleDropdownChange}
                group={"universities"}
                nameClasss={"journey-listingsss"}
                styleComponent={styleComponent}
                spinnerLoader={spinnerLoader}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                fetchMoreData={fetchMoreData}
                paragraphs={[
                  {
                    title:
                      "Highly Selective Liberal Arts Colleges and Ivy League Universities",
                    para: para,
                  },
                ]}
              />
            </div>

            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div>
                <MiniCard
                  handleShowModel={handleShowModel}
                  cardlisting={
                    userSelector?.user?.user_type === "user"
                      ? [cardlisting[2]]
                      : [{ uperName: "Add Collage", img: frame3_icon }]
                  }
                />
              </div>
              {/* } */}
              <div className="mb-4">
                <Calendar />
              </div>
              <div className="card-group-section">
                <ViewAll />
                {userSelector?.user?.user_type === "user" && <MaskUser />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalShow2 && (
        <AddCollege
          show={modalShow2}
          onHide={() => {
            setModalShow2(false);
            setSelectedUniData({});
          }}
          selectedUniData={selectedUniData}
          universityListing={universityListing}
          setUniversityListing={setUniversityListing}
        />
      )}
    </>
  );
};

export default Universities;
