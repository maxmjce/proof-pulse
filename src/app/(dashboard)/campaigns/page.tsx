'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-gray-500">Request testimonials via automated emails</p>
        </div>
        <Button>Create Campaign</Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">
            Create an email campaign to automatically request testimonials from your customers after purchase or project completion.
          </p>
          <Button>Create Your First Campaign</Button>
        </CardContent>
      </Card>
    </div>
  );
}
