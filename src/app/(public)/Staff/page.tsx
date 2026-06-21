import PublicLayout from "@/components/layout/PublicLayout";
import StaffPage from "@/components/organisms/admin/Staff";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <StaffPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}