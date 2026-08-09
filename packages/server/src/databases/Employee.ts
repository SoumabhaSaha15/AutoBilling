import mongoose from "mongoose";
import { AdminSchema as EmployeeSchema, type AdminType as EmployeeType, AdminValidator as EmployeeValidator } from "@/databases/Admin";

const EmployeeModel = mongoose.model<EmployeeType>('employee_model', EmployeeSchema);
export { EmployeeModel, EmployeeSchema, EmployeeValidator, EmployeeType };
