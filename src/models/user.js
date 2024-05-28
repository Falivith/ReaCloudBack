const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/db')

class User extends Model {}
User.init({
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  profilePicture: {
    type: DataTypes.BLOB, 
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

User.sync({ logging: false });


module.exports = User