import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      threadId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
