const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');
const User = require('./user');
const { tipoRecurso, publicoAlvo, areasConhecimento, tiposLicenca, idiomas, formats } = require('./recursoProperties');
const { format } = require('sequelize/lib/utils');

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
  contributor: {
    type: DataTypes.STRING,
  },
  coverage: {
    type: DataTypes.STRING,
  },
  creator: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  format: {
    type: DataTypes.ENUM(Object.keys(formats)),
  },
  publisher: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.ENUM(Object.keys(tipoRecurso)),
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
  },
  audience: {
    type: DataTypes.ENUM(Object.keys(publicoAlvo)),
    allowNull: false,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subject: {
    type: DataTypes.ENUM(Object.keys(areasConhecimento)),
    allowNull: false,
  },
  rights: {
    type: DataTypes.ENUM(Object.keys(tiposLicenca)),
    allowNull: false,
  },
  language: {
    type: DataTypes.ENUM(Object.keys(idiomas)),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  instructionalMethod: {
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
