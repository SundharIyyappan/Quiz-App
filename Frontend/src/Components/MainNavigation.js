import React from 'react';
import classes from './MainNavigation.module.css';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Button } from '@progress/kendo-react-buttons';

function MainNavigation() {
    Axios.defaults.withCredentials = true;
    const history = useHistory();

    // if (!localStorage.getItem('token')) {
    //     return <Redirect to= '/' />;
    // }

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('role_user');
        history.push('/');
    }

    if (!Cookies.get('userId')) {
        history.push('/');
    }

    if (Cookies.get('userId') && Cookies.get('role_admin')) {
        history.push('/admin');
    }

    return (
        <div>
            <header className={classes.header}>
                <div className={classes.logo}>  Changepond Technologies...
                    <img src="https://media.glassdoor.com/lst/4a/81/52/7b/headquarters.jpg" width="82" height="72" alt='Changepond logo' style={{ float: "left", margin: "10px 0 0 40px" }} />
                    {/* <img src="https://cbin.b-cdn.net/img/GO/Government-of-India01_9CFDJ_800x582.jpeg" width="82" height="72" alt='hi' style={{ float: "right", margin: "10px 30px 0 0" }} /> */}
                </div>
                <nav>
                    <ul>
                        <Link to='/home'>
                            <li className={classes.link1}> <b>Home</b></li>
                        </Link>
                        <Link to='/score'>
                            <li className={classes.link1}><b> Score </b></li>
                        </Link>
                        <Link to='/account'>
                            <li className={classes.link1}><b> Account </b></li>
                        </Link>
                        <Link to='/feedback'>
                            <li className={classes.link1}><b> Feedback </b></li>
                        </Link>

                        <Button primary={true} className={classes.logout} onClick={handleLogout}>Logout</Button>

                    </ul>
                </nav>
            </header>
        </div>
    );
}
export default MainNavigation;


