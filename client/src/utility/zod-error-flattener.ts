import { ZodError } from 'zod';
export default (error: ZodError, separator: string = "\n"): string => error.issues.map(({ message }) => message).join(separator);