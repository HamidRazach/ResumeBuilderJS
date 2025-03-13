const initialState = {
    scholarshipListing: [],
  };
  
    const get_scholarship = (state = initialState, action) => {
      switch (action.type) {
    
           
            case "SCHOLARSHIP":
                return {
                  ...state,
                  
                  scholarshipListing: action.payload,
                };
              
    
        default:
          return state;
      }   
    };
    
    export default get_scholarship;
    