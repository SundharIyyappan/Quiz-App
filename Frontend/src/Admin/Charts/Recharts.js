import React, { useState } from 'react';
import AdminNavigation from '../AdminNavigation';
import ScatterlineChart from './ScatterlineChart';
import {
      ScatterChart, Scatter, CartesianGrid, Tooltip, Legend, XAxis, YAxis, ZAxis,
      ReferenceLine, ReferenceDot, ReferenceArea, ErrorBar, LabelList
} from 'recharts';
import './ScatterChart.css';
import Component1 from '../WithoutUseeffect/Component1';

function Recharts() {
      const [data, setData] = useState([]);

      const data01 = [{ size: 10, name: 30 }, { size: 30, name: 200 }, { size: 45, name: 100 },
      { size: 50, name: 380 }, {size: 70, name: 150 }, { size: 100, name: 250 }]

      const data03 = [{ x: 10, y: 30 }, { x: 30, y: 200 }, { x: 45, y: 100 },
      { x: 50, y: 400 }, { x: 70, y: 150 }, { x: 100, y: 250 }];

      const data04 = [{ x: 30, y: 20 }, { x: 50, y: 180 }, { x: 75, y: 240 },
      { x: 100, y: 100 }, { x: 120, y: 190 }];

      const data05 = [{ x: 100, y: 200, z: 200 }, { x: 120, y: 100, z: 260 }, { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 }, { x: 150, y: 400, z: 500 }, { x: 110, y: 280, z: 200 },];

      const data06 = [{ x: 150, y: 160, z: 240 }, { x: 240, y: 290, z: 220 }, { x: 130, y: 290, z: 250 },
      { x: 198, y: 250, z: 210 }, { x: 70, y: 280, z: 260 }, { x: 210, y: 220, z: 230 },];

const handlePoint = (e) =>{
      alert('Weight is' + " " +e.name)
//       const newData = [];
//     data.forEach(function(item) {
//       newData.push(
//         {x: item.geometry.coordinates[0],
//         y: item.geometry.coordinates[1]})
//     })
//     setData(newData)
} 
      const data1 = Object.values(data);
      return (
            <div className='rechartsNpm'>
                  <AdminNavigation />

                  <h3 className='welcome'>Using Recharts Npm</h3>

                  <div className="scatter-chart-wrapper">
                        <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 0, left: 100 }}>
                              <XAxis type="number" dataKey="size" name="stature" unit="cm" />
                              <YAxis type="number" dataKey="name" name="weight" unit="kg" />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Legend />

                              <Scatter name="School Student Details" data={data01} fill="#ff7300" shape="star" onClick={handlePoint} />
                              {/* label={{ dataKey: 'x' }}  */}
                        </ScatterChart>
                  </div> <br />

                  <h3>ScatterChart which has joint line</h3>
                  <div className="scatter-chart-wrapper">
                        <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
                              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                              <YAxis dataKey="y" name="weight" unit="kg" />
                              <CartesianGrid />
                              <Tooltip cursor={{ stroke: '#808080', strokeDasharray: '5 5' }} />
                              <Legend />
                              {/* events: {
            click = function (e) {
                // find the clicked values and the series
                var x = Math.round(e.xAxis[0].value),
                    y = Math.round(e.yAxis[0].value),
                    data04 = data04[0];

                // Add it
                data04.addPoint([x, y]);

            }
        } */}
                              <Scatter line lineJointType="monotoneX" shape="wye" legendType="wye" data={data03} fill="#ff7300" name='A School' />
                              <Scatter line shape="square" legendType="square" data={data04} fill="#347300" name='B School' />
                        </ScatterChart>
                  </div><br />

                  <h3>ScatterChart of three dimension data</h3>
                  <div className="scatter-chart-wrapper">
                        <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
                              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
                              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
                              <ZAxis type="number" dataKey="z" range={[50, 1200]} name="score" unit="km" />
                              {/* <CartesianGrid /> */}
                              <Scatter name="A school" data={data05} fillOpacity={0.3} fill="#ff7300" />
                              <Scatter name="B school" data={data06} fill="#347300" />
                              <Tooltip cursor={{ stroke: '#808080', strokeDasharray: '3 3' }} />
                              <Legend />
                              <ReferenceArea x1={250} x2={300} alwaysShow label="Type Reference" />
                              <ReferenceLine x={150} stroke="red"/>
                              <ReferenceLine y={220} stroke="red"/>
                              {/* <ReferenceDot x={170} y={290} r={15} label="AB" stroke="none" fill="red" isFront/> */}
                        </ScatterChart>
                  </div>

                  <div className='normalChartNpm'>
                        <ScatterlineChart />
                  </div>
                  <div>
                        <Component1 />
                  </div>
            </div>
      );
}

export default Recharts;



