import React, { useEffect, useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import get_scholarship from '../../Redux/GetScholarshipReducer';
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { get_scholarships } from '../../Redux/GetScholarshipAction';
import { fixLink } from '../../constant/commonUtils';

const Calendar = () => {
    const todayDate =new Date().toISOString().split('T')[0]
    const dispatch = useDispatch();
    const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
    const scholarshipListing = useSelector((state) => state.get_scholarship?.scholarshipListing);
    
    const [clickedDate, setClickedDate] = useState(todayDate);
    const deadlineItem = scholarshipListing && scholarshipListing.length > 0 &&  scholarshipListing.find(item => item.deadline === todayDate);
    const [selectedScholarship, setSelectedScholarship] = useState(deadlineItem ? deadlineItem : '')

    useEffect(() => {
        dispatch(get_scholarships('', tokenSelector));
    }, []);


    const [currentDate, setCurrentDate] = useState(new Date());

    const getMonthName = (date) => {
        return date.toLocaleString('default', { month: 'long' });
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const startDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderHeader = () => {

        return (
            <div className="calendar-header">
                <button onClick={prevMonth}><MdOutlineKeyboardArrowLeft /></button>
                <span>{getMonthName(currentDate)} {currentDate.getFullYear()}</span>
                <button onClick={nextMonth}><MdKeyboardArrowRight /></button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="calendar-days">
                {days.map((day, index) => (
                    <div key={index} className="calendar-day">
                        {day}
                    </div>
                ))}
            </div>
        );
    };
    const ScholarshipCard = ({ selectedScholarship }) => {

        const day = clickedDate ? clickedDate.split('-')[2] : null;

        return (
            <div className="scholarship-calander">
                <h4 className="scholarship">Upcoming Scholarships</h4>
                <div className="card p-3 mt-2 mb-2">
                    {selectedScholarship ?
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="calander-content">
                                <small className="text-muted">
                                    <span className="text-primary">&#x25CF;</span> {selectedScholarship.deadline}
                                </small>
                                <h5 className="mt-2 mb-1">{fixLink(selectedScholarship.title)}</h5>
                                <p className="mb-0">{selectedScholarship.award_worth}</p>
                            </div>
                            <div>
                                <a className="card-link" target="_blank" href={selectedScholarship.link}>
                                    <FaArrowRightLong />
                                </a>
                            </div>

                        </div>
                        :
                        <div className='no-recorde-upscholarship'>
                            <h5 className="mt-2 mb-1">No scholarship found against {day} </h5>
                        </div>
                    }
                </div>
            </div>
        );

    };
    const renderCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = startDayOfMonth(currentDate);

        const cells = [];
        let day = 1;

        // Empty cells for previous month's days
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
        }

        // Cells for current month's days
        for (let i = startDay; i < daysInMonth + startDay; i++) {

            const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const deadlineItem =  scholarshipListing && scholarshipListing.length > 0 &&  scholarshipListing.find(item => item.deadline === currentDateString);

            const isClickedWithoutDeadline = clickedDate === currentDateString && !deadlineItem;

            cells.push(
                <div
                    key={`day-${day}`}
                    className={`calendar-cell ${day === currentDate.getDate() ? 'selected' : ''}}`}
                    style={{
                        backgroundColor: deadlineItem ? '#4792A7' : (isClickedWithoutDeadline ? 'gray' : 'transparent'),
                        color: (deadlineItem || isClickedWithoutDeadline) ? 'white' : 'black',
                        transition: 'background-color 0.5s ease, color 0.5s ease'
                    }}
                    onClick={() => {
                        setSelectedScholarship(deadlineItem);
                        setClickedDate(currentDateString);
                    }}
                >
                    {day}
                    {/* {deadlineItem && <div className="deadline-label">Deadline</div>} */}
                </div>
            );

            day++;
        }

        return <div className="calendar-cells">{cells}</div>;
    }


    return (
        <div className="calendar">
            {<ScholarshipCard selectedScholarship={selectedScholarship} />}
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default Calendar;
