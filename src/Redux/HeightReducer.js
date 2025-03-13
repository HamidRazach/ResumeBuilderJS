const initialState = {
    data: null,
  };
  
  const height_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "Height":
        return {
          ...state,
  
          data: {
            data: action?.payload?.data,
            type: action?.payload?.type,
          },
        };
  
    
  
      default:
        return state;
    }
  };
 
  
  export default height_reducer;
  