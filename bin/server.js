const app = require("../app");
const db = require("../model/db");
const createFolderIsNotExist = require("../helper/create-dir");
require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

const PORT = process.env.PORT || 3030;
db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD_DIR);
    await createFolderIsNotExist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(err.message);
  process.exit(1);
});
