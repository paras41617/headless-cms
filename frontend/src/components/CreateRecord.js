import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateRecord.css';

const CreateRecord = () => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [record, setRecord] = useState({});

  useEffect(() => {
    // Fetch available entities
    const fetchEntities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/entities');
        setEntities(response.data);
      } catch (error) {
        console.error('Error fetching entities', error);
      }
    };

    fetchEntities();
  }, []);

  useEffect(() => {
    // Fetch entity attributes
    const fetchEntityAttributes = async () => {
      if (selectedEntity) {
        try {
          const response = await axios.get(`http://localhost:3000/api/entity/${selectedEntity}/attributes`);
          setAttributes(response.data);
        } catch (error) {
          console.error('Error fetching entity attributes', error);
        }
      }
    };

    fetchEntityAttributes();
  }, [selectedEntity]);

  const handleFieldChange = (field, value) => {
    setRecord({ ...record, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/entity/${selectedEntity}/record`, { entityName: selectedEntity, record });
      alert('Record created successfully');
    } catch (error) {
      console.error('Error creating record', error);
    }
  };

  return (
    <div className="create-record-container">
      <h2>Create Record</h2>
      <div>
        <label htmlFor="select-entity">Select Entity: </label>
        <select id="select-entity" onChange={(e) => setSelectedEntity(e.target.value)}>
          <option value="">Select Entity</option>
          {entities.map((entity, index) => (
            <option key={index} value={entity}>{entity}</option>
          ))}
        </select>
      </div>
      {selectedEntity && (
        <form className="create-record-form" onSubmit={handleSubmit}>
          {attributes.map((attr, index) => (
            <div key={index}>
              <label htmlFor={`attribute-${index}`}>{attr.column_name}: </label>
              {attr.data_type === 'timestamp with time zone' ? (
                <input
                  id={`attribute-${index}`}
                  type="date"
                  onChange={(e) => handleFieldChange(attr.column_name, e.target.value)}
                  required
                />
              ) : (
                <input
                  id={`attribute-${index}`}
                  type="text"
                  onChange={(e) => handleFieldChange(attr.column_name, e.target.value)}
                  required
                />
              )}
              <span>({attr.data_type})</span>
            </div>
          ))}
          <button type="submit">Create Record</button>
        </form>
      )}
    </div>
  );
};

export default CreateRecord;
