/* eslint-disable */
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const User = require('./user');


// eslint-disable-next-line require-jsdoc
class Recurso extends Model {}
Recurso.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  }
  ,
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reatype: {
    type: DataTypes.STRING,
    
  },
  link: {
    type: DataTypes.STRING,
    
  },
  targetPublic: {
    type: DataTypes.ENUM,
    values: ['Séries Iniciais', 'Fundamental', 'Médio', 'Superior'],
    
  },
  thumb: {
    type: DataTypes.BLOB,
    
  },
  knowledgeArea: {
    type: DataTypes.ENUM,
    values: ['Português', 'Matemática', 'Biologia', 'Teologia'],
    
  },
  license: {
    type: DataTypes.ENUM,
    values: ['Domínio Público', 'GNU'],
    
  },
  language: {
    type: DataTypes.ENUM,
    values: ['Português', 'Inglês', 'Francês', 'Alemão', 'Outro'],
    
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


module.exports = Recurso
