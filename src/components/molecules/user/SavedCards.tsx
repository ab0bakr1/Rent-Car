// ============================================================
// src/components/molecules/user/SavedCards.tsx
// بطاقات الدفع المحفوظة — one-click pay
// تُستخدم في /bookings/new و /payments
// ============================================================
"use client";

import { CreditCard, Star, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSavedCards, useDeleteCard, useSetDefaultCard } from "@/hooks/user/useUserQueries";
import type { SavedCard } from "@/types/user.types";

// ─── Card brand icon ──────────────────────────────────────────
function CardBrandIcon({ brand }: { brand: string }) {
  const lower = brand.toLowerCase();
  if (lower === "visa")
    return <span className="text-blue-600 font-bold text-xs">VISA</span>;
  if (lower === "mastercard")
    return <span className="text-red-500 font-bold text-xs">MC</span>;
  return <span className="text-green-600 font-bold text-xs">MADA</span>;
}

// ─── Single saved card ────────────────────────────────────────
interface SavedCardItemProps {
  card: SavedCard;
  selected?: boolean;
  onSelect?: (card: SavedCard) => void;
  showActions?: boolean;
}

function SavedCardItem({
  card,
  selected,
  onSelect,
  showActions = false,
}: SavedCardItemProps) {
  const deleteCard = useDeleteCard();
  const setDefault = useSetDefaultCard();

  return (
    <div
      onClick={() => onSelect?.(card)}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border transition-all",
        onSelect && "cursor-pointer",
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
        onSelect && !selected && "hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      <div className="flex items-center gap-3">
        {/* اختيار (radio) */}
        {onSelect && (
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 flex-shrink-0",
              selected
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 dark:border-gray-600"
            )}
          >
            {selected && (
              <div className="w-full h-full rounded-full bg-white scale-50" />
            )}
          </div>
        )}
        <CreditCard className="w-5 h-5 text-gray-400" />
        <div>
          <div className="flex items-center gap-2">
            <CardBrandIcon brand={card.brand} />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              •••• {card.last4}
            </span>
            {card.isDefault && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                افتراضية
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            تنتهي {card.expiryMonth}/{card.expiryYear}
          </p>
        </div>
      </div>

      {/* أزرار الإجراءات */}
      {showActions && (
        <div className="flex items-center gap-2">
          {!card.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDefault.mutate(card.id);
              }}
              title="تعيين كافتراضية"
              className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCard.mutate(card.id);
            }}
            title="حذف البطاقة"
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
interface SavedCardsProps {
  /** وضع الاختيار: للدفع بنقرة واحدة */
  mode?: "select" | "manage";
  selectedCardId?: string;
  onSelect?: (card: SavedCard) => void;
  onAddNew?: () => void;
}

export function SavedCards({
  mode = "select",
  selectedCardId,
  onSelect,
  onAddNew,
}: SavedCardsProps) {
  const { data: cards, isLoading } = useSavedCards();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!cards?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-400 mb-3">لا توجد بطاقات محفوظة</p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            إضافة بطاقة جديدة
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <SavedCardItem
          key={card.id}
          card={card}
          selected={selectedCardId === card.id}
          onSelect={mode === "select" ? onSelect : undefined}
          showActions={mode === "manage"}
        />
      ))}
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border 
                     border-dashed border-gray-300 dark:border-gray-700 
                     text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 
                     transition-colors mt-1"
        >
          <Plus className="w-4 h-4" />
          إضافة بطاقة جديدة
        </button>
      )}
    </div>
  );
}