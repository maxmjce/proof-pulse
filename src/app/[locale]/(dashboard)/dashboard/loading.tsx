import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the layout in dashboard/page.tsx:
//   - Page heading row (title + subtitle + button)
//   - 4-column stats grid
//   - Quick actions card (3 buttons)
//   - Recent testimonials card (5 rows)

export default function DashboardLoading() {
  return (
    <div>
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Stats grid — 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <Skeleton className="h-4 w-28 mb-4" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>

      {/* Quick actions card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-2">
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-3 w-36 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent testimonials card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-3 w-16 ml-4 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
