const app = require("./app");
const { DB_HOST } = process.env;
// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => console.log("Database connection successful"))
  .then(() => app.listen(3000))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
