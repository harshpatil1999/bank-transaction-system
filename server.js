const dotenv = require("dotenv");
dotenv.config();

const connectToDB = require("./src/config/db");
const app = require("./src/app");

connectToDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database : " + err.message);
    process.exit(1);
  });
