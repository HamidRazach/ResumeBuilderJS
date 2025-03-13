import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fixLink } from '../../constant/commonUtils';

const ScholarshipDeatilModal = (props) => {
    const {detail} = props;

    const detailListing = detail?.item;
    const sanitizedDescription = detailListing.description
    .replace(/<\/li>/g, "\n")               // Add new line after closing </li> tag
    .replace(/<\/(ul|ol)>/g, "\n")          // Add new line after closing </ul> or </ol> tag
    .replace(/<\/?[^>]+(>|$)/g, "")         // Remove all other HTML tags
    .replace(/&nbsp;/g, " ")                // Replace &nbsp; with a regular space
    .replace(/\n\s*\n/g, "\n");             // Remove consecutive new lines

    // Dynamic scholarship data array
    const listings = 
        detail?.type !== 'news' ?
        [{ label: 'Title', value: detailListing.title },
        { label: 'Price', value: detailListing.award_worth },
        { label: 'Link', value: detailListing.link },
        { label: 'Category', value: detailListing.category },
        { label: 'Offered by', value: detailListing.offered_by },
        { label: 'Grade Level', value: detailListing.grade_level },
        { label: 'Deadline', value: detailListing.deadline },
        { label: 'Description', value: detailListing.description }]
        :
        [{ label: 'Title', value: detailListing.title },
        { label: 'Link', value: detailListing.link },
        { label: 'Description', value: sanitizedDescription }];

    return (
        <>
            {/* <Button variant="primary" onClick={props.show}>
                Open
            </Button> */}
            <Modal 
            {...props}
            centered
            // show={props.show} onHide={props.onHide}
             backdrop="static" keyboard={false} 
             id="scholarshipmodal">
                <div className="modal-header">
                    <h4>{detail?.type === 'news' ? 'News Detail' : 'Scholarship Detail'}</h4>
                    <i className="fa-solid fa-xmark" onClick={props.onHide} style={{ cursor: 'pointer' }}></i>
                </div>

                <div className="modal-body">
                    <div className="scholarship-detail">
                        {listings.map((detail, index) => (
                            <div className="row g-3" key={index}>
                                <div className="col-2 d-flex align-items-center">
                                    <h4>{detail.label}:</h4>
                                </div>
                                <div className="col-10 d-flex align-items-center">
                                    {detail.label === 'Link' ? 
                                    <a href={detail.value} target="_blank">{fixLink(detail.value)}</a>
                                    :
                                    <p>{detail.value}</p>
}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ScholarshipDeatilModal;
