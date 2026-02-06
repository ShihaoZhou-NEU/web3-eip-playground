interface PageBannerProps {
  title: string;
  subtitle?: string;
  imagePath?: string;
}

export default function PageBanner({
  title,
  subtitle,
  imagePath,
}: PageBannerProps) {
  const defaultBg = "/images/banner-background.png";

  return (
    <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
      {/* Background Image */}
      <img
        src={imagePath || defaultBg}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 pixel-font drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 pixel-font drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
