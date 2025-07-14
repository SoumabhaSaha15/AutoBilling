import { UserDetailsSchema } from '../../contexts/Auth/employee/AuthContext';
import { useAuth } from '../../contexts/Auth/employee/AuthContext';
import flattener from "../../utility/zod-error-flattener"
import { Card, Avatar, Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { FC } from "react";
import { z } from "zod";
const OmittedId = UserDetailsSchema.omit({ id: true });
const AdminCard: FC<z.infer<typeof OmittedId>> = (props: z.infer<typeof OmittedId>) => {
  const { success, data, error } = OmittedId.safeParse(props);
  const employeeAuth = useAuth();
  const navigate = useNavigate();
  return ((success) ?
    (<Card className="max-w-sm rounded-3xl">
      <div className="flex flex-col items-center">
        <Avatar img={data?.profilePicture} size="xl" rounded />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data?.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data?.email}</span>
      </div>
      <Button
        size="md"
        color="red"
        as={'div'}
        onClick={() => {
          employeeAuth.logout(() => {
            navigate('/login/employee');
          })
        }}
      >Log Out</Button>
    </Card>) : (<Card>
      {error && flattener(error)}
    </Card>)
  )
}
export default AdminCard;
