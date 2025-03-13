import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });


    
  export const get_scholarships = (data, token) =>{
    return async (dispatch) => {
      try {
        const response = await commonApi.upcoming_scholarship(data, token);
        
        dispatch(getDispatch("SCHOLARSHIP", response?.data));
        return response;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    };
  };


