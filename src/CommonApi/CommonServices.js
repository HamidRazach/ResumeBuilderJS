import axios from "axios";

// const BACKEND_URL = "https://api.thepathfinderhub.com/api/";

const { host } = window.location;

var BACKEND_URL = "https://api.thepathfinderhub.com/api/";

if (host.includes("localhost") || host.includes("dev")) {
  BACKEND_URL = "https://devapi.thepathfinderhub.com/api/";
} else if (host.includes("staging")) {
  BACKEND_URL = "https://stagingapi.thepathfinderhub.com/api/";
} else {
  BACKEND_URL = "https://api.thepathfinderhub.com/api/";
}
export var PDFUrl = "https://api.thepathfinderhub.com/";

if (host.includes("localhost") || host.includes("dev")) {
  PDFUrl = "https://devapi.thepathfinderhub.com/";
} else if (host.includes("staging")) {
  PDFUrl = "https://stagingapi.thepathfinderhub.com/";
} else {
  PDFUrl = "https://api.thepathfinderhub.com/";
}





const apiHit = async (url, data,token, type, ) => {
  const expiresInMilliseconds = 3600000; // 1 hour


  // Calculate the expiration date
  const expirationDate = new Date(Date.now() + expiresInMilliseconds);
  return axios({
    method: type,
    url: url,
    data: JSON.stringify(data),
    // config: {
    headers: {
      "Content-Type": "multipart/form-data",
      Expires: expirationDate.toUTCString(),
      Accept: "application/json",
      Authorization: "Bearer " +  token ? token : localStorage.getItem('token'),
    },
    // },
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error", err);
      return err.response.data;
    });
};
const apiFormData = async (url, data,token, type, ) => {


  const expiresInMilliseconds = 3600000; // 1 hour

  // Calculate the expiration date
  const expirationDate = new Date(Date.now() + expiresInMilliseconds);
  return axios({
    method: type,
    url: url,
    data: data,
    // config: {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Expires: expirationDate.toUTCString(),
      Authorization: "Bearer " +  token ? token : localStorage.getItem('token'),
    },
    // },
  }).then((res) => res.data);
};

