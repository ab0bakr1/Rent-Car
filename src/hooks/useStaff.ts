import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi, type Staff, type StaffFormData } from '@/utils/cars-service';

export const STAFF_QUERY_KEY = ['staff'] as const;

export function useStaff() {
  const queryClient = useQueryClient();

  // ── GET all ───────────────────────────────────────────────────────────────
  const { data: staffList = [], isLoading, isError } = useQuery<Staff[]>({
    queryKey: STAFF_QUERY_KEY,
    queryFn: staffApi.getAll,
  });

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation<Staff, Error, { id: string; data: StaffFormData }>({
    mutationFn: ({ id, data }) => staffApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Staff[]>(STAFF_QUERY_KEY, (prev = []) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    },
  });

  // ── DELETE ────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: staffApi.remove,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Staff[]>(STAFF_QUERY_KEY, (prev = []) =>
        prev.filter((s) => s.id !== deletedId)
      );
    },
  });

  return {
    staffList,
    isLoading,
    isError,

    updateStaff:  updateMutation.mutateAsync,
    isUpdating:   updateMutation.isPending,

    deleteStaff:  deleteMutation.mutateAsync,
    isDeleting:   deleteMutation.isPending,
  };
}