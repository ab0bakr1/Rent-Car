import PublicLayout from "@/components/layout/PublicLayout";
import BrandPage from "@/components/organisms/admin/Brand";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <BrandPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}