import React from "react";
import { redBucket } from "../constant/images";
import { fixTitle } from "../constant/commonUtils";

const AnswerAddlisting = (props) => {
  const { activities, handleDelete, type } = props

  const DecesionClass = type === 'normal_questions' ? 'hide_x_Scroll' : ''
  const DecesionStyle = type !== 'normal_questions' && window.innerWidth > 999 ? 'hide_x_Scroll' : ''

  return (
    <div className="form-group-activites-list">
      <div className={`form-group-activites-list-block ${DecesionClass} ${DecesionStyle}`}>
        {activities.length > 0 && (
          <div className="form-label">Added Activities</div>
        )}

        {activities &&
          activities.length > 0 &&
          activities.map((item, index) => (
            <div class="row g-3" key={index}>
              <div class="col">{item.gradesInvolved}</div>
              <div className='col'>
                {fixTitle(item.activityName)}
              </div>
              <div class="col">{item.weeksPerYear}</div>
              <div class="col">{item.hoursPerWeek}</div>

              {item.dropdownId &&
                <div class="col">{fixTitle(item.dropdownId)}</div>
              }
              {item.participationLevelId && (
                <div class="col">{fixTitle(item.participationLevelId)}</div>
              )}
              <div class="col">
                <img
                  className="as-link"
                  src={redBucket}
                  alt="Delete"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AnswerAddlisting;

{
  /* <ul index={index}>
  <li>{item.gradesInvolved}</li>
  <li>{item.activityName}</li>
  <li>{item.weeksPerYear}</li>
  <li>{item.hoursPerWeek}</li>
  {item.dropdownId &&
    <li>{item.dropdownId}</li>
  }
  {item.participationLevelId &&
    <li>{item.participationLevelId}</li>
  }
  <li className="as-link" onClick={() => handleDelete(item)}>
    <img src={redBucket} alt="Delete" />
  </li>
</ul> */
}
