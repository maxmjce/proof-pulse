'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO: Fetch from Supabase
export default function WidgetsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Widgets</h1>
          <p className="text-gray-500">Create embeddable widgets for your website</p>
        </div>
        <Button>Create Widget</Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
          <p className="text-gray-500 mb-4">
            Create a widget to display your testimonials on any website with a simple embed code.
          </p>
          <Button>Create Your First Widget</Button>
        </CardContent>
      </Card>

      {/* Widget Types Preview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Widget Types</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'Carousel', desc: 'Auto-rotating testimonial slider' },
            { type: 'Wall', desc: 'Masonry grid of testimonials' },
            { type: 'Badge', desc: 'Compact rating badge with count' },
            { type: 'Minimal', desc: 'Single featured testimonial' },
          ].map((w) => (
            <Card key={w.type}>
              <CardHeader>
                <CardTitle className="text-base">{w.type}</CardTitle>
                <CardDescription>{w.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  Preview
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
