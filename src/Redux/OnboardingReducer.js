const initialState = {
  data: [],
};

const OnboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ONBOARDING_question_listing":
      return {
        ...state,
        data: action.payload.data, // Directly setting the new data
      };

    default:
      return state;
  }
};

export default OnboardingReducer;