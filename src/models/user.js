const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(36), // melhor colocar tamanho pra UUID
    primaryKey: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  given_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  family_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
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

module.exports = User;
