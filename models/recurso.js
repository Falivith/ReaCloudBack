/* eslint-disable */
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db')


// eslint-disable-next-line require-jsdoc
class Recurso extends Model {}
Recurso.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reatype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetPublic: {
    type: DataTypes.ENUM,
    values: ['Séries Iniciais', 'Fundamental', 'Médio', 'Superior'],
    allowNull: false,
  },
  thumb: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  knowledgeArea: {
    type: DataTypes.ENUM,
    values: ['Português', 'Matemática', 'Biologia', 'Teologia'],
    allowNull: false,
  },
  license: {
    type: DataTypes.ENUM,
    values: ['Domínio Público', 'GNU'],
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM,
    values: ['Português', 'Inglês', 'Francês', 'Alemão', 'Outro'],
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'recurso',
});

Recurso.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

Recurso.sync({ logging: false });


module.exports = Recurso
