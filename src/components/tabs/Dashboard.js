import React, { useEffect, useState } from "react";
import { Col, Row, Container, Form } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import ViewAll from "../Dashoard/ViewAll";
import Calendar from "../Dashoard/Calander";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

import { OverlayTrigger, Popover } from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import {
  DropDownValues,
  PieChartDropdown,
  // calculatePercentage,
  countValuesEqualToOrLessThanScore,
  dashboard,
  honors_awards_dropdown,
  roles_activites_dropdown,
  savedChange,
  universityDropDownList,
} from "../../constant/commonUtils";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage } from "../../Errors/Toast";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import { useSelector } from "react-redux";
import { data_error } from "../../constant/WebText";
import { Scrollbars } from "react-custom-scrollbars";
import PricingModal from "../Modals/PricingModal";
import { useLocation } from "react-router";
import MiniCard from "../Dashoard/MiniCard";
import {
  frame1_icon,
  frame2_icon,
  frame3_icon,
  frame4_icon,
} from "../../constant/images";
import ProgressBar from "../Dashoard/ProgressBar";
import MaskUser from "../Dashoard/MaskUser";
import DashboardTab from "./DashboardTab";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = (props) => {
  const user_score = props.dashBoradScore;
  const location = useLocation();
  const cardlisting = [
    { uperName: "Prompt Against", lowerName: "Your Data", img: frame4_icon },
    {
      uperName: "Complete College",
      lowerName: "Application",
      img: frame1_icon,
    },
    { uperName: "Preview Resume", img: frame2_icon },
    { uperName: "Write Essay", img: frame3_icon },
  ];

  // const labels = ["January", "February", "March", "April", "May", "June"];
  const adminSelector = useSelector((state) => state.rootReducer);

  const [tabType, setTabType] = useState("roles_activites");
  const [dropdownId, setdropdownId] = useState(roles_activites_dropdown[0].id);
  const [subDropdown, setSubDropdown] = useState(honors_awards_dropdown[0].id);
  const [chatDropDown, setChatDropDown] = useState(dashboard[0].id);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [dashboardSuggestions, setDashboardSuggestions] = useState([]);
  const newDasboardData = props.dashboardData?.line_graph;
  const newDasboardDataForBarCaht = props.dashboardData?.selected_universities;
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const [showModel, setShowModel] = useState(false);
  const payment_status = useSelector((state) => state.rootReducer);
  const [universityListing, setUniversityListing] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const [dropdown, setdropdown] = useState(
    location.pathname === "/dashboard" &&
      adminSelector?.user?.user_type === "admin"
      ? universityDropDownList[0].id
      : DropDownValues[0].id
  );
  const [adminDropdown, setAdmindropdown] = useState(PieChartDropdown[0].id);
  const [pieChartQuestions, setPieChartQuestions] = useState({});
  const [lineChartQuestions, setLineChartQuestions] = useState();
  const [hideData, setHideData] = useState(false);
  const [laoderSuggestion, setLaoderSuggestion] = useState(false);
  const [newsListing, setNewsListing] = useState([]);

  // const [isFetchingPage, setIsFetchingPage] = useState(false);

  const handleAdminDropdownChange = (id) => {
    setdropdown(id);
  };

  const filteredItems =
    chatDropDown === "sc_roles"
      ? newDasboardData?.sc_roles
      : chatDropDown === "ld_roles"
        ? newDasboardData?.ld_roles
        : chatDropDown === "ct_roles"
          ? newDasboardData?.ct_roles
          : chatDropDown === "sp_roles"
            ? newDasboardData?.sp_roles
            : chatDropDown === "sc_honors"
              ? newDasboardData?.sc_honors
              : chatDropDown === "ld_honors"
                ? newDasboardData?.ld_honors
                : chatDropDown === "ct_honors"
                  ? newDasboardData?.ct_honors
                  : chatDropDown === "sp_honors"
                    ? newDasboardData?.sp_honors
                    : [];

  const Choose_DropDown = dashboard;

  const handleDropdownChange = (id) => {
    setdropdownId(id);
  };
  const handleDropdownChangeChart = (id) => {
    setChatDropDown(id);
  };
  const handleAdminDropdown = (id) => {
    setAdmindropdown(id);
  };

  // useEffect(() => {
  //   if (
  //     !payment_status?.user?.payment_status &&
  //     payment_status?.user?.user_type === "user"
  //   ) {
  //     setShowModel(true);
  //   }
  //   setHideData(true);
  //   setTimeout(() => {
  //     setHideData(true);
  //   }, 1000);

  //   // eslint-disable-next-line
  // }, []);



  useEffect(() => {
    // if (adminSelector?.user?.user_type === "user") {
      setLaoderSuggestion(true);
      setPageNumber(1)
      get_dashboard_suggestions(1);
     
    // }
    // eslint-disable-next-line
  }, [dropdownId, subDropdown, tabType]);

  const [scrollLock, setScrollLock] = useState(false);  // To prevent scroll trigger on tab switch

useEffect(() => {

  // Reset page number and scroll position when switching tabs
  setPageNumber(1);
  setScrollLock(true);  // Lock scroll for a brief moment when switching tabs
  document.getElementById('scroll-container-main').scrollTop = 0; 


  // Unlock scroll after a small delay
  setTimeout(() => setScrollLock(false), 500); 
}, [tabType]);

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
      setPageNumber(prevPage => prevPage + 1);
      get_dashboard_suggestions(pageNumber + 1);
    }, 300); // Adjust the debounce delay as needed
  }
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const get_dashboard_suggestions = (page) => {
    const formData = new FormData();

    const category = tabType === 'roles_activites' ? dropdownId : subDropdown

    formData.append("tab", tabType);
    formData.append("category", category);
    formData.append("items_per_page", 20);
    formData.append("page", page ? page : 1);
    // formData.append("page", pageCount ? pageCount : 1);

    commonApi
      .dashboard_suggestions(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          const fetchedData = res?.data || [];

          // Handling scenarios based on filtered data
          if (fetchedData.length > 0) {
            if (page > 1) {
              // Case: length > 0 and page > 1 (Append to array)
              if (fetchedData.length > 0) {
                setDashboardSuggestions((prevData) => [
                  ...prevData,
                  ...fetchedData,
                ]);
                setPageNumber(page); // Increment page for next fetch
              }
            } else if (page === 1) {
              // Case: length > 0 and page === 1 (Replace array)
              setDashboardSuggestions(fetchedData);
              setPageNumber(page); // Reset page number for next page fetch
            }
          } else if (fetchedData.length === 0 && page === 1) {
            // Case: length === 0 and page === 1 (Clear the array)
            setDashboardSuggestions([]);
          } else if (fetchedData.length === 0 && page > 1) {
            // Case: length === 0 and page > 1 (No action needed for pagination)
         
          }
        }
        setLaoderSuggestion(false);
       
      })

      .catch((err) => {
        console.log("Err", err);
        setIsFetching(false);
      });
  };

  const get_university = (pageCount) => {
    const formData = new FormData();

    formData.append("group", dropdown);
    formData.append("search", searchQuery);
    // formData.append("page", pageCount ? pageCount : 1);

    commonApi
      .get_university(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {

          setUniversityListing(res.data);

          setIsFetching(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };







  useEffect(() => {
    if (adminSelector?.user?.user_type === "admin") {
      get_university(1);
    }
    // eslint-disable-next-line
  }, [dropdown, searchQuery]);


  useEffect(() => {
    setSearchQuery("");
    // eslint-disable-next-line
  }, [dropdown]);

  const admin_pigraph = () => {
    commonApi
      .admin_pigraph("", tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setPieChartQuestions(res?.pie_graph);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  const admin_linegraph = () => {
    commonApi
      .admin_linegraph("", tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setLineChartQuestions(res?.line_graph);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  const filteredAdminItems =
    chatDropDown === "sc_roles"
      ? lineChartQuestions?.sc_roles
      : chatDropDown === "ld_roles"
        ? lineChartQuestions?.ld_roles
        : chatDropDown === "ct_roles"
          ? lineChartQuestions?.ct_roles
          : chatDropDown === "sp_roles"
            ? lineChartQuestions?.sp_roles
            : chatDropDown === "sc_honors"
              ? lineChartQuestions?.sc_honors
              : chatDropDown === "ld_honors"
                ? lineChartQuestions?.ld_honors
                : chatDropDown === "ct_honors"
                  ? lineChartQuestions?.ct_honors
                  : chatDropDown === "sp_honors"
                    ? lineChartQuestions?.sp_honors
                    : [];

  const popover = (description) => {
    return (
      <Popover id="popover-basic">
        <Popover.Body>{description}</Popover.Body>
      </Popover>
    );
  };

  // const filterItems = () => {

  //   let filteredItems = [];

  //   return filteredItems;
  // };
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // For 12-hour format, use false for 24-hour format
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  const scores =
    filteredItems?.length > 0 &&
    filteredItems.map((item) => parseInt(item.score));
  const adminScores =
    filteredAdminItems?.length > 0 &&
    filteredAdminItems.map((item) => parseInt(item.average));

  const userDateTime =
    filteredItems?.length > 0 &&
    filteredItems.map((item) => formatDate(item.created_at));
  const adminDateTime =
    filteredAdminItems?.length > 0 &&
    filteredAdminItems.map((item) => formatDate(item.created_at));

  const scoresOfBarChat =
    newDasboardDataForBarCaht?.length > 0 &&
    newDasboardDataForBarCaht.map((item) => parseInt(item.score));

  const labelsOfBarChat =
    newDasboardDataForBarCaht?.length > 0 &&
    newDasboardDataForBarCaht.map((item) => item.title);

  // Creating labels for the chart

  const lineChartData =
    adminSelector?.user?.user_type === "admin" ? adminScores : scores;
  const lineChartlabels =
    adminSelector?.user?.user_type === "admin" ? adminDateTime : userDateTime;

  const data2 = {
    labels: lineChartlabels?.length > 0 ? lineChartlabels : [0, 0, 0, 0, 0, 0],
    datasets: [
      {
        // label: labelsOfChart?.length > 0 ? labelsOfChart : [],
        backgroundColor: "#1D1E1C", // Default color for bars
        borderColor: "#1D1E1C", // Default color for borders
        borderWidth: 2, // Line width
        // data: scores?.length > 0 ? scores : [], // Adjusted data values to span from 0 to 100
        data: lineChartData?.length > 0 ? lineChartData : [0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const data = {
    labels: labelsOfBarChat?.length > 0 ? labelsOfBarChat : [],
    datasets: [
      {
        type: "bar",
        label: "",
        backgroundColor: [], // Dynamically assign colors
        borderColor: "#1D1E1C",
        borderWidth: 2,
        data:
          scoresOfBarChat?.length > 0 ? scoresOfBarChat : [0, 0, 0, 0, 0, 0],
        order: 1,
      },
      {
        type: "line",
        label: "Line Dataset",
        borderColor: "black",
        borderWidth: 2,
        fill: false,
        data:
          scoresOfBarChat?.length > 0
            ? Array(scoresOfBarChat.length).fill(user_score)
            : "",
        order: 0,
        pointRadius: 0,
      },
    ],
  };

  const pieGradeData = pieChartQuestions?.grade;
  const pieSchoolData = pieChartQuestions?.school;

  const labelShow =
    adminDropdown === "year_started"
      ? ["Freshman", "Softmore", "Junior", "Senior"]
      : ["Notable", "Emerging", "Moderate", "High"];

  const dataShow =
    adminDropdown === "year_started"
      ? [
        pieGradeData?.freshman,
        pieGradeData?.sophomore,
        pieGradeData?.junior,
        pieGradeData?.senior,
      ]
      : [
        pieSchoolData?.notable,
        pieSchoolData?.emerging,
        pieSchoolData?.moderate,
        pieSchoolData?.high,
      ];

  const data3 = {
    labels: labelShow,

    datasets: [
      {
        label: "My First Dataset",
        data: dataShow,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(25, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Assigning colors based on values
  const barColors = [];
  const score = user_score;
  const colorDecesionData = data.datasets[0].data;
  for (let i = 0; i < colorDecesionData.length; i++) {
    if (colorDecesionData[i] < score) {
      barColors.push("#7BD17E"); // Green for values <= 60
    } else if (colorDecesionData[i] <= score + 10) {
      barColors.push("#EDCE72"); // Yellow for values <= 70
    } else {
      barColors.push("#C57373"); // Red for values > 70
    }
  }

  data.datasets[0].backgroundColor = barColors;

  // Chart options for the bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      datalabels: {
        display: true,
        color: "black",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        display: false, // Hide x-axis labels
      },
    },
  };
  // Chart options for the line chart
  // Chart options for the line chart (data2) to display specific values on the y-axis
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        display: false, // Hide x-axis labels
      },
      y: {
        display: true, // Show y-axis labels
        ticks: {
          min: 0, // Minimum value on the y-axis
          max: 100, // Maximum value on the y-axis
          stepSize: 20, // Interval between each value
          callback: function (value) {
            // Convert values to 0, 20, 40, 60, 80, 100
            return value === 0 ? "0" : value === 100 ? "100" : value;
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: "black",
      },
    },
  };

  const searchIconHandle = () => {
    setSearchIcon(!searchIcon);
  };

  const Bar_chart_span = {
    fontFamily: "Inter",
    fontSize: "17.05px",
    fontWeight: 600,
    lineHeight: "24px",
    textAlign: "left",
    paddingLeft: "6px",
  };
  const Bar_chart_P = {
    fontFamily: "Inter",
    fontSize: "17.05px",
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "left",
    paddingLeft: "6px",
  };

  const save_question = (item) => {

    const formData = new FormData();

    formData.append("question_id", item.id);
    formData.append(
      "label",
      "journey"
    );

    commonApi
      .save_question(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          const savedUnsavedQuestions = savedChange(dashboardSuggestions, item, res.is_saved);

          setDashboardSuggestions(savedUnsavedQuestions)
          successMessage(res.message);
        } else {
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [searchIcon]);

  const handleUserAction = (item, type) => {

    if (type === 'save') {
      save_question(item)
    }
  };

  return (
    <>
      {" "}
      {/* {props.spinnerLoader && <SpinnerLoader />} */}
      <div
        className={
          // adminSelector?.user?.user_type === "admin"
          //   ? "line-chart-main-container"
          // : 
          "line-chart-main-container-user"
        }
        style={{ maxWidth: width === 947 && "1000px" }}
      >
        {adminSelector?.user?.user_type === "user" &&
          <MiniCard cardlisting={cardlisting} />
        }
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-sm-9 pe-4 progress-3">
              <div className="mb-4">
                <ProgressBar />
              </div>
              <DashboardTab
              handleScroll={handleScroll}
                tabs={[
                  { name: "Activities", id: "roles_activites" },
                  { name: "Awards", id: "honors_awards" },
                  { name: "Colleges", id: "selected_university" },
                ]}
                setTabtype={setTabType}
                tabType={tabType}
                dropdownListing={tabType === 'roles_activites' ? roles_activites_dropdown : honors_awards_dropdown}
                dropdownSelected={tabType === 'roles_activites' ? setdropdownId : setSubDropdown}
                dropdownSelectedId={tabType === 'roles_activites' ? dropdownId : subDropdown}
                listing={dashboardSuggestions}
                userAction={handleUserAction}
                nameClasss={'dashboard-listings'}
                spinnerLoader={laoderSuggestion}
                type={'dashboard'}
                userType={adminSelector?.user?.user_type}
                is_admin={adminSelector?.user?.user_type === 'admin' ? true : false}
              />
            </div>
            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div className="mb-4">
                <Calendar />
              </div>
              <div className="card-group-section">
                <ViewAll newsListing={newsListing} />
                {adminSelector?.user?.user_type === "user" &&
                  <MaskUser />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PricingModal
        show={showModel}
        onClose={() => setShowModel(false)}
        setShowModel={setShowModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModel(false)}
      />
    </>
  );
};

export default Dashboard;
