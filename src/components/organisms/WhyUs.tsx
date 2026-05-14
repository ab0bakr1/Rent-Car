import Text from "../atoms/Text"
import Title from "../atoms/Title"
import Box from "../molecules/Box"
import {Sun} from "../../../public/assets/icons/icons"

export default function WhyUs() {
    const data = [
        { title: "المرونة في الحجز", text: "سهولة الإلغاء أو التعديل" , IconComponent: Sun },
        { title: "الأسعار المنافسة", text: "أفضل قيمة مقابل المال", IconComponent: Sun },
        { title: "الخدمة على مدار الساعة", text: "مساعدة فورية عند الحاجة" , IconComponent: Sun },
        { title: "الخدمة على مدار الساعة", text: "مساعدة فورية عند الحاجة" , IconComponent: Sun },
    ];
    return (
        <section className="py-20 ds-bg-alt">
            <div className="ds-container flex flex-col gap-4">
                <Title variant="primary" className="text-center">لماذا تختارنا؟</Title>
                <Text size="lg" variant="secondary" className="text-center">استكشف مجموعتنا من السيارات المميزة</Text>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-20 gap-y-10 m-auto mt-10">
                    {data.map((item, index) => (
                        <Box key={index} title={item.title} text={item.text} IconComponent={item.IconComponent} />
                    ))}
                </div>
            </div>
        </section>
    )
}