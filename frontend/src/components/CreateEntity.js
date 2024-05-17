import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateEntity.css'

const CreateEntity = () => {
  const [entityName, setEntityName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: 'string' }]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: 'string' }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/entity', { entityName, attributes });
      alert('Entity created successfully');
    } catch (error) {
      console.error('Error creating entity', error);
    }
  };

  return (
    <form className="create-entity-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="entity-name">Entity Name: </label>
        <input
          id="entity-name"
          type="text"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          required
        />
      </div>
      {attributes.map((attr, index) => (
        <div key={index}>
          <label htmlFor={`attribute-name-${index}`}>Attribute Name: </label>
          <input
            id={`attribute-name-${index}`}
            type="text"
            value={attr.name}
            onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
            required
          />
          <label htmlFor={`attribute-type-${index}`}>Attribute Type: </label>
          <select
            id={`attribute-type-${index}`}
            value={attr.type}
            onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
            required
          >
            <option value="string">String</option>
            <option value="int">Int</option>
            <option value="date">Date</option>
          </select>
        </div>
      ))}
      <button
        type="button"
        className="add-attribute-btn"
        onClick={handleAddAttribute}
      >
        Add Attribute
      </button>
      <button type="submit">Create Entity</button>
    </form>
  );
};

export default CreateEntity;
