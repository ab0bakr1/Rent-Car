import PublicLayout from "@/components/layout/PublicLayout";
import { ForgotPasswordForm } from "@/components/organisms/auth/ForgotPasswordForm";

export default function Page() {
    return (
        <PublicLayout>
            <ForgotPasswordForm />
        </PublicLayout>
    );
}