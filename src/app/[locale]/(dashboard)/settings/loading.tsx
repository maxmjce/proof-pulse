import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the layout in settings/page.tsx (max-w-2xl column):
//   - Page title
//   - Profile card: title + desc, then 3 labelled inputs + save button
//   - Plan & Billing card: title + desc, current plan banner, upgrade option row
//   - Danger Zone card: title + desc + delete button

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl">
      {/* Page title */}
      <Skeleton className="h-8 w-24 mb-8" />

      {/* Profile card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
        <div className="p-6 space-y-1.5">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Full name field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Company name field */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Email field (disabled) */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Plan & Billing card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
        <div className="p-6 space-y-1.5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Current plan banner */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-52" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
          {/* Upgrade option row */}
          <div>
            <Skeleton className="h-4 w-36 mb-3" />
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3.5 w-20" />
                <div className="mt-2 space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-sm" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  ))}
                </div>
              </div>
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone card */}
      <div className="rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="p-6 space-y-1.5">
          <Skeleton className="h-6 w-28 bg-red-100" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="px-6 pb-6 space-y-4">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-10 w-32 rounded-lg bg-red-100" />
        </div>
      </div>
    </div>
  );
}
