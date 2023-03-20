/* eslint-disable */
const {Model, DataTypes} = require('sequelize');
const { sequelize } = require('../util/db')


// eslint-disable-next-line require-jsdoc
class Recurso extends Model {}
Recurso.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo_material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_material: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publico_alvo: {
    type: DataTypes.ENUM,
    values: ['Séries Iniciais', 'Fundamental', 'Médio', 'Superior'],
    allowNull: false,
  },
  imagem_material: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  area_conhecimento: {
    type: DataTypes.ENUM,
    values: ['Português', 'Matemática', 'Biologia', 'Teologia'],
    allowNull: false,
  },
  tipo_licensa: {
    type: DataTypes.ENUM,
    values: ['Domínio Público', 'GNU'],
    allowNull: false,
  },
  idioma_material: {
    type: DataTypes.ENUM,
    values: ['Português', 'Inglês', 'Francês', 'Alemão', 'Outro'],
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  intrucoes_uso: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'recurso',
});

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

User.sync({ logging: false });


module.exports = Recurso