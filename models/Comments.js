class Comments extends Model {}

Comments.init({
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
    modelName: 'Comments',
    tableName: 'comments',
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
});