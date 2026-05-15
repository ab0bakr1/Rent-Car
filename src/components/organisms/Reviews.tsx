import Text from "../atoms/Text"
import Title from "../atoms/Title"
import Review from "../molecules/Review"

export default function Reviews() {
    return (
        <section className="py-20 ds-bg">
            <div className="ds-container flex flex-col gap-4">
                <Title variant="disabled" className="text-center" size="sm">آراء العملاء</Title>
                <Text size="xl" variant="secondary" className="text-center">استكشف مجموعتنا من السيارات المميزة</Text>
                <div className="">
                    <Review />
                </div>
            </div>
        </section>
    )
}