import React, { useState, useEffect } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import Component2 from './Component2';
import './Component.css';

function Component1() {

      const [value, setValue] = useState('even');
      const [number, setNumber] = useState('Parent Data');

      const callBack = (data) => {
            setNumber(data);
      }
      const callBack1 = (data) => {
            setValue(data);
      }

      return (
            <div >
                  <h3>Parent functional component</h3>
                  <div className='useeffect'>
                        <Input type='text' name="check" value={number} />
                  </div> <br />
                  <div>
                        <Component2 id={value} callBack={callBack} callBack1={callBack1} />
                  </div> <br />
            </div>
      );
}

export default Component1;
