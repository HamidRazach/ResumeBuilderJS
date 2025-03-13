const initialState = {
    usersData: null,
  };
  
    const resume_reducer = (state = initialState, action) => {
      switch (action.type) {

            case "resume_data":
                return {
                  ...state,
                  
                  usersData: action.payload,
                };
              
    
        default:
          return state;
      }
    };
    
    export default resume_reducer;
    