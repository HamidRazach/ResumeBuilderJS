import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });

    export const get_user_info = (token) => {
      return async (dispatch) => {
        try {
          const response = await commonApi.user_info("", token);
          dispatch(getDispatch("VIEW_USER_PROFILE", response?.user_info));
          return response;
        } catch (error) {
          console.error("Error fetching user profile:", error);
          throw error;
        }
      };
    };
  

