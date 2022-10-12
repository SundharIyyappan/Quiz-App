import React from 'react';
import './TestIsntructions.css';

function TestIsntructions() {

      return (
            <>
                  <div className='instructions'> <b>
                        <h3> <u> Test Instructions: </u></h3>
                        <p id='instructions'>1. Read each question carefully.</p>
                        <p id='instructions'>2. You cannot skip a question. You must provide an answer to each question to proceed with the test.</p>
                        <p id='instructions'>3. Once answered, you cannot go back to a question. </p>
                        <p id='instructions'>4. If you cancel the test, you will not be able to resume your place in the test. You will have to start from the beginning.</p>
                  </b>
                  </div>

            </>
      )
}
export default TestIsntructions;