import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  IoRibbonOutline,
  IoLocationOutline,
  IoStarOutline,
  IoColorPaletteOutline,
  IoBookOutline,
  IoWarningOutline,
  IoPersonOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import SectionHeading from '../components/ui/SectionHeading';

// ─── VERIFIED CLOUDINARY / WIKIMEDIA ASSETS ──────────────────────────────────
// Only images with confirmed identity and verified license are used as portraits.
// For artists where no verified portrait exists, we show a deliberate placeholder
// instead of a misleading substitute image.

const VERIFIED_PORTRAITS = {
  'mahasundari-devi': {
    url: 'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artists/artist_mahasundari_devi.jpg',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Devi6.JPG',
    confidence: 'HIGH — Artist uploaded image to Wikimedia under her own username (user:Mahasundari_devi)',
    attribution: 'Mahasundari Devi (own work) via Wikimedia Commons CC BY 3.0',
  },
  'baua-devi': {
    url: 'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artists/artist_baua_devi.jpg',
    license: 'GODL-India (Government Open Data License)',
    source: 'https://commons.wikimedia.org/wiki/File:The_President,_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Smt._Baoa_Devi.jpg',
    confidence: 'HIGH — Official government photograph from Padma Shri investiture ceremony, Rashtrapati Bhavan, 30 March 2017',
    attribution: 'Ministry of Communications & IT, Government of India (GODL-India)',
    caption: 'Receiving the Padma Shri from President Pranab Mukherjee, March 2017',
  },
  'dulari-devi': {
    url: 'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artists/artist_dulari_devi.jpg',
    license: 'GODL-India (Government Open Data License)',
    source: 'https://commons.wikimedia.org/wiki/File:Dulari_Devi.jpg',
    confidence: 'HIGH — From official Rashtrapati Bhavan Twitter account (@rashtrapatibhvn), Government of India',
    attribution: 'Rashtrapati Bhavan, Government of India (GODL-India)',
  },
  // Portraits NOT available for these artists in any verified public archive:
  'sita-devi': null,
  'ganga-devi': null,
  'jagdamba-devi': null,
};

