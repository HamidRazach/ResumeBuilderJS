import React from "react";

export const ResumePersonalInformation = (props) => {
  const { resumeDetail, heading1, heading2, resume_heading } = props;

  return (
    <>
      <div className="row">
        <div className="col resume-heading">
          <h2>{resume_heading}</h2>
          <p>{resumeDetail?.contact}</p>
        </div>
      </div>

      {(resumeDetail.university_name ||
        resumeDetail.university_address ||
        resumeDetail.graduation_date ||
        resumeDetail.address ||
        resumeDetail.DOB ||
        resumeDetail.name) && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>
                <h2>{heading1}</h2>
              </th>
              <th>
                <h2>{heading2}</h2>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {resumeDetail.university_name && (
                  <p>{resumeDetail.university_name}</p>
                )}
              </td>

              <td>{resumeDetail.name && <p>{resumeDetail.name}</p>}</td>
            </tr>
            <tr>
              <td>
                <p>{resumeDetail.university_address}</p>
              </td>

              <td>
                <p>{resumeDetail.address}</p>
              </td>
            </tr>
            <tr>
              <td>
                {resumeDetail.graduation_date && (
                  <p>Completion Date: {resumeDetail.graduation_date}</p>
                )}
              </td>

              <td>
                {resumeDetail.DOB && <p>Date of birth: {resumeDetail.DOB}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* {(resumeDetail.university_name ||
        resumeDetail.university_address ||
        resumeDetail?.graduation_date ||
        resumeDetail.address ||
        resumeDetail.DOB ||
        resumeDetail.name) && (
        <div className="row">
          <div className="resume-content">
            {(resumeDetail.university_name ||
              resumeDetail.university_address ||
              resumeDetail?.graduation_date) && (
              <div className="resume-para1">
                {resumeDetail.university_name && (
                  <p>{resumeDetail.university_name}</p>
                )}
                {resumeDetail.university_address && (
                  <p>{resumeDetail.university_address}</p>
                )}
                {resumeDetail?.graduation_date && (
                  <p>Graduation Date: {resumeDetail.graduation_date}</p>
                )}
              </div>
            )}
            {(resumeDetail.address ||
              resumeDetail.DOB ||
              resumeDetail.name) && (
              <div className="resume-para2">
                {resumeDetail.name && <p>{resumeDetail.name}</p>}
                {resumeDetail.address && <p>{resumeDetail.address}</p>}
                {resumeDetail?.DOB && (
                  <p>
                    <span>Date of birth: </span>
                    {resumeDetail.DOB}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )} */}
    </>
  );
};
