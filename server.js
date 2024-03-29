const app = require("./app");
const jsonWebToken = require("jsonwebtoken");
require("dotenv/config");


// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
