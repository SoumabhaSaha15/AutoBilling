import { FC } from "react";
import { Card, Badge } from 'flowbite-react';
import { HiClock, HiCheck } from 'react-icons/hi';
const data = [
  {
    comingSoon: true,
    name: 'sales reports',
    url: './sales-performance.svg',
  },
  {
    comingSoon: true,
    name: 'employee stats',
    url: './employee-worker.svg',
  },
  {
    comingSoon: true,
    name: 'customer satisfaction',
    url: './customer-list-line.svg',
  },
  {
    comingSoon: true,
    name: 'product demand',
    url: './shopping-card.svg',
  },
  {
    comingSoon: true,
    name: 'inventory reports',
    url: './inventory.svg',
  }
]
const AdminPage: FC = () => {
  return (
    <div className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 items-center place-items-center p-2 justify-center">
      {data.map((value, index) => (
        <Card className="w-full hover:scale-90 hover:shadow-2xl hover:shadow-gray-600 dark:hover:shadow-gray-950" key={index}>
          <img src={value.url} alt="sales report" className="aspect-square h-[224px]" onError={(e) => { e.currentTarget.src = './image-broken.svg' }} />
          <div className="flex flex-row items-center justify-center space-y-2">
            <Badge icon={value.comingSoon ? HiClock : HiCheck} color="green" size="sm" className="mr-2 mb-0"/>
            <h5 className="text-2xl tracking-tight font-medium text-center text-gray-900 dark:text-white">{value.name}</h5>
          </div>
        </Card>
      ))}
    </div>
  );
}
export default AdminPage
