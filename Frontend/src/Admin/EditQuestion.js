import React, { useState, useEffect } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import axios from 'axios';
import './Profile.css';

function EditQuestion(props) {

      const [name, setName] = useState([]);
      const qus_type = ['radio', 'textBox', 'dropdown'];
      const [value, setValue] = useState('');
      const [edit, setEdit] = useState(true);
      const [updated, setUpdated] = useState(false);
      const [message, setMessage] = useState([]);

      axios.defaults.withCredentials = true;

      useEffect(() => {
            let id = props.id;
            let data = {
                  qus_Id: id,
            }
            axios.post('http://localhost:3005/admin/getByQuestionId', data)
                  .then(res => {
                        if (res.data.testData === true) {
                              setName(res.data.questions[0]);
                              let val = res.data.questions[0];
                              setValue(val.qus_type);
                              // console.log(val.qus_type)
                        }
                        else {
                              console.log('User not logged in')
                        }
                  })
      }, [])

      const handleQuestionType = (event) => {
            setValue(event.target.value);
      }

      const handleSubmit = (data, e) => {
            data.qus_type = value;
            data.questions = e.target.questions.value;
            data.options = e.target.options.value;
            data.answer = e.target.answer.value;
            data.qus_Id = name.qus_Id;
            axios
                  .put('http://localhost:3005/admin/editQuestion', data)
                  .then(res => {
                        console.log(data)
                        if (res) {
                              setUpdated(true);
                              let getLoginDatas = () => {
                                    axios.get('http://localhost:3005/admin/getAllQuestions')
                                          .then(res => {
                                                if (res.data.questionsData) {
                                                      props.callBack(res.data.questions)
                                                }
                                                if (!res.data.questionsData) {
                                                      console.log('questions not found')
                                                }
                                          })
                              }
                              getLoginDatas();
                              console.log(res.data.message);
                        } else {
                              setMessage(res.data);
                        }
                  })
      }

      const handleEdit = () => {
            setUpdated(false);
            setEdit(false);
      }

      return (
            <div >
                  <div >
                        <Form autocomplete='off' ignoreModified={true} onSubmit={handleSubmit}
                              render={(formRender) => (<FormElement >
                                    <div >
                                          <div >
                                                <div className='header'>
                                                      <h3><u> Edit Question </u></h3>
                                                </div>
                                                <h3 className='update-date'>Last Edit Date: {name.edited_date}</h3>

                                                <h4> Question:</h4>
                                                <Field name={'questions'} key={name.questions} defaultValue={name.questions} rows={2} component={TextArea} type={'text'} required readOnly={edit === true || updated === true} /> <br />

                                                <div className='choices-text'>
                                                      <h4> Choices: </h4>
                                                      <Field name={'options'} key={name.options} defaultValue={name.options} type={'text'} required component={Input} readOnly={edit === true || updated === true} /> <br />
                                                </div>

                                                <div className='answer-text'>
                                                      <h4> Correct Answer: </h4>
                                                      <Field name={'answer'} key={name.answer} defaultValue={name.answer} type={'text'} required component={Input} readOnly={edit === true || updated === true} /> <br />
                                                </div>

                                                <div className='cdk-overlay-container'>
                                                      <h4> Question Type: </h4>
                                                      <DropDownList key={name.qus_type} defaultValue={name.qus_type} data={qus_type} value={value} onChange={handleQuestionType} disabled={edit === true || updated === true} />
                                                </div> <br />

                                          </div>
                                    </div>

                                    {edit === true &&
                                          <Button primary={true} className='edit1-btn' onClick={handleEdit}>Edit</Button>
                                    }

                                    {updated && <div className='admin-update'>
                                          Question updated
                                    </div>}

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
export default EditQuestion;
