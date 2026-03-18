import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the layout in testimonials/page.tsx:
//   - Page heading row (title + subtitle)
//   - Tab bar (Testimonials | Forms)
//   - Filter button row (All | Pending | Approved | Rejected)
//   - 3 testimonial card skeletons

export default function TestimonialsLoading() {
  return (
    <div>
      {/* Page heading */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <div className="px-4 py-2">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="px-4 py-2">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {[52, 44, 52, 44].map((w, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" style={{ width: `${w * 2}px` }} />
        ))}
      </div>

      {/* Testimonial cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="p-6 pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
            {/* Card content */}
            <div className="px-6 pb-6 space-y-3">
              {/* Star rating row */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Skeleton key={s} className="h-3.5 w-3.5 rounded-sm" />
                ))}
              </div>
              {/* Testimonial text lines */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              {/* Tags row */}
              <div className="flex gap-1.5 mt-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
