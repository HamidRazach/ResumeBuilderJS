const initialState = {
    show: true,
  };
  
  const video_model_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "decesion":
        return {
          ...state,
  
          show: action?.payload?.show,
        };
  
    
  
      default:
        return state;
    }
  };
 
  
  export default video_model_reducer;
  