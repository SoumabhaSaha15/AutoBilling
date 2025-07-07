import { z } from "zod";
export const AdminSubmit = z.strictObject({
  email: z.string({ required_error: 'email is required' })
    .email('invalid email'),
  password: z.string({ required_error: 'password is required' })
    .length(8, 'password should have 8 chars')
    .regex(/^[\x21-\x7E]+$/, 'invalid password'),
  adminKey: z.string({ required_error: "admin key is missing" })
});
export type AdminSubmitType = z.infer<typeof AdminSubmit>