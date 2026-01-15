import z from "zod";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const AdminValidator = z.strictObject({
  name: z.string({ error: 'name is required' })
    .min(4, 'name must have 4 or more chars')
    .max(30, 'name must be under 30 chars')
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid user name'),
  email: z.email('invalid email'),
  password: z.string({ error: 'password is required' })
    .length(8, 'password should have 8 chars')
    .regex(/^[\x21-\x7E]+$/, 'invalid password'),
  profilePublicId: z.string({ error: "cloudinary image Id Required" }),
  profilePicture: z.url({ message: "value is not propper url" })
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
  profilePublicId: {
    type: String,
    required: true,
    validator: {
      validate: (value: string) => AdminValidator.pick({ profilePublicId: true }).safeParse({ profilePublicId: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid cloudinary id.`
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

AdminSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(12));
});

const AdminModel = mongoose.model<AdminType>('admin_model', AdminSchema);
export { AdminModel, AdminSchema, AdminValidator };
