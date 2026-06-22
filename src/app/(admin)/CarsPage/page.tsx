import PublicLayout from "@/components/layout/PublicLayout";
import Cars from "@/components/organisms/admin/Cars";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <Cars />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}