const express = require('express');
const { createEntity, listEntities, getEntityAttributes, createRecord, getRecords, updateRecord, deleteRecord } = require('../controller/entityController');

const router = express.Router();

router.post('/entity', createEntity);
router.get('/entities', listEntities);
router.get('/entity/:entityName/attributes', getEntityAttributes);
router.post('/entity/:entityName/record', createRecord);
router.get('/entity/:entityName/records', getRecords);
router.put('/entity/:entityName/record/:id', updateRecord);
router.delete('/entity/:entityName/record/:id', deleteRecord);

module.exports = router;
