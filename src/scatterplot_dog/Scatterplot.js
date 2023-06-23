import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Plot from './Plot';
import Papa from 'papaparse';
import { Dropdown } from 'semantic-ui-react';
import React, { useState, useEffect, useRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import './plot.css'
import { hover } from '@testing-library/user-event/dist/hover';

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

  const [helpVisible, setHelpVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [axisChanged, setAxisChanged] = useState(false);
  const [pointLabeled, setPointLabeled] = useState(false);
  const [pointReset, setPointReset] = useState(false);
  const [allLabeled, setAllLabeled] = useState(false);

  const toggleHelp = () => {
    setHelpVisible(!helpVisible);
  };

  const handleLabelClick = (event) => {
    setPointLabeled(true);
  };

  const handleResetClick = (event) => {
    setPointReset(true);
  };

  const handleAxisChange = (event) => {
    setAxisChanged(true);
  };

  const handlePointHover = (event) => {
    setHovered(true);
  };

  const handleAllLabeled = (event) => {
    setAllLabeled(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/dog_removed.csv');
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
    if (coloredPoints.length >= 12) {
      navigate('/selectaxis_credit');
    } else {
      alert('Please color at least 12 points before continuing.');
    }
  }

  return (
    <div className="scatterplot" ref={scatterplotRef}>
      <div className='tutorial_part'>
        {!hovered && (
          <div>
            <p>Hover on a point to get details. <br/><br/></p>
          </div>
        )}
        {hovered && !axisChanged && (
          <div>
            <p>Change the axes with the drop-down menu. <br/><br/>Try changing the <u>x-axis</u> now to any other value.<br/><br/></p>
          </div>
        )}
        {axisChanged && !pointLabeled && (
          <div>
            <p>Click on the <u>BREED buttons</u> (Bernedoodle, ShihTzu, and AmericanBulldog) on the top, then <u>label</u> one of the points in the scatterplot by clicking on it. <br/><br/></p>
          </div>
        )}
        {pointLabeled && !pointReset && (
          <div>
            <p>If you change your mind, select the RESET button, then click on the point. <br/><br/></p>
          </div>
        )}
        {pointReset && !helpVisible && (
          <div>
            <p>If you need help at any point, hover on the HELP button. <br/><br/></p>
          </div>
        )}
        {helpVisible && !allLabeled && (
          <div>
            <p>Before you proceed to the first task, go ahead and <u>label all of the points</u>. <br/><br/>Click <u>Continue</u> when you are done.</p>
          </div>
        )}
      </div>
      <div className="hover-container">
        <div className="hover-trigger" onMouseEnter={toggleHelp}>
          Help
        </div>
        <div className="info-bar">
          <p>Here's the help text</p>
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
          onChange={(e, { value }) => {
            setXColumn(value);
            handleAxisChange();
          }}
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
          onClick={(e) => {
            setSelectedCategory('Bernedoodle');
            setActiveButton('Bernedoodle');
            handleLabelClick(e);
          }} 
          className={`ui button Bernedoodle_button ${activeButton === 'Bernedoodle' ? 'active' : ''}`}
          style={activeButton === 'Bernedoodle' ? {borderColor: 'black'} : {}}
        >
          Bernedoodle
        </button>

        <button 
          onClick={(e) => {
            setSelectedCategory('ShihTzu');
            setActiveButton('ShihTzu');
            handleLabelClick(e);
          }} 
          className={`ui button ShihTzu_button ${activeButton === 'ShihTzu' ? 'active' : ''}`}
          style={activeButton === 'ShihTzu' ? {borderColor: 'black'} : {}}
        >
          ShihTzu
        </button>

        <button 
          onClick={(e) => {
            setSelectedCategory('AmericanBulldog');
            setActiveButton('AmericanBulldog');
            handleLabelClick(e);
          }} 
          className={`ui button AmericanBulldog_button ${activeButton === 'AmericanBulldog' ? 'active' : ''}`}
          style={activeButton === 'AmericanBulldog' ? {borderColor: 'black'} : {}}
        >
          AmericanBulldog
        </button>
        <button 
          onClick={() => {setSelectedCategory('Null'); setActiveButton('Null'); handleResetClick();}} 
          className={`ui button ${activeButton === 'Null' ? 'active' : ''}`}
          style={activeButton === 'Null' ? {borderColor: 'black'} : {}}
        >
          Reset
        </button>
      </div>

      <div className='scatterplot_plot'>
        <Plot data={data} xColumn={xColumn} yColumn={yColumn} selectedCategory={selectedCategory} setData={setData} zoomTransform={zoomTransform} setZoomTransform={setZoomTransform} hovered={hovered} setHovered={setHovered} />
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