import PublicLayout from "@/components/layout/PublicLayout";
import RefundPage from "@/components/organisms/admin/Refund";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <RefundPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}