const commonApi = {

  
  signup: (data ,token) => apiFormData(`${BACKEND_URL}signup`, data,token, "POST"),
  login: (data ,token) => apiFormData(`${BACKEND_URL}login`, data,token, "POST"),
  questions_onboard: (data ,token) => apiFormData(`${BACKEND_URL}questions_onboard`, data,token, "GET"),
  get_questions: (data ,token) => apiFormData(`${BACKEND_URL}get_questions_new`, data,token, "POST"),
  onboard: (data ,token) => apiFormData(`${BACKEND_URL}onboard`, data,token, "POST"),
  saved_questions: (data ,token) => apiFormData(`${BACKEND_URL}saved_questions`, data,token, "POST"),
  save_question: (data ,token) => apiFormData(`${BACKEND_URL}save_question`, data,token, "POST"),
  selected_questions: (data ,token) => apiFormData(`${BACKEND_URL}selected_questions`, data,token, "POST"),
  add_university: (data ,token) => apiFormData(`${BACKEND_URL}add_university`, data,token, "POST"),
  answer_questions: (data ,token) => apiFormData(`${BACKEND_URL}answer_questions`, data,token, "POST"),
  get_university: (data ,token) => apiFormData(`${BACKEND_URL}get_university`, data,token, "POST"),
  select_university: (data ,token) => apiFormData(`${BACKEND_URL}select_university`, data,token, "POST"),
  update_university: (data ,token) => apiFormData(`${BACKEND_URL}update_university`, data,token, "POST"),
  user_info: (data ,token) => apiFormData(`${BACKEND_URL}user_info`, data,token, "POST"),
  update_user_info: (data ,token) => apiHit(`${BACKEND_URL}update_user_info`, data,token, "POST"),
  setting_questions: (data ,token) => apiFormData(`${BACKEND_URL}setting_questions`, data,token, "POST"),
  add_activity: (data ,token) => apiHit(`${BACKEND_URL}add_activity`, data,token, "POST"),
  dashboard_suggestions: (data ,token) => apiFormData(`${BACKEND_URL}dashboard_suggestions`, data,token, "POST"),
  dashboard: (data ,token) => apiFormData(`${BACKEND_URL}dashboard`, data,token, "POST"),
  newsletter: (data ,token) => apiFormData(`${BACKEND_URL}newsletter`, data,token, "POST"),
  resume_preview: (data ,token) => apiFormData(`${BACKEND_URL}resume_preview`, data,token, "POST"),
  all_users_info: (data ,token) => apiFormData(`${BACKEND_URL}all_users_info`, data,token, "GET"),
  get_packages: (data ,token) => apiFormData(`${BACKEND_URL}get_packages`, data,token, "POST"),
  forgot_password: (data ,token) => apiFormData(`${BACKEND_URL}forgot_password`, data,token, "POST"),
  authenticate_token: (data ,token) => apiFormData(`${BACKEND_URL}authenticate_token`, data,token, "POST"),
  reset_password: (data ,token) => apiFormData(`${BACKEND_URL}reset_password`, data,token, "POST"),
  // payment_update: (data ,token) => apiFormData(`${BACKEND_URL}payment_update`, data,token, "POST"),
  payment_details: (data ,token) => apiFormData(`${BACKEND_URL}payment_details`, data,token, "POST"),
  admin_pigraph: (data ,token) => apiFormData(`${BACKEND_URL}admin_pigraph`, data,token, "POST"),
  admin_linegraph: (data ,token) => apiFormData(`${BACKEND_URL}admin_linegraph`, data,token, "POST"),
  generate_pdf: (data ,token) => apiHit(`${BACKEND_URL}generate_pdf`, data,token, "POST"),
  create_payment: (data ,token) => apiHit(`${BACKEND_URL}create_payment`, data,token, "POST"),
  all_packages: (data ,token) => apiHit(`${BACKEND_URL}all_packages`, data,token, "POST"),
  process_jobs: (data ,token) => apiHit(`${BACKEND_URL}process_jobs`, data,token, "POST"),
  add_news: (data ,token) => apiFormData(`${BACKEND_URL}add_news`, data,token, "POST"),
  update_news: (data ,token) => apiFormData(`${BACKEND_URL}update_news`, data,token, "POST"),
  get_news: (data ,token) => apiFormData(`${BACKEND_URL}get_news`, data,token, "POST"),
  delete_news: (data ,token) => apiFormData(`${BACKEND_URL}delete_news`, data,token, "POST"),
  delete_answer: (data ,token) => apiFormData(`${BACKEND_URL}delete_answer`, data,token, "POST"),
  get_scholarships: (data ,token) => apiFormData(`${BACKEND_URL}get_scholarships`, data,token, "POST"),
  search_onboard_questions: (data ,token) => apiFormData(`${BACKEND_URL}search_onboard_questions`, data,token, "POST"),
  // selected_scholarships: (data ,token) => apiFormData(`${BACKEND_URL}selected_scholarships`, data,token, "POST"),
  select_scholarships: (data ,token) => apiFormData(`${BACKEND_URL}select_scholarships`, data,token, "POST"),
  status_change_colleges_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}status_change_colleges_scholarship`, data,token, "POST"),
  total_of_colleges_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}total_of_colleges_scholarship`, data,token, "POST"),
  admin_users_by_university_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}admin_users_by_university_scholarship`, data,token, "POST"),
  add_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}add_scholarship`, data,token, "POST"),
  update_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}update_scholarship`, data,token, "POST"),
  delete_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}delete_scholarship`, data,token, "POST"),
  // update_stories: (data ,token) => apiFormData(`${BACKEND_URL}update_stories`, data,token, "POST"),
  get_stories: (data ,token) => apiFormData(`${BACKEND_URL}get_stories`, data,token, "POST"),
  add_stories: (data ,token) => apiFormData(`${BACKEND_URL}add_stories`, data,token, "POST"),
  search_universities: (data ,token) => apiFormData(`${BACKEND_URL}search_universities`, data,token, "POST"),
  get_notifications: (data ,token) => apiFormData(`${BACKEND_URL}get_notifications`, data,token, "POST"),
  read_notification: (data ,token) => apiFormData(`${BACKEND_URL}read_notification`, data,token, "POST"),
  selected_university: (data ,token) => apiFormData(`${BACKEND_URL}selected_university`, data,token, "POST"),
  selected_scholarships: (data ,token) => apiFormData(`${BACKEND_URL}selected_scholarships`, data,token, "POST"),
  upcoming_scholarship: (data ,token) => apiFormData(`${BACKEND_URL}upcoming_scholarship`, data,token, "POST"),
  delete_answers: (data ,token) => apiFormData(`${BACKEND_URL}delete_answers`, data,token, "POST"),

  // get_frequency: data => apiHit(`${BACKEND_URL}get_frequency`, data, 'GET'),
  // get_background: data => apiHit(`${BACKEND_URL}get_background`, data, 'GET'),
};

export default commonApi;
