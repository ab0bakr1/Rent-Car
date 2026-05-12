import Select from "@/components/atoms/Select";

export default function From() {
    const carTypes = [
        { value: 'all', label: 'كل السيارات' },
        { value: 'sedan', label: 'سيدان' },
        { value: 'suv', label: 'دفع رباعي' },
        { value: 'coupe', label: 'كوبيه' },
        { value: 'convertible', label: 'كابورليه' },
    ];
    return (
        <div className="w-full">
            <form action="">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="ds-text-sm ds-text-secondary" htmlFor="">الموقع</label>
                        <input type="text" className="border border-gray-300 rounded-md py-3 px-5" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="ds-text-sm ds-text-secondary" htmlFor="">تاريخ الاستلام</label>
                        <input type="date" className="border border-gray-300 rounded-md py-3 px-5" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="" className="ds-text-sm ds-text-secondary">نوع السيارة</label>
                        <Select options={carTypes} placeholder="اختر نوع السيارة" className="border border-gray-300 rounded-md py-3.5 px-5" />
                    </div>
                    <button type="submit" className="flex flex-col ds-bg-primary ds-text-primary py-2 px-5 rounded-md text-lg lg:text-xl self-end w-full">ابحث</button>
                </div>
            </form>
        </div>
    )
}