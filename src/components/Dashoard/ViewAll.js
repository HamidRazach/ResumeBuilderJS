import React, { useEffect, useState } from "react";
import { fixNews } from "../../constant/commonUtils";
import { data_error } from "../../constant/WebText";
import { useDispatch, useSelector } from "react-redux";
import { newsData } from "../../Redux/NewsAction";
import ScholarshipDeatilModal from "../Modals/ScholarshipDeatilModal";


const ViewAll = () => {
  const dispatch = useDispatch();
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const newsListing = useSelector((state) => state.News_Reducer?.newsListing);
  const adminSelector = useSelector((state) => state.rootReducer);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState();

  const [showAll, setShowAll] = useState(false);
  const [newsListingData, setNewsListingData] = useState(
    showAll ? newsListing : newsListing?.slice(0, 3)
  );

 

  // const handleScroll = (e) => {
  //     if (!showAll) return; // Prevent triggering scroll when scroll is locked

  //     // const bottom =
  //     //     e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

  //     const target = e.target;
  //     // console.log('scrollHeight:', target.scrollHeight, 'scrollTop:', target.scrollTop, 'clientHeight:', target.clientHeight);

  //     const tolerance = 5;
  //     const bottom =
  //       target.scrollHeight - target.scrollTop <= target.clientHeight + tolerance;

  //     if (bottom) {
  //         get_news(pageNumber + 1);
  //         setPageNumber(pageNumber + 1)
  //     }
  // }
  let debounceTimer = null;

  const handleScroll = (e) => {
    if (!showAll) return;

    const target = e.target;
    console.log(
      "scrollHeight:",
      target.scrollHeight,
      "scrollTop:",
      target.scrollTop,
      "clientHeight:",
      target.clientHeight
    );

    const tolerance = 5;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + tolerance;

    if (bottom) {
      clearTimeout(debounceTimer); // Clear the previous timer

      debounceTimer = setTimeout(() => {
        get_news(pageNumber + 1);
        setPageNumber(pageNumber + 1);
      }, 300); // Adjust the debounce delay as needed
    }
  };

  const get_news = (page) => {
    const formData = new FormData();
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    dispatch(newsData(formData, tokenSelector, page));
  };

  useEffect(() => {
    get_news(1);
    // setNewsListingData(showAll ? newsListing : newsListing?.slice(0, 3))
  }, []);
  useEffect(() => {
    // get_news(1);
    setNewsListingData(showAll ? newsListing : newsListing?.slice(0, 3))
  }, [newsListing]);

  const handleViewAll = () => {
    const newsDiv = document.getElementById("newsDiv");

    if (newsDiv) {
      // Using scrollIntoView to ensure smooth scrolling works on all devices
      // newsDiv.scrollIntoView({ behavior: "smooth", block: "start",});
      newsDiv.scrollTo({ top: 0, behavior: "smooth" });

      setShowAll(!showAll);
      setTimeout(() => {
        setNewsListingData(!showAll ? newsListing : newsListing?.slice(0, 3));
      }, showAll ? 500 : 0);
    }
    
  };

  return (
    <>
      <div
        className="card-view mb-4"
        id={adminSelector?.user?.user_type === "admin" ? "admin-side" : ""}
      >
        <div className="card-body">
          <div className="card-content">
            <h5 className="card-title">News</h5>
            {newsListingData && newsListingData.length > 0 ? (
              <>
                <div
                  className="card-content"
                  id="newsDiv"
                  onScroll={handleScroll}
                  // style={{ ,  }}
                >
                  {newsListingData.map((item, index) => (
                    <div key={index}>
                      <p className="card-text">{item.title}</p>
                      <p
                        className="card-link as-link"
                        onClick={() => {
                          setShowModal(true);
                          setDetail({
                            item: item,
                            type: "news",
                          });
                        }}
                      >
                        Read More
                      </p>
                    </div>
                  ))}
                </div>

                {!showAll && newsListing.length > 3 && (
                  <div className="text-center">
                    <a
                      onClick={handleViewAll}
                      className="card-link-section"
                      style={{ cursor: "pointer" }}
                    >
                      View All News
                    </a>
                  </div>
                )}

                {showAll && (
                  <div className="text-center">
                    <a
                      onClick={handleViewAll}
                      className="card-link-section"
                      style={{ cursor: "pointer" }}
                    >
                      Show Less
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center empty-text-holder dashboard">
                <h3>{data_error}</h3>
              </div>
            )}
          </div>
          <hr />
        </div>
      </div>

      {showModal && (
        <ScholarshipDeatilModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          detail={detail}
        />
      )}
    </>
  );
};

export default ViewAll;
