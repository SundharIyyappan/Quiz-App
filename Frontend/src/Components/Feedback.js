import React, { useState, useEffect } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import MainNavigation from './MainNavigation';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import axios from 'axios';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

function Feedback() {

      axios.defaults.withCredentials = true;

      const [name, setName] = useState([]);
      const [message, setMessage] = useState();
      const [submitted, setSubmitted] = useState(false);

      useEffect(() => {
            axios.get('http://localhost:3005/login')
                  .then(res => {
                        if (res.data.loggedIn === true) {
                              setName(res.data.profile[0]);
                        }
                        else {
                              console.log('User not logged in')
                        }
                  })
      }, [])

      const handleSubmit = (data, e) => {
            data.userId = name.userId
            data.userName = e.target.username.value;
            data.email = e.target.email.value;
            data.feedback = e.target.feedback.value;
            data.suggestion = e.target.suggestion.value;

            axios
                  .post('http://localhost:3005/feedback', data)
                  .then(res => {
                        console.log(res);
                        if (res.data.feedbackData) {
                              // setMessage(res.data.message);
                              setSubmitted(true);
                              // console.log(res.data.message)
                        }
                        if (!res.data.feedbackData)
                              setMessage(res.data.message);
                        // console.log(res.data.message)
                  })
                  e.preventDefault();
                  e.target.reset();
      }

      const handleSubmitted = () => {
            setSubmitted(false)            
            // window.location.reload();
      }

      return (
            <>
                  <MainNavigation />

                  <div className='addQuiz'>
                        <Form onSubmit={handleSubmit} 
                              render={(formRender) => (<FormElement >
                                    <div id='wrapper1'>
                                          <div className='Feedback-content'>
                                                <div className='header'>
                                                      <h3 className='welcome'>Student Feedback
                                                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsMIlm6mCiDlw05mR9QOkM2rFo31EukM-JhQ&usqp=CAU" width="72" height="62" alt='hi' style={{ float: "right", margin: "10px 0px 5px 0" }} />
                                                      </h3>
                                                </div>

                                                <p className='login-error'> {message} </p>

                                                <div className='overlap-text' >
                                                      <h4> Username: </h4>
                                                      <Field required name='username' key={name.userName} defaultValue={name.userName} placeholder='Username' className='input1' component={Input} readOnly={true} /> <br />
                                                </div>

                                                <div className='overlap-text' >
                                                      <h4> E-Mail: </h4>
                                                      <Field required name='email' type='email' key={name.email} defaultValue={name.email} placeholder='E-mail' className='input1' component={Input} readOnly={true} /> <br />
                                                </div>

                                                <div className='overlap-text' >
                                                      <h4> Feedback: <span className='registration-error'>*</span> </h4>
                                                      <Field required name='feedback' placeholder='Enter your feedback here (Max 1000 characters)' className='input1' rows={3} component={TextArea} /> <br />
                                                </div>

                                                <div className='overlap-text' >
                                                      <h4> Suggestion: <span className='registration-error'>*</span> </h4>
                                                      <Field required name='suggestion' placeholder='Enter your suggestion here (Max 1000 characters)' className='input1' rows={3} component={TextArea} /> 
                                                </div>
                                                <p> <b> Feedback submit one time only </b></p><br />
                                                <Button primary={true} className='feedback-btn' disabled={!formRender.allowSubmit} >Submit</Button>

                                          </div>
                                    </div>
                              </FormElement >
                              )}
                        />

                        {submitted && (
                              <Dialog title={'Press ok'} >
                                    <div >
                                          <p className='timeOut'><b> Feedback submitted successfully </b> </p> <br />
                                          <div className='delete-btn'>
                                                <DialogActionsBar>
                                                      <button className='yes-btn' onClick={handleSubmitted}>
                                                            Ok
                                                      </button>
                                                </DialogActionsBar>
                                          </div> </div>
                              </Dialog>
                        )}
                  </div>
                  
            </>
      )
}

export default Feedback;