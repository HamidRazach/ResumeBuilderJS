import React, { useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { errorMessage } from "../../Errors/Toast";

const MultiSelectDropDown = ({
  isOpen,
  setIsOpen,
  setGradesInvolved,
  gradesInvolved,
  dropdownRef,
}) => {
  const menuRef = useRef(null);

  const options = [
    { id: "9", label: "9th" },
    { id: "10", label: "10th" },
    { id: "11", label: "11th" },
    { id: "12", label: "12th" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, dropdownRef]);

  const handleOptionChange = (event) => {
    const optionId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setGradesInvolved([...gradesInvolved, optionId]);
    } else {
      if (gradesInvolved.length === 1) {
        errorMessage("One is required");
      } else {
        setGradesInvolved(gradesInvolved.filter((id) => id !== optionId));
      }
    }
  };

  return (
    <div className={`dropdown ${isOpen ? "show" : ""}`} ref={menuRef}>
      <div
        style={{ width: "-webkit-fill-available" }}
        className={`dropdown-menu ${isOpen ? "show" : ""}`}
        aria-labelledby="multiSelectDropdown"
      >
        {options.map((item, index) => (
          <Form.Check
            style={{ marginLeft: "10%" }}
            key={index}
            type="checkbox"
            id={`option_${item.id}`}
            label={item.label}
            checked={gradesInvolved.includes(item.id)}
            onChange={handleOptionChange}
            value={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MultiSelectDropDown;
