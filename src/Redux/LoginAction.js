// import { encryptData } from "../Secure_data";


  export const signUp = (gender,token) => ({
    type: 'SIGNUP',
    payload: {
      gender: gender, 
      token: token
    }
  });
  export const Gender_Change = (gender,token) => ({
    type: 'Gender',
    payload: {
      gender: gender, 
      token: token
    }
  });

  
 
export const login = (gender, user_type,onboarding,payment_status, token ) => ({
    type: 'LOGIN',
    payload: { 
      gender: gender, 
      user_type: user_type, 
      onboarding: onboarding,
      payment_status: payment_status, 
      token: token
    }
  });


   
export const payment_status = (payment_status) => ({
  type: 'payment_status',
  payload: { 
    payment_status: payment_status, 
  }
});



 
  
  export const onBoarding = () => ({
    type: 'ONBOARDING',
  });
  
  export const Logout = () => ({
    type: 'Logout',
  });

