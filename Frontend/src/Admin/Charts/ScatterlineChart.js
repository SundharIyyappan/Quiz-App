import React, { useEffect, useState } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart,Title  } from 'chart.js/auto';
// import { name,id } from 'react-router-dom';
import './ScatterChart.css';
import axios from 'axios';

function ScatterlineChart() {

      const [name, setName] = useState([]);
      const [id, setId] = useState([]);

      useEffect(() => {
            axios.get('http://localhost:3005/admin/getAllUser')
                  .then(res => {
                        if (res.data.userData) {
                              setName(res.data.profile.userName);
                              setId(res.data.profile.userId);
                              console.log(res.data.profile)
                              for (const dataObj of res.data.profile) {
                                    name.push(dataObj.userName);
                                    id.push(parseInt(dataObj.userId));
                              }
                              console.log(id)
                              console.log(name)
                        }
                        else {
                              console.log('User not logged in')
                        }
                  })
      }, [])

      const [lineData, setLineData] = useState({
            // });
            // const chart = () => {
            //       setLineData({
            labels: name,
            datasets: [
                  {
                        label: 'Student List',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderCapStyle: 'square',
                        pointStyle: 'rect',
                        pointRadius: 5,
                        borderWidth: 1,
                        data: id
                  }
            ]
      });
      // }

      const [scatterData, setScatterData] = useState({
            datasets: [
                  {
                        label: '1st Year Rainfall',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(205,112,192,180)',
                        borderColor: 'rgba(0,105,0,1)',
                        pointRadius: 5,
                        hoverBackgroundColor: 'rgba(75,192,192,1)',
                        borderWidth: 2,
                        data: [{ x: 65, y: -10 }, { x: 59, y: -50 }, { x: 45, y: 0 }, { x: 75, y: 10 }, { x: 81, y: 50 }, { x: 25, y: 70 }]
                  },
                  {
                        label: '2nd Year Rainfall',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,105,0,1)',
                        pointRadius: 5,
                        pointStyle: 'triangle',
                        hoverBackgroundColor: 'rgba(205,112,192,180)',
                        borderWidth: 2,
                        data: [{ x: 165, y: -10 }, { x: 159, y: -50 }, { x: 145, y: 0 }, { x: 175, y: 10 }, { x: 181, y: 50 }, { x: 125, y: 70 }]
                  }
            ]
      });

      // useEffect(() => {
      //       chart();
      // }, []);

      return (

                  <div className='chart'>
                        <h3 className='welcome'>Chart.js</h3>
                        <div className='lineChart'>
                              <Line
                                    data={lineData}
                                    // data={lineData.datasets}
                                    // data={scatterData.map((product) => (
                                    //       product.datasets
                                    // ))}
                                    options={{
                                          responsive: true,
                                          scales: {
                                                y: [{
                                                      id: 'y',
                                                      display: true,
                                                      title: {
                                                            display: true,
                                                            text: 'value'
                                                      }
                                                }]
                                          },
                                          title: {
                                                display: true,
                                                text: 'Line Chart',
                                                fontSize: 20

                                          },
                                          animations: {
                                                tension: {
                                                      duration: 1500,
                                                      easing: 'linear',
                                                      from: 1,
                                                      to: 0,
                                                      loop: true
                                                }
                                          },
                                          legend: {
                                                display: true,
                                                position: 'right'
                                          }
                                    }}
                              />
                        </div>
                        <div className='scatterChart'>
                              <Scatter
                                    data={scatterData}
                                    options={{
                                          title: {
                                                text: ['Scatter Chart'],
                                                display: true,
                                                fontSize: 20
                                          },
                                          legend: {
                                                display: true,
                                                position: 'right'
                                          },
                                    }}
                              />
                        </div>
                  </div>
      );
}

export default ScatterlineChart;



