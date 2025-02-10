import express from "express";
import { sequelize } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import openAIRoutes from "./routes/openAIRoutes.js";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/openAi", openAIRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