// ─── ARTIST DATA ─────────────────────────────────────────────────────────────
// All factual claims sourced and documented in src/data/SourceRegistry.md
const artists = [
  {
    id: 'sita-devi',
    name: 'Sita Devi',
    born: '1914',
    died: '2005',
    village: 'Jitwarpur, Madhubani, Bihar',
    style: 'Bharni',
    portraitStatus: 'unavailable',
    bio: 'Sita Devi was among the pioneering women of Jitwarpur who, in the early 1960s, transferred traditional wall-painting rituals onto handmade paper at the encouragement of the All India Handicrafts Board — an act that transformed a private ritual into a publicly celebrated art form.',
    contributions:
      'She became one of the first artists to professionally sell Madhubani paintings on paper, helping create an economic livelihood for women in the region. She lobbied for infrastructure — roads, schools, electricity — in Jitwarpur village.',
    legacy:
      'Her works are held in major international collections including the Victoria and Albert Museum (London) and the Musée du Quai Branly (Paris). Known locally as the "mother" of Jitwarpur.',
    awards: [
      'Padma Shri — 1981 (Government of India)',
      'Bihar Ratna Samman — 1984',
      'Shilp Guru — 2006 (posthumous, Ministry of Textiles)',
      'National Award — 1975',
    ],
    achievements: [
      'First to commercialise paper-based Madhubani paintings',
      'International exhibitions across Europe and the US',
      'Collections in V&A London and Musée du Quai Branly',
    ],
    famousWorks: ['Radha Krishna', 'The World Trade Center', 'Kadam Tree'],
    sources: [
      'Padma Award Citation, Government of India, 1981',
      'Shilp Guru Records, Ministry of Textiles, 2006',
      'V&A Museum Collection Records',
    ],
  },
  {
    id: 'ganga-devi',
    name: 'Ganga Devi',
    born: '1928',
    died: '1991',
    village: 'Rasidpur, Madhubani, Bihar',
    style: 'Kachni (Fine Line)',
    portraitStatus: 'unavailable',
    bio: 'Ganga Devi was a master of the Kachni (fine-line) style. After facing profound personal adversity — including the illness of her son — she channeled her experience into a groundbreaking autobiographical series called the "America Series," documenting her visit to the United States through the visual vocabulary of Mithila art.',
    contributions:
      'She pioneered the use of Mithila art as a vehicle for personal and contemporary narrative — a radical departure from the exclusively mythological subject matter of her era. She painted the celebrated Kohbar Ghar mural at the National Crafts Museum, New Delhi.',
    legacy:
      'The "America Series" is considered a landmark in folk art history, blending personal memoir with the ancient Kachni technique. Her work demonstrated that Mithila painting could absorb the modern world without losing its identity.',
    awards: [
      'Padma Shri — 1984 (Government of India)',
      'National Master Craftsman Award',
    ],
    achievements: [
      'Kohbar Ghar mural at National Crafts Museum, New Delhi',
      '"America Series" — first documented travelogue in Mithila art',
      'International exhibitions at the Smithsonian Institution',
    ],
    famousWorks: ['"America Series"', 'Kohbar Ghar mural', '"Cycle of Life"'],
    sources: [
      'Padma Award Citation, Government of India, 1984',
      'National Crafts Museum records, New Delhi',
      'Sahapedia.org — Ganga Devi profile',
    ],
  },
  {
    id: 'jagdamba-devi',
    name: 'Jagdamba Devi',
    born: '1901',
    died: '1984',
    village: 'Jitwarpur, Madhubani, Bihar',
    style: 'Bharni (Traditional)',
    portraitStatus: 'unavailable',
    bio: 'Jagdamba Devi was the first Mithila artist to receive the National Award and the Padma Shri — establishing the art form\'s legitimacy in the eyes of the national government. Orphaned at a young age, she developed a profound and intuitive approach to painting that was deeply rooted in ritual tradition.',
    contributions:
      'Played a central role in the 1960s transition from wall paintings to paper. She was particularly noted for her mastery of natural pigments, famously preparing her signature red colour using a mixture of gum and goat\'s milk. This technique was documented by the All India Handicrafts Board.',
    legacy:
      'As the first formally recognised Madhubani artist, her receiving the Padma Shri in 1975 permanently elevated the status of all folk artists in India and opened the door for subsequent national recognition of the form.',
    awards: [
      'National Award — 1970 (Ministry of Textiles)',
      'Padma Shri — 1975 (Government of India)',
    ],
    achievements: [
      'First Madhubani artist to receive the National Award',
      'First Madhubani artist to receive the Padma Shri',
      'Documented use of traditional natural pigments (gum + goat milk base)',
    ],
    famousWorks: ['Dashavatar series', 'Krishna Leela', 'Traditional Kohbar'],
    sources: [
      'National Award Citation, Ministry of Textiles, 1970',
      'Padma Award Citation, Government of India, 1975',
      'All India Handicrafts Board documentation',
    ],
  },
  {
    id: 'mahasundari-devi',
    name: 'Mahasundari Devi',
    born: '1922',
    died: '2013',
    village: 'Ranti, Madhubani, Bihar',
    style: 'Bharni & Kachni',
    portraitStatus: 'verified',
    bio: 'Mahasundari Devi broke a powerful social convention in 1961 when she abandoned the purdah system to practice her art publicly — a radical act in rural Bihar at the time. She was not only a prolific artist but also a social organiser who channeled art as a tool for women\'s emancipation.',
    contributions:
      'Founded the Mithila Hastashilp Kalakar Audyogki Sahyog Samiti, an artist\'s cooperative in Ranti that provided rural women with economic independence through art. She worked in multiple mediums — Madhubani painting, sikki grasswork, and papier-mâché.',
    legacy:
      'The cooperative she founded continues to sustain livelihoods in the region. Her courage in renouncing purdah inspired a generation of women in Mithila to claim public space through artistic practice.',
    awards: [
      'National Award — 1982 (Ministry of Textiles)',
      'Tulsi Samman — 1995 (Madhya Pradesh Government)',
      'Shilp Guru — 2007 (Ministry of Textiles)',
      'Padma Shri — 2011 (Government of India)',
    ],
    achievements: [
      'Founded women\'s artist cooperative in Ranti',
      'Renounced purdah in 1961 to practice art publicly',
      'Multi-disciplinary: painting, grasswork, papier-mâché',
    ],
    famousWorks: ['Kohbar series', 'Sita Swayamvar', 'Madhubani railway station mural'],
    sources: [
      'Padma Award Citation, Government of India, 2011',
      'Shilp Guru Citation, Ministry of Textiles, 2007',
      'Sahapedia.org — Mahasundari Devi profile',
    ],
  },
  {
    id: 'baua-devi',
    name: 'Baua Devi',
    born: '1940',
    died: null,
    village: 'Jitwarpur, Madhubani, Bihar',
    style: 'Bharni',
    portraitStatus: 'verified',
    bio: 'Baua Devi was one of the youngest members of the founding group of artists who transferred Mithila wall paintings to paper in the 1960s. Her work became increasingly experimental over decades — she pushed the Bharni style into new territory by working at large scale and reinterpreting serpent (naga) iconography from a female perspective.',
    contributions:
      'In 1989, her work was selected for the landmark "Magiciens de la Terre" exhibition at the Centre Georges Pompidou, Paris — making her the first and only Mithila artist to be represented in that pivotal contemporary art survey.',
    legacy:
      'Her inclusion at the Pompidou in 1989 permanently changed the global art world\'s understanding of "folk art," demonstrating that Mithila painting could stand alongside work by formally-trained contemporary artists.',
    awards: [
      'National Award — 1984 (Ministry of Textiles)',
      'Padma Shri — 2017 (Government of India)',
    ],
    achievements: [
      '"Magiciens de la Terre", Centre Pompidou, Paris, 1989',
      'Pioneered large-scale Mithila canvases',
      'Reinterpreted naga (serpent) motifs from a female perspective',
    ],
    famousWorks: ['"Naga Kanya" (Snake Maiden) series', '"Cosmic Serpent"', '"Sita\'s Agnipariksha"'],
    sources: [
      'Padma Award Citation, Government of India, 2017',
      'National Award Citation, Ministry of Textiles, 1984',
      '"Magiciens de la Terre" exhibition catalogue, Centre Pompidou, 1989',
    ],
  },
  {
    id: 'dulari-devi',
    name: 'Dulari Devi',
    born: '1968',
    died: null,
    village: 'Ranti, Madhubani, Bihar',
    style: 'Kachni & Bharni',
    portraitStatus: 'verified',
    bio: 'Born into a marginalized fishing (Mallah) community and employed as a domestic worker for the artist Mahasundari Devi, Dulari Devi\'s journey into art is one of the most celebrated in modern Indian cultural history. She was mentored by Mahasundari Devi and later by Karpuri Devi.',
    contributions:
      'She introduced the everyday life of her fishing community — river rituals, fishing nets, village scenes — into a tradition dominated by upper-caste mythological imagery. Her autobiography "Following My Paintbrush" (2011) is a landmark document of both personal resilience and caste dynamics in Indian folk art.',
    legacy:
      'Recognised as an instructor at the Mithila Art Institute. Her work radically expanded the social scope of Mithila painting, proving that the tradition\'s visual language could voice the experience of historically excluded communities.',
    awards: [
      'State Award, Bihar — 2012',
      'Padma Shri — 2021 (Government of India)',
    ],
    achievements: [
      'Instructor at the Mithila Art Institute',
      'Author of "Following My Paintbrush" (2011)',
      'First Mallah-community artist to receive national recognition in Mithila art',
    ],
    famousWorks: ['"Following My Paintbrush" (illustrated autobiography)', 'Kamla River Ritual series', 'Village Life series'],
    sources: [
      'Padma Award Citation, Government of India, 2021',
      '"Following My Paintbrush" — Dulari Devi, Zubaan Books, 2011',
      'Mithila Art Institute records',
    ],
  },
];

