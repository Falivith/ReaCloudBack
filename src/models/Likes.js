const { Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(/* your connection string here */);

class Likes extends Model {}

Likes.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
            model: 'users', // assuming your user model is User
            key: 'id'
        }
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'recursos', // assuming your resource model is Recursos
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Likes',
    tableName: 'likes',
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
});

