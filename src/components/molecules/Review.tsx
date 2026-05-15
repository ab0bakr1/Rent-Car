import Text from "../atoms/Text"
import { Star } from "../../../public/assets/icons/icons"

export default function Review() {
    const user = [
        {name: "ابوبكر المشهور",
        role: "مبرمج ومطور",
        desc: "شكراً لكم على الخدمة الممتازة! السيارة كانت نظيفة وفي حالة ممتازة والتسليم كان سريعاً جداً. أنصح الجميع بالتعامل معهم.",
        rate: 5,
        },
        {name: "ابوبكر المشهور",
        role: "مبرمج ومطور",
        desc: "شكراً لكم على الخدمة الممتازة! السيارة كانت نظيفة وفي حالة ممتازة والتسليم كان سريعاً جداً. أنصح الجميع بالتعامل معهم.",
        rate: 5,
        },
        {name: "ابوبكر المشهور",
        role: "مبرمج ومطور",
        desc: "شكراً لكم على الخدمة الممتازة! السيارة كانت نظيفة وفي حالة ممتازة والتسليم كان سريعاً جداً. أنصح الجميع بالتعامل معهم.",
        rate: 4,
        },
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 m-auto mt-10">
            {user.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 p-8 ds-bg-alt ds-border shadow-md shadow-blue-500/20 ds-rounded-xl w-full">
                    <div className="flex items-center gap-2">
                        {[...Array(item.rate)].map((_, i) => (
                            <Star key={i} size={24} className="ds-text-tertairy fill-current" />
                        ))}
                    </div>
                    <Text variant="disabled" size={"sm"}>
                        {item.desc}
                    </Text>
                    <div className="flex flex-col">
                        <Text size="lg" variant="secondary" className="m-0">{item.name}</Text>
                        <Text size="sm" variant="disabled" className="m-0">{item.role}</Text>
                    </div>
                </div>
            ))}
        </div>
    )
}