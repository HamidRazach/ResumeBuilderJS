const initialState = {
  isLoggedIn: false,
  user: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGNUP":
      return {
        ...state,

        user: {
          gender: action?.payload?.gender,
          user_type: "user",
          token: action?.payload?.token,
          onboarding: false,
          payment_status: false,
        },
        isLoggedIn: true,
      };

    case "LOGIN":

    return {
        ...state,
        isLoggedIn: true,
        user: {
          gender: action?.payload?.gender,
          user_type: action.payload.user_type, 
          onboarding: action?.payload?.onboarding,
          payment_status: action?.payload?.payment_status,
          token: action?.payload?.token,
        },
      };
    case "Gender":

    return {
        ...state,
        isLoggedIn: true,
        user: {
          gender: action?.payload?.gender,
          user_type: state.user?.user_type, 
          onboarding: state.user?.onboarding,
          payment_status: state.user?.payment_status,
          token: action?.payload?.token,
        },
      };


      case "payment_status":

      return {
          ...state,
          isLoggedIn: true,
          user: {
            gender: state.user?.gender,
            user_type: state.user?.user_type, 
            onboarding: state.user?.onboarding,
            payment_status: action?.payload?.payment_status,
            token: state.user?.token,
          },
        };
  

      // if (action.payload.user_type === "admin") {
      //   window.location.href = "/journey";
      // } else {
      //   if (action.payload.onboarding) {
      //     if (action.payload.payment_status) {
      //       window.location.href = "/journey";
      //     } else {
      //       window.location.href = "/playground";
      //     }
      //   } else {
      //     window.location.href = "/onboarding";
      //   }
      // }

    case "ONBOARDING":
      return {
        ...state,
        isLoggedIn: true,

        user: {
          gender: state.user?.gender,
          user_type: state.user?.user_type,
          onboarding: !state.user?.onboarding,
          // payment_status: state.payment_status,
          // payment_status: false,
          payment_status: state.user?.payment_status,
          token: state.user?.token
        },
      };
      case "Logout":
        return {
          ...state,
          isLoggedIn: false,
          user: {
            gender: '',
            user_type: '',
            token:'',
            onboarding: false,
            payment_status: false,
          },
        };
  

    default:
      return state;
  }
};

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       // Update user information in the state
//       const newState = {
//         ...state,
//         isLoggedIn: true,
//         user: {
//           gender: action.payload.gender,
//           user_type: action.payload.user_type,
//           token: action.payload.token,
//           onboarding: action.payload.onboarding,
//         },
//       };
//       // Perform conditional logic based on onboarding status
//       if (action.payload.onboarding) {
//         if (action.payload.payment_status === true) {
//           // Redirect to "/journey" if payment status is true
//           window.location.href = "/journey";
//         } else {
//           // Redirect to "/playground" if payment status is false
//           window.location.href = "/playground";
//         }
//       } else {
//         // Redirect to "/onboarding" if onboarding status is false
//         window.location.href = "/onboarding";
//       }
//       return newState;

//     default:
//       return state;
//   }
// };

export default rootReducer;
