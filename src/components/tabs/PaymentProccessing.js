import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import commonApi from "../../CommonApi/CommonServices";
import { payment_status } from "../../Redux/LoginAction";

const PaymentProccessing = () => {
  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);
  const user_location = useSelector((state) => state.URL_reducer?.data?.url);

  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  // Split the pathname using "/" as the delimiter
  const parts = pathname.split("/");

  // Get the last part of the pathname, which contains the token
  const id = parts[parts.length - 1];

  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    payment_details();
     // eslint-disable-next-line
  }, []);

  const payment_details = () => {
    const formData = new FormData();
    formData.append("stripe_id", id.toString());

    commonApi
      .payment_details(formData, tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          dispatch(payment_status(res.payment_status));


          localStorage.setItem("payment_status", true);
          setTimeout(() => {
            setProcessing(false);
          }, 1000);
          setTimeout(() => {
            history(user_location);
          }, 2000);
        }
      })

      .catch((err) => {
        console.log("Err", err);
      });
  };

  return (
    <div className="payment-container">
      <h2 className="payment-text">Processing Your Payment</h2>
      {processing && (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Please wait...</p>
        </div>
      )}
      {!processing && <p className="success-text">Payment Successful!</p>}
    </div>
  );
};

export default PaymentProccessing;
