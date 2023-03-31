import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import ConsentForm from './consent/Consent';
import PreSurvey from './presurvey/PreSurvey';
import Scatterplot from './scatterplot/Scatterplot';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConsentForm/>} />
        <Route path="/presurvey" element={<PreSurvey/>} />
        <Route path="/scatterplot" element={<Scatterplot/>} />
      </Routes>
   </Router>
  );
}

export default App;

