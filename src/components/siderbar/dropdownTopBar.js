import React, { useState, useRef, useEffect } from "react";

const DropdownTopBar = ({ menuRef, items, onSelect, isOpen, setIsOpen,type}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (type !== "sideBar") {
      const handleOutsideClick = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          menuRef.current &&
          !menuRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isOpen, menuRef]);
  

  return (
    <div className={`relative profile-dropdown-2 `} ref={dropdownRef}>
      <ul
        className={`absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${
          isOpen ? "open" : "close"
        }`}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${items.length === 1 && 'admin_logout'}`}
            onClick={() => {
              onSelect(item);
              setIsOpen(false);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownTopBar;
