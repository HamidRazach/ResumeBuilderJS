import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { group9_icon, redBucket } from "../../constant/images";
import DropdownDashboard from "./DropdownDashboard";
import {
  checkDollar,
  convertObjectToString,
  fixScholarshipTitle,
  fixTitle,
  formatPriceToK,
  formatString,
  scholarshipDropdown,
} from "../../constant/commonUtils";
import TooltipButton from "../Dashoard/TooltipButton";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import { IoIosLink, IoMdInformationCircleOutline } from "react-icons/io";
import ScholarshipDeatilModal from "../Modals/ScholarshipDeatilModal";
import DynamicPopover from "./PopOver";
// import TooltipButton from "./TooltipButton";
const DashboardTab = ({
  tabType,
  setTabtype,
  tabs,
  setSearhQuery,
  searchQuery,
  dropdownListing,
  dropdownSelected,
  dropdownSelectedId,
  nameClasss,
  userAction,
  listing,
  type,
  userType,
  getTitleById,
  handleDropdownChange,
  styleComponent,
  group,
  TagsView,
  handle,
  spinnerLoader,
  paragraphs,
  handleScroll,
  is_admin,
  fetchMoreData,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState();
  const [openPopover, setOpenPopover] = useState(null); // Track currently opened popover

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getClassName = () => {
    if (type === "scholarship") {
      return userType === "user" && tabType === "select"
        ? "custom-pl-10 as-link"
        : "custom-pl-10 as-link";
    } else {
      return "custom-pl-10";
    }

    // if (
    //   (type === 'journey' && (tabType === 'discovered' || tabType === 'save')) ||
    //   (type === 'universities' && (tabType === 'discovered' || tabType === 'select')) ||
    //   (type === 'news') ||
    //   (type === 'dashboard')
    // ) {
    //   return 'custom-pl-10';
    // }

    // return '';
  };

  const [hasScrollbar, setHasScrollbar] = useState(false);

  // Function to check if scroll exists
  const checkScrollbar = () => {
    if (type === "profile") {
      return false;
    }
    const hasScroll =
      document.getElementById("scroll-container-main").scrollHeight >
      window.innerHeight;
    setHasScrollbar(hasScroll);
  };

  // Trigger API call if no scroll
  const checkAndFetchMore = () => {
    if (!hasScrollbar && fetchMoreData) {
      fetchMoreData();
    }
  };

  // Monitor array changes and check scroll
  useEffect(() => {
    checkScrollbar();
  }, [listing]);

  // When scrollbar state changes, check if more data needs to be fetched
  useEffect(() => {
    if (!hasScrollbar) {
      checkAndFetchMore();
    }
  }, [hasScrollbar]);

  const new_ScrollBar = (e) => {
    const popoverElement = document.getElementById("popover-basic");

    if (popoverElement) {
      popoverElement.style.display = "none"; // Reset to default on unmount
    }
    if (handleScroll) {
      handleScroll(e);
    }
  };

  const ListingOfPages = () => {
    return (
      <>
        {type === "dashboard" && userType === "admin" && (
          <h5 className="nav nav-tabs border-0 gap-3 trending-title">
            Trending
          </h5>
        )}

        <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between dashboard-name-section">
          <ul className="nav nav-tabs border-0 gap-3">
            {tabs.map((item, idx) => (
              <li
                className="nav-item"
                key={idx}
                onClick={() => {
                  setTabtype(item.id);
                }}
              >
                <a
                  className={`nav-link ${
                    item.id === tabType && "active"
                  } p-0 as-link`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-dropdown-listing d-flex gap-3 align-items-center justify-content-center">
            {tabType !== "selected_university" &&
              type !== "universities" &&
              dropdownListing &&
              dropdownListing.length > 0 && (
                <DropdownDashboard
                  dropdownListing={dropdownListing}
                  dropdownSelected={dropdownSelected}
                  dropdownSelectedId={dropdownSelectedId}
                  placeholder="ddd"
                  itemName={"title"}
                />
              )}
            {setSearhQuery && (
              <input
                type="text"
                value={searchQuery}
                className="form-control w-auto"
                placeholder="Search"
                onChange={(e) => {
                  setSearhQuery(e.target.value);
                }}
              />
            )}
          </div>
        </div>

        {paragraphs &&
          paragraphs.map((item, index) => (
            <div key={index} class="dashboard-label p-0">
              <div className="col d-flex gap-3 align-items-end">
                <div className="content-dashboardtab">
                  <div className="d-flex gap-1 flex-column ">
                    <h4>{item.title}</h4>
                    <p>{item.para}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div class="dashboard-label p-0">
          <form className="mt-3 mb-3">
            <div class="form-group">
              <div class="row g-3">
                <div
                  class="col"
                  style={{
                    paddingRight:
                      type === "scholarship" &&
                      window.innerWidth >= 480 &&
                      "0px",
                  }}
                >
                  Name
                </div>
                {type !== "universities" && (
                  <div
                    className="col d-flex justify-content-center align-items-end"
                    style={{
                      paddingLeft:
                        type === "scholarship" &&
                        window.innerWidth >= 480 &&
                        "0px",
                    }}
                  >
                    {type === "scholarship" && "Price"}
                    {/* {dropdownSelectedId === "all" &&
                    type === "universities" &&
                    "Group"} */}
                  </div>
                )}
                {type === "scholarship" && (
                  <>
                    <div class="col d-flex justify-content-center align-items-end">
                      Dead Line
                    </div>
                    {tabType === "select" && (
                      <div class="col d-flex justify-content-center align-items-end">
                        Status
                      </div>
                    )}
                  </>
                )}

                {type === "universities" && tabType === "select" && (
                  <>
                    <div
                      class={`col d-flex  justify-content-${
                        window.innerWidth > 480 ? "start" : "center"
                      } align-items-end`}
                    >
                      Status
                    </div>
                  </>
                )}
                {type !== "universities" && (
                  <div className="col d-flex justify-content-center align-items-end">
                    {(type === "universities" || type === "scholarship") &&
                    tabType === "select"
                      ? ""
                      : tabType === "select" &&
                        type === "journey" &&
                        "Participation Frequency"}
                  </div>
                )}

                {/* <div class="col"></div> */}
              </div>
            </div>
          </form>
        </div>

        <div className="dashboard-card">
          <div
            className="dashboard-listings position-relative"
            style={styleComponent}
            onScroll={new_ScrollBar}
            id="scroll-container-main"
          >
            {spinnerLoader && <SpinnerLoader color={"white"} />}
            {/* <div className="row">{""}</div> */}
            {!spinnerLoader && listing.length > 0 ? (
              listing.map((item, idx) => (
                <div
                  className={`${
                    spinnerLoader
                      ? "row g-3 border-bottom py-2 align-items-center collapse"
                      : "row g-3 border-bottom py-2 align-items-center"
                  }`}
                  key={idx}
                >
                  <div className="col d-flex gap-3 align-items-end">
                    <div className="content-dashboardtab">
                      <div className="d-flex gap-1 flex-column">
                        <h3
                          className={getClassName()}
                          style={{
                            whiteSpace:
                              type === "scholarship" &&
                              window.innerWidth <= 480 &&
                              "nowrap",

                            wordBreak:
                              type === "scholarship" ? "keep-all" : "break-all",
                          }}
                          onClick={() => {
                            type === "scholarship" && setShowModal(true);
                            setDetail({
                              item: item,
                              type: type,
                            });
                          }}
                        >
                          {type === "scholarship"
                            ? fixScholarshipTitle(item.title)
                            : item.title}
                        </h3>
                        {item?.answers?.length > 0 && (
                          <div>
                            {item &&
                              item?.answers?.length > 0 &&
                              item?.answers?.map((answer, index) => (
                                <div
                                  index={index}
                                  className="circle-icon-holder circle-icon-child-holder one-line-text"
                                >
                                  <span className={getClassName()}>
                                    {answer.answer}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {type !== "scholarship" && (
                        // <TooltipButton
                        //   icon={<IoMdInformationCircleOutline />}
                        //   tooltipText={item.description}
                        //   index={idx}
                        // />
                        // <span className="info-icons">
                        <DynamicPopover
                          title="Popover Title"
                          content={item.description}
                          placement="top"
                          type={type === "news" ? "news" : ""}
                          idx={idx}
                          openPopover={openPopover} // Pass the currently opened popover index
                          setOpenPopover={setOpenPopover}
                        >
                          <IoMdInformationCircleOutline
                            size={24}
                            color="rgb(1, 146, 166)"
                          />
                        </DynamicPopover>
                        // </span>
                      )}
                    </div>
                  </div>

                  {/* {group === "universities" && dropdownSelectedId === "all" && (
                    <div className="col d-flex justify-content-center align-items-end">
                      <div className="m-0">{getTitleById(item.group)}</div>
                    </div>
                  )} */}
                  {type === "scholarship" && (
                    <>
                      <div className="col d-flex justify-content-center align-items-center gap-2">
                        <div className="content-dashboardtab">
                          <h3>
                            {window.innerWidth > 480
                              ? checkDollar(item.award_worth)
                              : formatString(item.award_worth)}
                          </h3>
                        </div>
                      </div>
                      <div className="col d-flex justify-content-center align-items-center gap-2">
                        <div className="content-dashboardtab">
                          <h3>{item.deadline}</h3>
                        </div>
                      </div>
                    </>
                  )}

                  {userType === "user" &&
                    item.selected &&
                    type !== "dashboard" &&
                    type !== "universities" && (
                      <div className="col d-flex justify-content-end align-items-end scholarship-dropdown">
                        <DropdownDashboard
                          dropdownListing={scholarshipDropdown}
                          dropdownSelectedId={item}
                          handleDropdownChange={handleDropdownChange}
                          placeholder="ddd"
                          itemName={"title"}
                        />
                      </div>
                    )}
                  {type === "universities" && (
                    <div
                      className={`col-6 d-flex justify-content-end align-items-end ${
                        item.selected && "scholarship-dropdown"
                      }`}
                    >
                      {item.selected && userType === "user" && (
                        <DropdownDashboard
                          dropdownListing={scholarshipDropdown}
                          dropdownSelectedId={item}
                          handleDropdownChange={handleDropdownChange}
                          placeholder="ddd"
                          itemName={"title"}
                        />
                      )}
                      <button
                        className="custm-selct-icon-btn btn btn-primary btn-md mt-0 mr-5"
                        type="button"
                        onClick={() => {
                          if (type === "news" && userType === "user") {
                            setShowModal(true);
                            setDetail({
                              item: item,
                              type: type,
                            });
                          } else {
                            userAction(item, "select");
                          }
                        }}
                      >
                        {(item.answers && item.answers.length > 0) ||
                        ((type === "universities" || type === "scholarship") &&
                          userType === "admin") ||
                        (type === "news" && userType === "admin")
                          ? "Edit"
                          : type === "news" && userType === "user"
                          ? "Detail"
                          : item.selected && !item.saved
                          ? "Deselect"
                          : "Select"}
                      </button>
                    </div>
                  )}

                  {is_admin && type === "dashboard" && (
                    /// manage tool tip for admin side
                    <div className="col d-flex justify-content-end align-items-center gap-2"></div>
                  )}
                  {!is_admin &&
                    type === "dashboard" &&
                    tabType === "selected_university" && (
                      /// manage tool tip for user college side
                      <div className="col d-flex justify-content-end align-items-center gap-2"></div>
                    )}
                  {tabType !== "selected_university" &&
                    !is_admin &&
                    type !== "universities" && (
                      <div className="col d-flex justify-content-end align-items-center gap-2">
                        {item && item?.answers?.length > 0 && (
                          <div className="m-0 journey-answer">
                            {item &&
                              item?.answers?.length > 0 &&
                              item?.answers?.map((answer, index) => (
                                <div index={index}>
                                  {convertObjectToString(answer)}
                                </div>
                              ))}
                          </div>
                        )}

                        <div
                          className="dashboard-buttons d-flex align-items-center gap-3"
                          style={{
                            flexWrap:
                              userType === "user" &&
                              item.selected &&
                              type !== "dashboard" &&
                              type !== "scholarship" &&
                              "unset",
                          }}
                        >
                          {type !== "dashboard" && type !== "universities" && (
                            <button
                              className="custm-selct-icon-btn btn btn-primary btn-md mt-0 mr-5"
                              type="button"
                              onClick={() => {
                                if (type === "news" && userType === "user") {
                                  setShowModal(true);
                                  setDetail({
                                    item: item,
                                    type: type,
                                  });
                                } else {
                                  userAction(item, "select");
                                }
                              }}
                            >
                              {(item.answers && item.answers.length > 0) ||
                              ((type === "universities" ||
                                type === "scholarship") &&
                                userType === "admin") ||
                              (type === "news" && userType === "admin")
                                ? "Edit"
                                : type === "news" && userType === "user"
                                ? "Detail"
                                : item.selected && !item.saved
                                ? "Deselect"
                                : "Select"}
                            </button>
                          )}

                          {userType !== "admin" &&
                            type !== "universities" &&
                            type !== "scholarship" &&
                            tabType !== "select" &&
                            tabType !== "selected_university" &&
                            type !== "news" && (
                              <div
                                className="m-0 as-link"
                                onClick={() => userAction(item, "save")}
                              >
                                {item?.saved ? (
                                  <FaBookmark size={24} />
                                ) : (
                                  <FaRegBookmark size={24} />
                                )}
                              </div>
                            )}

                          {(type === "scholarship" || type === "news") &&
                            userType !== "admin" && (
                              <a
                                href={item.link}
                                className="m-0 as-link"
                                target="_blank"
                              >
                                <IoIosLink />
                              </a>
                            )}

                          {userType === "admin" &&
                            (type == "news" || type == "scholarship") && (
                              <div
                                className="m-0 as-link"
                                onClick={() => userAction(item, "delete")}
                              >
                                <img src={redBucket} alt="Delete" />
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="text-center no-record-section">
                <p className="font-weight-bold text-muted">No record found</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  const ListingofTags = () => {
    return (
      <>
        <div className="d-flex flex-wrap align-items-center gap-3 py-3 px-2 justify-around dashboard-name-section">
          {dropdownListing && dropdownListing.length > 0 && (
            <DropdownDashboard
              dropdownListing={dropdownListing}
              dropdownSelected={dropdownSelected}
              dropdownSelectedId={dropdownSelectedId}
              placeholder="ddd"
              itemName={"title"}
            />
          )}
        </div>

        {paragraphs &&
          paragraphs.map((item, index) => (
            <div key={index} class="dashboard-label p-0">
              <div className="col d-flex gap-3 align-items-end">
                <div className="content-dashboardtab">
                  <div className="d-flex gap-1 flex-column custom-pl-10">
                    <h4>{item.title}</h4>
                    <p>{item.para}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        <div class="dashboard-label p-0">
          <form className="mt-3 mb-3">
            <div class="form-group">
              <div class="row g-3">
                <div class="col">Name</div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
              </div>
            </div>
          </form>
        </div>
        <div
          className="dashboard-listings position-relative"
          style={styleComponent}
          onScroll={new_ScrollBar}
          id="scroll-container-main"
        >
          {spinnerLoader && <SpinnerLoader color={"white"} />}
          <div className="row"></div>

          {listing.length > 0 ? (
            listing.map((item, idx) => (
              <div
                className={`${
                  spinnerLoader
                    ? "row g-3 border-bottom py-2 collapse"
                    : "row g-3 border-bottom py-2 view-listing-tab"
                }`}
                key={idx}
              >
                <div className="col d-flex gap-3 align-items-center">
                  <div className="content-dashboardtab">
                    <h3
                      className="custom-pl-10"
                      style={{
                        wordBreak: "break-all",
                      }}
                    >
                      {item.title}
                    </h3>
                    {/* <TooltipButton
                      icon={group9_icon}
                      index={idx}

                      
                      adminJourney={true}
                      tooltipText={
                        item?.description
                          ? item.description
                          : "Hi backend developer please send description in Api "
                      }
                    /> */}
                    <DynamicPopover
                      title="Popover Title"
                      content={item.description}
                      placement="top"
                      idx={idx}
                      openPopover={openPopover} // Pass the currently opened popover index
                      setOpenPopover={setOpenPopover}
                    >
                      <IoMdInformationCircleOutline
                        size={24}
                        color="rgb(1, 146, 166)"
                      />
                    </DynamicPopover>
                  </div>
                </div>
                <div className="col d-flex gap-3 align-items-center">
                  {TagsView(item)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center no-record-section">
              <p className="font-weight-bold text-muted">No record found</p>
            </div>
          )}
          {listing.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                paddingTop: "20px",
                paddingRight: " 20px",
              }}
            >
              <button
                type="button"
                class="custm-selct-icon-btn btn btn-primary btn-md m-0"
                onClick={() => {
                  handle();
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </>
    );
  };
  const ListingofProfile = () => {
    return (
      <>
        <div class="dashboard-label p-0">
          <form className="mt-3 mb-3">
            <div class="form-group">
              <div class="row g-3">
                <div
                  class="col"
                  style={{
                    paddingRight: window.innerWidth > 480 && "0px",
                  }}
                >
                  Name
                </div>
                <div
                  class="col"
                  style={{
                    padding: window.innerWidth > 480 && "0px",
                  }}
                >
                  Email
                </div>
                <div class="col">Payment Status </div>
                <div class="col text-end"></div>
              </div>
            </div>
          </form>
        </div>
        <div
          className="dashboard-listings-profile position-relative"
          style={styleComponent}
        >
          {spinnerLoader && <SpinnerLoader color={"white"} />}
          <div className="row"></div>

          {listing.length > 0 ? (
            listing.map((item, idx) => (
              <div
                className={`${
                  spinnerLoader
                    ? "row g-3 border-bottom py-2 collapse"
                    : "row g-3 border-bottom py-2"
                }`}
                key={idx}
              >
                <div className="col d-flex gap-3">
                  <div className="content-dashboardtab">
                    <h3 className="custom-pl-10">{item.name}</h3>
                  </div>
                </div>
                <div className="col d-flex gap-3  d-flex justify-content-start align-items-center">
                  <div className="content-dashboardtab">
                    <h3>{item.email}</h3>
                  </div>
                </div>
                <div className="col d-flex gap-3 d-flex justify-content-start align-items-center">
                  <div className="content-dashboardtab">
                    <h3>{item.payment_status}</h3>
                  </div>
                </div>
                <div className="col d-flex gap-3  d-flex justify-content-end align-items-center pe-4">
                  <button
                    type="button"
                    class="custm-selct-icon-btn btn btn-primary btn-md m-0"
                    onClick={() => {
                      userAction(item, "select");
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center no-record-section">
              <p className="font-weight-bold text-muted">No record found</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className={`p-4 bg-white rounded-4 dashboard-tab-section ${
        type === "news" && "news-page-listing"
      }`}
    >
      {type !== "profile" && type !== "settings" && ListingOfPages()}

      {type === "profile" && ListingofProfile()}

      {type === "settings" && ListingofTags()}

      {showModal && (
        <ScholarshipDeatilModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          detail={detail}
        />
      )}
    </div>
  );
};

export default DashboardTab;
