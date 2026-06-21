"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Title from "../atoms/Title";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من الصلاحيات عبر الـ localStorage
    const userStr = localStorage.getItem("user");
    let userRole = "";
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userRole = user.role;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    
    // التحقق مما إذا كان المستخدم أدمن أو سوبر أدمن
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      setIsAuthorized(true);
    } else {
      // توجيه المستخدم لصفحة الدخول إذا لم يكن مدير
      router.push("/Login");
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen ds-bg flex items-center justify-center">
        <Title variant="primary" size="lg" className="animate-pulse">
          جاري التحقق من الصلاحيات...
        </Title>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // سيتم التوجيه تلقائياً
  }

  return <>{children}</>;
}
