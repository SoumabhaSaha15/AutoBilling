import z from "zod";
import { FC } from "react";
import { UserDetailsSchema } from '../../contexts/Auth/employee/AuthContext';

const OmittedId = UserDetailsSchema.omit({ id: true });
const EmployeeCard: FC<z.infer<typeof OmittedId>> = (props: z.infer<typeof OmittedId>) => {
  const { success, data, error } = OmittedId.safeParse(props);
  return ((success) ?
    (
      <>
        <div className="flex flex-col items-center">
          <h5 className="mb-1 text-md font-medium text-gray-900 dark:text-white">{data?.name}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">{data?.email}</span>
        </div>
      </>) : (error && z.prettifyError(error))
  )
}
export default EmployeeCard;
