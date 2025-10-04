import { ZodError } from 'zod/v3';
export default (error: ZodError, separator: string = "\n"): string => error.issues.map(({ message }) => message).join(separator);
