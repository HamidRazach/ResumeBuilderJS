import "./App.css";
import "./index.css";
import "./assets/css/dev-responsive.css";

import React from "react";
import "./assets/css/custom.css";
import "./assets/css/dev.css";
import "./assets/css/responsive.css";

import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, Navigate } from "react-router-dom";

import MainScreen from "./components/MainScreen/MainScreen";
import GetStartedScrn from "./components/GetStartedScreen/GetStartedScrn";
import Onboarding from "./components/OnboardingScreen/Onboarding";
import LandingPage from "./components/LandingPage/LandingPage";
import { useSelector } from "react-redux";
import ForgetPassword from "./components/ForgetPassword";

function App() {
  const selector = useSelector((state) => state.rootReducer);
  const userType = selector?.user?.user_type;
  const paymentStatus = selector?.user?.payment_status;

  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   // localStorage.getItem("token") ? true : false
  //   selector.isLoggedIn ? true : false
  // );

  // useEffect(() => {
  //   // Simulate retrieving login status from local storage or a server
  //   // const storedUser = localStorage.getItem("token") ? true : false;
  //   const storedUser = selector.isLoggedIn ? true : false;
  //   setIsLoggedIn(storedUser);
  // }, []);

  return (
    <>
      {!selector.isLoggedIn ? (
        <Routes>
          <Route path="/*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<GetStartedScrn />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/forget_password/:token" element={<ForgetPassword />} />
        </Routes>
      ) : !selector?.user?.onboarding ? (
        <Routes>
          <Route path="/*" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/journey" element={<MainScreen />} />
          <Route path="/payment/:paymentId" element={<MainScreen />} />
          {/* <Route path="/onboarding" element={<Onboarding />} /> */}
          <Route
            path="/*"
            element={
              <Navigate
                to={
                  selector.isLoggedIn && userType === "admin"
                    ? "/journey"
                    : userType === "user" && paymentStatus === true
                    ? "/journey"
                    : "/journey"
                }
                replace
              />
            }
          />
          {/* <Route path="/playground" element={<MainScreen />} /> */}
          <Route path="/universities" element={<MainScreen />} />
          <Route path="/settings" element={<MainScreen />} />
          <Route path="/dashboard" element={<MainScreen />} />
          
          {userType === "user" &&
          <Route path="/story" element={<MainScreen />} />
}
          <Route path="/scholarship" element={<MainScreen />} />
          {userType === "admin" &&  
          <Route path="/users" element={<MainScreen />} />  
          }        
          <Route path="/news" element={<MainScreen />} />
        

        </Routes>
      )}
    </>
  );
}

export default App;

// return (
//   <>
//     {!selector.isLoggedIn ? (
//       <Routes>
//         <Route path="/*" element={<Navigate to="/" replace />} />
//         <Route path="/login" element={<GetStartedScrn />} />
//         <Route path="/" element={<LandingPage />} />
//       </Routes>
//     ) : (
//       !selector.onboarding ? (
//         <Routes>
//           <Route path="/onboarding" element={<Onboarding />} />
//         </Routes>
//       ) : (
//         <Routes>
//           <Route path="/journey" element={<MainScreen />} />
//           <Route path="/*" element={<Navigate to="/playground" replace />} />
//           <Route path="/playground" element={<MainScreen />} />
//           <Route path="/universities" element={<MainScreen />} />
//           <Route path="/settings" element={<MainScreen />} />
//           <Route path="/dashboard" element={<MainScreen />} />
//           <Route path="/users" element={<MainScreen />} />
//         </Routes>
//       )
//     )}
//   </>
// );
