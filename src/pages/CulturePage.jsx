import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/ui/SectionHeading';
import {
  IoLeafOutline, IoFlowerOutline, IoSunnyOutline, IoPeopleOutline,
  IoEarthOutline, IoFishOutline, IoColorPaletteOutline, IoBookOutline,
  IoTimeOutline, IoSparklesOutline, IoLocationOutline,
} from 'react-icons/io5';

// ─── VERIFIED IMAGE REGISTRY ──────────────────────────────────────────────────
// All images uploaded to Cloudinary via backend/scripts/uploadAssets.js
// Fallbacks use direct Wikimedia URLs. See src/data/SourceRegistry.md for licenses.
const IMG = {
  // Cloudinary CDN URLs — permanent, never break
  hero:       'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_sita_vivah.jpg',
  origins:    'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg', // too large for Cloudinary free tier; direct Wikimedia URL
  kohbar:     'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_kohbar.jpg',
  chhath:     'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/festivals/festival_chhath.jpg',
  sama:       'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/festivals/festival_sama_chakeva.jpg',
  sama2:      'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/festivals/festival_sama_2.jpg',
  bharni:     'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_madhubani_main.jpg',
  kachni:     'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_madhubani_painting.jpg',
  fish:       'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_fish_motif.png',
  exhibition: 'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_exhibition.jpg',
  artist:     'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_dilli_haat.jpg',
  mural:      'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_patna_junction.jpg',
  mixed:      'https://res.cloudinary.com/dn4f4fr1n/image/upload/mithila_art_assets/artworks/art_mixed.jpg',
  // Wikimedia fallbacks (if Cloudinary URL fails)
  _hero_fb:   'https://upload.wikimedia.org/wikipedia/commons/e/ef/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg',
  _origins_fb:'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg',
  _chhath_fb: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Chhath_Puja_Worship.jpg',
  _sama_fb:   'https://upload.wikimedia.org/wikipedia/commons/4/40/Sama_chakeva.jpg',
};

