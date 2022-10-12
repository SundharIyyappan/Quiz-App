import React, { useEffect, useState } from 'react';
import MainNavigation from '../Components/MainNavigation';
import '@progress/kendo-theme-default/dist/all.css';
import './Home.css';
import Axios from 'axios';
import { Input, RadioButton } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import Timer from './OtherComponents/Timer';
import TestIsntructions from './OtherComponents/TestIsntructions/TestIsntructions';
import StudyMaterial from './OtherComponents/StudyMaterial';
import { AiFillFastForward } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
// import pdf from './Changepond_VPNCLIENT_Setup(1).pdf'; 

function Home() {

    const history = useHistory();
    const [name, setName] = useState([]);
    const [result, setResult] = useState([]);
    const [start, setStart] = useState(false);
    const [totalQus, setTotalQus] = useState();
    const [currentQus, setCurrentQus] = useState(0);
    const [answers, setAnswers] = useState({});
    const [userAnswer, setUserAnswer] = useState({});
    const [mark, setMark] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [saveTest, setSaveTest] = useState(false);
    const [instructions, setInstructions] = useState(true);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [cancel, setCancel] = useState(false);

    const [correctQus, setCorrectQus] = useState(0);
    const [wrongQus, setWrongQus] = useState(0);
    const [material, setMaterial] = useState(false);
    // const hoursMinSecs = { hours: 1, minutes: 0, seconds: 0 } hoursMinSecs={hoursMinSecs}

    Axios.defaults.withCredentials = true;

    // console.log("without string", userAnswer)
    // console.log("with string", JSON.stringify(userAnswer))

    useEffect(() => {
        Axios.get('http://localhost:3005/login')
            .then(res => {
                if (res.data.loggedIn === true) {
                    setName(res.data.profile[0]);
                    //console.log(res.data.userName[0])
                    console.log(res.data)
                }
                else {
                    console.log('User not logged in')
                }
            }),
            Axios.get('http://localhost:3005/updateAttempts')
                .then(res => {
                    if (res.data.testData) {
                        setTotalAttempts(res.data.result.length);
                    }
                    if (!res.data.testData) {
                        setTotalAttempts(0);
                    }
                })
    }, [])

    const handleTest = () => {
        setTotalAttempts(totalAttempts + 1);
        alert(`Hi!!  ${name.userName} You Started Test`);
        Axios.get('http://localhost:3005/questions')
            .then(result => {
                if (result) {
                    let answer = {}
                    setResult(result.data);
                    setTotalQus(result.data.qus_result.length);
                    result.data.qus_result.map((res) => (
                        answer[res.qus_Id] = res.answer
                    ))
                    setAnswers(answer);
                    console.log(answer);
                    setStart(true);
                    setInstructions(false);
                }
            })
    }
    const cancelTest = () => {
        setCancel(true);
    }
    const noCancel = () => {
        setCancel(false);
    }
    const yesCancel = () => {
        setCancel(false);
        setStart(false);
        setInstructions(true);
        history.push('/home');
        setMark(0);
        setCurrentQus(0);
    }

    const handleRadioButton = (e) => {
        console.log(e);
        let userAnswer = {};
        let ques_id = e.currentTarget.dataset.id;
        let answer_val = e.currentTarget.value;
        userAnswer[ques_id] = answer_val
        setUserAnswer(userAnswer);
        console.log(ques_id)
        console.log(answer_val)
    }

    const handleTextBox = (e) => {
        let userAnswer = {};
        let ques_id = e.target.props['data-id'];
        let answer_val = e.target.value;
        userAnswer[ques_id] = answer_val;
        setUserAnswer(userAnswer);
    }
    const handleDropdown = (e) => {
        let userAnswer = {};
        let ques_id = e.target.props['data-id'];
        let answer_val = e.target.value;
        userAnswer[ques_id] = answer_val;
        setUserAnswer(userAnswer);
    }

    const handleNext = () => {
        setCurrentQus(currentQus + 1);
        let key = Object.keys(userAnswer);
        let keyValue = answers[key];

        console.log(userAnswer)
        console.log(userAnswer[key])
        console.log(answers[key])

        if (userAnswer[key] === keyValue) {
            setMark(mark + 1);
            setCorrectQus(correctQus + 1);
            console.log(key, 'User Answer is correct')
            setUserAnswer({});
        }
        else {
            console.log(key, 'User Answer is wrong')
            setWrongQus(wrongQus + 1);
            setUserAnswer({});
        }
    }

    const handleSave = () => {
        let key = Object.keys(userAnswer);
        let keyValue = answers[key];
        if (userAnswer[key] === keyValue) {
            setMark(mark + 1);
            setCorrectQus(correctQus + 1);
            setUserAnswer({});
        }
        else {
            setUserAnswer({});
            setWrongQus(wrongQus + 1);
        }
        // console.log(name)      
        return completeTest();
    }

    const completeTest = () => {
        setIsVisible(!isVisible);
    }
    const end = () => {
        let data = {
            "userId": name.userId,
            "total_qus": totalQus,
            "score": mark,
            "attempt": totalAttempts
        }
        Axios
            .post('http://localhost:3005/attemptdetails', data)
            .then(res => {
                console.log(res);
                if (!res.data.error) {
                    console.log(res.data.status);
                } if (res.data.error) {
                    console.log(res.data.status)
                }
            });
        return going();
    };

    const closeDialog = () => {
        setIsVisible(false);
    };

    const going = () => {
        setIsVisible(false);
        setSaveTest(true);
        history.push('/home');
    }
    const viewMaterial = () => {
        setMaterial(true);
    }
    const closeMaterial = () => {
        setMaterial(false);
    }

    return (
        <>
            <MainNavigation />
            <div className='hole' >
                <h2 className='welcome'> Welcome: {name.userName}
                    {start == false && <>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPN1bVBy50arjFhcQwFyWzn7kgggqVqmm1PQ&usqp=CAU" width="82" height="72" alt='hi' style={{ float: "right", margin: "10px 90px 0 0" }} />
                        <Button className='view-btn' onClick={viewMaterial} style={{ float: "left", margin: "40px 0px 0 65px" }} >View Study Materials </Button>
                    </>}
                </h2> <br />

                {start && (
                    <div className='questions'>
                        <marquee direction="right" scrollamount="12" className='moving'>
                            All the best for your exam!!!.....
                            {/* behavior="alternate" */}
                        </marquee>
                    </div>
                )}
                <div className='entire'>
                    {saveTest === false && (
                        <div className='home'>
                            {instructions && <TestIsntructions />}
                            <div className='start-cancel'>
                                <Button onClick={start == false ? handleTest : cancelTest} className={start == false ? 'start-test' : 'cancel-test'}>{start ? "Cancel Test" : "Start Test"} </Button> <br />
                            </div>
                            <div >
                                {start && (
                                    <div className='questions'>

                                        <div id='timer' className='timer'> <b> <Timer submit={handleSave, end} /></b> </div>
                                        <p className='m-0' key={result.qus_result[currentQus].qus_Id}> <b> {result.qus_result[currentQus].questions} </b></p> <br />

                                        <div className='mt-5' key={'option' + result.qus_result[currentQus].qus_Id}>
                                            {result.qus_result[currentQus].qus_type === 'radio' && result.qus_result[currentQus].options.split(',').map((resp, val) => (
                                                <div key={resp} className='radio-group'>
                                                    <RadioButton data-id={result.qus_result[currentQus].qus_Id} name={'question' + result.qus_result[currentQus].qus_Id} className='d-inline-block' value={resp} onClick={handleRadioButton}>
                                                        <label htmlFor={resp} > {resp}</label>
                                                    </RadioButton>
                                                </div>
                                            ))}
                                            {result.qus_result[currentQus].qus_type === 'dropdown' &&
                                                <div className='dropdown-group'>
                                                    <DropDownList data-id={result.qus_result[currentQus].qus_Id} name={'question' + result.qus_result[currentQus].qus_Id} data={result.qus_result[currentQus].options.split(',')} defaultValue='None' onChange={handleDropdown} />
                                                </div>
                                            }
                                            {result.qus_result[currentQus].qus_type === 'textBox' &&
                                                <Input data-id={result.qus_result[currentQus].qus_Id} name={'question' + result.qus_result[currentQus].qus_Id} placeholder='Enter answer' onChange={handleTextBox} />}
                                        </div> <br />
                                        <div>
                                            <ProgressBar className='progressBar' value={currentQus + 1} max={totalQus} />
                                            <p className='progressBar-item'>{`${currentQus + 1} /  ${totalQus}`}</p>
                                        </div>
                                        <div>
                                            {currentQus < totalQus - 1 && <Button primary={true} className='next' onClick={handleNext} disabled={JSON.stringify(userAnswer) === '{}' ? true : false}>Next <AiFillFastForward /></Button>}
                                            {currentQus === totalQus - 1 && <Button primary={true} className='save' type='submit' onClick={handleSave} disabled={JSON.stringify(userAnswer) === '{}' ? true : false} >Save</Button>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isVisible && (
                <Dialog title={'Test Submitted Successfully'} onClose={closeDialog} >
                    <p style={{ margin: "5px 10px", textAlign: "left", fontSize: "20px", lineHeight: "2", color: 'green', fontWeight: 'bold' }}>
                        Your Score is - {mark} / {totalQus}
                    </p>
                    <p style={{ margin: "5px 10px", textAlign: "left", fontSize: "18px", lineHeight: "2" }}>
                        Correctly Answered Questions - {correctQus}
                    </p>
                    <p style={{ margin: "5px 10px", textAlign: "left", fontSize: "18px", lineHeight: "2" }}>
                        Wrongly  Answered Questions - {wrongQus}
                    </p>

                    <div className='submit-btn'>
                        <DialogActionsBar>
                            <Button primary={true} onClick={end}>
                                ok!!
                            </Button>
                        </DialogActionsBar> </div>
                </Dialog>
            )}

            {cancel && (
                <Dialog title={'Please Confirm'} >
                    <div >
                        <p className='text1'><b> Do you want to cancel the test </b> </p>
                        <div className='delete-btn'>
                            <DialogActionsBar>
                                <Button className='yes-btn' onClick={yesCancel} >
                                    Yes
                                </Button>
                                <Button onClick={noCancel}>
                                    No
                                </Button>
                            </DialogActionsBar>
                        </div> </div>
                </Dialog>
            )}

            {material && (
                < StudyMaterial closeMaterial={closeMaterial} />
            )}
        </>
    )
}

export default Home;
