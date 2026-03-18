import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { count: totalTestimonials } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: pendingCount } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending');

  const { count: activeWidgets } = await supabase
    .from('widgets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true);

  const { count: formCount } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: recentTestimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    totalTestimonials: totalTestimonials ?? 0,
    pendingApproval: pendingCount ?? 0,
    activeWidgets: activeWidgets ?? 0,
    activeForms: formCount ?? 0,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-500">
            {t('welcomeBack', { name: profile?.full_name || '' })}
          </p>
        </div>
        <Button asChild>
          <Link href="/testimonials">{t('viewTestimonials')}</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('totalTestimonials')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalTestimonials}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('pendingApproval')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingApproval}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('activeWidgets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeWidgets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('collectionForms')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeForms}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/testimonials?tab=forms&action=create">
                <span className="font-semibold">{t('createForm')}</span>
                <span className="text-xs text-gray-500">{t('createFormDesc')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/widgets?action=create">
                <span className="font-semibold">{t('createWidget')}</span>
                <span className="text-xs text-gray-500">{t('createWidgetDesc')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link href="/campaigns?action=create">
                <span className="font-semibold">{t('sendCampaign')}</span>
                <span className="text-xs text-gray-500">{t('sendCampaignDesc')}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Testimonials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('recentTestimonials')}</CardTitle>
            {(recentTestimonials?.length ?? 0) > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/testimonials">{t('viewAll')}</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!recentTestimonials || recentTestimonials.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              {t('noTestimonialsYet')}
            </p>
          ) : (
            <div className="space-y-4">
              {recentTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{testimonial.author_name}</p>
                      <Badge variant={
                        testimonial.status === 'approved' ? 'success' :
                        testimonial.status === 'pending' ? 'warning' : 'destructive'
                      }>
                        {testimonial.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{testimonial.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 ml-4 shrink-0">{formatDate(testimonial.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
