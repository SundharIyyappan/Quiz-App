import React from 'react';
import { Button } from '@progress/kendo-react-buttons';

function Component2(props) {

      const handleClick = () => {

            let value = props.id;
            if (value === 'even') {
                  props.callBack('Child Data');
                  props.callBack1('add');
            }
            else {
                  props.callBack('Parent Data');
                  props.callBack1('even');
            }
      }

      return (
            <div >
                  <h3>Child functional component</h3>
                  <div className='useeffect'>
                        <Button primary={true} onClick={handleClick} >Change Data</Button>
                  </div>
            </div>
      );
}

export default Component2;
