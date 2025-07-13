import { FC } from "react";
import {Card} from "flowbite-react"
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"
const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908
  }
]
const AdminPage: FC = () => {
  return (
    <div className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 items-center place-items-center p-2 justify-center">
      <Card className="w-sm max-w-xl h-[40%]">
        <h5 className="text-medium font-bold tracking-tight text-gray-900 dark:text-white"> bar-chart </h5>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart width={500} height={300} data={data} margin={{right:30}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
export default AdminPage
