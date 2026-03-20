import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'E-Jarnauld Soft | Cybersécurité & IT Douala',
    short_name: 'E-Jarnauld',
    description: 'Infrastructure réseau, cloud et infogérance sur-mesure pour professionnels.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ee1c25',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
