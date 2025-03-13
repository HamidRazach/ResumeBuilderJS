const initialState = {
    user_profile_data: {},
};

  const userProfileReducer = (state = initialState, action) => {
    switch (action.type) {
  
          case "VIEW_USER_PROFILE":
              return {
                ...state,
                
                user_profile_data: action.payload,
              };

         
  
      default:
        return state;
    }
  };
  
  export default userProfileReducer;
  