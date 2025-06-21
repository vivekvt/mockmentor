import * as React from 'react';
import { cn } from '@/lib/utils';
import { Brain, MessageCircle, Users, Target } from 'lucide-react';
import SectionHeading from './ui/section-heading';

interface FeaturesSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const defaultFeatures = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI-Powered Mock Interviews',
    description:
      'Experience realistic interview scenarios powered by advanced AI technology that adapts to your responses and provides intelligent follow-up questions.',
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'Real-time Feedback',
    description:
      'Get instant feedback on your answers, body language, and communication skills to improve your interview performance immediately.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'AI Avatar Coaches',
    description:
      'Practice with lifelike AI avatars that simulate real interview experiences with diverse coaching styles and industry-specific expertise.',
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Personalized Practice Sessions',
    description:
      'Tailored interview questions based on your target role, experience level, and industry to maximize your preparation effectiveness.',
  },
];

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-500/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />
      <div className="relative rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-8 transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-700/50 hover:shadow-xl hover:shadow-purple-500/10">
        <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-transparent p-3 dark:from-purple-400/10 dark:via-pink-400/10">
          <div className="text-purple-600 dark:text-purple-400">{icon}</div>
        </div>
        <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const FeaturesSection = React.forwardRef<HTMLDivElement, FeaturesSectionProps>(
  (
    {
      className,
      title = 'Powerful Features',
      subtitle = 'Everything you need to ace your next interview',
      features = defaultFeatures,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative pb-20', className)} ref={ref} {...props}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-black" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <SectionHeading title={title} subtitle={subtitle} />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

FeaturesSection.displayName = 'FeaturesSection';

export { FeaturesSection, type FeaturesSectionProps };
