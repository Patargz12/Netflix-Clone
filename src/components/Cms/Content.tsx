interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}

export default function FeatureSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reversed = false,
}: FeatureSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div
          className={`flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${reversed ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white md:text-5xl">{title}</h2>
            <p className="mt-4 text-lg text-white md:text-2xl">{description}</p>
          </div>

          {/* Image Container */}
          <div className="flex-1">
            <div className="relative aspect-video w-full">
              <img src={imageSrc || '/placeholder.svg'} alt={imageAlt} className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
