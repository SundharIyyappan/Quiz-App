import React, { useEffect, useState } from 'react';
import MainNavigation from '../Components/MainNavigation';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import axios from 'axios';
import './Score.css';
import Draggable from 'react-draggable';

function Score() {

    const initialDataState = {
        skip: 0,
        take: 4,
    };
    const [page, setPage] = useState(initialDataState);
    const pageChange = (event) => {
        setPage(event.page);
    };

    const [scoreDetails, setScoreDetails] = useState([]);
    const [name, setName] = useState([]);

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get('http://localhost:3005/getScore')
            .then(res => {
                console.log(res.data.result);
                setScoreDetails(res.data.result);
            }),
            axios.get('http://localhost:3005/login')
                .then(res => {
                    if (res.data.loggedIn === true) {
                        setName(res.data.profile[0]);
                    }
                })
    }, [])

    return (
        <div className='score'>
            <MainNavigation />

            {/* <div className="card" style={{ width: "18rem" }}>
                <img src="Score.jpg" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div> */}

            <Draggable>
                <div className='scoreDetails'>
                    <h2 className='top'> User-Id: {name.userId} , UserName: {name.userName}</h2> <br />
                    <Grid style={{ height: '350px' }}

                        data={(typeof scoreDetails !== 'undefined') ? scoreDetails.slice(page.skip, page.take + page.skip) : scoreDetails}
                        skip={page.skip}
                        take={page.take}
                        total={(typeof scoreDetails !== 'undefined') ? scoreDetails.length : " "}
                        pageable={true}
                        onPageChange={pageChange} >

                        <Column className='text' field='userId' title='User-Id' width='105px' />
                        <Column className='text' field='score' title='Score' width='200px' />
                        <Column className='text' field='attempt' title='Attempt-Details' width='200px' />
                        <Column className='text' field='submitted_date' title='Submitted-Date' width='275px' />
                    </Grid>
                </div>
            </Draggable>
        </div>
    )
}
export default Score;