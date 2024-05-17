const { createEntityModel } = require('../models/entity');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const { QueryTypes } = require('sequelize');

const typeMapping = {
  string: DataTypes.STRING,
  int: DataTypes.INTEGER,
  date: DataTypes.DATE,
};

const createEntity = async (req, res) => {
  const { entityName, attributes } = req.body;
  try {
    const attributesDefinition = {};
    attributes.forEach(attr => {
      attributesDefinition[attr.name] = typeMapping[attr.type];
    });

    const Entity = createEntityModel(entityName, attributesDefinition);

    await Entity.sync({ force: true });

    res.status(201).send({ message: 'Entity created successfully' });
  } catch (error) {
    console.error("Error creating entity:", error);
    res.status(500).send({ error: 'Error creating entity', details: error.message });
  }
};

const listEntities = async (req, res) => {
  try {
    const results = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'",
      { type: sequelize.QueryTypes.SELECT }
    );
    const entityNames = results.map(row => row[0]); 
    res.status(200).send(entityNames);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching entities' });
  }
};

const getEntityAttributes = async (req, res) => {
  const { entityName } = req.params;
  try {
    const [results] = await sequelize.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name='${entityName}' 
       AND column_default IS NULL 
       AND column_name NOT IN ('createdAt', 'updatedAt')`
    );
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching entity attributes' });
  }
};

const createRecord = async (req, res) => {
  const { entityName, record } = req.body;
  try {
    const columns = Object.keys(record);
    
    const values = columns.map(column => record[column]);

    const placeholders = Array(values.length).fill('?').join(', ');

    const query = `INSERT INTO ${entityName} (${columns.join(', ')}) VALUES (${placeholders})`;

    const result = await sequelize.query(query, {
      replacements: values,
    });

    const insertedRecord = result[0];

    res.status(201).send({ message: 'Record created successfully', record: insertedRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error creating record' });
  }
};

const getRecords = async (req, res) => {
  const { entityName } = req.params;
  try {
    const records = await sequelize.query(`SELECT * FROM ${entityName}`);
    res.status(200).send(records[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching records' });
  }
};

const updateRecord = async (req, res) => {
  const { entityName, id } = req.params;
  const { record } = req.body;
  try {
    const setClause = Object.keys(record).map((key, index) => `${key} = :${key}`).join(', ');

    const query = `UPDATE ${entityName} SET ${setClause} WHERE id = :id`;

    const replacements = { ...record, id };

    await sequelize.query(query, { replacements });
    res.status(200).send({ message: 'Record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error updating record' });
  }
};

const deleteRecord = async (req, res) => {
  const { entityName, id } = req.params;
  const query = `DELETE FROM ${entityName} WHERE id = :id`;

  try {
    await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.DELETE
    });
    res.status(200).send({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error deleting record' });
  }
};

module.exports = { createEntity, listEntities, createRecord, getRecords, updateRecord, deleteRecord, getEntityAttributes };