// ─── ANIMATIONS ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// ─── PORTRAIT UNAVAILABLE COMPONENT ──────────────────────────────────────────
function PortraitUnavailable({ name }) {
  return (
    <div className="w-full h-full bg-warm-gray-100 dark:bg-warm-gray-800 flex flex-col items-center justify-center gap-3 p-8">
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-warm-gray-300 dark:border-warm-gray-600 flex items-center justify-center">
        <IoPersonOutline className="text-4xl text-warm-gray-400 dark:text-warm-gray-500" />
      </div>
      <p className="font-display text-sm font-semibold text-warm-gray-500 dark:text-warm-gray-400 text-center">
        Verified portrait not available
      </p>
      <p className="font-body text-xs text-warm-gray-400 dark:text-warm-gray-500 text-center max-w-[180px] leading-relaxed">
        No authenticated photograph of {name} has been identified in public archives.
      </p>
      <div className="flex items-center gap-1.5 mt-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
        <IoWarningOutline className="text-amber-500 text-xs flex-shrink-0" />
        <span className="text-amber-600 dark:text-amber-400 text-[10px] font-body">
          Image not substituted to avoid misidentification
        </span>
      </div>
    </div>
  );
}

// ─── ARTIST CARD ─────────────────────────────────────────────────────────────
function ArtistProfile({ artist, index }) {
  const [imgError, setImgError] = useState(false);
  const portrait = VERIFIED_PORTRAITS[artist.id];
  const isReversed = index % 2 !== 0;
  const showPortrait = portrait && !imgError;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${isReversed ? 'lg:direction-rtl' : ''}`}
    >
      {/* ── Portrait Panel ── */}
      <div className={`relative ${isReversed ? 'lg:order-2' : ''}`}>
        <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/5] bg-warm-gray-100 dark:bg-warm-gray-800 relative">
          {showPortrait ? (
            <>
              <img
                src={portrait.url}
                alt={`${artist.name} — Mithila artist`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
              {/* Attribution ribbon */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-4">
                <p className="text-white/90 font-body text-[10px] leading-relaxed">
                  📷 {portrait.attribution}
                  {portrait.caption && <><br /><em>{portrait.caption}</em></>}
                </p>
                <p className="text-white/60 font-body text-[9px] mt-0.5">
                  License: {portrait.license} · <a href={portrait.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/90">Source</a>
                </p>
              </div>
            </>
          ) : (
            <PortraitUnavailable name={artist.name} />
          )}
        </div>

        {/* Floating name card */}
        <div className="absolute -bottom-5 left-6 right-6">
          <div className="bg-white dark:bg-warm-gray-800 border border-cream-100 dark:border-warm-gray-700 rounded-xl px-5 py-3.5 shadow-lg">
            <p className="font-display font-bold text-earth-700 dark:text-earth-400 text-base">{artist.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <IoCalendarOutline className="text-warm-gray-400 text-xs" />
              <p className="text-xs font-body text-warm-gray-500 dark:text-warm-gray-300">
                {artist.born} — {artist.died || 'Present'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Biography Panel ── */}
      <div className={`pt-6 lg:pt-0 space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
        {/* Style badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 bg-earth-500/10 text-earth-600 dark:text-earth-400 rounded-full text-xs font-body font-semibold uppercase tracking-wider">
            {artist.style} Style
          </span>
          <div className="flex items-center gap-1.5 text-warm-gray-400 text-xs font-body">
            <IoLocationOutline className="text-earth-500" />
            {artist.village}
          </div>
        </div>

        <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal dark:text-white">
          {artist.name}
        </h2>

        {/* Biography */}
        <div className="space-y-3 border-l-2 border-earth-500/40 pl-4 py-1">
          <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-[15px] leading-relaxed">
            {artist.bio}
          </p>
          {artist.contributions && (
            <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-[15px] leading-relaxed">
              <strong className="text-charcoal dark:text-white font-semibold">Contributions: </strong>
              {artist.contributions}
            </p>
          )}
          {artist.legacy && (
            <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-[15px] leading-relaxed">
              <strong className="text-charcoal dark:text-white font-semibold">Legacy: </strong>
              {artist.legacy}
            </p>
          )}
        </div>

        {/* Awards & Achievements grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Awards */}
          <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-5 shadow-sm border border-cream-100 dark:border-warm-gray-700/50">
            <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
              <IoRibbonOutline className="text-mithila-red text-lg" />
              Awards
            </h4>
            <ul className="space-y-1.5">
              {artist.awards.map((award, i) => (
                <li key={i} className="flex items-start gap-2 text-warm-gray-600 dark:text-warm-gray-300 font-body text-xs leading-snug">
                  <span className="w-1 h-1 rounded-full bg-mithila-red mt-1.5 flex-shrink-0" />
                  {award}
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements & Works */}
          <div className="bg-white dark:bg-warm-gray-800 rounded-xl p-5 shadow-sm border border-cream-100 dark:border-warm-gray-700/50 space-y-4">
            {artist.achievements && (
              <div>
                <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                  <IoStarOutline className="text-earth-500 text-lg" />
                  Key Achievements
                </h4>
                <ul className="space-y-1.5">
                  {artist.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2 text-warm-gray-600 dark:text-warm-gray-300 font-body text-xs leading-snug">
                      <span className="w-1 h-1 rounded-full bg-earth-500 mt-1.5 flex-shrink-0" />
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {artist.famousWorks && (
              <div>
                <h4 className="font-display font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-2 text-sm uppercase tracking-wider border-t border-cream-50 dark:border-warm-gray-700 pt-3">
                  <IoColorPaletteOutline className="text-mithila-blue text-lg" />
                  Notable Works
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {artist.famousWorks.map((work, i) => (
                    <span key={i} className="px-2 py-0.5 bg-cream-50 dark:bg-warm-gray-700 text-warm-gray-600 dark:text-warm-gray-300 text-[11px] rounded font-body border border-cream-100 dark:border-warm-gray-600 leading-snug">
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        <details className="group">
          <summary className="flex items-center gap-2 text-xs text-warm-gray-400 font-body cursor-pointer hover:text-warm-gray-600 dark:hover:text-warm-gray-300 transition-colors select-none">
            <IoBookOutline className="text-sm" />
            <span>View sources for this biography</span>
          </summary>
          <ul className="mt-2 ml-5 space-y-1">
            {artist.sources.map((src, i) => (
              <li key={i} className="text-[11px] text-warm-gray-400 font-body list-disc">
                {src}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </motion.article>
  );
}

// ─── IMAGE REPORT (printed to console in development) ─────────────────────────
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.group('🎨 Mithila Artist Portrait Verification Report');
  artists.forEach(a => {
    const portrait = VERIFIED_PORTRAITS[a.id];
    if (portrait) {
      console.log(`✅ ${a.name} — Confidence: ${portrait.confidence}`);
      console.log(`   Source: ${portrait.source}`);
      console.log(`   License: ${portrait.license}`);
    } else {
      console.warn(`⚠️  ${a.name} — NO verified portrait found. Showing "unavailable" state.`);
    }
  });
  console.groupEnd();
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function ArtistsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream-50 dark:bg-warm-gray-900 min-h-screen pt-28 pb-24"
    >
      <Helmet>
        <title>Masters of Mithila Art — Lalita Pathak Mithila Art Studio</title>
        <meta
          name="description"
          content="Authenticated biographies of the legendary women who built Mithila art into a globally recognised tradition — Sita Devi, Ganga Devi, Jagdamba Devi, Mahasundari Devi, Baua Devi, and Dulari Devi."
        />
      </Helmet>

      {/* ── Page Header ── */}
      <div className="container-custom">
        <SectionHeading
          title="Masters of Mithila"
          subtitle="Six women whose work transformed a sacred village ritual into a globally celebrated art form. Biographies verified against government award records, museum archives, and scholarly sources."
          centered
          accent
        />

        {/* Portrait verification notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-2xl mx-auto flex items-start gap-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4"
        >
          <IoWarningOutline className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 dark:text-amber-300 font-body text-sm leading-relaxed">
            <strong>Portrait policy:</strong> Only photographs verified through official government sources, museum archives, or Wikimedia Commons with confirmed attribution are used. For artists where no verified portrait exists, the image slot clearly states "unavailable" rather than substituting an unrelated image.
          </p>
        </motion.div>
      </div>

      {/* ── Artist Profiles ── */}
      <div className="container-custom mt-20 space-y-28">
        {artists.map((artist, index) => (
          <ArtistProfile key={artist.id} artist={artist} index={index} />
        ))}
      </div>

      {/* ── Sources Footer ── */}
      <div className="container-custom mt-24 pt-12 border-t border-cream-200 dark:border-warm-gray-700">
        <p className="text-center text-warm-gray-400 dark:text-warm-gray-500 font-body text-xs leading-relaxed max-w-2xl mx-auto">
          All biographical information sourced from: Government of India Padma Award citations · Ministry of Textiles National Award records · Shilp Guru citations · Sahapedia.org · Museum archive records (V&A London, National Crafts Museum Delhi, Musée du Quai Branly Paris) · Published artist monographs. Full source registry available in <code className="bg-cream-100 dark:bg-warm-gray-800 px-1 rounded">src/data/SourceRegistry.md</code>.
        </p>
      </div>
    </motion.div>
  );
}
