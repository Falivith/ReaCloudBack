const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Recurso = require('./recurso');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  recurso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recurso,
      key: 'id',
    },
  },
}, {
  underscored: true,
  timestamps: true,
  modelName: 'like',
  onDelete: 'CASCADE',
});

module.exports = Like;
