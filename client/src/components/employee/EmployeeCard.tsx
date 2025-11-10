import { UserDetailsSchema } from '../../contexts/Auth/employee/AuthContext';
import { useAuth } from '../../contexts/Auth/employee/AuthContext';
import flattener from "../../utility/zod-error-flattener"
import { Card, Avatar, Button, DropdownDivider } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { FC } from "react";
import { z } from "zod/v3";
const OmittedId = UserDetailsSchema.omit({ id: true });
const EmployeeCard: FC<z.infer<typeof OmittedId>> = (props: z.infer<typeof OmittedId>) => {
  const { success, data, error } = OmittedId.safeParse(props);
  const employeeAuth = useAuth();
  const navigate = useNavigate();
  return ((success) ?
    (<>
      <Card className="max-w-xs min-w-xs rounded-3xl">
        <div className="flex flex-col items-center">
          <Avatar img={data?.profilePicture} size="xl" rounded />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data?.name}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">{data?.email}</span>
        </div>
      </Card>
      <DropdownDivider />
      <Button
        className='w-full rounded-xl'
        size="md"
        color="red"
        onClick={() => employeeAuth.logout(() => navigate('/'))}
        children={"Log Out"}
      />
    </>) : (<Card>
      {error && flattener(error)}
    </Card>)
  )
}
export default EmployeeCard;
