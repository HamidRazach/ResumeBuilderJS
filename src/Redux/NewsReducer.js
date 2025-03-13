const initialState = {
    newsListing: [],
  };
  
    const News_Reducer = (state = initialState, action) => {
      switch (action.type) {
    
           
            case "SET_NEWS":
                return {
                  ...state,
                  
                  newsListing: action.payload,
                };
            case "PUSH_NEWS":
                return {
                  ...state,
                  
                  newsListing: action.payload,

                  newsListing: [
                    ...state.newsListing,
                    ...(Array.isArray(action?.payload)
                      ? action.payload
                      : [action.payload]),
                  ],
                };
              
    
        default:
          return state;
      }   
    };
    
    export default News_Reducer;
    