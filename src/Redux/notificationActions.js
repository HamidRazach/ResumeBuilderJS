import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });



export const get_notification = (token) =>{
    return async (dispatch) => {
      try {
        const response = await commonApi.get_notifications('', token);
        dispatch(getDispatch("notification_Listing", response?.questions));
        return response;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    };
  };