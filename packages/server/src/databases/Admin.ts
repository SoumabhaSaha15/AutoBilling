import z from "zod";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const name = z.string({ error: 'name is required' }).min(4, 'name must have 4 or more chars').max(30, 'name must be under 30 chars').regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid user name');
const email = z.email('invalid email');
const password = z.string({ error: 'password is required' }).length(8, 'password should have 8 chars').regex(/^[\x21-\x7E]+$/, 'invalid password');
const profilePublicId = z.string({ error: "cloudinary image Id Required" });
const profilePicture = z.url({ message: "value is not propper url" }).startsWith("https://res.cloudinary.com/", { message: "not a propper profilePicture url" });
const AdminValidator = z.strictObject({
  name,
  email,
  password,
  profilePublicId,
  profilePicture
});

export type AdminType = z.infer<typeof AdminValidator>;
const AdminSchema = new mongoose.Schema<AdminType>({
  name: {
    type: String,
    required: [true, 'name is required.'],
    validator: {
      validate: (value: string) => name.safeParse(value).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  email: {
    type: String,
    required: [true, 'email is required.'],
    unique: true,
    validator: {
      validate: (value: string) => email.safeParse(value).success,
      message: (props: { value: string; }) => `${props.value} is not a valid email.`
    }
  },
  password: {
    type: String,
    required: [true, 'password is required.'],
    unique: true,
    valodator: {
      validate: (value: string) => password.safeParse(value).success,
      message: (props: { value: string; }) => `${props.value} is not a valid password.`
    }
  },
  profilePublicId: {
    type: String,
    required: true,
    validator: {
      validate: (value: string) => profilePublicId.safeParse(value).success,
      message: (props: { value: string; }) => `${props.value} is not a valid cloudinary id.`
    }
  },
  profilePicture: {
    type: String,
    required: [true, 'profilePic is required'],
    validator: {
      validate: (value: string) => profilePicture.safeParse(value).success,
      message: (props: { value: string; }) => `${props.value} is not a valid profilePicture.`
    }
  }
}, { timestamps: true });

AdminSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(12));
});

const AdminModel = mongoose.model<AdminType>('admin_model', AdminSchema);
export { AdminModel, AdminSchema, AdminValidator };
