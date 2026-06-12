import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IoRibbonOutline, IoLocationOutline } from 'react-icons/io5';
import SectionHeading from '../components/ui/SectionHeading';
import { artists } from '../data/artists';
import { IoStarOutline, IoColorPaletteOutline, IoBookOutline } from 'react-icons/io5';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function ArtistsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="bg-cream-50 dark:bg-warm-gray-900 min-h-screen pt-32 pb-24">
      <Helmet>
        <title>Famous Mithila Artists — Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Discover the legendary artists who brought Mithila art to the world stage, from Sita Devi to Dulari Devi." />
      </Helmet>

      <div className="container-custom">
        <SectionHeading title="Masters of Mithila" subtitle="Meet the visionary women who transformed a village ritual into a globally recognized art form." centered accent />

        <div className="mt-20 space-y-24">
          {artists.map((artist, index) => (
            <motion.div key={artist.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="w-full lg:w-1/2 relative group">
                <div className="rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-500">
                  <img src={artist.image} alt={artist.name} className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-black/60 to-transparent opacity-60" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 dark:bg-warm-gray-800/95 backdrop-blur-md rounded-xl p-4 shadow-lg inline-block border border-cream-100/50 dark:border-warm-gray-700/50">
                    <p className="font-display font-bold text-earth-700 dark:text-earth-400">{artist.name}</p>
                    <p className="text-xs font-body text-warm-gray-500 dark:text-warm-gray-400">{artist.born} {artist.died ? `- ${artist.died}` : '(Present)'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <span className="px-3 py-1 bg-earth-500/10 text-earth-600 rounded-full text-xs font-body font-medium uppercase tracking-wider">{artist.style} Style</span>
                  <h2 className="font-display text-4xl font-bold text-charcoal dark:text-white mt-4">{artist.name}</h2>
                </div>

                <div className="flex items-center gap-2 text-warm-gray-500 dark:text-warm-gray-400 font-body text-sm">
                  <IoLocationOutline className="text-earth-500 text-lg" />
                  {artist.village}
                </div>

                <div className="space-y-4 text-warm-gray-600 dark:text-warm-gray-300 font-body text-[15px] leading-relaxed border-l-2 border-earth-500 pl-4 py-1">
                  <p>{artist.bio}</p>
                  {artist.contributions && <p><strong className="text-charcoal dark:text-white font-semibold">Contributions:</strong> {artist.contributions}</p>}
                  {artist.legacy && <p><strong className="text-charcoal dark:text-white font-semibold">Legacy:</strong> {artist.legacy}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Awards */}
                  <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-6 shadow-sm border border-cream-100 dark:border-warm-gray-700/50 h-full">
                    <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                      <IoRibbonOutline className="text-mithila-red text-xl" />
                      Major Awards
                    </h4>
                    <ul className="space-y-2">
                      {artist.awards.map((award, i) => (
                        <li key={i} className="flex items-start gap-2 text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-mithila-orange mt-1.5 flex-shrink-0" />
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Achievements & Famous Works */}
                  <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-6 shadow-sm border border-cream-100 dark:border-warm-gray-700/50 h-full">
                    {artist.achievements && (
                      <div className="mb-4">
                        <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                          <IoStarOutline className="text-earth-500 text-xl" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {artist.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start gap-2 text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-earth-500 mt-1.5 flex-shrink-0" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {artist.famousWorks && (
                      <div>
                        <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-3 text-sm uppercase tracking-wider pt-2 border-t border-cream-50 dark:border-warm-gray-700">
                          <IoColorPaletteOutline className="text-mithila-blue text-xl" />
                          Famous Works
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {artist.famousWorks.map((work, i) => (
                            <span key={i} className="px-2.5 py-1 bg-cream-50 dark:bg-warm-gray-700 text-warm-gray-600 dark:text-warm-gray-300 text-xs rounded-md font-body border border-cream-100 dark:border-warm-gray-600">
                              {work}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
