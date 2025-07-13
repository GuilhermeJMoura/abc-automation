const images = [
  { src: '/landing/partners/icp.png', alt: 'Internet Computer' },
  { src: '/landing/partners/xrp.png', alt: 'XRP' },
  { src: '/landing/partners/chainlink.png', alt: 'Chainlink' },
  { src: '/landing/partners/avax.png', alt: 'Avalanche' },
  { src: '/landing/partners/stacks.png', alt: 'Stacks' },
  { src: '/landing/partners/morpheus.png', alt: 'Morpheus' },
  { src: '/landing/partners/inteli.png', alt: 'Inteli' },
  { src: '/landing/partners/ucla.png', alt: 'UCLA Blockchain' },
  { src: '/landing/partners/ucla.webp', alt: 'UCLA' },
  { src: '/landing/partners/lmu.png', alt: 'LMU' },
]

const Partners = () => {
  return (
    <div className="mt-12 lg:mt-32">
      <h2 className="text-landing-title text-center text-2xl lg:text-3xl lg:text-4xl px-14 mb-2">Proudly Colaborating with:</h2>
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex my-8 gap-16 pr-16">
          {images.map((image, index) => (
            <div key={index} className="min-w-[150px]">
              <img src={image.src} alt={image.alt} className="h-20 sm:h-32 lg:h-24 w-auto object-contain" />
            </div>
          ))}
          {images.map((image, index) => (
            <div key={index} className="min-w-[150px]">
              <img src={image.src} alt={image.alt} className="h-20 sm:h-32 lg:h-24 w-auto object-contain" />
            </div>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex my-8 gap-16 pr-16">
          {images.map((image, index) => (
            <div key={`second-${index}`} className="min-w-[150px]">
              <img src={image.src} alt={image.alt} className="h-20 sm:h-32 lg:h-24 w-auto object-contain" />
            </div>
          ))}
          {images.map((image, index) => (
            <div key={`second-${index}`} className="min-w-[150px]">
              <img src={image.src} alt={image.alt} className="h-20 sm:h-32 lg:h-24 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Partners
