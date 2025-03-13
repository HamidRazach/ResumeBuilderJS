import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { fixSlice } from '../../constant/commonUtils';

const DynamicPopover = ({ openPopover, setOpenPopover, idx, type, title, content, placement, children }) => {
  const sanitizedText = content
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, " ");

  const isMobile = window.innerWidth <= 480;
  const triggers = isMobile ? ['focus', 'click'] : ['hover', 'focus'];

  // Function to control the 'show' logic
  const shouldShowPopover = () => {
    if (isMobile) {
      // On mobile, only show when it's the currently opened popover
      return openPopover === idx;
    }
    // On web, the popover should follow default behavior (triggered by hover/focus)
    return undefined;
  };

  const handleTogglePopover = () => {
    if (openPopover === idx) {
      // Close the currently opened popover
      setOpenPopover(null);
    } else {
      // Open the new popover and close the previous one
      setOpenPopover(idx);
    }
  };

  const popover = (
    <Popover id="popover-basic" className="custom_new_popover">
      <Popover.Body
        style={{
          fontSize: '14px',
          fontFamily: 'Poppins',
          color: 'black',
        }}>
        {type === 'news' ? fixSlice(sanitizedText) : sanitizedText}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger 
      trigger={triggers} 
      show={shouldShowPopover()} 
      placement={placement} 
      overlay={popover}>
      <span 
        style={{ cursor: 'pointer', display: 'inline-block' }} 
        onClick={() => isMobile && handleTogglePopover()}>
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default DynamicPopover;
