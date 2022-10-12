import React, { useState, useCallback, useEffect } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { RadioButton } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import axios from 'axios';
import './Profile.css';

function AdminUpdateProfile(props) {

      const [name, setName] = useState([]);
      const citys = ['Kanyakumari', 'Chennai', 'Karaikudi', 'Madurai', 'Trichy'];
      const [city, setCity] = useState();
      const admin = ['0', '1'];
      const [adminUser, setAdminUser] = useState();
      const [selectedValue, setSelectedValue] = useState();
      const [edit, setEdit] = useState(true);
      const [updated, setUpdated] = useState(false);
      const [message, setMessage] = useState([]);

      axios.defaults.withCredentials = true

      useEffect(() => {
            let id = props.id;
            let data = {
                  userId: id,
            }
            axios.post('http://localhost:3005/admin/getByUserId', data)
                  .then(res => {
                        if (res.data.testData === true) {
                              setName(res.data.profile[0]);
                              let val = res.data.profile[0];
                              setSelectedValue(val.gender);
                              setCity(val.city);
                              setAdminUser(val.user)
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
      const handleAdminRights = (event) => {
            setAdminUser(event.target.value);
      }

      const handleSubmit = (data, e) => {
            data.gender = selectedValue;
            data.city = city;
            data.user = adminUser;
            data.userName = e.target.username.value;
            data.phoneNumber = e.target.number.value;
            data.email = e.target.email.value;
            data.userId = name.userId
            axios
                  .put('http://localhost:3005/admin/updateProfile', data)
                  .then(res => {
                        if (res) {
                              let getLoginDatas = () => {
                                    setUpdated(true);

                                    axios.get('http://localhost:3005/admin/getAllUser')
                                          .then(res => {
                                                if (res.data.userData) {
                                                      props.callBack(res.data.profile)
                                                }
                                                if (!res.data.userData) {
                                                      console.log('user data not found')
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

      return (
            <div >
                  <div >
                        <Form autocomplete='off' ignoreModified={true} onSubmit={handleSubmit}
                              render={(formRender) => (<FormElement >
                                    <div >
                                          <div >
                                                <div className='header'>
                                                      <h3><u> Edit Profile </u></h3>
                                                </div>
                                                {/* <h3 className='update-date'>Last Update: {name.updated_date}</h3> */}

                                                <h4> Username:</h4>
                                                <Field name={'username'} key={name.userName} defaultValue={name.userName} component={Input} type={'text'} required placeholder='Username' readOnly={true} /> <br />

                                                <div className='phone-text'>
                                                      <h4> Phone No: </h4>
                                                      <Field name={'number'} key={name.phoneNumber} defaultValue={name.phoneNumber} type={'number'} required placeholder='phone no' component={Input} readOnly={edit === true || updated === true} /> <br />
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

                                                <div className='cdk-overlay-container'>
                                                      <h4> City: </h4>
                                                      <DropDownList required key={name.city} defaultValue={name.city} data={citys} value={city} onChange={handleCity} disabled={edit === true || updated === true} />
                                                </div> <br />

                                                <div className='cdk-overlay-container'>
                                                      <h4> Admin Rights: </h4>
                                                      <p>[0-Student, 1-Admin] </p>
                                                      <DropDownList required key={name.user} defaultValue={name.user} data={admin} value={adminUser} onChange={handleAdminRights} disabled={name.userId === 2 || edit === true || updated === true} />
                                                </div>
                                          </div>
                                    </div>

                                    {edit === true &&
                                          <Button primary={true} className='edit1-btn' onClick={handleEdit}>Edit</Button>
                                    }

                                    {updated && <> <div className='admin-update'>
                                          Profile updated
                                    </div>
                                          <Button primary={true} className='edit1-btn' onClick={handleEdit}>Edit</Button>
                                    </>}

                                    {edit === false && updated === false &&
                                          <Button primary={true} className='update1-btn'>Update</Button>
                                    }

                                    <p className='mb-3 bold'> {message.error}</p>

                              </FormElement >
                              )}
                        />
                  </div>
            </div>
      )
}
export default AdminUpdateProfile;
