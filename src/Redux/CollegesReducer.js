const initialState = {
    data: [],
  };
  
  const CollegesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "Add_Colleges":
        return {
          ...state,
          data: [
            ...state.data,
            ...(Array.isArray(action?.payload?.data)
              ? action.payload.data
              : [action.payload.data]),
          ],
        };
  
      case "Remove_Colleges":
        return {
          ...state,
          data: state.data.filter(
            (college) => college.id !== action.payload.id
          ),
        };
  
      case "Update_Status":
        return {
          ...state,
          data: state.data.map((college) =>
            college.id === action.payload.id
              ? { ...college, status: action.payload.status } 
              : college
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default CollegesReducer;
  