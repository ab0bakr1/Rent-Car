import PublicLayout from "@/components/layout/PublicLayout";
import Dashboard from "@/components/organisms/admin/Dashboard";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <Dashboard />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}