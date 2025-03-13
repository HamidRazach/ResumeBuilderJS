import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import commonApi from "../../CommonApi/CommonServices";
import { useSelector } from "react-redux";
import { dashboardDropdown } from "../../constant/commonUtils";
import DropdownDashboard from "../tabs/DropdownDashboard";
import { FaChevronDown } from "react-icons/fa6";
const ProgressBar = () => {

  const adminSelector = useSelector((state) => state.rootReducer);

  const [totalCollegesScholar, setTotalCollegesScholar] = useState({});
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const [subId, setSubId] = useState(dashboardDropdown[0].id);


  const handleSubDropdownChange = (id) => {
    setSubId(id);
  };


  const chooseCategory = totalCollegesScholar[subId] || {
    applied: 0,
    accepted: 0,
    rejected: 0,
    total: 1,
  };

  const total = chooseCategory?.total || 1;
  const appliedPercentage = ((chooseCategory.applied / total) * 100);
  const acceptedPercentage = ((chooseCategory.accepted / total) * 100);
  const rejectedPercentage = ((chooseCategory.rejected / total) * 100);

  const total_of_colleges_scholarship = () => {
    const formData = new FormData();

    // formData.append("search_query", searchQuery);

    commonApi
      .total_of_colleges_scholarship('', tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          // successMessage(res.message)
          setTotalCollegesScholar(res.data);
          // setSpinnerLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };
  const admin_users_by_university_scholarship = () => {
    const formData = new FormData();

    // formData.append("search_query", searchQuery);

    commonApi
      .admin_users_by_university_scholarship('', tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success === true) {
          // successMessage(res.message)
          setTotalCollegesScholar(res.users);
          // setSpinnerLoader(false);
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  useEffect(() => {

    if (adminSelector?.user?.user_type === "admin") {
      admin_users_by_university_scholarship();
    } else {
      total_of_colleges_scholarship()
    }


  }, [])

  return (
    <div className="progress-section">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="dropdown-college">
              <div className="col-12 col-md-6">
                <h5 className="card-title">{subId === 'university' ? 'Colleges Admissions' : 'Scholarship'}</h5>
              </div>
              <div className="col-12 col-md-6">
                <div className="custom-form-slect-field progress-dropdown">
                  <Dropdown className="dashboard-dropdowns progresssssss">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                    >
                      {subId &&
                        dashboardDropdown.find((item) => item.id === subId)?.title}
                      <FaChevronDown />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ height: '94px' }}>
                      {dashboardDropdown.map((item, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            handleSubDropdownChange(item.id)
                          }
                        >
                          {item.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-user">
            <div className="mt-2 progress-1">
              <label>Applied ({chooseCategory?.applied})</label>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${appliedPercentage}%` }}
                  aria-valuenow={appliedPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
            <div className="mt-2 progress-1">
              <label>Accepted ({chooseCategory?.accepted})</label>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${acceptedPercentage}%` }}
                  aria-valuenow={acceptedPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
            <div className="mt-2 progress-1">
              <label>Rejected ({chooseCategory?.rejected})</label>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${rejectedPercentage}%` }}
                  aria-valuenow={rejectedPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
