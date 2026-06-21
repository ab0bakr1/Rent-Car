"use client";

import { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { StaffModal, type ModalMode } from "@/components/organisms/admin/Modal/StaffModal";
import { staffFullName, type Staff, type StaffFormData } from "@/utils/cars-service";

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Avatar({ staff }: { staff: Staff }) {
  const initials = [staff.firstName?.[0], staff.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 select-none">
      {initials}
    </span>
  );
}

function RoleBadge({ role }: { role?: string }) {
  const styles: Record<string, string> = {
    SUPER_ADMIN: "bg-violet-100 text-violet-700 ring-violet-200",
    ADMIN:       "bg-blue-100  text-blue-700  ring-blue-200",
    USER:        "bg-gray-100  text-gray-600  ring-gray-200",
  };
  const cls = styles[(role ?? "").toUpperCase()] ?? styles.USER;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {role ?? "—"}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  staff, isLoading, onClose, onConfirm,
}: { staff: Staff | null; isLoading: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!staff) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Remove Staff Member</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-medium text-gray-700">{staffFullName(staff)}</span>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
            {isLoading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const { staffList, isLoading, updateStaff, isUpdating, deleteStaff, isDeleting } = useStaff();

  const [modalMode, setModalMode]       = useState<ModalMode>(null);
  const [selectedStaff, setSelected]    = useState<Staff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [search, setSearch]             = useState("");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEdit = async (data: StaffFormData) => {
    if (!selectedStaff) return;
    await updateStaff({ id: selectedStaff.id, data });
    setModalMode(null);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteStaff(deleteTarget.id);
    setDeleteTarget(null);
  };

  const openEdit = (staff: Staff) => {
    setSelected(staff);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelected(null);
  };

  // ── Search ────────────────────────────────────────────────────────────────

  const q = search.toLowerCase();
  const filtered = staffList.filter((s) =>
    staffFullName(s).toLowerCase().includes(q) ||
    s.email?.toLowerCase().includes(q) ||
    s.role?.toLowerCase().includes(q)
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <section className="ds-container ds-bg-alt min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="sm:flex sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight ds-text-primary">Staff Management</h1>
              <p className="mt-1 text-sm ds-text-secondary">Manage your team members and their access levels.</p>
            </div>
          </div>

          {/* Search + Count */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm w-full">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or role…"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <p className="shrink-0 text-sm text-gray-500">
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {isLoading ? (
              <Spinner />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="h-12 w-12 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">No staff members found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {search ? "Try a different search term." : "No staff members available."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Member", "Email", "Phone", "Role", "Actions"].map((h) => (
                        <th key={h} scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${h === "Actions" ? "text-right" : ""}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filtered.map((staff) => (
                      <tr key={staff.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar staff={staff} />
                            <span className="text-sm font-medium text-gray-900">
                              {staffFullName(staff)}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {staff.email ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {staff.phone ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <RoleBadge role={staff.role} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(staff)}
                              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(staff)}
                              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <StaffModal
        mode={modalMode}
        staff={selectedStaff}
        isLoading={isUpdating}
        onClose={closeModal}
        onSubmit={handleEdit}
      />

      {/* Delete Modal */}
      <DeleteModal
        staff={deleteTarget}
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}