import React, { useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { Dialog } from '@progress/kendo-react-dialogs';
import { DropDownList } from '@progress/kendo-react-dropdowns';

function StudyMaterial(props) {

      const [link, setLink] = useState('https://reactjs.org/docs/getting-started.html');
      const List = ['https://reactjs.org/docs/getting-started.html', 'https://www.gktoday.in/', 'https://www.jagranjosh.com/general-knowledge',
            'Pdf/Session_2_Data_Types.pdf', 'Pdf/Session_3_MySQL DDL_DML.pdf', 'Links/Notes.txt',
            'https://www.indiabix.com/general-knowledge/questions-and-answers/', 'https://www.careerpower.in/gk-general-knowledge.html'];

      const handleLink = (e) => {
            setLink(e.target.value);
      }

      return (
            <div className='materials'>
                  <Dialog title={'Below the Study material links'} onClose={props.closeMaterial} width='70%' height='80%'>
                        <div style={{ margin: "0px 10px 0 20px" }}>
                              <div className='linkPara'> <b>Study material links & Pdf : </b>
                                    <DropDownList required data={List} value={link} onChange={handleLink} /> <br /><br />
                              </div>
                              <iframe src={link} title='Online Web Tutorials' width='100%' height='500px' >
                              </iframe>
                              {/* <iframe src='Pdf/Changepond_VPNCLIENT_Setup(1).pdf' title="Online Web Tutorials" width='100%' height='430px' >
                        </iframe> */}
                        </div>
                  </Dialog>
            </div>
      )
}

export default StudyMaterial;

