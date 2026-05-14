import Title from "../atoms/Title";
import Text from "../atoms/Text";
import Box from "../molecules/Box";
import Card from "../molecules/Card";
import {bgHeroDark } from "../../../public/assets/images/images"
import Button from "../atoms/Button";

export default function Special() {
    const SpecialCars = [
        {
            id: 1,
            name: "السيارة المميزة",
            price: 500,
            image: bgHeroDark,
            seats: 2,
            gear: "automatic",
            type:"petrol",
            
        },
        {
            id: 2,
            name: "السيارة المميزة",
            price: 300,
            image: bgHeroDark,
            seats: 5,
            gear: "automatic",
            type:"petrol",
            
        },
        {
            id: 3,
            name: "السيارة المميزة",
            price: 260,
            image: bgHeroDark,
            seats: 5,
            gear: "automatic",
            type:"electric",
            
        },
    ];
    return (
        <section className="py-20 ds-bg">
            <div className="ds-container flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-4">
                        <Title variant="primary" className="text-start">السيارات المميزة</Title>
                        <Text size="lg" variant="secondary" className="text-start">استكشف مجموعتنا من السيارات المميزة</Text>
                    </div>
                    <Button size="md" className="ds-bg">عرض الكل</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SpecialCars.map((car) => (
                        <Card key={car.id} name={car.name} price={car.price} image={car.image} seats={car.seats} gear={car.gear} type={car.type} />
                    ))}
                </div>
            </div>
        </section>
    )
}