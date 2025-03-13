import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaChevronDown } from "react-icons/fa";

const DropdownDashboard = ({
  dropdownListing,
  dropdownSelected,
  dropdownSelectedId,
  handleDropdownChange,
  itemName,
  type

}) => {
  const [selectedItem, setSelectedItem] = useState("Preview Resume1");
  const items = ["Preview Resume2", "Preview Resume3", "Preview Resume4"];

  const handleDropdownClick = (item) => {
    if (handleDropdownChange) {
      handleDropdownChange(dropdownSelectedId.id, item);
    } else {
        dropdownSelected(item);
    }
  };

  const getSelectedItemValue = (array, selectedId, key) => {

    // Find the item where the id matches the selectedId
    const selectedstatusItem = array.find((item) => item.id === selectedId?.status);
    const selectedItem = array.find((item) => item.id === selectedId );

    const select = selectedstatusItem || selectedItem
  
    // If the item is found and has the requested key, return the value, otherwise return a fallback
    return select && select[key] ? select[key] : 'Unknown';
  };

  return (
    <Dropdown className="dashboard-dropdowns">
      <Dropdown.Toggle style={{ color: type && 'white' }} id="dropdown-basic">
          {getSelectedItemValue(dropdownListing,dropdownSelectedId,itemName)}
        <FaChevronDown />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {dropdownListing.map((item, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleDropdownClick(item.id)}
          >
            {item.title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownDashboard;
