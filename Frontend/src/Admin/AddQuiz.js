import React, { useState, useEffect } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import AdminNavigation from '../Admin/AdminNavigation';
import { Field, Form, FormElement } from '@progress/kendo-react-form';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { filterBy } from '@progress/kendo-data-query';
import EditQuestion from './EditQuestion';
import { AiFillEye } from 'react-icons/ai';
import axios from 'axios';
import './AddQuiz.css';

function AddQuiz() {

    const [page, setPage] = useState({
        skip: 0,
        take: 6,
    });
    const pageChange = (event) => {
        setPage(event.page);
    };

    const initialFilter = {
        logic: "and",
        filters: [
            {
                field: "questions",
                operator: "contains",
                value: "",
            }
        ]
    };
    const [filter, setFilter] = useState(initialFilter);

    const [created, setCreated] = useState(false);
    const [value, setValue] = useState('');
    const qus_type = ['radio', 'textBox', 'dropdown'];
    const [message, setMessage] = useState();
    const [viewQus, setViewQus] = useState(false);
    const [qusData, setQusData] = useState([]);
    const [edit, setEdit] = useState(false);
    const [qus_Id, setQus_Id] = useState()
    const [deletes, setDeletes] = useState(false);
    const [deleteId, setDeleteId] = useState({
        qus_Id: ''
    })

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3005/admin/getAllQuestions')
            .then(res => {
                if (res.data.questionsData) {
                    console.log(res.data.questions);
                    setQusData(res.data.questions);
                }
            })
    }, [])

    const handleType = (event) => {
        setValue(event.target.value);
    }

    const handleSubmit = data => {
        data.qus_type = value;

        axios.post('http://localhost:3005/addQuestions', data)
            .then(res => {
                console.log(res);
                if (res.status === 201) {
                    console.log(res);
                    setCreated(true);

                    axios.get('http://localhost:3005/admin/getAllQuestions')
                        .then(res => {
                            if (res.data.questionsData) {
                                console.log(res.data.questions);
                                setQusData(res.data.questions);
                            }
                        })

                } else {
                    setMessage(res.data.message);
                }
            })
    }

    const viewQuestions = () => {
        setViewQus(true);
    }
    const closeDialog = () => {
        setViewQus(false);
        setDeletes(false);
    }
    const closeDeleteDialog = () => {
        setDeletes(false);
    }
    const closeEditDialog = () => {
        setEdit(false);
    }

    const editQuestion = (e) => {
        let qus_Id = e.target.attributes['data-id'].value;
        setQus_Id(qus_Id);
        setEdit(true);
    }

    const deleteQuestions = (e) => {
        let qus_Id = e.target.attributes['data-id'].value;
        setDeletes(true);
        setDeleteId({ qus_Id: qus_Id });
    }
    const noDelete = () => {
        setDeletes(false);
    }
    const yesDelete = (e) => {
        let qus_Id = e.target.attributes['data-id'].value;
        let data = {
            qus_Id: parseInt(qus_Id)
        }
        console.log(data)
        axios.post('http://localhost:3005/admin/deleteQuestion', data)
            .then(res => {
                if (res.data.deleteData) {
                    console.log('Question deleted')
                    // alert('Question deleted')
                    setDeletes(false);
                    console.log(res.data.deleteData)

                    axios.get('http://localhost:3005/admin/getAllQuestions')
                        .then(res => {
                            if (res.data.questionsData) {
                                console.log(res.data.questions);
                                setQusData(res.data.questions);
                            }
                        })
                }
                if (!res.data.deleteData) {
                    console.log('error')
                    alert('No data found')
                    setDeletes(false);
                }
            })
    }

    const callBack = (data) => {
        console.log(data)
        setQusData(data);
    }

    const handleCreated = () => {
        setCreated(false);
        // window.location.reload();
    }

    return (
        <div className='addQuiz'>
            <div >
                <AdminNavigation />
                <button type='submit' className='viewQus-btn' onClick={viewQuestions}>
                    <AiFillEye /> View Question
                </button>
                <div >
                    <Form onSubmit={handleSubmit}
                        render={(formRender) => (<FormElement >
                            <div id='wrapper1'>
                                <div className='quiz-content'>
                                    <div className='header'>
                                        <h3>Add New Question</h3>
                                    </div>
                                    <p className='error'> {message} </p>

                                    <h4> Question: <span className='registration-error'>*</span> </h4>
                                    <Field required name='questions' placeholder='Add new question here' className='input' rows={2} component={TextArea} /> <br />

                                    <div className='overlap-text'>
                                        <h4> Choices: <span className='registration-error'>*</span> </h4>
                                        <Field required name='options' placeholder='Choices separated only by commas' className='input' component={Input} /> <br />
                                    </div>

                                    <div className='overlap-text'>
                                        <h4> Correct Answer: <span className='registration-error'>*</span> </h4>
                                        <Field required name='answer' placeholder='[Ex: b) answer ]' className='input' component={Input} /> <br />
                                    </div>

                                    <h4> Question Type: <span className='registration-error'>*</span> </h4>
                                    <DropDownList required data={qus_type} value={value} onChange={handleType} />

                                    <Button primary={true} className='quiz-btn' disabled={!formRender.allowSubmit} >Add Question</Button>

                                </div>
                            </div>
                        </FormElement >
                        )}
                    />
                </div>
            </div>
            {created && (
                <Dialog title={'Press ok'} >
                    <div >
                        <p className='timeOut'><b> Question Added Successfully </b> </p>
                        <div className='delete-btn'>
                            <DialogActionsBar>
                                <Button className='yes-btn' onClick={handleCreated}>
                                    Ok
                                </Button>
                            </DialogActionsBar>
                        </div> </div>
                </Dialog>
            )}

            <div >
            <div className='question-details'>
                {viewQus && (
                    
                    <Dialog title={'Questions Details'} onClose={closeDialog}  className='viewquestion'>
                        
                            <Grid style={{ height: "480px" }}
                                // data={qusData.slice(page.skip, page.take + page.skip)}
                                data={filterBy(qusData.slice(page.skip, page.take + page.skip), filter)}
                                skip={page.skip}
                                take={page.take}
                                total={qusData.length}
                                pageable={true}
                                onPageChange={pageChange}


                                // data={filterBy(qusData, filter)}
                                filterable={true}
                                filter={filter}
                                onFilterChange={(e) => setFilter(e.filter)} >

                                <Column field='qus_Id' title='Question-Id' width='150px' />
                                <Column field='questions' title='Questions' width='280px' />
                                <Column field='options' title='Choices' width='280px' filterable={false} />
                                <Column field='answer' title='Answer' width='150px' filterable={false} />
                                <Column field='qus_type' title='Qus_type' width='150px' />

                                <Column className='text' field='userId' title='Delete' width='90px' filterable={false}
                                    cell={(props) => {
                                        return (
                                            <td >
                                                <button className='k-button k-primary'
                                                    data-id={props.dataItem['qus_Id']}
                                                    onClick={deleteQuestions}> Delete  </button>
                                            </td>
                                        );
                                    }} />
                                <Column className='text' field='edit' title='Edit-Qus' width='90px' filterable={false}
                                    cell={(props) => {
                                        return (
                                            <td >
                                                <Button className='k-button k-primary'
                                                    data-id={props.dataItem['qus_Id']}
                                                    onClick={editQuestion}> Edit
                                                </Button>
                                            </td>
                                        );
                                    }} />
                            </Grid>
                        
                    </Dialog>
                    
                )}
                </div>

                {edit && (
                    <Dialog title={'Question Details'} onClose={closeEditDialog} width='37%' height='62%'>
                        <div className='editQuestion'>
                            <EditQuestion id={qus_Id} callBack={callBack} />
                        </div>
                    </Dialog>
                )}

                {deletes && (
                    <Dialog title={'Please Confirm'} onClose={closeDeleteDialog} width='28%' height='22%'>
                        <div >
                            <p className='text1'> <b> Do you want delete this question </b> </p>
                            <div className='delete-btn'>
                                <DialogActionsBar>
                                    <Button className='yes-btn' onClick={yesDelete} data-id={deleteId.qus_Id}>
                                        Yes
                                    </Button>
                                    <Button onClick={noDelete}>
                                        No
                                    </Button>
                                </DialogActionsBar>
                            </div> </div>
                    </Dialog>
                )}
            </div>
        </div>
    )
}
export default AddQuiz;



