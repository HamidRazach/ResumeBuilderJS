import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });



export const resume_profile_data = (data, token) =>{
    return async (dispatch) => {
      try {
        const response = await commonApi.resume_preview(data, token);
        dispatch(getDispatch("resume_data", response?.user_info));
        return response;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    };
  };