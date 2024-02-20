const { sequelize } = require('../util/db');
const { Model, DataTypes } = require('sequelize');
const User = require('./user');
const Recurso = require('./recurso');

class Comment extends Model {}

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Recurso,
            key: 'id'
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'comments',
    modelName: 'comments',
    underscored: true,
});

Comment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Comment.belongsTo(Recurso, { foreignKey: 'resource_id', targetKey: 'id' })

module.exports = Comment;
