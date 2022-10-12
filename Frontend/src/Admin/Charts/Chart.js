import React, { Component } from 'react';
import {
      ScatterChart, Scatter, CartesianGrid, Tooltip, Legend, XAxis, YAxis, ZAxis,
      ReferenceLine, ReferenceDot, ReferenceArea, ErrorBar, LabelList
} from 'recharts';


class Chart extends Component {
      constructor(props){
          super(props);
          this.state = {
            data: []
          }
          this.scatter = React.createRef();
          this.handleClick = this.handleClick.bind(this);
          this.handleMouseOut = this.handleMouseOut.bind(this);
          this.mouseSimulation = this.mouseSimulation.bind(this);
      }
  
    componentDidMount(){
      const newData = [];
      const data = [];
      data.forEach(function(item) {
          var a = item.geometry.coordinates[1] - (-10.679538);
          var b = item.geometry.coordinates[0] - (-76.267526);
          let distance_from_pit = Math.sqrt( a*a + b*b );
        newData.push(
          {x: item.geometry.coordinates[0],
          y: item.geometry.coordinates[1],
          id: item.properties.id,
          distance_from_pile: distance_from_pit,
          conc: item.properties.conc + Math.random()*1500},)
      })
  
      this.setState({
        data: newData
      })
  
      this.props.setGlobalState({
        handleDataInteract: this.handleClick,
        mouseSimulation: this.mouseSimulation
      })
    }
  
    componentDidUpdate(prevProps){
      if (prevProps !== this.props) {
        if (this.props.globalState.data_point_id !== undefined){
          const chart = this.scatter.current;
          console.log('chart didupdate', chart.props.points)
          // const scatterPoints = chart.props.points;
          // scatterPoints.forEach(function(point) {
          //   point.click();
          // })
        }
      }
    }
  
    handleClick(e){
      if (e.payload !== undefined) {
          this.props.setGlobalState({data_point_id: e.payload.id})
      } else {
        this.props.setGlobalState({data_point_id: e.name})
      }
    }
  
    handleMouseOut(e){
      console.log('mouse out')
        this.props.setGlobalState({data_point_id: ''});
    }
  
  
    mouseSimulation(event, x, y){
      let simulatedEvent = document.createEvent('MouseEvent');
      simulatedEvent.initMouseEvent('mouseover', true, true, window, 1,
              x, y,
              x, y, false,
              false, false, false, 0/*left*/, null);
  
      document.dispatchEvent(simulatedEvent);
      console.log(event + " at " + x + ", " + y);
  
      this.handleClick(event);
    }
  
    render() {
      const data1 = Object.values(this.state.data);
      return (
        <div className="chart">
          <section
            className="sectionStyle item">
            <h1>Lead Concentration</h1>
            <div className="bar-charts">
                <ScatterChart
                  width={600}
                  height={900}
                  margin={{
                    top: 15, right: 15, bottom: 15, left: 15,
                  }}
                  >
                  <CartesianGrid stroke="#000" />
                  <XAxis type="number" dataKey="distance_from_pile" name="distance from pile" unit="" stroke="#000" />
                  <YAxis type="number" dataKey="conc" name="concentration" unit=" mg/kg" stroke="#000" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter ref={this.scatter} name="dataset" data={data1} fill='#000' onMouseOver={(e)=>this.handleClick(e)} onMouseLeave={()=>this.handleMouseOut()} />
              </ScatterChart>
              </div>
          </section>
        </div>
      );
    }
  }
  
  export default Chart;