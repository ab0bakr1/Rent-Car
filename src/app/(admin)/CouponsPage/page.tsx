import PublicLayout from "@/components/layout/PublicLayout";
import CouponPage from "@/components/organisms/admin/Coupon";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <CouponPage />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}