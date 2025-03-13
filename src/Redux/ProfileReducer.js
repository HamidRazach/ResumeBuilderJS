const initialState = {
  profileData: {},
  usersData: [],
};

  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
  
          case "VIEWPROFILE":
              return {
                ...state,
                
                profileData: action.payload,
              };
          case "USERS":
              return {
                ...state,
                
                usersData: action.payload,
              };
            
  
      default:
        return state;
    }
  };
  
  export default profileReducer;
  