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
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  recurso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recurso,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  underscored: true,
  timestamps: true,
  modelName: 'like',
});

module.exports = Like;
