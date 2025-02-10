import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
import defineUser from "./user.js";
import defineMessage from "./message.js";

const dbUserName = process.env.DB_USERNAME;
const database = process.env.DB_DATABASE;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbType = process.env.DB_TYPE;

const sequelize = new Sequelize(database, dbUserName, dbPassword, {
  host: dbHost,
  dialect: dbType,
  logging: false,
});

const User = defineUser(sequelize);
const Message = defineMessage(sequelize);

User.hasMany(Message, { foreignKey: "userId", as: "messages" });
Message.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Message };
