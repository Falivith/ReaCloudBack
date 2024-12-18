const { DataTypes } = require('sequelize');
const { sequelize } = require('../../app');
const User = require('./user');
const Recurso = require('./recurso');

const Issue = sequelize.define('Issue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recurso_id: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recurso,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'resolved'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'Issues'
});

module.exports = Issue;