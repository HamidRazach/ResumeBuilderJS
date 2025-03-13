import React from 'react'

export const AnnuallyData = ({data, handle, grade}) => {
  return (
    <div className="payment-tab-holder">
      {data && data.length > 0 && data.map((item,index)=> 
                       < >
                        <div className="payment-tab-content">
                          <div className="payment-list-box">
                            <h3>Included</h3>
                            <ul className="list-unstyled">
                             
                              <li>{item.description.access}</li>
                              <li>{item.description.playground}</li>
                              <li>{item.description.analysis}</li>
                              <li>{item.description.activity}</li>
                              <li>{item.description.award}</li>
                              <li>{item.description.college}</li>
                              <li>{item.description.resume_builder}</li>
                            
                            </ul>
                            <div className="dollar-list-contain">
                              <strong>${item?.price}</strong>
                              <button
                                className="btn btn-primary landing-custom-btn"
                                onClick={() => {
                                  handle(item.price, item.type, grade);
                                }}
                              >
                                Get Started
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="payment-tab-content">
                          <div className="payment-list-box">
                            <h3>Included</h3>
                            <ul className="list-unstyled">
                              <li>Access to Playground</li>
                              {/* <li>Path Playground</li>
                        <li>Likelihood Analysis</li>
                        <li>Activity Suggestions</li>
                        <li>Award Suggestions</li>
                        <li>College Suggestions</li>
                        <li>College Suggestions</li>
                        <li>Resume Builder</li> */}
                            </ul>
                            <div className="dollar-list-contain">
                              <strong>Free</strong>
                              <button
                                className="btn btn-primary landing-custom-btn"
                                onClick={() => {
                                  handle("", item.type, grade);
                                }}
                              >
                                Get Started
                              </button>
                            </div>
                          </div>
                        </div>
                        </>
                        )}

                      </div>
  )
}

