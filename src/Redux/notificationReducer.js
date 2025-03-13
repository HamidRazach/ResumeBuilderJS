const initialState = {
    notificationListing: [],
  };
  
  const notification_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "notification_Listing":
        return {
            ...state,
            
            notificationListing: action.payload,
          };
        
  
    
  
      default:
        return state;
    }
  };
 
  
  export default notification_reducer;
  
  