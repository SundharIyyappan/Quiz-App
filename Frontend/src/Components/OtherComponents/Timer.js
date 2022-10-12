import React, { useState, useEffect } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { FaRegSadCry } from 'react-icons/fa';

function Timer({ submit }) {

    const hoursMinSecs = { hours: 1, minutes: 0, seconds: 0 }
    
    const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
    const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
    const [timer, setTimer] = useState(false);

    const tick = () => {

        if (hrs === 0 && mins === 0 && secs === 0) {
            setTimer(true);
        }
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };

    // const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });

    // const closeTimerDialog = () => { onClose={closeTimerDialog}
    //     setTimer(false)
    // }
    const handleTimer = () => {
        setTimer(false)
        submit();
    }

    return (
        <>
            <div className='countdown'>
                <p>Time Left: {`${hrs.toString().padStart(2, '0')}h:${mins
                    .toString()
                    .padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`}</p>
            </div>

            {timer && (
                <Dialog title={"Press ok"} >
                    <div >
                        <p className='timeOut'><b> <FaRegSadCry /> Time out!!! </b> </p>
                        <div className='delete-btn'>
                            <DialogActionsBar>
                                <button className='yes-btn' onClick={handleTimer}>
                                    Ok
                                </button>
                            </DialogActionsBar>
                        </div> </div>
                </Dialog>
            )}
        </>
    );
}
export default Timer;


