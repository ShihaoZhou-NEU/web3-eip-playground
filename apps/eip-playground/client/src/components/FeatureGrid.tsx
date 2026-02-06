import { Link } from "wouter";
import { eips } from "@/data/eips";

interface FeatureCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundImage: string;
  gradient: string;
  icon?: string;
}

function FeatureCard({
  id,
  title,
  subtitle,
  description,
  image,
  backgroundImage,
  gradient,
  icon,
}: FeatureCardProps) {
  return (
    <Link
      href={`/eip/${id}`}
      className="block group h-[260px] sm:h-[300px] lg:h-[320px] perspective-1000 cursor-pointer"
    >
      <div
        className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180"
        style={{ borderRadius: "10px" }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden card-pixel overflow-hidden ${gradient}`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 flex flex-col h-full gap-4 p-4">
            <div className="mt-auto space-y-2">
              <h3 className="text-lg md:text-xl text-white text-shadow-pixel">
                {title}
              </h3>
              <p className="font-mono text-white/90 text-sm font-bold">
                {subtitle}
              </p>
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 card-pixel overflow-hidden ${gradient}`}
          style={{ borderRadius: "10px" }}
        >
          <div className="absolute inset-0 bg-black/80" />

          <div className="relative z-10 flex flex-col h-full justify-center items-center text-center p-6 gap-4">
            <h3 className="text-xl text-primary text-shadow-pixel">{title}</h3>
            <p className="font-mono text-white text-sm leading-relaxed">
              {description}
            </p>
            <button className="btn-pixel btn-pixel-accent mt-4 text-xs">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeatureGrid() {
  const featureOrder = ["eip-1559", "eip-7702", "erc-8004"];
  const features = featureOrder
    .map(id => eips[id])
    .filter(Boolean)
    .map(eip => ({
      id: eip.id,
      title: eip.title,
      subtitle: eip.subtitle,
      description: eip.description,
      image: eip.image,
      backgroundImage: eip.image,
      gradient: eip.gradient,
      icon: eip.icon,
    }));

  return (
    <section className="container py-12 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
