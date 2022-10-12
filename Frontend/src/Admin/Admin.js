import React, { useState, useEffect } from 'react';
import AdminNavigation from '../Admin/AdminNavigation';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import '@progress/kendo-theme-default/dist/all.css';
import axios from 'axios';
import './Admin.css';
import AdminUpdateProfile from './AdminUpdateProfile';
import { ImCross, ImCheckmark } from 'react-icons/im';
import { filterBy } from '@progress/kendo-data-query';
import { orderBy } from '@progress/kendo-data-query';
import { FcFeedback } from 'react-icons/fc';

function Admin() {

    const [page, setPage] = useState({
        skip: 0,
        take: 5,
    });
    const pageChange = (event) => {
        setPage(event.page);
    };

    const initialFilter = {
        logic: "and",
        filters: [
            {
                field: "userName",
                operator: "contains",
                value: "",
            },
        ],
    };
    const [filter, setFilter] = useState(initialFilter);

    const [sort, setSort] = useState([
        {
            field: "userName",
            dir: "asc",
        }
    ]);
    const [adminDetails, setAdminDetails] = useState(false);
    const [userData, setUserData] = useState([]);
    const [userResult, setUserResult] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [feedbackResult, setFeedbackResult] = useState([]);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [profile, setProfile] = useState(false);
    const [deletes, setDeletes] = useState(false);
    const [userId, setUserId] = useState();
    const [deleteId, setDeleteId] = useState({
        userId: ''
    });

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get('http://localhost:3005/admin/getAllUser')
            .then(res => {
                if (res.data.userData) {
                    console.log(res.data.profile);
                    setUserData(res.data.profile);
                }
            })
    }, [])

    const testResult = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        let data = {
            userId: user_Id
        }
        axios.post('http://localhost:3005/admin/getUserResult', data)
            .then(res => {
                if (res.data.testData) {
                    setUserResult(res.data.profile);
                }
                if (!res.data.testData) {
                    setUserResult([]);
                }
            })
        setIsVisible(true);
    }

    const deleteProfile = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        setDeletes(true);
        setDeleteId({ userId: user_Id });
    }
    const noDelete = () => {
        setDeletes(false);
    }

    const yesDelete = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        let data = {
            userId: parseInt(user_Id)
        }
        console.log(data)
        axios.post('http://localhost:3005/admin/deleteUserDetails', data)
            .then(res => {
                if (res.data.deleteData) {
                    console.log('test details deleted')
                    alert('All Test Results deleted');
                    setDeletes(false);
                    console.log(res.data.deleteData)
                }
                if (!res.data.deleteData) {
                    console.log('error')
                    alert('No data found');
                    setDeletes(false);
                }
            })
    }
    const profileStatusActive = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        let data = {
            userId: parseInt(user_Id)
        }
        axios.put('http://localhost:3005/admin/activeStatus', data)
            .then(res => {
                if (res.data.statusData) {
                    // alert("status updated")
                    axios.get('http://localhost:3005/admin/getAllUser')
                        .then(res => {
                            if (res.data.userData) {
                                console.log(res.data.profile);
                                setUserData(res.data.profile);
                            }
                        })
                }
            })
    }
    const profileStatusDeactive = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        let data = {
            userId: parseInt(user_Id)
        }
        axios.put('http://localhost:3005/admin/deactiveStatus', data)
            .then(res => {
                if (res.data.statusData) {
                    // alert("status updated")
                    axios.get('http://localhost:3005/admin/getAllUser')
                        .then(res => {
                            if (res.data.userData) {
                                console.log(res.data.profile);
                                setUserData(res.data.profile);
                            }
                        })
                }
            })
    }

    const viewFeedback = (e) => {
        e.stopPropagation();
        let user_Id = e.target.attributes['data-id'].value;
        let data = {
            userId: user_Id
        }
        axios.post('http://localhost:3005/admin/getFeedback', data)
            .then(res => {
                if (res.data.testData) {
                    setFeedbackResult(res.data.feedback);
                }
                if (!res.data.testData) {
                    setFeedbackResult([]);
                }
            })
        setFeedbackVisible(true);
    }

    const editProfile = (e) => {
        let user_Id = e.target.attributes['data-id'].value;
        setUserId(user_Id);
        setProfile(true);
    }

    const closeResult = () => {
        setIsVisible(false);
        setFeedbackVisible(false);
        setProfile(false);
    }
    const closeDialog = () => {
        setIsVisible(false);
        setFeedbackVisible(false);
        setProfile(false);
        setDeletes(false);
    }
    const callBack = (data) => {
        console.log(data)
        setUserData(data);
    }
    const viewAdminDetails = () => {
        setAdminDetails(true);
    }
    const closeAdminDetails = () => {
        setAdminDetails(false);
    }

    return (
        <div className='adminNavigation'>
            <AdminNavigation />

            <div className='view-closeButton'>
                <Button onClick={adminDetails? closeAdminDetails : viewAdminDetails} className='view-btn' >{adminDetails? 'Close All Details' : 'View All Details' }</Button>
                {/* <Button onClick={closeAdminDetails} className='close-btn' >Close All Details</Button> */}
            </div>

            {adminDetails && (
                <div className='adminDetails'>
                    <Grid style={{ height: "510px" }}
                        // data={userData.slice(page.skip, page.take + page.skip)}
                        // data={filterBy(userData.slice(page.skip, page.take + page.skip), filter)}
                        data={orderBy(filterBy(userData.slice(page.skip, page.take + page.skip), filter), sort)}
                        skip={page.skip}
                        take={page.take}
                        total={userData.length}
                        pageable={true}
                        onPageChange={pageChange}

                        // data={filterBy(userData, filter)}
                        filterable={true}
                        filter={filter}
                        onFilterChange={(e) => setFilter(e.filter)}

                        // data={orderBy(userData, sort)}
                        sortable={true}
                        sort={sort}
                        onSortChange={(e) => { setSort(e.sort); }}>

                        <Column field='userId' title='User-Id' width='150px' filter="numeric" />
                        <Column field='userName' title='User-Name' width='200px'
                            cell={(props) => {
                                return (
                                    <td>
                                        <span>{props.dataItem['userName']}</span> <br />
                                        <span className={props.dataItem['status'] === 'deactivate' ? 'deactivate' : 'activate'}>
                                            {props.dataItem['status'] === 'deactivate' ? <ImCross /> : <ImCheckmark />}
                                        </span>
                                    </td>
                                );
                            }} />
                        <Column field='phoneNumber' title='Phone Number' width='140px' filterable={false} />
                        <Column field='email' title='E-Mail Address' width='180px' filterable={false} />
                        <Column field='gender' title='Gender' width='80px' filterable={false} />
                        <Column field='dob' title='Date Of Birth' width='130px' filterable={false} />
                        <Column field='city' title='City' width='110px' filterable={false} />
                        <Column field='user' title='User-Type' width='110px' filterable={false}
                            cell={(props) => {
                                return (
                                    <td className={props.dataItem['user'] === 0 ? 'Student-User' : 'Admin-User'}>
                                        {props.dataItem['user'] === 0 ? 'Student-User' : 'Admin-User'}
                                    </td>
                                );
                            }}
                        />
                        <Column className='text' field='userId' title='Result' width='75px' filterable={false}
                            cell={(props) => {
                                return (
                                    <td >
                                        <button className='k-button k-primary'
                                            data-id={props.dataItem['userId']}
                                            data-name={props.dataItem['userName']}
                                            onClick={testResult}> View  </button>
                                    </td>
                                );
                            }} />
                        <Column className='text' field='profile' title='Profile' width='75px' filterable={false}
                            cell={(props) => {
                                return (
                                    <td >
                                        <button className='k-button k-primary'
                                            data-id={props.dataItem['userId']}
                                            data-name={props.dataItem['userName']}
                                            onClick={editProfile}> Edit
                                        </button>
                                    </td>
                                );
                            }} />
                        <Column className='text' field='user' title='Detete' width='85px' filterable={false}
                            cell={(props) => {
                                return (
                                    <>
                                        {props.dataItem["userId"] !== 2 &&
                                            <td >
                                                <button className='k-button k-primary'
                                                    data-id={props.dataItem['userId']}
                                                    data-name={props.dataItem['userName']}
                                                    onClick={deleteProfile}> Delete
                                                </button>
                                            </td>}
                                        {props.dataItem["userId"] === 2 &&
                                            <td >
                                                <b>-</b>
                                            </td>}
                                    </>
                                );
                            }} />
                        <Column className='text' field='feedback' title='Feedback' width='100px' filterable={false}
                            cell={(props) => {
                                return (
                                    <>
                                        {props.dataItem["userId"] !== 2 &&
                                            <td >
                                                <button className='k-button k-primary'
                                                    data-id={props.dataItem['userId']}
                                                    data-name={props.dataItem['userName']}
                                                    onClick={viewFeedback}>
                                                    <FcFeedback onClick={e => e.stopPropagation()} />
                                                </button>
                                            </td>}
                                        {props.dataItem["userId"] === 2 &&
                                            <td >
                                                <b>-</b>
                                            </td>}
                                    </>
                                );
                            }} />
                        <Column className='text' field='status' title='Change-Status' width='140px'
                            cell={(props) => {
                                return (
                                    <>
                                        {props.dataItem["userId"] !== 2 && props.dataItem["status"] === 'deactivate' &&
                                            <td >
                                                <button className='k-button k-primary'
                                                    data-id={props.dataItem['userId']}
                                                    data-name={props.dataItem['userName']}
                                                    onClick={profileStatusActive}> Active
                                                </button>
                                            </td>}
                                        {props.dataItem["userId"] === 2 && props.dataItem["status"] === 'activate' &&
                                            <td > <b> Super Admin </b>
                                                {/* <button className="k-button k-primary"
                                                data-id={props.dataItem['userId']}
                                                data-name={props.dataItem['userName']}> Stable
                                            </button> */}
                                            </td>}
                                        {props.dataItem["userId"] !== 2 && props.dataItem["status"] === 'activate' &&
                                            <td >
                                                <button className='k-button k-primary'
                                                    data-id={props.dataItem['userId']}
                                                    data-name={props.dataItem['userName']}
                                                    onClick={profileStatusDeactive}> Deactive
                                                </button>
                                            </td>}
                                            {/* <Column title={"User State"} field={"disable"} filterable={false} cell={(props)=>
                            {
                                return(<td>
                                    {user=user.map((user,i)=>{return user})}
                                    <Switch  className="text-white" id={JSON.stringify(props.dataItem['id'])} defaultChecked={JSON.parse((props.dataItem['disable']).toLowerCase())} onChange={handleLock}/>
                                    </td>)
                                }} /> */}
                                    </>
                                );
                            }} />
                    </Grid>

                    {profile && (
                        <Dialog title={'User Details'} onClose={closeDialog} width='34%' height='77%'>
                            <div className='editProfile'>
                                <AdminUpdateProfile id={userId} callBack={callBack} />
                            </div>
                        </Dialog>
                    )}
                    {deletes && (
                        <Dialog title={'Please Confirm'} onClose={closeDialog} width='28%' height='22%'>
                            <div >
                                <p className='text1'> <b> Delete Only All Test Results </b> </p>
                                <div className='delete-btn'>
                                    <DialogActionsBar>
                                        <Button className='yes-btn' onClick={yesDelete} data-id={deleteId.userId}>
                                            Yes
                                        </Button>
                                        <Button onClick={noDelete}>
                                            No
                                        </Button>
                                    </DialogActionsBar>
                                </div> </div>
                        </Dialog>
                    )}

                    {isVisible && (
                        <Dialog title={'Test Result'} onClose={closeDialog} >
                            {userResult.length > 0 && (
                                <div className='viewResult'>

                                    <Grid style={{ height: "350px" }} data={userResult} >

                                        <Column className='text' field='userId' title='User-Id' />
                                        <Column className='text' field='total_qus' title='Total-Questions' />
                                        <Column className='text' field='score' title='Score' />
                                        <Column className='text' field='attempt' title='Attempt-Details' />
                                        <Column className='text' field='submitted_date' title='Submitted-Date' />
                                    </Grid>
                                </div>
                            )}
                            {userResult.length === 0 && (
                                <p className='text1' > <b> This user not attent any test </b></p>
                            )}<br />
                            <div className='button'>
                                <DialogActionsBar>
                                    <Button primary={true} onClick={closeResult}>
                                        ok!!
                                    </Button>
                                </DialogActionsBar></div>
                        </Dialog>
                    )}

                    {feedbackVisible && (
                        <Dialog title={'Student Feedback & Suggestions'} onClose={closeDialog} >
                            {feedbackResult.length > 0 && (
                                <div className='viewResult'>

                                    <Grid style={{ height: "200px" }} data={feedbackResult} >

                                        <Column className='text' field='userId' title='User-Id' width='80px' />
                                        <Column className='text' field='userName' title='user-Name' width='120px' />
                                        <Column className='text' field='email' title='E-Mail Address' width='190px' />
                                        <Column className='text' field='feedback' title='Student-Feedback' width='220px' />
                                        <Column className='text' field='suggestion' title='Student-Suggestions' width='220px' />
                                        <Column className='text' field='submitted_date' title='Submitted-Date' width='180px' />
                                    </Grid>
                                </div>
                            )}
                            {feedbackResult.length === 0 && (
                                <p className='text1'> <b> This user not submit any feedback </b></p>
                            )}<br />
                            <div className='button'>
                                <DialogActionsBar>
                                    <Button primary={true} onClick={closeResult}>
                                        ok!!
                                    </Button>
                                </DialogActionsBar></div>
                        </Dialog>
                    )}
                </div>
            )}
        </div>
    )
}
export default Admin;
