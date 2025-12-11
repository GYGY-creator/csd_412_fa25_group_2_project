const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' }
  }, {
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.Review, { foreignKey: 'userId' });
  };

  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
