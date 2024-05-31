const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');
const User = require('./user');
const { tipoRecurso, publicoAlvo, areasConhecimento, tiposLicenca, idiomas } = require('./recursoProperties');

const Recurso = sequelize.define('Recurso', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reaType: {
    type: DataTypes.ENUM,
    values: Object.values(tipoRecurso),
  },
  link: {
    type: DataTypes.STRING,
  },
  targetPublic: {
    type: DataTypes.ENUM,
    values: Object.values(publicoAlvo),
  },
  thumb: {
    type: DataTypes.BLOB,
  },
  knowledgeArea: {
    type: DataTypes.ENUM,
    values: Object.values(areasConhecimento),
  },
  license: {
    type: DataTypes.ENUM,
    values: Object.values(tiposLicenca),
  },
  language: {
    type: DataTypes.ENUM,
    values: Object.values(idiomas),
  },
  description: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
}, {
  underscored: true,
  timestamps: true,
  modelName: 'recurso',
});

Recurso.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Recurso;
