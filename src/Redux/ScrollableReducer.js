const initialState = {
    data: true,
  };
  
  const scrollable_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "SCROLL":
        return {
          ...state,
  
          data: {
            scroll: action?.payload?.scroll,
          },
        };
  
    
  
      default:
        return state;
    }
  };
 
  
  export default scrollable_reducer;
  