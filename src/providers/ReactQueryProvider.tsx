"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // نستخدم useState لضمان إنشاء نسخة واحدة فقط من العميل لكل مستخدم وعدم تكرارها مع الـ SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // التخزين المؤقت للبيانات لمدة دقيقة
        refetchOnWindowFocus: false, // عدم إعادة جلب البيانات عند تغيير نافذة المتصفح
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}