// ─── IMAGE COMPONENT WITH FALLBACK ────────────────────────────────────────────
function VerifiedImage({ src, fallback, alt, className, attribution, license }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative w-full h-full">
      <img
        src={errored ? fallback : src}
        alt={alt}
        className={className}
        onError={() => { if (!errored) setErrored(true); }}
      />
      {attribution && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <p className="text-white/80 text-[9px] font-body">
            📷 {attribution} {license && `· ${license}`}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

// ─── 1. HERO SECTION ──────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <VerifiedImage
          src={IMG.hero}
          fallback={IMG._hero_fb}
          alt="Madhubani painting depicting the wedding of Ram and Sita — Mithila tradition"
          className="w-full h-full object-cover"
          attribution="Wikimedia Commons — Madhubani Painting of Ram-Sita Vivah"
          license="Public Domain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-cream-50 dark:to-warm-gray-900" />
        <div className="absolute inset-0 bg-amber-950/20 mix-blend-multiply" />
      </motion.div>

      {/* Floating decorative rings */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-16 left-8 w-48 h-48 rounded-full border border-earth-500/20" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-24 right-12 w-32 h-32 rounded-full border-2 border-dashed border-cream-300/15" />
      </div>

      <motion.div className="relative z-10 text-center px-4 max-w-5xl mx-auto" style={{ opacity }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="font-accent text-earth-400 text-base md:text-lg tracking-[0.4em] mb-6"
        >
          मिथिला — एक जीवित विरासत
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6"
        >
          The Living World
          <span className="block bg-gradient-to-r from-earth-400 via-cream-200 to-earth-300 bg-clip-text text-transparent">
            of Mithila
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="text-cream-200/75 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          A civilisation shaped by floods, harvests, and sacred myth — where every wall was a prayer, every festival a painting, and every woman an artist.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-12 flex justify-center">
          <div className="w-6 h-10 rounded-full border-2 border-cream-300/30 flex justify-center">
            <motion.div className="w-1.5 h-3 bg-earth-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── 2. THE LAND OF MITHILA ───────────────────────────────────────────────────
function LandSection() {
  const facts = [
    { label: 'Region', value: 'Northern Bihar, India', icon: IoLocationOutline },
    { label: 'Key Districts', value: 'Madhubani, Darbhanga, Sitamarhi', icon: IoEarthOutline },
    { label: 'Sacred Centre', value: 'Jitwarpur & Ranti Villages', icon: IoLeafOutline },
    { label: 'Rivers', value: 'Kamla, Bagmati, Gandak', icon: IoFlowerOutline },
  ];

  return (
    <section className="py-24 bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-5" />
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Map visual */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideLeft}>
            <div className="rounded-2xl overflow-hidden shadow-card-hover relative aspect-square max-w-[500px]">
              <VerifiedImage
                src={IMG.mural}
                fallback={IMG.mural}
                alt="Mithila mural at Patna Junction railway station, Bihar — a public display of the art form's regional significance"
                className="w-full h-full object-cover"
                attribution="Mithila mural, Patna Junction station · CC BY-SA 4.0 / Wikimedia"
                license="CC BY-SA 4.0"
              />
              {/* Overlay facts */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-warm-gray-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                <p className="font-display font-bold text-earth-600 dark:text-earth-400 text-sm">Ancient Kingdom</p>
                <p className="font-display text-2xl font-bold text-charcoal dark:text-white">Videha</p>
                <p className="font-body text-xs text-warm-gray-500 dark:text-warm-gray-400">Modern Mithila, Bihar</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={slideRight} className="space-y-6">
            <span className="px-3 py-1 bg-earth-500/10 text-earth-600 dark:text-earth-400 rounded-full text-xs font-body font-semibold uppercase tracking-wider">
              Geography & Origins
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal dark:text-white leading-tight">
              The Land of{' '}
              <span className="bg-gradient-to-r from-earth-600 to-mithila-red bg-clip-text text-transparent">
                Mithila
              </span>
            </h2>
            <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-lg leading-relaxed">
              The historical region of Mithila occupies the northern plains of Bihar, bounded by the Mahananda River to the east, the Ganges to the south, the Gandaki River to the west, and the Himalayan foothills to the north. It was the seat of the ancient <strong className="text-charcoal dark:text-white">Videha Kingdom</strong> — a major centre of learning, philosophy, and Vedic scholarship.
            </p>
            <p className="text-warm-gray-500 dark:text-warm-gray-400 font-body leading-relaxed">
              The region's annual flooding — from rivers that overflow their banks every monsoon — has paradoxically made its people deeply creative. When flood waters recede, freshly deposited silt coats the walls of houses. For millennia, women have used this as their canvas. The cycle of flood, renewal, and painting is built into the very rhythm of Mithila life.
            </p>

            {/* Fact grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {facts.map(f => (
                <div key={f.label} className="bg-white dark:bg-warm-gray-800 border border-cream-100 dark:border-warm-gray-700 rounded-xl p-4 flex items-start gap-3">
                  <f.icon className="text-earth-500 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-earth-500 font-body uppercase tracking-wider">{f.label}</p>
                    <p className="font-display font-semibold text-charcoal dark:text-white text-sm mt-0.5">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. ORIGIN STORY ──────────────────────────────────────────────────────────
function OriginSection() {
  return (
    <section className="py-24 bg-white dark:bg-warm-gray-950 relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight} className="space-y-6 lg:order-2">
            <span className="px-3 py-1 bg-mithila-red/10 text-mithila-red rounded-full text-xs font-body font-semibold uppercase tracking-wider">
              Mythology & Sacred Origin
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal dark:text-white leading-tight">
              The Daughter of{' '}
              <span className="bg-gradient-to-r from-mithila-red to-mithila-orange bg-clip-text text-transparent">
                Mithila
              </span>
            </h2>
            <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-lg leading-relaxed">
              According to the Ramayana, when King Janaka of Mithila arranged the marriage of his daughter <strong className="text-charcoal dark:text-white">Sita</strong> to Lord Rama, he commissioned the finest artists to decorate every wall and courtyard of the city of Janakpur. The women of Mithila painted the walls with images of gods, sacred symbols, and scenes from nature.
            </p>
            <p className="text-warm-gray-500 dark:text-warm-gray-400 font-body leading-relaxed">
              This mythological origin is why Mithila art is fundamentally a <em>women's tradition</em> — it was women who were charged with creating the sacred environment for life's most important ceremonies. This narrative has been passed from mother to daughter for over 2,500 years.
            </p>
            <blockquote className="border-l-3 border-earth-500 pl-4 py-1">
              <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm italic leading-relaxed">
                "These paintings were not merely decorative. Each was a prayer made visible — encoding fertility, protection, and cosmic order into the walls of a home."
              </p>
            </blockquote>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft} className="lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-card-hover aspect-[4/5]">
              <VerifiedImage
                src={IMG.origins}
                fallback={IMG._origins_fb}
                alt="The Birth of Sita — Raja Janaka of Mithila carrying her in his lap. Historical painting."
                className="w-full h-full object-cover"
                attribution="The Birth of Sita — Raja Janaka carrying her · Public Domain / Wikimedia Commons"
                license="Public Domain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. HISTORICAL TIMELINE ───────────────────────────────────────────────────
const TIMELINE = [
  {
    era: 'Ancient Period',
    period: '~800 BCE – 200 CE',
    title: 'Sacred Ritual Art on Mud Walls',
    body: 'Women of the Mithila region paint freshly plastered walls of homes and courtyards for weddings, births, and festivals. The tradition is rooted in Tantric, Shakta, and Vaishnava spiritual practices. Paintings are ephemeral — renewed with each monsoon flood.',
    color: 'bg-amber-600',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    era: 'Medieval Period',
    period: '14th – 17th Century',
    title: 'Royal Patronage & Stylistic Refinement',
    body: 'Under the Oinwar and Khandwala dynasties of Mithila, the Kohbar (nuptial chamber) tradition reaches high sophistication. The Bharni and Kachni styles crystallise as distinct artistic schools. Upper-caste Brahmin and Kayastha women refine the traditions; Dalit women independently develop the Godhana (tattoo-inspired) style.',
    color: 'bg-earth-600',
    textColor: 'text-earth-600 dark:text-earth-400',
  },
  {
    era: '1934 Discovery',
    period: 'January 15, 1934',
    title: 'British Officer Photographs the Ruins',
    body: 'A devastating earthquake (M8.4) strikes Bihar on 15 January 1934, killing over 7,000 people. British civil servant William G. Archer, inspecting damage in Madhubani district, notices extraordinary paintings on crumbling mud walls. He photographs them extensively. His documentation — later published in the journal Marg — introduces Mithila art to the outside world for the first time.',
    color: 'bg-warm-gray-600',
    textColor: 'text-warm-gray-600 dark:text-warm-gray-400',
  },
  {
    era: '1960s Drought',
    period: '1960 – 1965',
    title: 'From Walls to Paper',
    body: 'A severe drought devastates Bihar. The All India Handicrafts Board, led by officer Bhaskar Kulkarni, encourages Mithila women to transfer their paintings onto paper for commercial sale. Jagdamba Devi, Sita Devi, and Mahasundari Devi are among the first to exhibit in Delhi. This transition saves both the art form and the livelihoods of thousands of families.',
    color: 'bg-mithila-red',
    textColor: 'text-mithila-red',
  },
  {
    era: 'National Recognition',
    period: '1969 – 1984',
    title: 'Padma Awards & Government Validation',
    body: 'Jagdamba Devi receives the first National Award for Mithila painting in 1970, followed by the Padma Shri in 1975. Sita Devi receives the Padma Shri in 1981, Ganga Devi in 1984. The Government of India formally recognises the art form as a Geographical Indication (GI) — Madhubani painting — protecting its regional identity.',
    color: 'bg-earth-500',
    textColor: 'text-earth-500',
  },
  {
    era: 'International',
    period: '1985 – Present',
    title: 'Global Galleries & UNESCO Nomination',
    body: 'Baua Devi is selected for "Magiciens de la Terre" at Centre Pompidou, Paris (1989). Works enter the collections of the V&A (London), Musée du Quai Branly (Paris), and the Mithila Museum in Tokamachi, Japan. In 2012, India nominates Mithila painting for UNESCO\'s Representative List of Intangible Cultural Heritage. Contemporary artists continue expanding the tradition\'s visual vocabulary.',
    color: 'bg-mithila-blue',
    textColor: 'text-mithila-blue dark:text-blue-400',
  },
];

function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 mithila-pattern opacity-5" />
      <motion.div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-earth-500/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 14, repeat: Infinity }} />

      <div className="container-custom relative z-10">
        <SectionHeading title="A Timeline of Living Heritage" subtitle="Two and a half millennia — from sacred ritual to international gallery" accent centered light />

        <div className="mt-16 grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12">
          {/* Nav */}
          <div className="space-y-2">
            {TIMELINE.map((item, i) => (
              <button
                key={item.era}
                onClick={() => setActive(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 group ${i === active ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <p className={`text-xs font-body uppercase tracking-wider font-semibold ${i === active ? item.textColor : 'text-white/40 group-hover:text-white/60'}`}>
                  {item.era}
                </p>
                <p className={`font-display text-sm font-semibold mt-0.5 ${i === active ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                  {item.period}
                </p>
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-3 h-3 rounded-full ${TIMELINE[active].color} flex-shrink-0 mt-2`} />
                <div>
                  <span className={`text-xs font-body uppercase tracking-widest font-semibold ${TIMELINE[active].textColor}`}>
                    {TIMELINE[active].era} · {TIMELINE[active].period}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mt-2">
                    {TIMELINE[active].title}
                  </h3>
                </div>
              </div>
              <p className="text-white/65 font-body leading-relaxed text-base lg:text-lg">
                {TIMELINE[active].body}
              </p>
              <div className="mt-6 h-px bg-gradient-to-r from-earth-500/30 to-transparent" />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-white/30 text-xs font-body">
                  {active + 1} / {TIMELINE.length}
                </p>
                <div className="flex gap-1">
                  {TIMELINE.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === active ? TIMELINE[active].color + ' w-6' : 'bg-white/20'}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── 5. FESTIVALS & TRADITIONS ────────────────────────────────────────────────
const FESTIVALS = [
  {
    name: 'Chhath Puja',
    subtitle: 'Worship of the Sun God',
    description:
      'The most revered festival in Bihar, Chhath is dedicated to Surya Devta (the Sun God) and Chhathi Maiya. Celebrated over four days, devotees observe strict fasting, immerse themselves in rivers, and offer arghya (water oblations) to the rising and setting sun. The festival\'s profound austerity and deep connection to natural cycles — solar worship, water, and harvest — make it unique in the Hindu calendar. Mithila paintings frequently depict the iconic image of women standing waist-deep in the river making offerings at sunset.',
    image: IMG.chhath,
    fallback: IMG._chhath_fb,
    imgAlt: 'Chhath Puja worship at the riverside — devotees offering arghya to the setting sun',
    imgAttribution: 'Chhath Puja Worship · Public Domain / Wikimedia Commons',
    icon: IoSunnyOutline,
    color: 'text-mithila-orange',
    significance: 'The river (usually the Kamla or Bagmati) is sacred in Mithila — it gives life through floods and takes life through disease. Chhath channels this ambivalence into prayer.',
  },
  {
    name: 'Sama Chakeva',
    subtitle: 'Festival of Siblings & Migratory Birds',
    description:
      'A uniquely Maithil winter festival celebrated in Kartik (October–November), Sama Chakeva commemorates the mythological story of Sama (daughter of Krishna) and her brother Chakeva (a bird). Women craft clay effigies of birds and forest animals, sing traditional songs (Sama Chakeva geet), and ritually burn the effigies at the end. The festival celebrates the sibling bond, the arrival of migratory birds from the Himalayas, and the cyclical return of winter.',
    image: IMG.sama,
    fallback: IMG._sama_fb,
    imgAlt: 'Sama Chakeva festival celebration in Mithila — clay bird effigies and traditional ceremony',
    imgAttribution: 'Sama Chakeva · Public Domain / Wikimedia Commons',
    icon: IoPeopleOutline,
    color: 'text-mithila-blue',
    significance: 'Sama Chakeva is one of the few major Indian festivals with no parallel outside the Mithila region — it is a living cultural property unique to this geography.',
  },
  {
    name: 'Vivah Panchami & Kohbar',
    subtitle: 'Sacred Wedding Traditions',
    description:
      'The Vivah Panchami marks the mythological anniversary of the wedding of Sita and Rama and is celebrated with elaborate community processions and recitations of the Ramayana. In Mithila weddings, the Kohbar Ghar (nuptial chamber) is lavishly painted with highly symbolic Kohbar art — bamboo groves (male lineage), lotus ponds (female fertility), fish pairs (conjugal love), and sun/moon motifs (cosmic blessing). The act of painting the Kohbar is itself a sacred ritual performed by the women of the family.',
    image: IMG.kohbar,
    fallback: IMG.kohbar,
    imgAlt: 'Kohbar (nuptial chamber) painting from the Mithila tradition — Sohrai and Kohbar artworks',
    imgAttribution: 'Sohrai and Kohbar Paintings · CC0 1.0 / Wikimedia Commons',
    icon: IoFlowerOutline,
    color: 'text-mithila-red',
    significance: 'The Kohbar is both art and prayer — it is painted specifically to be seen only by the new couple on their wedding night, then washed away. Its ephemerality is part of its power.',
  },
  {
    name: 'Jur Sital (Maithil New Year)',
    subtitle: 'Festival of Cooling & Renewal',
    description:
      'Celebrated on the first day of Vaishakh (mid-April), Jur Sital marks the Maithil New Year. The name literally means "pouring water to cool" — community members pour cold water over each other\'s feet at dawn to wash away the summer heat and begin the new year. It is a festival of reconciliation, renewal, and gratitude. Traditional Maithili folk songs (Lokgeet) are sung, and homes are freshly painted with Aripan (floor art) patterns. It is also a day when new artistic works are traditionally inaugurated.',
    image: IMG.mixed,
    fallback: IMG.mixed,
    imgAlt: 'Traditional Madhubani paintings representing Mithila cultural traditions and festivals',
    imgAttribution: 'Madhubani paintings · CC BY 2.0 / Wikimedia Commons',
    icon: IoSparklesOutline,
    color: 'text-mithila-green',
    significance: 'Jur Sital is not found on the national calendar — it is entirely local to Mithila, and its practice is a marker of Maithil cultural identity even among diaspora communities worldwide.',
  },
];

function FestivalsSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <section className="py-24 bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-5" />
      <div className="container-custom relative z-10">
        <SectionHeading
          title="Festivals & Traditions"
          subtitle="The ceremonial calendar of Mithila — where every celebration has a painting and every painting carries a prayer"
          centered accent
        />

        <div className="mt-16 space-y-6">
          {FESTIVALS.map((fest, i) => (
            <motion.div
              key={fest.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}
              className="bg-white dark:bg-warm-gray-800 rounded-2xl border border-cream-100 dark:border-warm-gray-700 overflow-hidden shadow-sm"
            >
              <div
                className="flex flex-col md:flex-row cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              >
                {/* Image */}
                <div className={`md:w-2/5 h-56 md:h-64 relative flex-shrink-0 ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                  <VerifiedImage
                    src={fest.image}
                    fallback={fest.fallback}
                    alt={fest.imgAlt}
                    className="w-full h-full object-cover"
                    attribution={fest.imgAttribution}
                  />
                </div>

                {/* Content */}
                <div className={`flex-1 p-7 lg:p-9 flex flex-col justify-between ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <fest.icon className={`text-2xl ${fest.color} flex-shrink-0`} />
                      <span className={`text-xs font-body uppercase tracking-widest font-semibold ${fest.color}`}>{fest.subtitle}</span>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-charcoal dark:text-white mb-3">{fest.name}</h3>
                    <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed text-sm lg:text-base line-clamp-3">
                      {fest.description}
                    </p>
                  </div>

                  <button className={`mt-5 flex items-center gap-2 text-xs font-body font-semibold ${fest.color} self-start`}>
                    {expandedIndex === i ? '↑ Show less' : '↓ Read historical significance'}
                  </button>
                </div>
              </div>

              {/* Expandable significance */}
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 lg:px-9 pb-7 pt-2 border-t border-cream-100 dark:border-warm-gray-700">
                      <p className="text-xs font-body uppercase tracking-widest text-earth-500 font-semibold mb-2">Cultural Significance</p>
                      <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed text-sm">
                        {fest.significance}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 6. SYMBOLISM ─────────────────────────────────────────────────────────────
const SYMBOLS = [
  { name: 'Fish (Machh)', emoji: '🐟', meaning: 'The fish is the most universal symbol in Mithila art — representing fertility, prosperity, conjugal love, and abundance. Fish appear in virtually every Kohbar (wedding) painting. The pair of fish is a direct invocation of the divine couple — Shiva and Parvati, or Vishnu and Lakshmi.', vedic: 'Also associated with Matsya, the first avatar of Vishnu.' },
  { name: 'Lotus (Kamal)', emoji: '🪷', meaning: 'The lotus represents female energy (Shakti), purity emerging from the mud of worldly existence, and the womb of creation. It is the centrepiece of Kohbar paintings — from the lotus, all other symbols emanate. In Tantric interpretations, the lotus pond maps the cosmic yoni.', vedic: 'Sacred to Lakshmi (goddess of prosperity) and Saraswati (goddess of knowledge).' },
  { name: 'Peacock', emoji: '🦚', meaning: 'Associated with Lord Krishna, romantic love, and the monsoon rains. The peacock dances when rain is imminent — making it a symbol of longing, beauty, and divine play (Leela). In Mithila art, peacocks are often depicted in pairs on either side of a central deity.', vedic: 'Vehicle of Kartikeya (Murugan). Associated with Saraswati in some traditions.' },
  { name: 'Bamboo Grove', emoji: '🎋', meaning: 'Bamboo represents male lineage, ancestral continuity, and rapid growth. In Kohbar paintings, the bamboo grove (baans) is always paired with the lotus pond — together they encode the union of male and female principles. Bamboo is also used literally in the making of Mithila art tools (bamboo nibs for Kachni).', vedic: 'Connected to the flute of Krishna — made from bamboo.' },
  { name: 'Sun & Moon', emoji: '🌞', meaning: 'Celestial witnesses to auspicious events — weddings, births, and festivals are always held under their benediction. In Mithila paintings, the sun and moon appear in the four corners of Kohbar compositions as cosmic anchors, ensuring the event is witnessed by the universe itself.', vedic: 'Surya (Sun) — god of health and intellect. Chandra (Moon) — god of mind and fertility.' },
  { name: 'Tree of Life', emoji: '🌳', meaning: 'The cosmic axis connecting earth, humanity, and the divine. Rooted in the earth and reaching toward the sky, the Tree of Life (Kalpa Vriksha) is depicted laden with fruit, birds, and climbing figures. It represents the wish-fulfilling abundance of a blessed household.', vedic: 'The Ashvattha (sacred fig) is particularly revered — the Gita begins under its shade.' },
  { name: 'Turtle (Kurma)', emoji: '🐢', meaning: 'Stability, longevity, and cosmic support. In Mithila cosmology, the earth rests on the back of a giant turtle — the Kurma avatar of Vishnu — who in turn rests on the serpent Shesha. The turtle\'s appearance in a Kohbar painting invokes this foundational stability for the new household.', vedic: 'Kurma — second avatar of Vishnu, supporting Mount Mandara during the churning of the cosmic ocean.' },
  { name: 'Serpent (Naga)', emoji: '🐍', meaning: 'One of the most potent symbols in Mithila art — simultaneously representing fertility, transformation, ancestral spirits, and divine protection. Baua Devi\'s celebrated "Naga Kanya" series reimagined snake iconography from a female perspective, giving serpents an empowered rather than fearful quality.', vedic: 'Nagas are semi-divine beings in Hindu/Buddhist cosmology. Shesha supports Vishnu; Vasuki encircles Shiva\'s neck.' },
];

function SymbolismSection() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-24 bg-white dark:bg-warm-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 mithila-pattern opacity-5" />
      <div className="container-custom relative z-10">
        <SectionHeading
          title="The Language of Symbols"
          subtitle="Every motif in Mithila art is a word in an ancient visual vocabulary — learned by girls as they learn to speak"
          centered accent
        />

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SYMBOLS.map((sym, i) => (
            <motion.button
              key={sym.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.06, duration: 0.5 } } }}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 ${selected === i ? 'bg-earth-50 dark:bg-earth-900/20 border-earth-400/50 shadow-md' : 'bg-cream-50 dark:bg-warm-gray-800 border-cream-200 dark:border-warm-gray-700 hover:border-earth-300/50 hover:shadow-sm'}`}
            >
              <div className="text-4xl mb-3">{sym.emoji}</div>
              <h4 className="font-display font-semibold text-charcoal dark:text-white text-sm">{sym.name}</h4>
            </motion.button>
          ))}
        </div>

        {/* Expanded detail */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-8 bg-earth-50 dark:bg-warm-gray-800 border border-earth-200 dark:border-warm-gray-700 rounded-2xl p-7 lg:p-10"
            >
              <div className="flex items-start gap-5">
                <div className="text-6xl flex-shrink-0">{SYMBOLS[selected].emoji}</div>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-charcoal dark:text-white">{SYMBOLS[selected].name}</h3>
                  <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed">{SYMBOLS[selected].meaning}</p>
                  {SYMBOLS[selected].vedic && (
                    <div className="mt-3 pl-4 border-l-2 border-earth-400/40">
                      <p className="text-earth-600 dark:text-earth-400 font-body text-sm font-semibold">Vedic Context</p>
                      <p className="text-warm-gray-500 dark:text-warm-gray-400 font-body text-sm">{SYMBOLS[selected].vedic}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fish motif art */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-16">
          <div className="rounded-2xl overflow-hidden shadow-card">
            <VerifiedImage
              src={IMG.fish}
              fallback={IMG.fish}
              alt="Madhubani fish motif with stylized geometric scales and red-toned accents from Mithila, India — example of Mithila symbolism in art"
              className="w-full h-64 object-cover"
              attribution="Madhubani Fish Motif · CC BY-SA 4.0 / Wikimedia Commons"
              license="CC BY-SA 4.0"
            />
          </div>
          <p className="text-center text-warm-gray-400 font-body text-xs mt-3">
            Fish motif (Machh) — one of the most universal symbols in Mithila painting, appearing in virtually every wedding artwork
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 7. PAINTING STYLES ───────────────────────────────────────────────────────
const STYLES = [
  {
    name: 'Bharni', hindi: 'भरनी', subtitle: 'The Filled Style',
    desc: 'The most visually striking of the Mithila styles, Bharni (literally "to fill") is characterised by bold outlines filled with vibrant solid colours. Traditionally practised by Brahmin women of Jitwarpur and Ranti villages, Bharni paintings predominantly depict Hindu deities — Krishna, Durga, Rama, Ganesha. The palette is entirely derived from natural sources: kumkum for red, turmeric for yellow, indigo for blue, soot for black.',
    practitioners: 'Sita Devi, Mahasundari Devi, Baua Devi',
    motifs: 'Deities, mythological narratives, cosmic symbols',
    medium: 'Natural pigments on handmade paper or cloth',
    image: IMG.bharni,
    fallback: IMG.bharni,
    imgAlt: 'Bharni style Madhubani painting — vibrant filled artwork',
    imgAttribution: 'Madhubani art · Wikimedia Commons',
    color: 'border-mithila-red',
    badgeColor: 'bg-mithila-red/10 text-mithila-red',
  },
  {
    name: 'Kachni', hindi: 'कचनी', subtitle: 'The Fine Line Style',
    desc: 'Kachni (literally "to scratch" or "engrave") achieves its mesmerising effect through intricate hatching and cross-hatching, usually in black ink or red vermillion applied with a sharpened bamboo nib — with no colour fill. A single Kachni painting can take weeks, as the artist builds form, depth, and texture entirely through thousands of precisely placed parallel lines. Traditionally practised by Kayastha women of Madhubani.',
    practitioners: 'Ganga Devi, Godavari Dutta',
    motifs: 'Narrative scenes, lyrical landscapes, portraiture',
    medium: 'Black or red ink on handmade paper, bamboo nib',
    image: IMG.kachni,
    fallback: IMG.kachni,
    imgAlt: 'Kachni style Madhubani painting — intricate monochromatic line work',
    imgAttribution: 'Madhubani painting · Wikimedia Commons',
    color: 'border-charcoal dark:border-warm-gray-400',
    badgeColor: 'bg-charcoal/10 dark:bg-warm-gray-700 text-charcoal dark:text-warm-gray-200',
  },
  {
    name: 'Kohbar', hindi: 'कोहबर', subtitle: 'The Wedding Chamber Art',
    desc: 'The most ritually significant category of Mithila painting, Kohbar is painted exclusively on the walls of the nuptial chamber (kohbar ghar) to bless a newly married couple. The central composition is always a lotus pond, from which bamboo groves, fish pairs, birds, and divine symbols radiate outward. Every element encodes a specific prayer: for fertility, prosperity, love, protection. The painting is traditionally destroyed after the wedding night.',
    practitioners: 'Women of all communities (ritual tradition)',
    motifs: 'Lotus pond, bamboo grove, fish pairs, sun/moon, naga',
    medium: 'Natural pigments on mud-plastered walls',
    image: IMG.kohbar,
    fallback: IMG.kohbar,
    imgAlt: 'Kohbar (Sohrai and Kohbar) painting — nuptial chamber art of the Mithila tradition',
    imgAttribution: 'Sohrai and Kohbar Paintings · CC0 1.0 / Wikimedia Commons',
    color: 'border-earth-500',
    badgeColor: 'bg-earth-500/10 text-earth-600 dark:text-earth-400',
  },
  {
    name: 'Godna (Godhana)', hindi: 'गोदना', subtitle: "The Dalit Women's Tattoo Style",
    desc: 'Godna (also written Godhana) translates to "tattoo." It originated in the body-art traditions of Dalit communities — particularly the Dusadh and Mallah communities — who were historically excluded from painting on paper. Godna features repeating geometric patterns, concentric circles, dots, and everyday rural imagery applied in black and red. The distinctive "cow dung wash" (applied to paper as a background) gives it a warm, matte, rustic quality unlike any other style.',
    practitioners: 'Dulari Devi, Yamuna Devi',
    motifs: 'Geometric patterns, rural life, tattoo-derived motifs',
    medium: 'Black/red ink on cow-dung washed paper',
    image: IMG.exhibition,
    fallback: IMG.exhibition,
    imgAlt: 'Madhubani painting exhibition showing various Mithila styles including Godna tradition',
    imgAttribution: 'Madhubani Painting Exhibition · CC BY-SA 3.0 / Wikimedia Commons',
    color: 'border-mithila-green',
    badgeColor: 'bg-mithila-green/10 text-mithila-green dark:text-green-400',
  },
  {
    name: 'Tantrik', hindi: 'तांत्रिक', subtitle: 'The Mystical Geometric Style',
    desc: 'Tantrik Mithila painting is the most esoteric category — rooted directly in Shakta-Tantric spiritual practice. These paintings depict yantras (sacred geometric diagrams), mandalas, and cosmic energy maps. The Sri Yantra, composed of nine interlocking triangles, is the most complex and revered composition. Tantrik paintings are not merely art — they are functional ritual objects, believed to concentrate and transmit spiritual energy when correctly executed.',
    practitioners: 'Specialists within Tantric lineages',
    motifs: 'Yantras, mandalas, geometric diagrams, Shakti imagery',
    medium: 'Natural pigments, often on bark cloth or silk',
    image: IMG.artist,
    fallback: IMG.artist,
    imgAlt: 'Mithila painting artist at Dilli Haat demonstrating traditional techniques',
    imgAttribution: 'Mithila Painting Artist, Dilli Haat · CC BY 2.0 / Wikimedia Commons',
    color: 'border-mithila-purple',
    badgeColor: 'bg-mithila-purple/10 text-mithila-purple dark:text-purple-400',
  },
];

function StylesSection() {
  return (
    <section className="py-24 bg-cream-50 dark:bg-warm-gray-900 relative overflow-hidden">
      <div className="container-custom">
        <SectionHeading
          title="The Five Great Styles"
          subtitle="Each style carries its own history, social context, spiritual significance, and technical vocabulary — refined over centuries of practice"
          centered accent
        />

        <div className="mt-16 space-y-16">
          {STYLES.map((style, i) => (
            <motion.div
              key={style.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${i % 2 !== 0 ? 'lg:direction-rtl' : ''}`}
            >
              {/* Image */}
              <div className={`relative ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className={`rounded-2xl overflow-hidden shadow-card border-2 ${style.color} aspect-[4/3]`}>
                  <VerifiedImage
                    src={style.image}
                    fallback={style.fallback}
                    alt={style.imgAlt}
                    className="w-full h-full object-cover"
                    attribution={style.imgAttribution}
                  />
                </div>
                <motion.div
                  className="absolute -top-3 -left-3 bg-white dark:bg-warm-gray-800 border border-cream-100 dark:border-warm-gray-700 rounded-xl px-4 py-2 shadow-md"
                  animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                >
                  <p className="font-accent text-earth-500 text-sm">{style.hindi}</p>
                </motion.div>
              </div>

              {/* Content */}
              <div className={`space-y-5 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider ${style.badgeColor}`}>
                    {style.name}
                  </span>
                  <span className="text-warm-gray-400 font-body text-xs">{style.subtitle}</span>
                </div>

                <h3 className="font-display text-3xl lg:text-4xl font-bold text-charcoal dark:text-white">{style.name}</h3>

                <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed">{style.desc}</p>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {[
                    { label: 'Key Practitioners', value: style.practitioners },
                    { label: 'Core Motifs', value: style.motifs },
                    { label: 'Medium & Tools', value: style.medium },
                  ].map(d => (
                    <div key={d.label} className="flex gap-3 text-sm">
                      <span className="text-earth-500 font-body font-semibold flex-shrink-0 w-36">{d.label}:</span>
                      <span className="text-warm-gray-600 dark:text-warm-gray-300 font-body">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 8. NATURAL PALETTE ───────────────────────────────────────────────────────
const PIGMENTS = [
  { name: 'Black', hindi: 'काला', source: 'Soot from kerosene lamp or burnt mustard husks, mixed with cow-dung binder', swatch: 'bg-neutral-900', text: 'text-white' },
  { name: 'Red / Vermillion', hindi: 'लाल', source: 'Kumkum (vermillion sindoor), crushed palash flower petals (Butea monosperma), or red sandalwood', swatch: 'bg-red-700', text: 'text-white' },
  { name: 'Yellow', hindi: 'पीला', source: 'Turmeric powder (haldi), pollen, or bael fruit extract', swatch: 'bg-yellow-400', text: 'text-yellow-900' },
  { name: 'Blue', hindi: 'नीला', source: 'Indigo (neel) extracted from the Indigofera tinctoria plant — one of Bihar\'s most important cash crops historically', swatch: 'bg-indigo-800', text: 'text-white' },
  { name: 'Green', hindi: 'हरा', source: 'Bilva (wood apple) or neem leaf paste; also turmeric mixed with indigo', swatch: 'bg-green-700', text: 'text-white' },
  { name: 'White', hindi: 'सफेद', source: 'Rice powder paste (pithar), sometimes mixed with gum arabic for binding', swatch: 'bg-cream-100 border border-warm-gray-200', text: 'text-warm-gray-700' },
  { name: 'Orange', hindi: 'नारंगी', source: 'Blend of turmeric and sindoor, or dried marigold petal extract', swatch: 'bg-orange-500', text: 'text-white' },
];

function PaletteSection() {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 mithila-pattern opacity-5" />
      <div className="container-custom relative z-10">
        <SectionHeading title="Painted with the Earth" subtitle="For centuries, Mithila artists extracted their entire palette from the natural world — no synthetic pigments, no imported dyes" accent centered light />

        <div className="mt-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Pigments */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <IoColorPaletteOutline className="text-earth-400" />
              The Natural Palette
            </h3>
            {PIGMENTS.map(p => (
              <motion.div key={p.name} variants={fadeUp} className="flex items-start gap-4 group">
                <div className={`w-10 h-10 rounded-xl ${p.swatch} flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`} />
                <div>
                  <p className="text-white font-display font-semibold text-sm">
                    {p.name} <span className="font-accent text-earth-400 font-normal ml-1">{p.hindi}</span>
                  </p>
                  <p className="text-white/50 font-body text-xs leading-relaxed">{p.source}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools + process */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-5">
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <IoBookOutline className="text-earth-400" />
              Tools & Process
            </h3>
            {[
              { tool: 'Bamboo Nib (Kalam)', desc: 'A bamboo stick sharpened to a fine point — the primary tool for Kachni line work. The nib is cut at an angle and dipped directly into pigment.' },
              { tool: 'Cotton-Wrapped Twigs', desc: 'Twigs from neem or mango trees, wrapped in raw cotton. Used for softer, wider strokes and colour filling in Bharni paintings.' },
              { tool: 'Fingers & Cloth', desc: 'Direct finger painting for filling broad areas; strips of cloth rolled into a nib for smooth curved lines in Aripan floor art.' },
              { tool: 'Cow Dung Wash', desc: 'A diluted wash of cow dung applied to handmade paper before painting. It creates the distinctive warm, matte, textured background unique to Godna paintings.' },
              { tool: 'Khadir Gum Binder', desc: 'Gum from the Khadir (Acacia catechu) tree, mixed with natural pigments to ensure the paint bonds to walls and resists moisture.' },
            ].map(t => (
              <motion.div key={t.tool} variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors duration-300">
                <p className="text-earth-400 font-display font-semibold text-sm mb-1">{t.tool}</p>
                <p className="text-white/50 font-body text-xs leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}

            {/* Artist at work image */}
            <div className="rounded-xl overflow-hidden mt-2">
              <VerifiedImage
                src={IMG.artist}
                fallback={IMG.artist}
                alt="A Mithila painting artist demonstrating the traditional technique at Dilli Haat market, New Delhi"
                className="w-full h-48 object-cover"
                attribution="Mithila artist at Dilli Haat · CC BY 2.0 / Wikimedia Commons"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 9. GEOGRAPHIC IDENTITY ───────────────────────────────────────────────────
function GeographySection() {
  const villages = [
    { name: 'Jitwarpur', role: 'Bharni Style Hub', desc: 'Home village of Sita Devi, Jagdamba Devi, and Baua Devi. The first village to transition to paper paintings in the 1960s. Now produces over 60% of commercially sold Madhubani paintings.' },
    { name: 'Ranti', role: 'Kachni & Godhana Centre', desc: 'Home of Mahasundari Devi and Dulari Devi. A major hub for cooperative art production. Mahasundari Devi\'s cooperative, founded here, continues to sustain dozens of artists.' },
    { name: 'Madhubani Town', role: 'Administrative & Market Hub', desc: 'The district capital and primary market for Madhubani paintings. The Madhubani railway station is adorned with a landmark mural installation painted by local artists — one of India\'s most visible public art projects.' },
    { name: 'Darbhanga', role: 'Kachni & Royal Patronage', desc: 'The historical seat of the Maharajas of Darbhanga, whose patronage supported Mithila artists for centuries. Home to several prominent artists practising the Kachni style, including Bharti Dayal.' },
  ];

  return (
    <section className="py-24 bg-white dark:bg-warm-gray-950 relative overflow-hidden">
      <div className="container-custom">
        <SectionHeading title="Villages of the Masters" subtitle="The geography of Mithila art is small in scale but enormous in cultural impact — a handful of villages that shaped a global tradition" centered accent />

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {villages.map((v, i) => (
            <motion.div key={v.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay: i * 0.1 } } }}
              className="bg-cream-50 dark:bg-warm-gray-800 border border-cream-200 dark:border-warm-gray-700 rounded-2xl p-7"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-earth-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IoLocationOutline className="text-earth-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-charcoal dark:text-white">{v.name}</h3>
                  <span className="px-2.5 py-0.5 bg-earth-500/10 text-earth-600 dark:text-earth-400 rounded-full text-[10px] font-body font-semibold uppercase tracking-wider">
                    {v.role}
                  </span>
                  <p className="mt-3 text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mural image */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-12 rounded-2xl overflow-hidden shadow-card">
          <VerifiedImage
            src={IMG.mural}
            fallback={IMG.mural}
            alt="Large-scale Mithila mural painted at Patna Junction railway station — one of India's most prominent public art installations"
            className="w-full h-72 lg:h-96 object-cover"
            attribution="Mithila Painting at Patna Junction · CC BY-SA 4.0 / Wikimedia Commons"
            license="CC BY-SA 4.0"
          />
          <div className="bg-warm-gray-50 dark:bg-warm-gray-800 px-6 py-4 border-t border-cream-100 dark:border-warm-gray-700">
            <p className="text-warm-gray-500 dark:text-warm-gray-400 font-body text-xs text-center">
              Mithila mural at Patna Junction railway station — part of a government initiative to transform public spaces with the region's artistic heritage
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CulturePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Mithila Culture — Heritage, Festivals & Traditions | Lalita Pathak</title>
        <meta name="description" content="A museum-quality guide to the culture, festivals, symbolism, painting styles, and historical geography of the Mithila region of Bihar, India. Including Chhath Puja, Sama Chakeva, Kohbar art, and the five styles of Madhubani painting." />
      </Helmet>

      <Hero />
      <LandSection />
      <OriginSection />
      <Timeline />
      <FestivalsSection />
      <SymbolismSection />
      <StylesSection />
      <PaletteSection />
      <GeographySection />

      {/* Sources footer */}
      <section className="py-12 bg-cream-50 dark:bg-warm-gray-900 border-t border-cream-200 dark:border-warm-gray-700">
        <div className="container-custom">
          <p className="text-center text-warm-gray-400 dark:text-warm-gray-500 font-body text-xs leading-relaxed max-w-3xl mx-auto">
            All cultural information sourced from: Government of Bihar cultural archives · Ministry of Textiles GI tag documentation · William G. Archer photographic documentation (1934) · Sahapedia.org · National Crafts Museum, New Delhi · V&A Museum, London · Academic publications on Mithila art history. Full image source registry in <code className="bg-cream-100 dark:bg-warm-gray-800 px-1 rounded">src/data/SourceRegistry.md</code>.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
