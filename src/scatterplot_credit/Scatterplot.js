// src/ScatterPlot.js
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // added import
import Plot from './Plot';
import Papa from 'papaparse';
import { Dropdown } from 'semantic-ui-react';
import React, { useState, useEffect, useRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './plot.css'

function ScatterPlot() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState(null);
  const [yColumn, setYColumn] = useState(null);
  const [zoomTransform, setZoomTransform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scatterplotRef = useRef(null);
  const webgazer = window.webgazer;
  const [activeButton, setActiveButton] = useState(null);

  


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/credit_removed.csv');
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
      });
      setData(parsedData.data);
      setData(parsedData.data.map(d => ({ ...d, category: null })));
      setColumns(parsedData.meta.fields);
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (location.state) {
      setXColumn(location.state.xColumn);
      setYColumn(location.state.yColumn);
    }
    
  }, [location.state]);

  const handleContinueClick = () => {
    const coloredPoints = data.filter(d => d.category !== null);
    if (coloredPoints.length >= 25) {
      navigate('/selectaxis_car');
    } else {
      alert('Please color at least 25 points before continuing.');
    }
  }

  useEffect(() => {
    async function initializeWebGazer() {
      if (webgazer) {
        try {
          webgazer.begin();
          webgazer.showVideoPreview(false).showPredictionPoints(false);
          webgazer.setGazeListener(function(event){
            var currentdate = new Date(); 
            var datetime = currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds() + ":"
                  + currentdate.getMilliseconds();
            console.log(event);            
          }).begin();
          
          } catch (error) {
          console.error('Error initializing WebGazer:', error);
        }
      }
    }
    initializeWebGazer();
    return () => {
      initializeWebGazer();
    };
  }, []);
  

  return (
    <div className="scatterplot">
      
      <div class="hover-container">
        <div class="hover-trigger">
          Help
        </div>
        <div class="info-bar">
          <p>Using the information provided about the <b>customers</b> when <b>hovering over the points</b>, <b>color each circle</b> in the scatterplot by which level of credit you think it is. By clicking the colored label on the top, you may start to color the point with the corresponding label. If you wanted to change your previous labels, directly click the circle in the scatterplot after clicking the new color label on the top.</p>
        </div>
      </div>
      <div className='x-axis'>
        <Dropdown
          placeholder={xColumn}
          selection
          options={columns
            .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID'].includes(column))
            .map(column => ({
              key: `x-${column}`,
              text: column,
              value: column
            }))}
          onChange={(e, { value }) => setXColumn(value)}
        />
      </div>
      <div className='y-axis'>
        <Dropdown
          placeholder={yColumn}
          selection
          options={columns
            .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID'].includes(column))
            .map(column => ({
              key: `y-${column}`,
              text: column,
              value: column
            }))}
          onChange={(e, { value }) => setYColumn(value)}
        />
      </div>

      <div className='buttons'>
        <button 
            onClick={() => {setSelectedCategory('Good'); setActiveButton('Good');}} 
            className={`ui button Good_button ${activeButton === 'Good' ? 'active' : ''}`}
            style={activeButton === 'Good' ? {borderColor: 'black'} : {}}
          >
            Good
          </button>
          <button 
            onClick={() => {setSelectedCategory('Fair'); setActiveButton('Fair');}} 
            className={`ui button Fair_button ${activeButton === 'Fair' ? 'active' : ''}`}
            style={activeButton === 'Fair' ? {borderColor: 'black'} : {}}
          >
            Fair
          </button>
          <button 
            onClick={() => {setSelectedCategory('Poor'); setActiveButton('Poor');}} 
            className={`ui button Poor_button ${activeButton === 'Poor' ? 'active' : ''}`}
            style={activeButton === 'Poor' ? {borderColor: 'black'} : {}}
          >
            Poor
          </button>
          <button 
            onClick={() => {setSelectedCategory('Null'); setActiveButton('Null');}} 
            className={`ui button ${activeButton === 'Null' ? 'active' : ''}`}
            style={activeButton === 'Null' ? {borderColor: 'black'} : {}}
          >
            Reset
          </button>
      </div>

      <div className='scatterplot_plot'>
      <Plot data={data} xColumn={xColumn} yColumn={yColumn} selectedCategory={selectedCategory} setData={setData} zoomTransform={zoomTransform} setZoomTransform={setZoomTransform} />

      </div>

      <div className='continue_next'>
      <button onClick={handleContinueClick} className="ui primary button">
          Continue
        </button>
    </div>

    </div>

    
  );
}

export default ScatterPlot;
