import PublicLayout from "@/components/layout/PublicLayout";
import CategoryPage from "@/components/organisms/admin/Category";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <CategoryPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}