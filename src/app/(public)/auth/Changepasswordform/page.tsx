import PublicLayout from "@/components/layout/PublicLayout";
import { ChangePasswordForm } from "@/components/organisms/auth/Changepasswordform";

export default function Page() {
    return (
        <PublicLayout>
            <ChangePasswordForm />
        </PublicLayout>
    );
}