import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import { BsAsterisk } from "react-icons/bs";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  DropDownValues,
  divideIntoGroups,
  styleComponent,
} from "../../constant/commonUtils";
import commonApi from "../../CommonApi/CommonServices";
import { successMessage } from "../../Errors/Toast";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import { useDispatch, useSelector } from "react-redux";
import { data_error } from "../../constant/WebText";
import { height_action } from "../../Redux/HeightAction";
import { scroll_action } from "../../Redux/ScrollableAction";
import TagInputResume from "../taginput/TagInputResume";
import { TagsInput } from "react-tag-input-component";
import DashboardTab from "../tabs/DashboardTab";
import Calendar from "../Dashoard/Calander";
import ViewAll from "../Dashoard/ViewAll";
const Settings = (props) => {
  const { spinnerLoader, settingQuestion, setSettingQuestion,dropdownId,setdropdownId, heading, para } = props;
 
  const [validated, setValidated] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  // const [dropdownId, setdropdownId] = useState(DropDownValues[0].id);
  const dispatch = useDispatch();

  const GradesInvolved = [
    {
      title: "Empty",
      id: "empty",
    },
    {
      title: "1",
      id: "1",
    },
    {
      title: "2",
      id: "2",
    },
    {
      title: "3",
      id: "3",
    },
    {
      title: "4",
      id: "4",
    },
  ];

  const [selectedTags, setSelectedTags] = useState([]);


  const handleCheck = (tags, id) => {
    // If selectedTags has a length greater than zero
    if (selectedTags.length > 0) {
      // Find if selectedTags contains the questionDetail.id
      const existingTags = selectedTags.find((item) => item.id === id);

      if (existingTags) {
        // If questionDetail.id exists, update its tags
        const updatedTags = selectedTags.map((item) =>
          item.id === id
            ? { ...item, tags } // Update tags array for matching id
            : item
        );
        setSelectedTags(updatedTags);
      } else {
        // If questionDetail.id doesn't exist, add a new entry with the id and tags
        setSelectedTags([...selectedTags, { id: id, tags }]);
      }
    } else {
      // If no tags exist, add the first one
      setSelectedTags([{ id: id, tags }]);
    }
  };
  const add_activity = () => {
    const paylaod = {
      questions: selectedTags,
    };

    commonApi
      .add_activity(paylaod, tokenSelector)
      .then((res) => {
        if (res.status === 200) {
          successMessage(res.message);
          setSettingQuestion(res.questions);
         
          setIsDisable(false);
        } else {
          setIsDisable(true);
        }
      })
      .catch((err) => {
        setIsDisable(true);
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };

  


  

  const handle = () => {
 
    // setIsDisable(true);
    add_activity();
  };

  useEffect(() => {
    dispatch(height_action(settingQuestion, "list"));
    // eslint-disable-next-line
  }, [settingQuestion]);

  const reduxHeight = useSelector((state) => state.height_reducer);
  const dataLength = reduxHeight?.data?.data;

  const containerRef = useRef(null);
  const container = containerRef.current;

  useEffect(() => {
    if (dataLength && container) {
      setTimeout(() => {
        if (container && container.scrollHeight > container.clientHeight) {
          dispatch(scroll_action(true));
        } else {
          dispatch(scroll_action(false));
        }
      }, 100);
    }
    // eslint-disable-next-line
  }, [dataLength, container, settingQuestion]);
  useEffect(() => {
    // if (settingQuestion.length > 0) {
    setTimeout(() => {
      setSelectedTags(
        settingQuestion.map((item) => ({
          id: item.id,
          tags: item.tags,
        }))
      );
    }, 1500);

  
    // alert('1')

    // }
    // eslint-disable-next-line
  }, [settingQuestion]);

  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const autoCompleteOff = document.querySelectorAll('input[type="text"]');
      if (autoCompleteOff.length > 0) {
        autoCompleteOff.forEach((input) => {
          input.setAttribute('autocomplete', 'off');
        });
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true, // Include all children of the body element
    });
  
    return () => observer.disconnect(); // Clean up observer when component unmounts
  }, []);
  
  
  

  const TagsView = (question) => {
    return (
      <div className="tags-input-resume-holder">
        <TagsInput
          value={
            selectedTags.find((item) => item.id === question.id)?.tags || []
          }
          onChange={(tags) => handleCheck(tags, question.id)}
          name="tags"
          placeHolder="Enter tags"
        />
      </div>
    );
  };

  return (
    <>
      {/* {spinnerLoader && <SpinnerLoader />} */}

      <div className={"line-chart-main-container-user"}>
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-sm-9 pe-4 progress-3">
              <DashboardTab
                TagsView={TagsView}
                styleComponent={styleComponent}
                dropdownListing={DropDownValues}
                dropdownSelected={setdropdownId}
                dropdownSelectedId={dropdownId}
                listing={settingQuestion}
                type={"settings"}
                handle={handle}
                spinnerLoader={spinnerLoader}
                paragraphs={[ 
                  { 
                    title: heading, 
                    para: para
                  } 
                ]}
                
              />
            </div>

            <div className="col-md-3 col-sm-3 mb-4 ps-0 calander-deshboards">
              <div className="mb-4">
                <Calendar />
              </div>
              <ViewAll />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
