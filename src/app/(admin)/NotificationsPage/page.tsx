import PublicLayout from "@/components/layout/PublicLayout";
import AdminSendNotification from "@/components/organisms/admin/SendNotification";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <AdminSendNotification />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}