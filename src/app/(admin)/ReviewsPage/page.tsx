import PublicLayout from "@/components/layout/PublicLayout";
import ReviewReply from "@/components/organisms/admin/ReviewReply";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

export default function Page() {
    return (
        <AdminGuard>
            <PublicLayout>
                <AdminLayout>
                    <ReviewReply />
                </AdminLayout>
            </PublicLayout>
        </AdminGuard>
    );
}