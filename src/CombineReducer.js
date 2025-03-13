import { combineReducers } from 'redux';
import rootReducer from './Redux/LoginReducer';
import profileReducer from './Redux/ProfileReducer';
import payment_reducer from './Redux/PricingReducer';
import URL_reducer from './Redux/URLReducer';
import resume_reducer from './Redux/ResumeReducer';
import height_reducer from './Redux/HeightReducer';
import scrollable_reducer from './Redux/ScrollableReducer';
import News_Reducer from './Redux/NewsReducer';
import get_scholarship from './Redux/GetScholarshipReducer';
import OnboardingReducer from './Redux/OnboardingReducer';
import CollegesReducer from './Redux/CollegesReducer';
import notification_reducer from './Redux/notificationReducer';
import userProfileReducer from './Redux/userProfileReducer';
import video_model_reducer from './Redux/VideoModelReducer';

const combinedReducers = combineReducers({
    rootReducer,
    profileReducer,
    payment_reducer,
    URL_reducer,
    resume_reducer,
    height_reducer,
    scrollable_reducer,
    News_Reducer,
    get_scholarship,
    OnboardingReducer,
    CollegesReducer,
    notification_reducer,
    userProfileReducer,
    video_model_reducer,
});

export default combinedReducers;
