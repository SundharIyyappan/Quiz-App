import React, { useState, useCallback, useEffect } from 'react';
import AdminNavigation from '../Admin/AdminNavigation';
import '@progress/kendo-theme-default/dist/all.css';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { RadioButton } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import axios from 'axios';
import './Profile.css';
import ChangePassword from '../Components/OtherComponents/ChangePassword/ChangePassword';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

function Profile() {

      const [name, setName] = useState([]);
      const citys = ['Kanyakumari', 'Chennai', 'Karaikudi', 'Madurai', 'Trichy'];
      const [city, setCity] = useState();
      const [selectedValue, setSelectedValue] = useState();
      const [edit, setEdit] = useState(true);
      const [updated, setUpdated] = useState(false);
      const [changepass, setChangepass] = useState(false);
      const [message, setMessage] = useState([]);

      axios.defaults.withCredentials = true

      useEffect(() => {
            axios.get('http://localhost:3005/login')
                  .then(res => {
                        if (res.data.loggedIn === true) {
                              setName(res.data.profile[0]);
                              let val = res.data.profile[0];
                              setSelectedValue(val.gender);
                              setCity(val.city);
                        }
                        else {
                              console.log('User not logged in')
                        }
                  })
      }, [])

      const handleGender = useCallback(
            (e) => {
                  setSelectedValue(e.value);
            },
            [setSelectedValue]
      );

      const handleCity = (event) => {
            setCity(event.target.value);
      }

      const handleSubmit = (data, e) => {
            data.gender = selectedValue;
            data.city = city;
            data.userName = e.target.username.value;
            data.phoneNumber = e.target.number.value;
            data.date = e.target.date.value;
            data.email = e.target.email.value;
            data.userId = name.userId
            axios
                  .put('http://localhost:3005/updateProfile', data)
                  .then(res => {
                        if (res) {
                              let getLoginDatas = () => {
                                    axios.get('http://localhost:3005/login').then(response => {
                                          if (response.data.loggedIn === true) {
                                                setName(response.data.profile[0])
                                                let val = response.data.profile[0]
                                                setSelectedValue(val.gender)
                                                setCity(val.city)
                                                setUpdated(true);
                                          }
                                          else {
                                                console.log('Something went wrong try again later')
                                          }
                                    })
                              }
                              getLoginDatas();
                              console.log(res.data.message);
                        } else {
                              setMessage(res.data)
                        }
                  })
      }

      const handleEdit = () => {
            setUpdated(false);
            setEdit(false)
      }

      // const handleReset = () => {
      //       window.location.reload();
      // }

      const changePassword = () => {
            setChangepass(true)
      }
      const closeDialog = () => {
            setChangepass(false)
      }

      return (
            <div className='profile-body'>
                  <AdminNavigation />

                  <button className='changePass-btn' onClick={changePassword} >
                        Change Password
                  </button>

                  <div className='profile'>
                        <Form autocomplete='off' ignoreModified={true} onSubmit={handleSubmit}
                              render={(formRender) => (<FormElement >
                                    <div id='wrapper2'>
                                          <div className='profile-content'>
                                                <div className='header'>
                                                      <h3>Edit Profile</h3>
                                                </div>
                                                <h4> Username:</h4>
                                                <Field name={'username'} key={name.userName} defaultValue={name.userName} component={Input} type={'text'} required placeholder='Username' readOnly={true} /> <br />

                                                <div className='phone-text'>
                                                      <h4> Phone No: </h4>
                                                      <Field name={'number'} key={name.phoneNumber} defaultValue={name.phoneNumber} type={'number'} required placeholder='phone no' component={Input} readOnly={edit === true || updated === true} /> <br />
                                                </div>

                                                <div className='overlap-text'>
                                                      <h4> Date Of Birth: </h4>
                                                      <Field required name={'date'} key={name.dob} defaultValue={name.dob} type={'Date'} placeholder='date of birth' component={Input} readOnly={edit === true || updated === true} /> <br />
                                                </div>

                                                <div className='email-text'>
                                                      <h4> E-Mail: </h4>
                                                      <Field name={'email'} key={name.email} defaultValue={name.email} type={'email'} required placeholder='E-Mail' component={Input} readOnly={edit === true || updated === true} /> <br />
                                                </div>

                                                <h4> Gender: </h4>
                                                <RadioButton required name='gender' value="Male" checked={selectedValue === 'Male'}
                                                      label="Male" onChange={handleGender} disabled={edit === true || updated === true} />
                                                <RadioButton required name='gender' value="Female" checked={selectedValue === 'Female'}
                                                      label="Female" onChange={handleGender} disabled={edit === true || updated === true} /> <br /><br />

                                                <h4> City: </h4>
                                                <DropDownList required key={name.city} defaultValue={name.city} data={citys} value={city} onChange={handleCity} disabled={edit === true || updated === true} />
                                          </div>
                                    </div>

                                    {edit === true &&
                                          <Button primary={true} className='edit-btn' onClick={handleEdit}>Edit</Button>
                                    }

                                    {updated && <> <div className='update'>
                                          Profile updated
                                    </div>
                                          <Button primary={true} className='edit-btn' onClick={handleEdit}>Edit</Button>
                                    </>}

                                    {edit === false && updated === false &&
                                          <Button primary={true} className='update-btn' onClick={handleEdit}>Update</Button>
                                    }
                                    {/* {edit === false && updated === false &&
                                          <Button primary={true} className='reset-btn' onClick={handleReset}>Reset</Button>
                                    } */}
                                    
                                    <p className='mb-3 bold'> {message.error}</p>

                              </FormElement >
                              )}
                        />
                        {changepass && (
                              <Dialog title={'Profile Password Details'} onClose={closeDialog} width='38%' height='60%'>
                                    <div className='editProfile'>
                                          <ChangePassword />
                                    </div>
                              </Dialog>
                        )}
                  </div>
            </div>
      )
}
export default Profile;
