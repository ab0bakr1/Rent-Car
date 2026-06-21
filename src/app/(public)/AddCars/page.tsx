import PublicLayout from "@/components/layout/PublicLayout";
import AddCar from "@/components/organisms/AddCar";
import AdminGuard from "@/components/layout/AdminGuard";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AddCar />
            </PublicLayout>
        </AdminGuard>
    );
}