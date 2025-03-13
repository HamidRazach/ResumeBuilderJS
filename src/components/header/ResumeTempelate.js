import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resume_profile_data } from "../../Redux/ResumeAction";
import ResumeData from "../ResumeData";
import { ResumePersonalInformation } from "../../ResumePersonalInformation";
import commonApi, { PDFUrl } from "../../CommonApi/CommonServices";
const ResumeTempelate = () => {
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const dispatch = useDispatch();
  const user_resume = useSelector((state) => state.resume_reducer?.usersData);

  const styles = {
    button: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "0px",
    },
    resumeheading: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px",
    },
    heading: {
      marginBottom: "0px",
      fontWeight: "700",
      fontSize: "26px",
      lineHeight: "31px",
      fontFamily: "Inter",
    },
    resumecontentst: {
      marginBottom: "0px",
      fontWeight: "500",
      fontSize: "17px",
      lineHeight: "20px",
      fontFamily: "Inter",
      maxwidth: "min-content",
    },
    resumecontents: {
      width: "50px",
      marginBottom: "0px",
      fontWeight: "500",
      fontSize: "17px",
      lineHeight: "20px",
      fontFamily: "Inter",
      maxwidth: "min-content",
    },
    resumecontentscontent: {
      width: "150px",
      marginBottom: "0px",
      fontWeight: "400",
      fontSize: "15px",
      lineHeight: "20px",
      fontFamily: "Inter",
    },
    resumehead: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "2px solid #000",
      padding: "0px",
    },
    resumepara: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      width: "50%",
    },
    resumecontent: {
      marginBottom: "0px",
      fontFamily: "inter",
      fontWeight: "500",
      fontSize: "17px",
      lineHeight: "20px",
      color: "#000",
    },
    resumeinformationhead: {
      maxWidth: "max-content",
      borderBottom: "2px solid #000",
    },
    resume: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0px",
      width: "100%",
      gap: "180px",
    },
    resumeinformations: {
      padding: "0px",
    },
    section: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    resumeeducation: {
      padding: "0px",
    },
    tableheader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    tableheader1: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    tableshead: {
      width: "150px",
      fontSize: "15px",
      fontWeight: "700",
      lineHeight: "31px",
      fontFamily: "Inter",
    },
    tablefrom: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      gap: "20px",
      padding: "0px",
    },
    tablesheaderfrom: {
      fontSize: "20px",
      fontWeight: "700",
      borderBottom: "1px solid #000",
      lineHeight: "31px",
      fontFamily: "Inter",
    },
    tablecontent: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    resumeheade: {
      marginBottom: "0px",
      fontWeight: "700",
      fontSize: "26px",
      lineHeight: "31px",
      fontFamily: "Inter",
    },
    tableheadeinformation: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    tabledouble: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
  };

  const pdfContentRef = useRef(null);
  const invoiceRef = useRef(null);

  const downloadResume = () => {
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body {
            font-family: "Inter !important";
            font-weight: 700;
            font-size: 17px;
            line-height: 31px;
            background: #F9FEFF;
            color: #000;
            overflow-x: hidden;
          }
          .resumehead{
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #000;
            padding: 0px;
          }
          .row .resume-heading{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0px;
            text-align: center
          }
          #pdf_content table thead tr th {
            display: flex;
            flex-direction: column;
            justify-content: left;
            align-items: left;
            padding: 0px;
            text-align: left;
            color: #000000;           
          }
          .resume-head {
            display: flex;
            justify-content: space-between;
          }
          .column h2 {
            font-weight: 700;
            font-size: 26px;
            line-height: 31px;
            font-family: "Inter";
            margin-bottom: 0px !important;
            color: #000000;
          }
          .resume-content .resume-para1 {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .resume-content .resume-para1 p {
          margin-bottom: 0px;
          }
          #resume-pdf .modal-content p {
              line-height: 1.4em;
              font-weight: 500;
              font-family: 'Inter';
              font-size: 17px;
              color: #000000;
              margin-bottom: 0px;
          }
          .resume-heading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .resume-heading h2 {
            margin-bottom: 0px;
            font-size: 26px;
            line-height: 31px;
            font-family: "Inter";
          }
          .resume-heading p {
            margin-bottom: 0px;
          }
          .resume-information {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .resume-information-head h2 {
            font-size: 26px;
            line-height: 31px;
            font-family: "Inter";
            margin-bottom: 0px;
            color: #000000;
            max-width: fit-content;
            border-bottom: 2px solid #000000;
          }
          .resume-information-content p {
            margin-bottom: 0px;
          }
          .resume-content {
            display: flex;
            justify-content: space-between;
          }
          .resume-para2 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
          }
          #pdf_content table thead tr th {
            border-bottom: 2px solid #000000;
          }
          .resume-modal::-webkit-scrollbar {
            width: 10px;
          }
          .resume-modal::-webkit-scrollbar-track {
            background: #f1f1f1; 
            border-radius: 10px;
          }
          .resume-modal::-webkit-scrollbar-thumb {
            background: #888; 
            border-radius: 10px;
          }
          #pdf_content table thead tr th h2 {
            margin-bottom: 0px;
          }
          @media (max-width: 1370px) {
            #pdf_content table thead tr th h2 {
              margin-bottom: 0px;
              font-size: 22px;
            }
            .resume-information-head h2 {
              font-size: 22px;
            }
            .resume-heading h2 {
              font-size: 22px;
            }
            #resume-pdf .modal-content p {
              font-size: 16px;
            }
          }
          @media (max-width: 1024px) {
            #pdf_content table thead tr th h2 {
              margin-bottom: 0px;
              font-size: 20px;
            }
            .resume-information-head h2 {
              font-size: 20px;
            }
            .resume-heading h2 {
              font-size: 20px;
            }
            #resume-pdf .modal-content p {
              font-size: 16px;
            }
          }
          @media (max-width: 991px) {
            #pdf_content table thead tr th h2 {
              margin-bottom: 0px;
              font-size: 17px;
            }
            .resume-information-head h2 {
              font-size: 17px;
            }
            .resume-heading h2 {
              font-size: 17px;
            }
            #resume-pdf .modal-content p {
              font-size: 15px;
            }
          }
          @media (max-width: 480px) {
            #pdf_content table thead tr th h2 {
              margin-bottom: 0px;
              font-size: 16px;
            }
            .resume-information-head h2 {
              font-size: 16px !important;
            }
            .resume-heading h2 {
              font-size: 16px;
            }
            #resume-pdf .modal-content p {
              font-size: 14px;
            }
            #pdf_content table thead tr th h2 {
              white-space: nowrap;
          }
          }
          </style>
        </head>
        <body>
          ${invoiceRef.current.outerHTML}
        </body>
      </html>
    `;
    const paylaod = {
      fileName: "test.pdf",
      html: invoiceHTML,
    };
    commonApi
      .generate_pdf(paylaod, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          const a = document.createElement("a");
          a.href = `${PDFUrl}pdfs/${res.pdf_file_name}`; // Set the URL to the generated PDF URL
          a.target = "_blank"; // Open in a new tab/window
          a.rel = "noopener noreferrer"; // Add security features
          // Append the anchor to the body
          document.body.appendChild(a);
          // Trigger a click on the anchor element
          a.click();
          // Remove the anchor element from the body
          document.body.removeChild(a);
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };


  useEffect(() => {
    // resume_preview_data();
    dispatch(resume_profile_data("", tokenSelector));
    // setResume_data(user_resume);
    // eslint-disable-next-line
  }, []);


  const leadership_roles_activites =
    user_resume?.academics &&
    user_resume.academics[0]?.leadership_roles_activites;
  const leadership_honors_awards =
    user_resume?.academics &&
    user_resume.academics[0]?.leadership_honors_awards;

  const citizenship_roles_activites =
    user_resume?.academics &&
    user_resume.academics[0]?.citizenship_roles_activites;
  const citizenship_honors_awards =
    user_resume?.academics &&
    user_resume.academics[0]?.citizenship_honors_awards;

  const scholarship_roles_activites =
    user_resume?.academics &&
    user_resume.academics[0]?.scholarship_roles_activites;
  const scholarship_honors_awards =
    user_resume?.academics &&
    user_resume.academics[0]?.scholarship_honors_awards;

  const sportsmanship_roles_activites =
    user_resume?.academics &&
    user_resume.academics[0]?.sportsmanship_roles_activites;
  const sportsmanship_honors_awards =
    user_resume?.academics &&
    user_resume.academics[0]?.sportsmanship_honors_awards;

  return (
    <>
      {user_resume && (
        <>
          <div className="row">
            <div className="resume-dowload" style={styles.button}>
              <button
                type="button"
                className="custom-resume-btn btn btn-warning"
                onClick={() => {
                  downloadResume();
                }}
              >
                DOWNLOAD
              </button>
            </div>
          </div>
          <div className="res" ref={invoiceRef}>
            <div className="content" ref={pdfContentRef}>
              <div className="content-template">
                <div
                  id="pdf_content"
                  className="resume-section"
                  // style={styles.section}
                >
                  <ResumePersonalInformation
                    styles={styles}
                    resumeDetail={user_resume}
                    resume_heading={"RESUME"}
                    heading1={"Education"}
                    heading2={"Personal Information"}
                  />

                  {user_resume?.cgpa && (
                    <ResumeData
                      resumedataHeading="Academic Information"
                      resumeDetail={user_resume?.cgpa}
                      type="CGPA"
                      styles={styles}
                    />
                  )}
                  {scholarship_roles_activites &&
                    scholarship_roles_activites.length > 0 && (
                      <ResumeData
                        resumedataHeading="Scholorship Roles and Activities"
                        resumeDetail={scholarship_roles_activites}
                        styles={styles}
                      />
                    )}
                  {scholarship_honors_awards &&
                    scholarship_honors_awards.length > 0 && (
                      <ResumeData
                        resumedataHeading="Scholarship Honors/Awards"
                        resumeDetail={scholarship_honors_awards}
                        styles={styles}
                      />
                    )}
                  {leadership_roles_activites &&
                    leadership_roles_activites.length > 0 && (
                      <ResumeData
                        resumedataHeading="Leadership Roles and Activities"
                        resumeDetail={leadership_roles_activites}
                        styles={styles}
                      />
                    )}
                  {leadership_honors_awards &&
                    leadership_honors_awards.length > 0 && (
                      <ResumeData
                        resumedataHeading="Leadership Honors/Awards"
                        resumeDetail={leadership_honors_awards}
                        styles={styles}
                      />
                    )}
                  {citizenship_roles_activites &&
                    citizenship_roles_activites.length > 0 && (
                      <ResumeData
                        resumedataHeading="Citizenship Roles and Activities"
                        resumeDetail={citizenship_roles_activites}
                        styles={styles}
                      />
                    )}
                  {citizenship_honors_awards &&
                    citizenship_honors_awards.length > 0 && (
                      <ResumeData
                        resumedataHeading="Citizenship Honors/Awards"
                        resumeDetail={citizenship_honors_awards}
                        styles={styles}
                      />
                    )}
                  {sportsmanship_roles_activites &&
                    sportsmanship_roles_activites.length > 0 && (
                      <ResumeData
                        resumedataHeading="Sportsmanship Roles and Activities"
                        resumeDetail={sportsmanship_roles_activites}
                        styles={styles}
                      />
                    )}
                  {sportsmanship_honors_awards &&
                    sportsmanship_honors_awards.length > 0 && (
                      <ResumeData
                        resumedataHeading="Sportsmanship Honors/Awards"
                        resumeDetail={sportsmanship_honors_awards}
                        styles={styles}
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResumeTempelate;
