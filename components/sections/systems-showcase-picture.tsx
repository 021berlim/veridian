interface SystemsShowcasePictureProps {
  className?: string
}

export function SystemsShowcasePicture({
  className = "w-full h-auto",
}: SystemsShowcasePictureProps) {
  return (
    <picture>
      <source
        media="(max-width: 767px)"
        srcSet="/images/sistemas-mobile-10apps-mobile.avif"
        type="image/avif"
      />
      <source
        media="(max-width: 767px)"
        srcSet="/images/sistemas-mobile-10apps-mobile.webp"
        type="image/webp"
      />
      <source srcSet="/images/sistemas-mobile-10apps.avif" type="image/avif" />
      <source srcSet="/images/sistemas-mobile-10apps.webp" type="image/webp" />
      <img
        src="/images/sistemas-mobile-10apps.png"
        alt="Coleção de 10 aplicativos e sistemas mobile criados pela Zuse Labs"
        loading="lazy"
        decoding="async"
        width={1920}
        height={1072}
        className={className}
      />
    </picture>
  )
}
