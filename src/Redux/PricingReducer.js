const initialState = {
    data: null,
    grade: null
  };
  
  const payment_reducer = (state = initialState, action) => {
    switch (action.type) {
      case "PAYMENT_STATUS":
        return {
          ...state,
  
          data: {
            grade: action?.payload?.grade,
            id: action?.payload?.id,
            price: action?.payload?.price,
            type: action?.payload?.type,
            package_id: action?.payload?.package_id,
          },
        };

      // case "pricing_data":
      //   return {
      //     ...state,
  
      //     grade: {
      //       grade: action?.payload?.grade
      //     },
      //   };
      case "pricing_type":
        return {
          ...state,
  
          type: {
            price: action?.payload?.price,
            type: action?.payload?.type,
            grade: action?.payload?.grade,
          },
        };
  
      default:
        return state;
    }
  };
  
   
  export default payment_reducer;
  