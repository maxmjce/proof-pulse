'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Widget, WidgetType } from '@/types';
import { getEmbedCode } from '@/lib/utils';

const WIDGET_TYPES: { type: WidgetType; labelKey: string; descKey: string }[] = [
  { type: 'carousel', labelKey: 'carousel', descKey: 'carouselDesc' },
  { type: 'wall', labelKey: 'wall', descKey: 'wallDesc' },
  { type: 'badge', labelKey: 'badge', descKey: 'badgeDesc' },
  { type: 'minimal', labelKey: 'minimal', descKey: 'minimalDesc' },
];

export default function WidgetsPage() {
  const t = useTranslations('widgets');
  const tc = useTranslations('common');

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [widgetName, setWidgetName] = useState('');
  const [widgetType, setWidgetType] = useState<WidgetType>('carousel');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Config state
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1f2937');
  const [borderRadius, setBorderRadius] = useState(12);
  const [columns, setColumns] = useState(3);
  const [maxTestimonials, setMaxTestimonials] = useState(9);
  const [showRating, setShowRating] = useState(true);
  const [showBranding, setShowBranding] = useState(true);
  const [createError, setCreateError] = useState('');

  const fetchWidgets = useCallback(async () => {
    const res = await fetch('/api/widgets');
    if (res.ok) {
      const json = await res.json();
      setWidgets(json.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWidgets();
  }, [fetchWidgets]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'create') setShowCreator(true);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    const res = await fetch('/api/widgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: widgetName,
        type: widgetType,
        config: {
          primary_color: primaryColor,
          background_color: bgColor,
          text_color: textColor,
          border_radius: borderRadius,
          show_rating: showRating,
          show_avatar: true,
          show_date: true,
          animation: 'fade',
          columns,
          max_testimonials: maxTestimonials,
        },
        show_branding: showBranding,
      }),
    });
    if (res.ok) {
      setWidgetName('');
      setShowCreator(false);
      fetchWidgets();
    } else {
      const json = await res.json();
      setCreateError(typeof json.error === 'string' ? json.error : 'Failed to create widget.');
    }
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t('deleteConfirm'))) return;
    const res = await fetch(`/api/widgets/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setWidgets((prev) => prev.filter((w) => w.id !== id));
      if (selectedWidget?.id === id) setSelectedWidget(null);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/widgets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !isActive }),
    });
    if (res.ok) {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, is_active: !isActive } : w))
      );
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setShowCreator(true)}>{t('createWidget')}</Button>
      </div>

      {/* Widget Creator */}
      {showCreator && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('createWidget')}</CardTitle>
            <CardDescription>{t('configureDisplay')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('widgetName')} *</label>
                <Input
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder={t('widgetNamePlaceholder')}
                  required
                />
              </div>

              {/* Widget Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('widgetType')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {WIDGET_TYPES.map((wt) => (
                    <button
                      key={wt.type}
                      type="button"
                      onClick={() => setWidgetType(wt.type)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        widgetType === wt.type
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{t(wt.labelKey)}</p>
                      <p className="text-xs text-gray-500">{t(wt.descKey)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Config */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('primaryColor')}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('backgroundColor')}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('textColor')}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('borderRadius')}</label>
                  <Input
                    type="number"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    min={0}
                    max={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('columns')}</label>
                  <Input
                    type="number"
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value))}
                    min={1}
                    max={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('maxTestimonials')}</label>
                  <Input
                    type="number"
                    value={maxTestimonials}
                    onChange={(e) => setMaxTestimonials(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showRating}
                    onChange={(e) => setShowRating(e.target.checked)}
                    className="rounded"
                  />
                  {t('showRatings')}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showBranding}
                    onChange={(e) => setShowBranding(e.target.checked)}
                    className="rounded"
                  />
                  {t('showBranding')}
                </label>
              </div>

              {createError && <p className="text-sm text-red-600">{createError}</p>}

              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? t('creating') : t('createWidget')}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowCreator(false); setCreateError(''); }}>
                  {tc('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Widget Detail View */}
      {selectedWidget && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedWidget.name}</CardTitle>
                <CardDescription>{t('embedCode')} &amp; {t('preview')}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedWidget(null)}>
                {tc('close')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('embedCodeLabel')}</label>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {getEmbedCode(selectedWidget.id)}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getEmbedCode(selectedWidget.id), selectedWidget.id)}
                >
                  {copied === selectedWidget.id ? tc('copied') : tc('copy')}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('preview')}</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={`/embed/${selectedWidget.id}`}
                  className="w-full border-none"
                  style={{ minHeight: '300px' }}
                  title="Widget Preview"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widget List */}
      {widgets.length === 0 && !showCreator ? (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">{t('noWidgets')}</h3>
            <p className="text-gray-500 mb-4">{t('noWidgetsDesc')}</p>
            <Button onClick={() => setShowCreator(true)}>{t('createFirstWidget')}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {widgets.map((widget) => (
            <Card key={widget.id} className="cursor-pointer hover:border-gray-300 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{widget.name}</CardTitle>
                    <CardDescription className="capitalize">{widget.type} {t('widget')}</CardDescription>
                  </div>
                  <Badge variant={widget.is_active ? 'success' : 'secondary'}>
                    {widget.is_active ? t('active') : t('inactive')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>{t('columns')}: {widget.config?.columns || 3}</span>
                  <span>Max: {widget.config?.max_testimonials || 9}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedWidget(widget)}>
                    {t('embedCode')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(widget.id, widget.is_active)}>
                    {widget.is_active ? t('deactivate') : t('activate')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(widget.id)}
                  >
                    {tc('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Widget Types Reference */}
      {widgets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">{t('widgetTypes')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WIDGET_TYPES.map((w) => (
              <Card key={w.type}>
                <CardHeader>
                  <CardTitle className="text-base">{t(w.labelKey)}</CardTitle>
                  <CardDescription>{t(w.descKey)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
