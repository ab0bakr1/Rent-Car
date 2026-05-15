import Button from "../atoms/Button";
import Images from "../atoms/Images";
import Text from "../atoms/Text";
import Title from "../atoms/Title";
import { StaticImageData } from "next/image";


interface Props {
    name: string;
    price: number;
    image: StaticImageData;
    seats: number;
    gear: string;
    type: string;
}
export default function Card({name , price , image , seats , gear , type}:Props){
    return(
        <div className="ds-border ds-border-secondary rounded-lg overflow-hidden">
            <Images src={image} alt={name} width={500} height={500} className="w-full h-full object-cover" />
            <div className="ds-bg-alt bg-opacity-50 p-4">
                <div className="flex justify-between items-center">
                    <Title variant="primary" size="md" >
                        {name}
                    </Title>
                    <Title variant="disabled" size="md" className="relative">
                        ${price} <span className="ds-text-alt absolute top-8 left-0 ds-text-sm">/DAY</span>
                    </Title>
                </div>
                <div className="flex gap-5 py-5">
                    <div className="flex items-center gap-2">
                        <Text variant="primary" size="sm">{seats}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <Text variant="primary" size="sm">{gear}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <Text variant="primary" size="sm">{type}</Text>
                    </div>
                </div>
                <Button size="lg" className="w-full border rounded-md ds-bg-alt ds-text-secondary">عرض سريع</Button>
            </div>
        </div>
    )
}