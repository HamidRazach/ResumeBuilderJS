import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { url_action } from "../../Redux/URLAction";
import SpinnerLoader from "../../webLoader/SpinnerLoader";
import commonApi from "../../CommonApi/CommonServices";
import { errorMessage } from "../../Errors/Toast";
const StripePaymentForm = (props) => {
  const userSelectPkg = useSelector((state) => state.payment_reducer?.data);
  const stripe = useStripe();
  const elements = useElements();
  const [showLoader, setShowLoader] = useState(false);
  const token = useSelector((state) => state.rootReducer?.user?.token);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(url_action(location.pathname));

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      errorMessage(submitError.message);
      return;
    }
    setShowLoader(true);
    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    try{
    const requestBody = {
      amount: 100 * userSelectPkg?.price,
      package_id: userSelectPkg?.package_id,
    };
    const response = await commonApi.create_payment(requestBody, token);
    // axios.post(
    //   "https://api.thepathfinderhub.com/api/create_payment",
    //   requestBody,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    const clientSecret = response.stripe.client_secret;
    const transactionId = response.stripe.id;

    const host = window.location.origin;
    const returnUrl = `${host}/payment/${transactionId}`;
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (stripeError) {
      errorMessage("Payment failed. Please try again.")
      setShowLoader(false);
    }
  } catch (error) {
    errorMessage("An unexpected error occurred. Please try again.");
    setShowLoader(false);
  }

  };


  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        ":focus": {
          border: "none",
          outline: "none",
          boxShadow: "none",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="payment-from">
          <PaymentElement options={cardStyle} />
          {!showLoader && (
            <button type="submit" disabled={!stripe || !elements}>
              Submit
            </button>
          )}
        </div>
        {showLoader && <SpinnerLoader color={"#fff"} />}
        {/* Show error message to your customers */}
        {/* {errorMessage && <div>{errorMessage}</div>} */}
      </form>
    </div>
  );
};
export default StripePaymentForm;
