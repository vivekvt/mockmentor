import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';
import SectionHeading from './section-heading';

export const demos = [
  {
    image: '/demos/aditya.png',
    name: 'Aditya',
  },
  {
    image: '/demos/Dinojan.png',
    name: 'Dinojan',
  },
  {
    image: '/demos/jonathan.png',
    name: 'Jonathan',
  },
  {
    image: '/demos/nehtteen.png',
    name: 'Nehtteen',
  },
  {
    image: '/demos/arjun.png',
    name: 'Arjun',
  },
  {
    image: '/demos/sai.png',
    name: 'Sai',
  },
  {
    image: '/demos/vivek.png',
    name: 'Vivek',
  },
];

const DemoCard = ({ image, name }: { image: string; name: string }) => {
  return (
    <figure
      className={cn(
        'relative h-full w-67 lg:w-100 cursor-pointer overflow-hidden rounded-xl border',
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

export function DemosSection() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <SectionHeading
        title="Demos"
        subtitle="Demos of the interviews"
        className="pt-16 pb-6"
      />
      <Marquee pauseOnHover className="[--duration:30s]">
        {demos.map((demo) => (
          <DemoCard key={demo.name} {...demo} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
