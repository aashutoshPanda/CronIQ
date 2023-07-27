import sequelize from "../helpers/sequelize.js";
import { DataTypes } from "sequelize";

const OneTimeJob = sequelize.define("OneTimeJob", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timeoutSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

// Add the relationship with User model
User.hasMany(OneTimeJob, {
  foreignKey: "userId",
});
OneTimeJob.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("OneTimeJob table created successfully!");
  })
  .catch((error) => {
    console.error("Failed to create OneTimeJob table : ", error);
  });

export default OneTimeJob;
