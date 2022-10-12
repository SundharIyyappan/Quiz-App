import React, { useState, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import './Registration.css';
import '@progress/kendo-theme-default/dist/all.css';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { RadioButton } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { AiFillEyeInvisible, AiFillEye, AiOutlineUser, AiTwotonePhone, AiTwotoneMail } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Button } from '@progress/kendo-react-buttons';


function Registration() {

    const history = useHistory();
    const [passwordShown, setPasswordShown] = useState('password');
    const [selectedValue, setSelectedValue] = useState();
    const [value, setValue] = useState('');
    const city = ['Kanyakumari', 'Chennai', 'Karaikudi', 'Madurai', 'Trichy'];
    const [message, setMessage] = useState();
    const [created, setCreated] = useState(false);

    const [fullName, setFullName] = useState({
        userName: '',
        userNameError: ''
    });
    const [phoneNumber, setPhoneNumber] = useState({
        number: '',
        numberError: ''
    });
    const [userPassword, setUserPassword] = useState({
        password: '',
        passwordError: ''
    });
    const [passError, setPassError] = useState('')

    const handleChange = useCallback(
        (e) => {
            setSelectedValue(e.value);
        },
        [setSelectedValue]
    );

    const handleCity = (event) => {
        setValue(event.target.value);
    }

    const handleSubmit = data => {
        data.gender = selectedValue;
        data.city = value;
        data.userName = fullName.userName;
        data.number = phoneNumber.number;
        data.password = userPassword.password;

        if (data.password !== data.confirmPassword) {
            setPassError('Password Mismatch');
            return false;
        }
        if (data.password == data.confirmPassword) {
            setPassError('');
        }

        axios
            .post('http://localhost:3005/createUser', data)
            .then(res => {
                console.log(res);
                if (res.status === 201) {
                    console.log(res);
                    setCreated(true);
                } else {
                    //throw new Error('error')
                    setMessage(res.data.message);
                }
            })
        // .catch(error => {
        //     alert(`user already exist ${error}`)
        // });
        // alert(JSON.stringify(data, null, 2))
    }

    const togglePassword = () => {
        setPasswordShown(passwordShown === 'text' ? 'password' : 'text');
    };

    const handleCreated = () => {
        setCreated(false);
        history.push('/');
        // window.location.reload();
    }

    const handleUsername = (e) => {
        if (e.target.value.match(/^\w{1,20}$/) != null) {
            setFullName({
                userName: e.target.value,
                userNameError: ''
            });
        }
        else {
            setFullName({
                userName: '',
                userNameError: 'Please enter valid name'
            });
        }
    }
    const handlePhoneNumber = (e) => {
        if (e.target.value.match(/^\d{10}$/) != null) {
            setPhoneNumber({
                number: e.target.value,
                numberError: ''
            });
        }
        else {
            setPhoneNumber({
                number: '',
                numberError: 'Phone number contains 10 characters'
            });
        }
    }
    const handlePassword = (e) => {
        if (e.target.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?<>()!@$%^&*-]).{8,}$/) != null) {
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
        <div className='registration'>
            {/* <img className='profileImage' src='http://localhost:3005/public/uploads/Home-Back.png' /> */}
            <Form onSubmit={handleSubmit}
                render={(formRender) => (<FormElement >
                    <div id='wrapper1'>
                        <div className='registration-content'>
                            <div className='header'>
                                <h3>Registration</h3>
                            </div>
                            <p className='registration-error'> {message} </p>

                            <div className='overlap-text'>
                                <h4> Username: <span className='registration-error'>*</span> </h4>
                                <Field required name='userName' placeholder='Username' className='input1' component={Input} onChange={handleUsername} />
                                <span className='registration-error'> {fullName.userNameError} </span> <br />
                                <p >{<AiOutlineUser />}</p>
                            </div>

                            <div className='overlap-text'>
                                <h4> Password: <span className='registration-error'>*</span>  </h4>
                                <Field required name='password' type='password' placeholder='Password' className='input1' component={Input} onChange={handlePassword} />
                                <span className='registration-error'> {userPassword.passwordError} </span> <br />
                                <p >{<RiLockPasswordLine />}</p>
                            </div>

                            <div className='overlap-text'>
                                <h4> Confirm Password: <span className='registration-error'>*</span> </h4>
                                <Field required name='confirmPassword' type={passwordShown} placeholder='Confirm Password' className='input1' component={Input} />
                                <span className='registration-error'> {passError} </span> <br />
                                <p onClick={togglePassword} >{passwordShown === 'text' ? <AiFillEye /> : <AiFillEyeInvisible />}</p>
                            </div>

                            <div className='overlap-text'>
                                <h4> Phone Number: <span className='registration-error'>*</span> </h4>
                                <Field required name='number' type='text' placeholder='Phone no' className='input1' component={Input} onChange={handlePhoneNumber} />
                                <span className='registration-error'> {phoneNumber.numberError} </span> <br />
                                <p >{<AiTwotonePhone />}</p>
                            </div>

                            <div className='overlap-text'>
                                <h4> Date Of Birth: <span className='registration-error'>*</span> </h4>
                                <Field required name='date' type='Date' placeholder='date of birth' className='input1' component={Input} /> <br />
                            </div>

                            <div className='overlap-text'>
                                <h4> E-Mail: <span className='registration-error'>*</span> </h4>
                                <Field required name='email' type='email' placeholder='E-Mail' className='input1' component={Input} /> <br />
                                <p>{<AiTwotoneMail />}</p>
                            </div>

                            <h4> Gender: <span className='registration-error'>*</span> </h4>
                            <RadioButton required name="group1" value="Male" checked={selectedValue === 'Male'}
                                label="Male" onChange={handleChange} />
                            <RadioButton required name="group1" value="Female" checked={selectedValue === 'Female'}
                                label="Female" onChange={handleChange} /> <br /><br />

                            <h4> City: <span className='registration-error'>*</span> </h4>
                            <DropDownList required data={city} value={value} onChange={handleCity} />

                            <Button primary={true} className='register-btn' disabled={!formRender.allowSubmit} >Registration</Button>

                        </div>
                        <div className='sub-content'>
                            <div className='support'>
                                Already you have an account? <Link to='/'> Login</Link>
                            </div>
                        </div>
                    </div>
                </FormElement >
                )}
            />

            {created && (
                <Dialog title={"Press ok"} >
                    <div >
                        <p className='timeOut'><b> Account Created Successfully </b> </p>
                        <div className='delete-btn'>
                            <DialogActionsBar>
                                <button className='yes-btn' onClick={handleCreated}>
                                    Ok
                                </button>
                            </DialogActionsBar>
                        </div> </div>
                </Dialog>
            )}
        </div>
    )
}
export default Registration;



