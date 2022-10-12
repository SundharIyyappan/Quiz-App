import React from 'react';
import classes from '../Components/MainNavigation.module.css';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie'
import { Button } from '@progress/kendo-react-buttons';

function AdminNavigation() {

    const history = useHistory();

    const handleLogout = () => {
        Cookies.remove('userId');
        Cookies.remove('role_admin');
        history.push('/');
    }

    if (!Cookies.get('userId')) {
        history.push('/');
    }

    if (Cookies.get('userId') && Cookies.get('role_user')) {
        history.push('/home');
    }

    return (
        <div>
            <header className={classes.header}>
                <div className={classes.logo}>Changepond Technologies...
                <img src="https://media.glassdoor.com/lst/4a/81/52/7b/headquarters.jpg" width="82" height="72" alt='hi' style={{float:"left", margin: "10px 0 0 40px" }}/> 
                {/* <img src="https://cbin.b-cdn.net/img/GO/Government-of-India01_9CFDJ_800x582.jpeg" width="82" height="72" alt='hi' style={{float:"right", margin: "10px 20px 0 0"}}/> */}
                </div>
                <nav>
                    <ul >
                        <Link to='/admin'>
                            <li className='link1'><b> Admin </b></li>
                        </Link>
                        <Link to='/profile'>
                            <li className='link1'><b> Profile </b></li>
                        </Link>
                        <Link to='/addQuiz'>
                            <li className='link1'><b> Question</b></li>
                        </Link>
                        <Link to='/chart'>
                            <li className='link1'><b> Charts</b></li>
                        </Link>

                        <Button primary={true} className={classes.logout} onClick={handleLogout}>Logout</Button>

                    </ul>
                </nav>
            </header >
        </div >
    );
}
export default AdminNavigation;


