import { z } from "zod/v3";
import { AdminSubmit } from "./admin";
export const EmployeeSubmit = AdminSubmit.omit({ adminKey: true });
export type EmployeeSubmitType = z.infer<typeof EmployeeSubmit>;

export const EmployeeRegister = EmployeeSubmit.extend({
  name: z.string({ required_error: 'name is required' })
    .min(4, 'name must have 4 or more chars')
    .max(30, 'name must be under 30 chars')
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid employee name'),
  profilePicture: z
    .instanceof(FileList)
    .refine(files => files.length == 1, "Single Product image is required")
    .refine(files => files[0]?.size <= 2 ** 20, `Max image size is 1MB.`) // 5MB limit
    .refine(
      files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
      "Only .jpg, .png, .webp formats are supported."
    ),
});
export const EmployeeRegisterResopnse = EmployeeRegister.omit({ profilePicture: true, password: true }).extend({
  profilePicture: z.string().url(),
  id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
})
export type EmployeeRegisterType = z.infer<typeof EmployeeRegister>;
export type EmployeeRegisterResponseType = z.infer<typeof EmployeeRegisterResopnse>;
