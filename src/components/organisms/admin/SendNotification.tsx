"use client";

import { useEffect, useState, useCallback } from "react";
import EmptyState from "@/components/molecules/Emptystate";
import Pagination from "@/components/molecules/Pagination";
import SendNotificationModal from "@/components/organisms/admin/Modal/SendNotificationModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getNotifications,
  sendNotification,
  type NotificationItem,
  type SendNotificationPayload,
} from "@/utils/notifications-service";
import { Loader2, Bell, Plus, User } from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications(page, 15);
      setNotifications(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب الإشعارات. تأكد من اتصال الخادم.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSend = async (data: SendNotificationPayload) => {
    setSending(true);
    try {
      await sendNotification(data);
      setModalOpen(false);
      setPage(1);
      await fetchNotifications();
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الإشعار.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة الإشعارات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              إرسال إشعارات للمستخدمين وعرض السجل.
            </Text>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            إشعار جديد
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={28} />}
            title="لا توجد إشعارات"
            description="لم يتم إرسال أي إشعارات بعد."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{n.title}</p>
                    <span className="text-xs text-gray-400 shrink-0" dir="ltr">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User size={12} />
                    {n.user.firstName} {n.user.lastName} — {n.user.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <SendNotificationModal
        open={modalOpen}
        isLoading={sending}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSend}
      />
    </>
  );
}