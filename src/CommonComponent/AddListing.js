import React from "react";
import { redBucket } from "../constant/images";
import { fixTitle } from "../constant/commonUtils";

const AddListing = (props) => {
  const {
    handleDeleteScores,
    handleDeleteMajors,
    // scoresList,
    interestedData,
    miniTab,
    psatData,
    satData
  } = props;

  return (
    <>
      {['psat', 'sat'].includes(miniTab) && (
        <div className="form-group-activites-list">
          <div className="form-group-activites-list-block"
            style={{
              overflowX: 'hidden',
            }}>
            {(miniTab === 'psat' ? psatData : satData)
              ?.filter((item) => item.type === miniTab)
              .map((item, index) => (
                <div className="row g-3" key={index}>
                  <div className="col">{item.math}</div>
                  <div className="col">{item.reading}</div>
                  <div className="col">{item.total}</div>
                  <div className="col">{item.date}</div>
                  <div className="col text-end">
                    <img
                      style={{
                        marginRight: '10px'
                      }}
                      className="as-link"
                      src={redBucket}
                      alt="Delete"
                      onClick={() => handleDeleteScores(index)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}


      {interestedData?.length > 0 && (
        <div className="form-group-activites-list">
          <div className="form-group-activites-list-block"
            style={{
              overflowX: 'hidden',
            }}>
            {interestedData.map((item, index) => (
              <div class="row g-3" key={index}>
                <div class="col">{fixTitle(item, 20)}</div>
                {/* <div class={window?.innerWidth && window.innerWidth < 999 ? "col text-end" : 'col'}> */}
                <div class={"col text-end"}>
                  <img
                    style={{
                      marginRight: '10px'
                    }}
                    className="as-link"
                    src={redBucket}
                    alt="Delete"
                    onClick={() => handleDeleteMajors(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AddListing;
