import React, { useState } from 'react';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import '@progress/kendo-theme-default/dist/all.css';
import { Button } from '@progress/kendo-react-buttons';
import './ChangePassword.css';
import axios from 'axios';

function ChangePassword() {
      const [passwordShown, setPasswordShown] = useState('password');
      const [message, setMessage] = useState();
      const [userPassword, setUserPassword] = useState({
            password: '',
            passwordError: ''
        });

      axios.defaults.withCredentials = true

      const handleSubmit = data => {
            data.newPassword = userPassword.password;

            if (data.newPassword !== data.confirmPassword) {
                  setMessage('New Password & Confirm Password is Mismatch');
                  return false;
            }
            if (data.newPassword == data.confirmPassword) {
                  setMessage('');
            }
            axios
                  .put('http://localhost:3005/changePassword', data)
                  .then(res => {
                        console.log(res);
                        if (res.data.updatePassword) {
                              console.log(res.data);
                              setMessage(res.data.message)
                        }
                        if (!res.data.updatePassword) {
                              setMessage(res.data.message);
                        }
                  })
      }

      const togglePassword = () => {
            setPasswordShown(passwordShown === 'text' ? 'password' : 'text');
      };
      const handlePassword = (e) => {
            if (e.target.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!<>()@$%^&*-]).{8,}$/) != null) {
                setUserPassword({
                    password: e.target.value,
                    passwordError: ''
                });
            }
            else {
                setUserPassword({
                    password: '',
                    passwordError: 'should contain at least one upper & lower case,one digit,one Special character & 8 characters in length'
                });
            }
        }

      return (
            <>
                  <div className='changePassword' >
                        <Form autocomplete='off' onSubmit={handleSubmit}
                              render={(formRender) => (<FormElement >
                                    
                                          <div className='header'>
                                                <h3>Change Password</h3>
                                          </div>

                                          <div className='overlap-text'>
                                                <h4> Old Password: <span className='registration-error'>*</span> </h4>
                                                <Field required name='oldPassword' type='password' placeholder='Old Password' className='input1' component={Input} /> <br />
                                                <p >{<RiLockPasswordLine />}</p>
                                          </div>

                                          <div className='overlap-text'>
                                                <h4>New Password: <span className='registration-error'>*</span> </h4>
                                                <Field required name='newPassword' type='password' placeholder='New Password' className='input1' component={Input} onChange={handlePassword}/>
                                                <span className='registration-error'> {userPassword.passwordError} </span> <br />
                                                <p >{<RiLockPasswordLine />}</p>
                                          </div>

                                          <div className='overlap-text'>
                                                <h4> Confirm Password: <span className='registration-error'>*</span> </h4>
                                                <Field required name='confirmPassword' type={passwordShown} placeholder='Confirm Password' className='input1' component={Input} /> <br />
                                                <p onClick={togglePassword} >{passwordShown === 'text' ? <AiFillEye /> : <AiFillEyeInvisible />}</p>
                                          </div>

                                          <p className='password-error'> {message}</p>

                                          <Button primary={true} className='edit1-btn' disabled={!formRender.allowSubmit} > Submit
                                          </Button>
                                   

                              </FormElement >
                              )}
                        />
                  </div>
            </>
      )
}
export default ChangePassword;
