import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// TODO: Replace with real data from Supabase
const MOCK_STATS = {
  totalTestimonials: 0,
  pendingApproval: 0,
  activeWidgets: 0,
  totalViews: 0,
};

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to ProofPulse</p>
        </div>
        <Button asChild>
          <Link href="/testimonials">View Testimonials</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{MOCK_STATS.totalTestimonials}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{MOCK_STATS.pendingApproval}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{MOCK_STATS.activeWidgets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Widget Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{MOCK_STATS.totalViews}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/testimonials?action=create-form">
                <span className="font-semibold">Create Collection Form</span>
                <span className="text-xs text-gray-500">Build a form to collect testimonials</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/widgets?action=create">
                <span className="font-semibold">Create Widget</span>
                <span className="text-xs text-gray-500">Build an embeddable testimonial widget</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/campaigns?action=create">
                <span className="font-semibold">Send Campaign</span>
                <span className="text-xs text-gray-500">Request testimonials via email</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
