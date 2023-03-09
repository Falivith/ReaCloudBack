/* eslint-disable */
const {Model, DataTypes} = require('sequelize');
const { sequelize } = require('../util/db')


// eslint-disable-next-line require-jsdoc
class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sobrenome: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  instituicao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  perfil: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
});

User.sync({ logging: false });


module.exports = User