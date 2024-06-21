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
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reaType: {
    type: DataTypes.ENUM(Object.values(tipoRecurso)),
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
  },
  targetPublic: {
    type: DataTypes.ENUM(Object.values(publicoAlvo)),
    allowNull: false,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  knowledgeArea: {
    type: DataTypes.ENUM(Object.values(areasConhecimento)),
    allowNull: false,
  },
  license: {
    type: DataTypes.ENUM(Object.values(tiposLicenca)),
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM(Object.values(idiomas)),
    allowNull: false,
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
