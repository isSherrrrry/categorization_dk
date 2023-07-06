import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './plot.css'

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    background: '#f5f5f5',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    marginTop: '30px',
    fontWeight: 'bold',
    fontSize: '1.6em'
  },
  subHeader: {
    color: '#555',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '16px'
  },
  instruction: {
    maxWidth: '620px',
    margin: '0 auto',
    fontSize: '1.1em',
    lineHeight: '1.6',
    marginBottom: '30px',
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
    textAlign: 'center'
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  dropdown: {
    margin: '0 10px',
  },
  buttonContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  button: {
    background: '#2185d0',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 'bold',
  }
};

function SelectAxes() {
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState(null);
  const [yColumn, setYColumn] = useState(null);
  

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/car_removed.csv');
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
      });
      setColumns(parsedData.meta.fields);
    };
    fetchData();
  }, []);

  const handleSubmit = () => {
    if (xColumn && yColumn) {
      navigate('/scatterplot_car', { state: { xColumn, yColumn } });
    } else {
      alert('Please select both x and y axes.');
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Task: Car Types</h2>
      <div style={styles.instruction}>
        <p> In this task, you will be categorizing <b>cars</b> according to their <b>type </b><span style={{fontSize: '1.5em'}}>🚗</span>.</p>
        <p> Just like with the practice task, get started by selecting attributes to show on the x-axis and y-axis that you would like to see when you begin the task. </p>
      </div>
      <div style={styles.dropdownContainer}>
        <div style={styles.dropdown}>
          <h4>Please Select X Axis:</h4>
            <Dropdown
              placeholder="--Select column--"
              selection
              options={columns
                .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID', 'name'].includes(column))
                .map(column => ({
                  key: `x-${column}`,
                  text: column,
                  value: column
                }))}
              onChange={(e, { value }) => setXColumn(value)}
            />
        </div>
        
        <div style={styles.dropdown}>
          <h4>Please Select Y Axis:</h4>
          <Dropdown
            placeholder="--Select column--"
            selection
            options={columns
              .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID', 'name'].includes(column))
              .map(column => ({
                key: `y-${column}`,
                text: column,
                value: column
              }))}
            onChange={(e, { value }) => setYColumn(value)}
          />
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit} style={styles.button}>Go to ScatterPlot</button>
      </div>
    </div>
  );
}  

export default SelectAxes;




// // src/SelectAxes.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Papa from 'papaparse';
// import { Dropdown } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';
// import './plot.css'


// function SelectAxes() {
//   const [columns, setColumns] = useState([]);
//   const [xColumn, setXColumn] = useState(null);
//   const [yColumn, setYColumn] = useState(null);
  

//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch('/car_removed.csv');
//       const csvData = await response.text();
//       const parsedData = Papa.parse(csvData, {
//         header: true,
//         dynamicTyping: true,
//       });
//       setColumns(parsedData.meta.fields);
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = () => {
//     if (xColumn && yColumn) {
//       navigate('/scatterplot_car', { state: { xColumn, yColumn } });
//     } else {
//       alert('Please select both x and y axes.');
//     }
//   };

//   return (
//     <div className="select_axes" style={{padding: '20px'}}>
//       <div className='instruction' style={{marginBottom: '-10px'}}>
//         <h2 style={{marginTop: '40px'}}>Task: Car Types</h2> 
//         <p style={{lineHeight: '1.5'}}> In this task, you will be categorizing <b>cars</b> according to their <b>type 🚗</b>.</p>
//         <p style={{lineHeight: '1.5'}}> Just like with the practice task, get started by selecting attributes to show on the x-axis and y-axis that you would like to see when you begin the task. </p>
//       </div>
//       <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '0px'}}> 
//         <div style={{marginRight: '40px'}}>

//           <h4>Please Select X Axis:</h4>
//           <Dropdown
//             placeholder="--Select column--"
//             selection
//             options={columns
//               .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID', 'name', 'CarType'].includes(column))
//               .map(column => ({
//                 key: `x-${column}`,
//                 text: column,
//                 value: column
//               }))}
//             onChange={(e, { value }) => setXColumn(value)}
//           />
//         </div>
//         <div>
//           <h4>Please Select Y Axis:</h4>
//           <Dropdown
//             placeholder="--Select column--"
//             selection
//             options={columns
//               .filter(column => !['Customer ID', 'Name', 'Credit Score', 'creditID', 'name', 'CarType'].includes(column))
//               .map(column => ({
//                 key: `y-${column}`,
//                 text: column,
//                 value: column
//               }))}
//             onChange={(e, { value }) => setYColumn(value)}
//           />
//         </div>
//       </div>
//       <div style={{marginTop: '40px', textAlign: 'center'}}>
//         <button onClick={handleSubmit} class="ui blue button">Go to ScatterPlot</button>
//       </div>
//     </div>
//   );
// }  

// export default SelectAxes;
