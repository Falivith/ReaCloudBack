const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const User = require('./user');
const { tipoRecurso, publicoAlvo, areasConhecimento, tiposLicenca, idiomas } = require('./recursoProperties');

class Recurso extends Model {}

Recurso.init({
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
    values: Object.values(tipoRecurso), // Usando os valores do objeto tipoRecurso
  },
  link: {
    type: DataTypes.STRING,
  },
  targetPublic: {
    type: DataTypes.ENUM,
    values: Object.values(publicoAlvo), // Usando os valores do objeto publicoAlvo
  },
  thumb: {
    type: DataTypes.BLOB,
  },
  knowledgeArea: {
    type: DataTypes.ENUM,
    values: Object.values(areasConhecimento), // Usando os valores do objeto areasConhecimento
  },
  license: {
    type: DataTypes.ENUM,
    values: Object.values(tiposLicenca), // Usando os valores do objeto tiposLicenca
  },
  language: {
    type: DataTypes.ENUM,
    values: Object.values(idiomas), // Usando os valores do objeto idiomas
  },
  description: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'recurso',
});

Recurso.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Recurso.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

Recurso.sync({ logging: false });

module.exports = Recurso;
