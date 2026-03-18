import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the layout in campaigns/page.tsx:
//   - Page heading row (title + subtitle + create button)
//   - Vertical list of 3 campaign cards
//     Each card: name + recipient info + status badge in header,
//                subject line + created date + action buttons in content

export default function CampaignsLoading() {
  return (
    <div>
      {/* Page heading */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="p-6 pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-44" />
                  {/* "X recipients · Form: Y" descriptor */}
                  <Skeleton className="h-3.5 w-52" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
            {/* Card content */}
            <div className="px-6 pb-6 space-y-2">
              {/* Subject line */}
              <Skeleton className="h-4 w-80" />
              {/* Created / sent date */}
              <Skeleton className="h-3 w-48" />
              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
