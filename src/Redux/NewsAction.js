import commonApi from "../CommonApi/CommonServices";


  const getDispatch = (action,state) => ({
    type: action,
    payload: state,
  });


    
  export const newsData = (data, token, page) =>{
    return async (dispatch) => {
      try {
        const response = await commonApi.get_news(data, token);
        
        const fetchedData = response || [];

        if (fetchedData?.data.length > 0) {
          if (page > 1) {
            if (fetchedData?.data.length > 0) {
              dispatch(getDispatch("PUSH_NEWS", fetchedData?.data));
            }
          } else if (page === 1) {
            dispatch(getDispatch("SET_NEWS", fetchedData?.data));
          }
        } else if (fetchedData?.data.length === 0 && page === 1) {
          dispatch(getDispatch("SET_NEWS", fetchedData?.data));
        }

        return fetchedData;
      } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
      }
    };
  };


