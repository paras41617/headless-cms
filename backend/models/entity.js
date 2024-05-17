const sequelize = require('../config/config');

const createEntityModel = (entityName, attributes) => {

  return sequelize.define(entityName, attributes, {
    freezeTableName: true,
    tableName: entityName,
    timestamps: false
  });
};

module.exports = { createEntityModel };
