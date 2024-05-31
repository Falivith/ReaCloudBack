const User = require('./user');
const Recurso = require('./recurso');
const Like = require('./like');
const Comment = require('./comment');

User.hasMany(Recurso, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Recurso.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });

Recurso.hasMany(Like, { foreignKey: 'recurso_id', onDelete: 'CASCADE' });
Like.belongsTo(Recurso, { foreignKey: 'recurso_id', targetKey: 'id', onDelete: 'CASCADE' });

User.hasMany(Like, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });

User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE' });

Recurso.hasMany(Comment, { foreignKey: 'resource_id', onDelete: 'CASCADE' });
Comment.belongsTo(Recurso, { foreignKey: 'resource_id', targetKey: 'id', onDelete: 'CASCADE' });
