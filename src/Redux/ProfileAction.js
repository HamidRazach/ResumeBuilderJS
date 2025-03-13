import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });

    export const user_profile_info = (id, token) => {
      return async (dispatch) => {
        try {
          const response = id ? await commonApi.user_info(id,token) : await commonApi.user_info("", token);
          dispatch(getDispatch("VIEWPROFILE", response?.user_info));
          return response;
        } catch (error) {
          console.error("Error fetching user profile:", error);
          throw error;
        }
      };
    };
  
  export const users_data = (data, token) =>{
    return async (dispatch) => {
      try {
        const response = await commonApi.all_users_info(data, token);
        dispatch(getDispatch("USERS", response?.users));
        return response;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    };
  };


