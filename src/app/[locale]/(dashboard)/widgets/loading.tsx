import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the layout in widgets/page.tsx:
//   - Page heading row (title + subtitle + create button)
//   - 2-column grid of 4 widget cards
//     Each card: name + type badge in header, meta row + action buttons in content

export default function WidgetsLoading() {
  return (
    <div>
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Widget cards grid — 2 columns, 4 cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="p-6 pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
            {/* Card content */}
            <div className="px-6 pb-6 space-y-3">
              {/* Meta row (columns / max testimonials) */}
              <div className="flex gap-3">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              {/* Action buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
