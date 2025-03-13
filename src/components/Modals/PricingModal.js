import React, { useState, useEffect } from "react";
import { Modal, Form, Tabs, Tab } from "react-bootstrap";
import commonApi from "../../CommonApi/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { payment_status } from "../../Redux/PricingAction";
import { loadStripe } from "@stripe/stripe-js";
import { stringToInt, stripe_promise } from "../../constant/commonUtils";

import StripePaymentForm from "../tabs/StripePaymentForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(stripe_promise());

const PricingModal = (props) => {
  const [pricing_detail, setPricing_detail] = useState([]);

  const [key, setKey] = useState("annually");
  const [modelType, setModelType] = useState("");
  const [selectedPkg, setSelectedPkg] = useState({});
  const pricingSelector = useSelector((state) => state.rootReducer);

  const history = useNavigate();

  const dispatch = useDispatch();

  const tokenSelector = useSelector((state) => state.rootReducer?.user?.token);

  const user_type = useSelector((state) => state.payment_reducer);
  const seletedPkg = user_type?.type?.type;

  useEffect(() => {
    if (props.show) {
      get_pricing_packages();
    } else {
      setPricing_detail([]);
    }
    // eslint-disable-next-line
  }, [props.show]);

  const get_pricing_packages = () => {
    commonApi
      .get_packages("", tokenSelector)
      .then((res) => {
        if (res.status === 200 && res.success) {
          setPricing_detail(res?.questions);
          if (seletedPkg === "anually") {
            setKey("annually");
          }
          if (seletedPkg === "one_time") {
            setKey("one-time");
          }
          if (
            res?.questions.length > 0 &&
            res.questions[0]?.grade === "senior"
          ) {
            setKey("one-time");
          }
        }
      })
      .catch((err) => {
        console.log("Err", err);
        return { type: "error", message: err.message };
      });
  };


  const handleClose = () => {
    if (pricingSelector?.user?.payment_status === true) {
      props.setShowModel(false);
      // history("/journey");
    } else {
      // history("/playground");
      props.setShowModel(false);
    }
  };

  const handleGetStarted = (data) => {
    setSelectedPkg({
      grade: data.grade,
      id: data.id,
      price: data.price,
      type: data.type,
      package_id: data.package_id,
    });
    dispatch(
      payment_status(
        data.grade,
        data.id,
        data.price,
        data.type,
        data.package_id
      )
    );
    // props.setShowModel(false);
    setModelType("stripe");
  };

  const annually_data = pricing_detail?.filter(
    (item) => item.type === "anually"
  );
  const onetime_data = pricing_detail?.filter(
    (item) => item.type === "one_time"
  );

  const senior_data = pricing_detail?.filter(
    (item) => item.grade === "senior"
  );


  return (
    <>
      {modelType === "" && pricing_detail?.length > 0 && (
        <Modal
          id="pricing-modal"
          className={senior_data ? 'custom-modal1 one_tab_pricing' : "custom-modal1"}
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <div className={!annually_data ||
              !annually_data?.length > 0 && "one-time-tab"}>
              <h2>Pricing</h2>
              <i className="fa-solid fa-xmark" onClick={handleClose}></i>
            </div>
          </Modal.Header>

          <Modal.Body>
            <Form
              noValidate
              // validated={validated}
              // onSubmit={handleSubmit}
              className="custom-form-modal"
            >
              <div className="pricing-info-block">
                <div className="modal-tab-block"></div>

                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  {annually_data &&
                    annually_data?.length > 0 &&
                    annually_data[0]?.grade && (
                      <Tab
                        eventKey="annually"
                        title={
                          <div>
                            <span>Annually</span>
                          </div>
                        }
                      >
                        {annually_data &&
                          annually_data?.length > 0 &&
                          annually_data.map((data, index) => (
                            <div className="payment-tab-holder" key={index}>
                              <div className="payment-tab-content">
                                <div className="payment-list-box">
                                  <h3>Included</h3>
                                  <ul className="list-unstyled">
                                    <li>{data.description?.access}</li>
                                    <li>{data.description?.playground}</li>
                                    <li>{data.description?.analysis}</li>
                                    <li>{data.description?.activity}</li>
                                    <li>{data.description?.award}</li>
                                    <li>{data.description?.college}</li>
                                    <li>{data.description?.resume_builder}</li>
                                  </ul>
                                  <div className="dollar-list-contain">
                                    <strong>${data.price}</strong>
                                    <button
                                      className="btn btn-primary landing-custom-btn"
                                      onClick={() => {
                                        handleGetStarted(data);
                                      }}
                                    >
                                      Get Started
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </Tab>
                    )}
                  {onetime_data && onetime_data?.length > 0 && (
                    <Tab
                      eventKey="one-time"
                      // tabClassName={!annually_data ||
                      //   !annually_data?.length > 0 && "one-time-tab"}
                      title={
                        <div>
                          <span>One Time</span>
                        </div>
                      }
                    >
                      {onetime_data &&
                        onetime_data?.length > 0 &&
                        onetime_data.map((data, index) => (
                          <div className="payment-tab-holder" key={index}>
                            <div className="payment-tab-content">
                              <div className="payment-list-box">
                                <h3>Included</h3>
                                <ul className="list-unstyled">
                                  <li>{data.description?.access}</li>
                                  <li>{data.description.playground}</li>
                                  <li>{data.description.analysis}</li>
                                  <li>{data.description.activity}</li>
                                  <li>{data.description.award}</li>
                                  <li>{data.description.college}</li>
                                  <li>{data.description.resume_builder}</li>
                                </ul>
                                <div className="dollar-list-contain">
                                  <strong>${data.price}</strong>
                                  <button
                                    className="btn btn-primary landing-custom-btn"
                                    onClick={() => {
                                      handleGetStarted(data);
                                    }}
                                  >
                                    Get Started
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </Tab>
                  )}
                </Tabs>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
      {modelType !== "" && (
        <Modal
          id="join-modal"
          className="custom-modal1 custom-modal2 custom-modal3"
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header style={{marginBottom:'2px'}}>
            <h2>Payment</h2>
            <i className="fa-solid fa-xmark" onClick={handleClose}></i>
          </Modal.Header>

          <Modal.Body className="mt-2">
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: 100 * stringToInt(selectedPkg?.price),
                currency: "usd",
                paymentMethodTypes: ["card"],
                payment_method_types: ["card"],
              }}
            >
              <StripePaymentForm />
            </Elements>
            {/* <Button>
          Submit
        </Button> */}
            {/* <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm productName={productName} productAmount={productAmount} />
        </Elements> */}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PricingModal;
