const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

UserVerificationSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.uniqueString, 10);
  this.uniqueString = hash;
  next();
});

UserVerificationSchema.methods.isValidUniqueString = async function (
  uniqueString
) {
  const user = this;
  const compare = await bcrypt.compare(uniqueString, user.uniqueString);
  return compare;
};

module.exports = mongoose.model("usersVerification", UserVerificationSchema);
