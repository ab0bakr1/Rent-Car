import PublicLayout from "@/components/layout/PublicLayout";
import LocationPage from "@/components/organisms/admin/Location";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <LocationPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}