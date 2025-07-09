import { UserDetailsSchema } from '../../contexts/Auth/admin/AuthContext';
import { Card, Avatar } from "flowbite-react";
import flattener from "./../../utility/zod-error-flattener"
import { FC } from "react";
import { z } from "zod";
const OmittedId = UserDetailsSchema.omit({ id: true });
const AdminCard: FC<z.infer<typeof OmittedId>> = (props: z.infer<typeof OmittedId>) => {
  let { success, data, error } = OmittedId.safeParse(props);
  return ((success) ?
    (<Card className="max-w-sm rounded-3xl">
      <div className="flex flex-col items-center pb-4">
        <Avatar img={data?.profilePicture} size="lg" className="rounded-lg" />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data?.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data?.email}</span>
      </div>
    </Card>) : (<Card>
      {error && flattener(error)}
    </Card>)
  )
}
export default AdminCard;
