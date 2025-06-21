import { HeroSection } from '@/components/hero-section';
import { Mentors } from '@/components/mentors';
import Navbar from '@/components/navbar';
import { appConfig } from '@/lib/appConfig';

export default function Home() {
  return (
    <div className="relative">
      <div className="bg-transparent h-10 absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <HeroSection
        className="h-screen flex items-center justify-center"
        title={`Welcome to ${appConfig?.title}`}
        subtitle={{
          regular: 'AI-Powered ',
          gradient: 'Mock Interview',
        }}
        description="Practice real-world interviews with instant feedback anytime, anywhere"
        ctaText="Get Started"
        ctaHref="/interview/new"
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: '#4a4a4a',
          darkLineColor: '#2a2a2a',
        }}
      />
      <Mentors />
    </div>
  );
}
