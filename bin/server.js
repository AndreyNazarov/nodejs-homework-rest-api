const app = require("../app");
const db = require("../model/db");
db.then(() => {
  const PORT = process.env.PORT || 3030;

  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(err.message);
  process.exit(1);
});
