const { sequelize } = require('../../app');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  given_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  family_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  institution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profile: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.TEXT,
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
