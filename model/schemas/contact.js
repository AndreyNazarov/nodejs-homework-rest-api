const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "User phone number required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactSchema.path("name").validate((value) => {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;

// const profileSchema = new Schema({
//   firstName: String,
//   lastName: String,
// });
// contactSchema.path("email").validate(function (email) {
//   const emailRegex = /^([\w-]\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//   return emailRegex.test(email.text); // Assuming email has a text attribute
// }, "The e-mail field cannot be empty.");
