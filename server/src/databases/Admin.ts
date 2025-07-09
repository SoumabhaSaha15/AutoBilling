import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
const AdminValidator = z.strictObject({
  name: z.string({ required_error: 'name is required' })
    .min(4, 'name must have 4 or more chars')
    .max(30, 'name must be under 30 chars')
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid user name'),
  email: z.string({ required_error: 'email is required' })
    .email('invalid email'),
  password: z.string({ required_error: 'password is required' })
    .length(8, 'password should have 8 chars')
    .regex(/^[\x21-\x7E]+$/, 'invalid password'),
  profilePicture: z.string({ required_error: 'profilePicture is required' })
    .url({ message: "value is not propper url" })
    .startsWith(
      "https://res.cloudinary.com/",
      { message: "not a propper profilePicture url" }
    )
});
export type AdminType = z.infer<typeof AdminValidator>;
const AdminSchema = new mongoose.Schema<AdminType>({
  name: {
    type: String,
    required: [true, 'name is required.'],
    validator: {
      validate: (value: string) => AdminValidator.pick({ 'name': true }).safeParse({ name: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  email: {
    type: String,
    required: [true, 'email is required.'],
    unique: true,
    validator: {
      validate: (value: string) => AdminValidator.pick({ email: true }).safeParse({ email: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid email.`
    }
  },
  password: {
    type: String,
    required: [true, 'password is required.'],
    unique: true,
    valodator: {
      validate: (value: string) => AdminValidator.pick({ password: true }).safeParse({ password: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid password.`
    }
  },
  profilePicture: {
    type: String,
    required: [true, 'profilePic is required'],
    validator: {
      validate: (value: string) => AdminValidator.pick({ profilePicture: true }).safeParse({ profilePicture: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid profilePicture.`
    }
  }
}, { timestamps: true });

AdminSchema.pre("save",async function(next){
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(12));
  next();
});
const AdminModel = mongoose.model<AdminType>('admin_model', AdminSchema);
export { AdminModel, AdminSchema, AdminValidator };
