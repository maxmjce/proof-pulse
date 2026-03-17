export type Plan = 'free' | 'creator' | 'business';
export type TestimonialStatus = 'pending' | 'approved' | 'rejected';
export type WidgetType = 'carousel' | 'wall' | 'badge' | 'minimal';
export type CampaignStatus = 'draft' | 'scheduled' | 'sent';
export type TestimonialSource = 'form' | 'import' | 'manual';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  testimonial_count: number;
  created_at: string;
}

export interface Form {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  title: string;
  description: string | null;
  questions: FormQuestion[];
  thank_you_message: string;
  collect_video: boolean;
  collect_rating: boolean;
  branding: FormBranding | null;
  is_active: boolean;
  created_at: string;
}

export interface FormQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'rating';
  required: boolean;
}

export interface FormBranding {
  primary_color: string;
  background_color: string;
  logo_url: string | null;
}

export interface Testimonial {
  id: string;
  form_id: string;
  user_id: string;
  author_name: string;
  author_email: string | null;
  author_title: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  video_url: string | null;
  status: TestimonialStatus;
  tags: string[];
  is_featured: boolean;
  source: TestimonialSource;
  created_at: string;
}

export interface Widget {
  id: string;
  user_id: string;
  name: string;
  type: WidgetType;
  config: WidgetConfig;
  testimonial_ids: string[] | null;
  filter_tags: string[] | null;
  show_branding: boolean;
  is_active: boolean;
  created_at: string;
}

export interface WidgetConfig {
  primary_color: string;
  background_color: string;
  text_color: string;
  border_radius: number;
  show_rating: boolean;
  show_avatar: boolean;
  show_date: boolean;
  animation: 'fade' | 'slide' | 'none';
  columns: number;
  max_testimonials: number;
}

export interface Campaign {
  id: string;
  user_id: string;
  form_id: string;
  name: string;
  subject: string;
  body: string;
  recipient_emails: string[];
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface PricingTier {
  name: string;
  plan: Plan;
  price: number;
  testimonials: number | null; // null = unlimited
  forms: number | null;
  widgets: number | null;
  features: string[];
}
