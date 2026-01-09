'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const partners = [
  // Placeholder logos - in a real app these would come from an API or be static assets
  { name: 'Partner 1', logo: '/images/partners/1.png' },
  { name: 'Partner 2', logo: '/images/partners/2.png' },
  { name: 'Partner 3', logo: '/images/partners/3.png' },
  { name: 'Partner 4', logo: '/images/partners/4.png' },
  { name: 'Partner 5', logo: '/images/partners/5.png' },
  { name: 'Partner 6', logo: '/images/partners/6.png' },
]

// Duplicate partners to create seamless loop
const marqueePartners = [...partners, ...partners, ...partners]

export default function PartnersMarquee() {
  return (
    <div className="w-full overflow-hidden bg-white py-8 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-500">
          شركاء النجاح والتوظيف
        </h3>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-12 items-center py-4"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {marqueePartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-32 h-20 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              {/* Using a placeholder div if image doesn't exist */}
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                 <span className="text-xs text-gray-400 font-medium">{partner.name}</span>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Overlays for smooth fade effect */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </div>
  )
}
