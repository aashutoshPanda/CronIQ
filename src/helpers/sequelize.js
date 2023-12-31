import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env.example" });

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: "mysql",
//   define: {
//     timestamps: false,
//   },
// });
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/home/panda/projects/backend/CronIQ/database.sqlite", // Replace this with the path to your SQLite database file
  define: {
    timestamps: false,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

export default sequelize;
