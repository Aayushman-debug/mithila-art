import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/ui/SectionHeading';
import { IoFlowerOutline, IoMusicalNotesOutline, IoRestaurantOutline, IoPeopleOutline, IoSunnyOutline, IoLeafOutline, IoColorPaletteOutline, IoWaterOutline } from 'react-icons/io5';

// Local Mithila artwork
const fishArtwork = '/paintings/fish.jpeg';
const peacockArtwork = '/paintings/peacockOne.jpeg';
const brideArtwork = '/paintings/bride.jpeg';
const shivParvatiArtwork = '/paintings/Shivparvatimarriage.jpeg';
const lotusKrishnaArtwork = '/paintings/idkthecontext.jpeg';
const sunYantraArtwork = '/paintings/WhatsApp Image 2026-05-25 at 5.40.19 PM.jpeg';
const ganesha_lotus = '/paintings/WhatsApp Image 2026-05-25 at 8.28.30 AM.jpeg';
const multiple_figures = '/paintings/WhatsApp Image 2026-05-25 at 5.37.33 PM.jpeg';

// Wikimedia Commons - Authentic Mithila Art
const imgHero = shivParvatiArtwork; // Beautiful traditional Mithila wedding scene
const imgOrigins = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_art.jpg';
const imgSita = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg';
const imgKohbar = 'https://commons.wikimedia.org/wiki/Special:FilePath/Kohbar_Ghar.jpg';
const imgFish = fishArtwork; // Local Mithila fish motif artwork
const imgPeacock = peacockArtwork; // Local Mithila peacock artwork
const imgGodhana = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_art_from_Bihar.jpg';
const imgBharni = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mithila_Painting_-_Krishna_with_Gopis.jpg';
const imgKachni = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mithila_Painting_Display.jpg';
const imgTantrik = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_painting.jpg';
const imgTree = 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree_of_life_in_Madhubani_Art.jpg';
// Festival images - using Mithila artwork for authentic cultural representation
const imgChhath = multiple_figures; // Traditional Mithila figures in ceremonial attire
const imgSama = brideArtwork; // Traditional Mithila artwork showcasing cultural iconography
const imgCuisine = ganesha_lotus; // Ganesha in Mithila art representing prosperity and culture
const imgLotus = lotusKrishnaArtwork; // Krishna with lotus flowers - perfect lotus symbolism
const imgTurtle = ganesha_lotus; // Using Ganesha as turtle represents Kurma avatar symbolism
const imgBamboo = multiple_figures; // Mithila figures with traditional elements
const imgSunMoon = sunYantraArtwork; // Traditional Mithila sun/yantra design with concentric circles

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function CulturePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Mithila Culture — Lalita Pathak Mithila Art Studio</title>
        <meta name="description" content="Discover the rich culture, traditions, festivals, and lifestyle of the Mithila region." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgHero})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-black/80 via-warm-black/60 to-cream-50" />
        </motion.div>
        
        <motion.div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20" style={{ opacity }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
            The Heart of <span className="text-mithila-red">Mithila</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-warm-gray-200 font-body leading-relaxed">
            A journey into the traditions, festivals, symbolism, and lifestyle of one of India's most vibrant cultural landscapes.
          </motion.p>
        </motion.div>
      </section>

      {/* 1 & 2: Origins of Mithila & Sita's Legacy */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-5" />
        <div className="container-custom relative z-10">
          
          {/* Origins */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <img src={imgOrigins} alt="Mithila Origins" className="rounded-2xl shadow-xl w-full h-[500px] object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <span className="px-3 py-1 bg-earth-500/10 text-earth-600 rounded-full text-xs font-body font-medium uppercase tracking-wider">Ancient Roots</span>
              <h2 className="font-display text-4xl font-bold text-charcoal">The Origins of Mithila</h2>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                The historical region of Mithila lies bounded by the Mahananda River in the east, the Ganges in the south, the Gandaki River in the west, and the foothills of the Himalayas in Nepal to the north. It is a region of immense historical and cultural significance in the Indian subcontinent.
              </p>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                Known as the seat of the Videha kingdom in ancient India, it was a major center of learning, philosophy, and Vedic literature. The profound intellectual heritage of this region provided the fertile ground from which its unique visual art traditions would eventually bloom.
              </p>
            </motion.div>
          </div>

          {/* Sita and Mithila */}
          <div className="grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <img src={imgSita} alt="Sita and Ram" className="rounded-2xl shadow-xl w-full h-[500px] object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
              <span className="px-3 py-1 bg-mithila-red/10 text-mithila-red rounded-full text-xs font-body font-medium uppercase tracking-wider">Mythology & Legacy</span>
              <h2 className="font-display text-4xl font-bold text-charcoal">The Birthplace of Sita</h2>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                Mithila is revered worldwide as the birthplace of Goddess Sita, the protagonist of the epic Ramayana. According to legend, King Janaka of Mithila commissioned artists to decorate the walls and courtyards of his kingdom for the wedding of his daughter, Sita, to Lord Rama.
              </p>
              <p className="text-warm-gray-600 font-body text-lg leading-relaxed">
                This divine marriage is the foundational myth of Mithila Art. For thousands of years, women in the region have continued this tradition, painting intricate murals on the mud walls of their homes (Bhitti Chitra) and the floors (Aripana) to invite divine blessings, celebrate fertility, and mark auspicious occasions like weddings and harvests.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3: Festivals and Traditions */}
      <section className="py-24 bg-cream-50">
        <div className="container-custom">
          <SectionHeading title="Festivals & Traditions" subtitle="The rhythmic cycle of celebrations that keep the art and community alive" centered accent />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-16">
            {[
              { 
                title: 'Chhath Puja', 
                desc: 'The most revered festival in Bihar, dedicated to the Sun God (Surya) and Chhathi Maiya. Celebrated over four days with strict fasting, holy bathing, and offering arghya to the rising and setting sun. Many Mithila paintings vividly depict women making offerings waist-deep in the river.', 
                icon: IoSunnyOutline, 
                color: 'text-mithila-orange',
                image: imgChhath
              },
              { 
                title: 'Sama Chakeva', 
                desc: 'A beautiful winter festival celebrating the bond between brothers and sisters. Women make clay idols of birds and characters from folklore, sing traditional songs, and finally immerse the idols. The themes of Sama Chakeva are heavily represented in local crafts and paintings.', 
                icon: IoPeopleOutline, 
                color: 'text-mithila-blue',
                image: imgSama
              },
              { 
                title: 'Vivah Rituals & Kohbar', 
                desc: 'Weddings in Mithila are deeply artistic. The Kohbar Ghar (nuptial chamber) is painted with highly symbolic art meant to bless the newlywed couple. It features the bamboo tree (lineage), lotus (purity/female energy), and various deities to ensure fertility and a prosperous union.', 
                icon: IoFlowerOutline, 
                color: 'text-mithila-red',
                image: imgKohbar
              },
              { 
                title: 'Mithila Cuisine', 
                desc: 'A culinary tradition tied closely to the land and water. The classic proverb "Paan, Maach, aur Makhan" (Betel leaf, Fish, and Fox nut) highlights the staple delicacies. The reverence for fish is so strong that it features prominently in almost all auspicious Mithila artwork.', 
                icon: IoRestaurantOutline, 
                color: 'text-earth-500',
                image: imgCuisine
              },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-48 sm:h-auto">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 sm:w-3/5">
                  <item.icon className={`text-4xl ${item.color} mb-4`} />
                  <h3 className="font-display text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                  <p className="text-warm-gray-600 font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4: Symbolism Section */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <SectionHeading title="The Language of Symbols" subtitle="Every motif in Mithila art holds deep cultural and spiritual significance" centered accent />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              { name: 'Fish (Machh)', meaning: 'Fertility, prosperity, and good luck. An essential element in wedding paintings.', icon: '🐟', img: imgFish },
              { name: 'Peacock', meaning: 'Romantic love, beauty, and religion. Often associated with Lord Krishna.', icon: '🦚', img: imgPeacock },
              { name: 'Lotus', meaning: 'Purity, female energy, and the universe. The center of the Kohbar painting.', icon: '🪷', img: imgLotus },
              { name: 'Sun & Moon', meaning: 'Long life, celestial forces, and the eternal nature of the cosmos.', icon: '🌞', img: imgSunMoon },
              { name: 'Tree of Life', meaning: 'Growth, grounding, and connection between the earth and the heavens.', icon: '🌳', img: imgTree },
              { name: 'Bamboo', meaning: 'Lineage, male energy, and rapid growth. Usually paired with the lotus.', icon: '🎋', img: imgBamboo },
              { name: 'Turtle', meaning: 'Stability, longevity, and Lord Vishnu\'s Kurma avatar.', icon: '🐢', img: imgTurtle },
            ].map((symbol, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-cream-50 dark:bg-warm-gray-800 rounded-2xl overflow-hidden border border-cream-200/50 dark:border-warm-gray-700/50 group shadow-sm hover:shadow-glass transition-all duration-500">
                <div className="h-40 overflow-hidden relative">
                  <div className="w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
                    <img src={symbol.img} alt={symbol.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-warm-black/20" />
                  <div className="absolute inset-3 border border-earth-400/0 group-hover:border-earth-500/30 rounded-lg pointer-events-none transition-all duration-500 z-10" />
                  <div className="absolute top-4 right-4 text-3xl bg-white/80 dark:bg-warm-gray-700/80 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full shadow-md z-10">{symbol.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-charcoal dark:text-warm-gray-100 mb-2">{symbol.name}</h3>
                  <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body text-sm leading-relaxed">{symbol.meaning}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5: Painting Styles */}
      <section className="py-24 bg-cream-50 border-y border-cream-200">
        <div className="container-custom">
          <SectionHeading title="The Five Distinct Styles" subtitle="Though categorized historically by caste, today these styles are practiced by all, each offering a unique visual flavor." centered accent />
          
          <div className="mt-16 space-y-8">
            {[
              { name: 'Bharni', desc: 'Meaning "to fill" in Hindi, Bharni is characterized by bold, vibrant colors filling enclosed black outlines. Traditionally practiced by Brahmin women, it predominantly features Hindu deities like Krishna, Ram, and Durga.', img: imgBharni },
              { name: 'Kachni', desc: 'A monochromatic or dual-tone style (usually black and vermilion red) characterized by intricate, incredibly fine line work. It uses detailed hatching and stippling rather than solid color fills, traditionally practiced by Kayastha women.', img: imgKachni },
              { name: 'Godhana', desc: 'Originating from the body tattoo traditions of marginalized communities (like the Dusadhs), Godhana relies on repeating patterns, circles, and concentric shapes. It often uses a distinctive wash of cow dung on the paper for a rustic background.', img: imgGodhana },
              { name: 'Kohbar', desc: 'Highly symbolic art painted specifically on the walls of the nuptial chamber to bless newlyweds. It is deeply esoteric, featuring the central lingam/yoni motif formed by a bamboo shaft piercing a lotus flower.', img: imgKohbar },
              { name: 'Tantrik', desc: 'Reserved exclusively for depicting religious texts and Tantric symbolism, these paintings involve geometric shapes, yantras, and specific deities associated with tantric worship (like Kali or Chhinnamasta).', img: imgTantrik },
            ].map((style, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`flex flex-col md:flex-row gap-6 bg-white dark:bg-warm-gray-800 rounded-2xl overflow-hidden shadow-sm border border-cream-100 dark:border-warm-gray-700 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img src={style.img} alt={style.name} className="w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <h3 className="font-display text-3xl font-bold text-charcoal dark:text-warm-gray-100 mb-4">{style.name}</h3>
                  <p className="text-warm-gray-600 dark:text-warm-gray-300 font-body leading-relaxed">{style.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6: Traditional Colors */}
      <section className="py-24 bg-warm-black text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 mithila-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-6">The Colors of the Earth</h2>
            <p className="text-warm-gray-300 font-body text-lg leading-relaxed">
              True Mithila paintings derive their vibrant palette directly from nature. Artists traditionally extracted pigments from leaves, flowers, and household spices, mixing them with gum arabic or goat's milk to ensure longevity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { color: 'Black', source: 'Soot (Kajal) or burnt straw', hex: 'bg-black text-white' },
              { color: 'Yellow', source: 'Turmeric, pollen, or lime mixed with milk of banyan leaves', hex: 'bg-yellow-400 text-yellow-900' },
              { color: 'Red', source: 'Kusum flower juice or red sandalwood', hex: 'bg-red-600 text-white' },
              { color: 'Blue', source: 'Indigo (Nil)', hex: 'bg-blue-800 text-white' },
              { color: 'Green', source: 'Wood apple tree leaves (Bael)', hex: 'bg-green-700 text-white' },
              { color: 'White', source: 'Rice powder (Pithar)', hex: 'bg-white text-gray-900' },
            ].map((color, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`${color.hex} rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center aspect-square`}>
                <h3 className="font-display font-bold text-xl mb-2">{color.color}</h3>
                <p className="font-body text-xs opacity-90">{color.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </motion.div>
  );
}
