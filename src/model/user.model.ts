import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/default";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(canidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: any) {
  let user = this as UserDocument;

  // hash the password if it has been modified or is new
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.saltWorkFactor);

  const hash = await bcrypt.hashSync(user.password, salt);

  // replace password with the hash
  user.password = hash;
  next();
});

// used for logging in
UserSchema.methods.comparePassword = async function (canidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt
    .compare(canidatePassword, user.password)
    .catch((error) => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
