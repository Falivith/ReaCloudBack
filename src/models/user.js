const { Model, DataTypes} = require('sequelize');
const { sequelize } = require('../database/db')

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profilePicture: {
    type: DataTypes.BLOB, 
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
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
});

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  for (const key in values) {
    if (values[key] === null) {
      values[key] = "";
    }
  }
  delete values.password;

  return values;
};

//User.sync({ logging: false });


module.exports = User