import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ViewRecords.css';

const ViewRecords = () => {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [records, setRecords] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateRecordData, setUpdateRecordData] = useState({});
  const [selectedRecordId, setSelectedRecordId] = useState(null);

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

  const handleShowData = async () => {
    if (selectedEntity) {
      try {
        const response = await axios.get(`http://localhost:3000/api/entity/${selectedEntity}/records`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/entity/${selectedEntity}/record/${id}`);
      setRecords(records.filter(record => record.id !== id)); // Assuming each record has an 'id' field
    } catch (error) {
      console.error('Error deleting record', error);
    }
  };

  const handleUpdate = (record) => {
    setUpdateRecordData(record);
    setSelectedRecordId(record.id);
    setShowUpdateForm(true);
  };

  const handleFieldChange = (field, value) => {
    setUpdateRecordData({ ...updateRecordData, [field]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/entity/${selectedEntity}/record/${selectedRecordId}`, { entityName: selectedEntity, record: updateRecordData });
      alert('Record updated successfully');
      setShowUpdateForm(false);
      handleShowData(); // Refresh the data to reflect the updates
    } catch (error) {
      console.error('Error updating record', error);
    }
  };

  return (
    <div className="view-records-container">
      <h2>View Records</h2>
      <div className="entity-selection">
        <label htmlFor="select-entity">Select Entity: </label>
        <select id="select-entity" onChange={(e) => setSelectedEntity(e.target.value)}>
          <option value="">Select Entity</option>
          {entities.map((entity, index) => (
            <option key={index} value={entity}>{entity}</option>
          ))}
        </select>
        <button onClick={handleShowData}>Show Data</button>
      </div>
      {records.length > 0 && (
        <div>
          <h3>Records</h3>
          <table className="records-table">
            <thead>
              <tr>
                {Object.keys(records[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th> 
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  {Object.values(record).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  <td className="actions">
                    <button className="update-button" onClick={() => handleUpdate(record)}>Update</button>
                    <button className="delete-button" onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showUpdateForm && (
        <div className="update-form">
          <h3>Update Record</h3>
          <form onSubmit={handleUpdateSubmit}>
            {attributes.map((attr, index) => (
              <div key={index}>
                <label htmlFor={`update-attribute-${index}`}>{attr.column_name}: </label>
                {attr.data_type === 'timestamp with time zone' ? (
                  <DatePicker
                    id={`update-attribute-${index}`}
                    selected={new Date(updateRecordData[attr.column_name])}
                    onChange={(date) => handleFieldChange(attr.column_name, date)}
                    dateFormat="yyyy-MM-dd"
                    required
                  />
                ) : (attr.data_type === 'integer' ? <input
                id={`update-attribute-${index}`}
                type="number"
                value={updateRecordData[attr.column_name]}
                onChange={(e) => handleFieldChange(attr.column_name, e.target.value)}
                required
              />:<input
                id={`update-attribute-${index}`}
                type="text"
                value={updateRecordData[attr.column_name]}
                onChange={(e) => handleFieldChange(attr.column_name, e.target.value)}
                required
              />)}
                <span>({attr.data_type})</span>
              </div>
            ))}
            <button type="submit">Update Record</button>
            <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewRecords;
