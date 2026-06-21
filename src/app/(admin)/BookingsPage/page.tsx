import PublicLayout from "@/components/layout/PublicLayout";
import AdminBookingsPage from "@/components/organisms/admin/Bookings";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <AdminBookingsPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}