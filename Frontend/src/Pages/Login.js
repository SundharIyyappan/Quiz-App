import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';
import '@progress/kendo-theme-default/dist/all.css';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { AiFillEyeInvisible, AiFillEye, AiOutlineUser } from 'react-icons/ai';
import { Button } from '@progress/kendo-react-buttons';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {

    const history = useHistory();
    const [message, setMessage] = useState();
    const [passwordShown, setPasswordShown] = useState('password');

    axios.defaults.withCredentials = true

    const handleSubmit = (data, e) => {
        data.userName = e.target.userName.value;
        data.password = e.target.password.value;

        axios
            .post('http://localhost:3005/login', data)
            .then(res => {
                console.log(res);
                if (res.data.auth && res.data.result[0].user === 1) {
                    Cookies.set('role_admin', res.data)
                    history.push('/admin');
                }
                if (res.data.auth && res.data.result[0].user === 0) {
                    Cookies.set('role_user', res.data)
                    history.push('/home');
                }
                if (!res.data.auth)
                    setMessage(res.data.message);
            })
    }

    const resetPassword = () => {
        alert('Password reseted');
    }

    if (Cookies.get('userId') && Cookies.get('role_user')) {
        history.push('/home');
    }

    if (!Cookies.get('userId')) {
        history.push('/');
    }
    if (Cookies.get('userId') && Cookies.get('role_admin')) {
        history.push('/admin');
    }

    const togglePassword = () => {
        setPasswordShown(passwordShown === 'text' ? 'password' : 'text');
    };

    // if (localStorage.getItem('token')) {
    //     return <Redirect to='/home' />;
    // }
    // localStorage.setItem('token', res.data.token)

    return (
        <div className='login'>
            <div>
                <Form onSubmit={handleSubmit}
                    render={(formRender) => (<FormElement >
                        <div id='wrapper'>
                            <div className='main-content'>
                                <div className='header'>
                                    <h3>LOGIN</h3>
                                </div>

                                <div className='overlap-text' >
                                    <Field required name='userName' placeholder='Username' className='input1' component={Input} /> <br />
                                    <a >{<AiOutlineUser />}</a>
                                </div>

                                <div className='overlap-text' >
                                    <Field required name='password' type={passwordShown} placeholder='Password' className='input1' component={Input} /> <br />
                                    <a onClick={togglePassword} >{passwordShown === 'text' ? <AiFillEye /> : <AiFillEyeInvisible />}</a>
                                </div>

                                <div className='support' onClick={resetPassword}>
                                    Forgot Password ?<Link to='/'>Reset</Link>
                                </div>

                                <p className='login-error'> {message} </p>
                                
                                <Button primary={true} className='login-btn' disabled={!formRender.allowSubmit} >Login</Button>

                            </div>

                            <div className='sub-content'>
                                <div className='support'>
                                    Don't have an account?<Link to='/registration'>Sign up</Link>
                                </div>
                            </div>
                        </div>
                    </FormElement >
                    )}
                />
            </div>
        </div>
    )
}
export default Login;

