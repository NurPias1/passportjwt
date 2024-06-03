// require
require("dotenv").config();
const app = require("./app");
const port = process.env.PORT;

// listen
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
