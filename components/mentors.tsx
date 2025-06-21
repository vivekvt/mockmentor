import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';

const mentors = [
  {
    id: ' Bryan_IT_Sitting_public',
    image: ' /mentors/Bryan_IT_Sitting_public.webp',
    name: 'Bryan',
  },
  {
    id: 'Elenora_IT_Sitting_public',
    image: '/mentors/Elenora_IT_Sitting_public.webp',
    name: 'Elenora',
  },
  {
    id: 'Judy_Teacher_Sitting_public',
    image: '/mentors/Judy_Teacher_Sitting_public.webp',
    name: 'Judy',
  },
  { id: 'June_HR_public', image: '/mentors/June_HR_public.webp', name: 'June' },
  {
    id: 'SilasHR_public',
    image: '/mentors/SilasHR_public.webp',
    name: 'Silas',
  },
  {
    id: 'Wayne_20240711',
    image: '/mentors/Wayne_20240711.webp',
    name: 'Wayne',
  },
];

const MentorCard = ({ image, name }: { image: string; name: string }) => {
  return (
    <figure
      className={cn(
        'relative h-full w-100 cursor-pointer overflow-hidden rounded-xl border',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <img width="100%" height="100%" alt={name} src={image} />
      </div>
      <span className="absolute bottom-0 left-0 right-0 text-center text-sm font-medium bg-black/50 backdrop-blur-sm ">
        {name}
      </span>
    </figure>
  );
};

export function Mentors() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <h2 className="mb-4 text-2xl tracking-tighter font-geist bg-clip-text text-transparent mx-auto md:text-6xl bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
        Our Mentors
      </h2>
      <Marquee pauseOnHover className="[--duration:30s]">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} {...mentor} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} {...mentor} />
        ))}
      </Marquee> */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
