const initialState = {
    data: null,
  };
  
  const URL_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "URL":
        return {
          ...state,
  
          data: {
            url: action?.payload?.url,
          },
        };
  
    
  
      default:
        return state;
    }
  };
 
  
  export default URL_reducer;
  