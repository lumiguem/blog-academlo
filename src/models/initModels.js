const Comment = require("./commentModel");
const { Post } = require("./postModel");
const User = require("./userModel");

const initModel = () => {
    User.hasMany(Post, { foreignKey: 'userId' });
    Post.belongsTo(User, { foreignKey: 'userId' });

    Post.hasMany(Comment);
    Comment.belongsTo(Post);

    User.hasMany(Comment);
    Comment.belongsTo(User);

}

module.exports = initModel;