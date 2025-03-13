import React from "react";

export default function ResumeData(props) {
  const { resumedataHeading, resumeDetail, type } = props;

  return (
    <div className="row">
      <div className="resume-content-information">
        <div className="resume-information">
          <div className="resume-information-head">
            <h2>{resumedataHeading}</h2>
          </div>
          {type === "CGPA" ? (
            <div className="resume-information-content">
              <p>
                <span>GPA:</span>
                {resumeDetail}
              </p>
            </div>
          ) : (
            resumeDetail.map((items, index) => (
              <div className="resume-information-content" key={index}>
                <p>
                  {items.title} {items.grades}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
