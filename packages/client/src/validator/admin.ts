import * as z from 'zod'; // valid usage
export const AdminSubmit = z.strictObject({
  email: z.email('invalid email'),
  password: z.string({ error: 'password is required' })
    .length(8, 'password should have 8 chars')
    .regex(/^[\x21-\x7E]+$/, 'invalid password'),
  adminKey: z.string({ error: "admin key is missing" })
});
export type AdminSubmitType = z.infer<typeof AdminSubmit>
