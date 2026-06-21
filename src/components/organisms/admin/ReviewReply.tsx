"use client";

import { useEffect, useState, useCallback } from "react";
import StatusBadge from "@/components/molecules/Statusbadge";
import Pagination from "@/components/molecules/Pagination";
import EmptyState from "@/components/molecules/Emptystate";
import ReviewReplyModal from "@/components/organisms/admin/Modal/ReviewReplyModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getReviews,
  approveReview,
  rejectReview,
  replyToReview,
  type Review,
  type ReviewStatus,
} from "@/utils/reviews-service";
import { Search, Loader2, Star, Check, X, MessageSquare, CarFront } from "lucide-react";

const STATUS_CONFIG: Record<
  ReviewStatus,
  { label: string; color: "green" | "yellow" | "red" }
> = {
  PENDING: { label: "معلّقة", color: "yellow" },
  APPROVED: { label: "مقبولة", color: "green" },
  REJECTED: { label: "مرفوضة", color: "red" },
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "">("");
  const [actingId, setActingId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [replying, setReplying] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReviews({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      setReviews(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب التقييمات. تأكد من اتصال الخادم.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await approveReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
      );
    } catch (err) {
      console.error(err);
      alert("فشلت عملية الموافقة.");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActingId(id);
    try {
      await rejectReview(id);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
      );
    } catch (err) {
      console.error(err);
      alert("فشلت عملية الرفض.");
    } finally {
      setActingId(null);
    }
  };

  const handleReply = async (reply: string) => {
    if (!replyTarget) return;
    setReplying(true);
    try {
      await replyToReview(replyTarget.id, reply);
      setReviews((prev) =>
        prev.map((r) => (r.id === replyTarget.id ? { ...r, adminReply: reply } : r))
      );
      setReplyTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل إرسال الرد.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة التقييمات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              الموافقة أو رفض تقييمات العملاء والرد عليها.
            </Text>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="بحث باسم العميل أو السيارة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as ReviewStatus | "");
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
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
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<Star size={28} />}
            title="لا توجد تقييمات"
            description="لم يتم العثور على تقييمات مطابقة لبحثك."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <CarFront size={12} />
                      {review.car.name} {review.car.model}
                    </div>
                  </div>
                  <StatusBadge
                    label={STATUS_CONFIG[review.status].label}
                    color={STATUS_CONFIG[review.status].color}
                  />
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {review.comment}
                </p>

                {review.adminReply && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3 mb-4">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      ردّك:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{review.adminReply}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actingId === review.id || review.status === "APPROVED"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-40 transition-colors"
                  >
                    <Check size={14} />
                    موافقة
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    disabled={actingId === review.id || review.status === "REJECTED"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-40 transition-colors"
                  >
                    <X size={14} />
                    رفض
                  </button>
                  <button
                    onClick={() => setReplyTarget(review)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <MessageSquare size={14} />
                    رد
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ReviewReplyModal
        review={replyTarget}
        isLoading={replying}
        onClose={() => setReplyTarget(null)}
        onSubmit={handleReply}
      />
    </>
  );
}