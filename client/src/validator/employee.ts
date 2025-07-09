import { z } from "zod";
import { AdminSubmit } from "./admin";
export const EmployeeSubmit = AdminSubmit.omit({ adminKey: true });
export type EmployeeSubmitType = z.infer<typeof EmployeeSubmit>;
