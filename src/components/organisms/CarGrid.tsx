'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCars, Car } from '@/utils/cars-service';

export default function CarGrid() {
  // استخدام React Query v5 لإدارة جلب البيانات والتخزين المؤقت
  const { data: cars, isLoading, error } = useQuery<Car[]>({
    queryKey: ['cars'],
    queryFn: fetchCars,
  });

  if (isLoading) return <div className="text-center p-5">جاري تحميل السيارات...</div>;
  if (error) return <div className="text-center text-red-500 p-5">حدث خطأ أثناء جلب البيانات!</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cars?.map((car) => (
        <div key={car.id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-2">{car.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            السعر اليومي: <span className="text-green-600 font-semibold">{car.pricePerDay} ر.س</span>
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            احجز الآن
          </button>
        </div>
      ))}
    </div>
  );
}