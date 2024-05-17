import React, { useState } from 'react';
import CreateEntity from './components/CreateEntity';
import CreateRecord from './components/CreateRecord';
import ViewRecords from './components/ViewRecords';
import './App.css';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('');

  return (
    <div className="cms-app">
      <h1>Rudimentary Headless CMS</h1>
      <div className="cms-button-group">
        <button onClick={() => setActiveComponent('CreateEntity')}>Create Entity</button>
        <button onClick={() => setActiveComponent('CreateRecord')}>Create Record</button>
        <button onClick={() => setActiveComponent('ViewRecords')}>View Records</button>
      </div>
      <div className="cms-component-container">
        {activeComponent === 'CreateEntity' && <CreateEntity />}
        {activeComponent === 'CreateRecord' && <CreateRecord />}
        {activeComponent === 'ViewRecords' && <ViewRecords />}
      </div>
    </div>
  );
};

export default App;
