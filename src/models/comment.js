const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Recurso = require('./recurso');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recurso,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'comments',
  modelName: 'Comment',
  underscored: true,
  timestamps: false,
});

module.exports = Comment;
