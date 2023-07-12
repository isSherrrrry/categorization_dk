// src/ScatterPlot.js
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // added import
import Plot from './Plot';
import Papa from 'papaparse';
import { Dropdown } from 'semantic-ui-react';
import React, { useState, useEffect, useRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './plot.css'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';


function ScatterPlot() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState(null);
  const [yColumn, setYColumn] = useState(null);
  const [zoomTransform, setZoomTransform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const webgazer = window.webgazer;
  const [activeButton, setActiveButton] = useState(null);


  const [userId] = useState(localStorage.getItem('userId'));
  
  const firebaseConfig = {
    apiKey: "AIzaSyAHS7JCzpZAkLRmgilLdGDp9251l4HOO94",
    authDomain: "dkeffect-3776d.firebaseapp.com",
    projectId: "dkeffect-3776d",
    storageBucket: "dkeffect-3776d.appspot.com",
    messagingSenderId: "356413199968",
    appId: "1:356413199968:web:3211cbe960df3c8d4d9505",
    measurementId: "G-WE3CHELSN1"
  };
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const eventsCollection = collection(firestore, userId);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/car_removed.csv');
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

  console.log(localStorage.getItem('first_task'));

  const handleContinueClick = () => {
    const coloredPoints = data.filter(d => d.category !== null);
    if (coloredPoints.length >= 25) {
      if (localStorage.getItem("first_task") == 'car'){
        navigate('/selectaxis_credit');
      } else {
        navigate('/stop_tracking');   
      }
      
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
            addDoc(eventsCollection, {
              event: 'eyetracking',
              x: event.x,
              y: event.y,
              timestamp: new Date(),
            });
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
          <p>Your task is to <b>categorize all points in the scatterplot</b>.
            <ul>
              <li><b>Hover</b> over a point to see details</li>
              <li><b>Click</b> the colored label on the top corresponding the label you would like to apply</li>
              <li><b>Click</b> the point(s) in the scatterplot to label with the selected label</li>
              <li><b>Click</b> <i>Reset</i> then click the respective point in the scatterplot if you wanted to change your previous label</li>
            </ul>
          </p>


 

        </div>
      </div>
      <div className='x-axis'>
        <Dropdown
          placeholder={xColumn}
          selection
          options={columns
            .filter(column => !['Customer ID', 'name', 'Credit Score', 'creditID', 'CarType'].includes(column))
            .map(column => ({
              key: `x-${column}`,
              text: column,
              value: column
            }))}
          onChange={(e, { value }) => {
            addDoc(eventsCollection, {
              event: 'interaction',
              type: 'axis_x',
              task: 'car',
              org_axis: xColumn,
              new_axis: value,
              timestamp: new Date(),
            });
            setXColumn(value);
          }}
        />
      </div>
      <div className='y-axis'>
        <Dropdown
          placeholder={yColumn}
          selection
          options={columns
            .filter(column => !['Customer ID', 'name', 'Credit Score', 'creditID', 'CarType'].includes(column))
            .map(column => ({
              key: `y-${column}`,
              text: column,
              value: column
            }))}
          onChange={(e, { value }) => {
            addDoc(eventsCollection, {
              event: 'interaction',
              type: 'axis_y',
              task: 'car',
              org_axis: xColumn,
              new_axis: value,
              timestamp: new Date(),
            });
            setYColumn(value);
          }}
        />
      </div>

      <div className='buttons'>
        
        <button 
          onClick={() => {setSelectedCategory('SUV'); setActiveButton('SUV');}} 
          className={`ui button SUV_button ${activeButton === 'SUV' ? 'active' : ''}`}
          style={activeButton === 'SUV' ? {borderColor: 'black'} : {}}
        >
          SUV
        </button>
        <button 
          onClick={() => {setSelectedCategory('Minivan'); setActiveButton('Minivan');}} 
          className={`ui button Minivan_button ${activeButton === 'Minivan' ? 'active' : ''}`}
          style={activeButton === 'Minivan' ? {borderColor: 'black'} : {}}
        >
          Minivan
        </button>
        <button 
          onClick={() => {setSelectedCategory('Sedan'); setActiveButton('Sedan');}} 
          className={`ui button Sedan_button ${activeButton === 'Sedan' ? 'active' : ''}`}
          style={activeButton === 'Sedan' ? {borderColor: 'black'} : {}}
        >
          Sedan
        </button>
        <button 
          onClick={() => {setSelectedCategory('Null'); setActiveButton('Null');}} 
          className={`ui button reset_button ${activeButton === 'Null' ? 'active' : ''}`}
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
