/**
 * Mithila Art - Paintings Data
 * Complete catalog of Mithila/Madhubani paintings with categories.
 */
import radhaKrishna1 from '../assets/paintings/WhatsApp Image 2026-05-25 at 8.02.39 AM.jpeg'
import ganeshPainting from '../assets/paintings/WhatsApp Image 2026-05-25 at 8.28.30 AM.jpeg'
import suryaChakra1 from '../assets/paintings/WhatsApp Image 2026-05-25 at 5.40.19 PM.jpeg'
import ramSitaDarshan from "../assets/paintings/WhatsApp Image 2026-05-25 at 5.43.37 PM.jpeg";
import shivParvatiPainting from "../assets/paintings/WhatsApp Image 2026-05-25 at 8.28.34 AM.jpeg";
import peacockOne from "../assets/paintings/peacockOne.jpeg";
import bridePainting from "../assets/paintings/bride.jpeg";
import shivParvatiMarriage from "../assets/paintings/shivParvatiMarriage.jpeg";
import fish from "../assets/paintings/fish.jpeg";
import idkthecontext from '../assets/paintings/idkthecontext.jpeg';
import shivparvatiblackwhite from '../assets/paintings/shivparvatiblacknwhite.jpeg';
export const categories = [
  {
    id: 'kohbar',
    name: 'Kohbar',
    nameHindi: 'कोहबर',
    description:
      'Sacred wedding chamber paintings depicting fertility symbols, lotus ponds, and bamboo groves — integral to Maithil marriage rituals.',
  },
  {
    id: 'bharni',
    name: 'Bharni',
    nameHindi: 'भरनी',
    description:
      'Bold, filled-in style using vibrant primary colours. Originated from Brahmin households of the Mithila region.',
  },
  {
    id: 'kachni',
    name: 'Kachni',
    nameHindi: 'कचनी',
    description:
      'Delicate fine-line work using a single colour — typically red or black — with intricate hatching and cross-hatching.',
  },
  {
    id: 'godhana',
    name: 'Godhana',
    nameHindi: 'गोदना',
    description:
      'Tattoo-inspired motifs originally from the Dalit community, featuring geometric patterns and everyday rural life.',
  },
  {
    id: 'religious',
    name: 'Religious',
    nameHindi: 'धार्मिक',
    description:
      'Narrative paintings portraying episodes from the Ramayana, Krishna Leela, Durga Puja, and other Hindu mythological stories.',
  },
];

export const paintings = [
  // ── Kohbar ──────────────────────────────────────────────
  {
    id: 'p001',
    title: 'Radha Krishna',
    titleHindi: 'कोहबर — पवित्र कुञ्ज',
    artist: 'Lalita Pathak',
    price: 3499,
    originalPrice: 35000,
	images: [radhaKrishna1, shivparvatiblackwhite],
    category: 'kohbar',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      ' Hand-painted Radha Krishna Mithila artwork by Lalita Pathak created in traditional Madhubani style.',
    inStock: true,
    featured: true,
    isNew: false,
  },
  {
    id: 'p002',
    title: 'Shiv Parvati',
    titleHindi: 'कोहबर — कमल और मछली तालाब',
    artist: 'Lalita Pathak',
    price: 2599,
	images: [shivParvatiPainting],
    category: 'kohbar',
    size: '18 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      '',
    inStock: true,
    featured: false,
    isNew: true,
  },
  {
    id: 'p003',
    title: 'Ram Sita Darshan',
    titleHindi: 'राम सीता दर्शन',
    artist: 'Lalita Pathak',
    price: 7499,
    originalPrice: 50000,
	images: [ramSitaDarshan],
    category: 'kohbar',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'Traditional Mithila painting depicting Lord Rama, Sita, and Hanuman in devotional composition with intricate Madhubani detailing and sacred symbolism.',
    inStock: true,
    featured: true,
    isNew: false,
  },

  // ── Bharni ──────────────────────────────────────────────
  {
   id: 'p004',
   title: 'Peacock Harmony',
   titleHindi: 'मोर सौंदर्य',
   artist: 'Lalita Pathak',
  price: 4999,
   images: [peacockOne],
   category: 'bharni',
   size: '30 × 40 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Bharni',
   description:
     'A vibrant Madhubani composition featuring symbolic peacocks, floral borders, and sacred folk motifs rendered in traditional Bharni style with intricate detailing.',
   inStock: true,
   featured: true,
   isNew: false,
  },
  {
   id: 'p005',
   title: 'Bridal Kohbar Ceremony',
   titleHindi: 'कोहबर विवाह चित्र',
   artist: 'Lalita Pathak',
  price: 6299,
  originalPrice: 42000,
   images: [bridePainting],
   category: 'kohbar',
   size: '24 × 30 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Kohbar',
   description:
     'Traditional Mithila Kohbar painting depicting a sacred bridal ceremony composition with intricate folk detailing, ceremonial motifs, and symbolic elements celebrating marriage traditions.',
   inStock: true,
   featured: true,
   isNew: false,
  },
  {
   id: 'p006',
   title: 'Shiv Parvati Divine Union',
   titleHindi: 'शिव पार्वती मिलन',
   artist: 'Lalita Pathak',
  price: 8999,
   images: [shivParvatiMarriage],
   category: 'bharni',
   size: '24 × 36 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Bharni',
   description:
     'Traditional Madhubani painting portraying Lord Shiva and Goddess Parvati in sacred union, symbolising love, devotion, and cosmic harmony through intricate Bharni folk detailing.',
   inStock: true,
   featured: true,
   isNew: true,
   },

  // ── Kachni ──────────────────────────────────────────────
  {
    id: 'p007',
    title: 'Matsya Avatar – Sacred Waters',
    titleHindi: 'मत्स्य अवतार – पवित्र जल',
    artist: 'Lalita Pathak',
    price: 2499,
    originalPrice: 34000,
    images: [idkthecontext],
    category: 'kachni',
    size: '18 × 24 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Traditional Madhubani artwork portraying a divine Matsya-inspired figure surrounded by sacred waters, lotus motifs, and intricate Mithila patterns symbolising life, spirituality, and devotion.',
    inStock: true,
    featured: false,
    isNew: true,
  },
  {
    id: 'p008',
    title: 'Matsya – The Divine Fish',
    titleHindi: 'मत्स्य – दिव्य मछली',
    artist: 'Lalita Pathak',
    price: 5399,
    originalPrice: 45000,
    images: [fish],
    category: 'kachni',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Pairs of divine fish symbolising fertility, prosperity, and marital love in Mithila culture. Rendered in traditional Madhubani style.',
    inStock: true,
    featured: true,
    isNew: false,
  },
  {
    id: 'p009',
    title: 'Radha Krishna — Monochrome Devotion',
    titleHindi: 'राधा कृष्ण — एकरंगी भक्ति',
    artist: 'Godavari Dutta',
    price: 2199,
    images: ['https://picsum.photos/seed/mithila9/800/600'],
    category: 'kachni',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Radha and Krishna in the Vrindavan garden, portrayed through delicate black-ink Kachni linework. Every leaf and feather is built from thousands of fine, patient strokes.',
    inStock: true,
    featured: false,
    isNew: false,
  },

  // ── Godhana ─────────────────────────────────────────────
  {
    id: 'p010',
    title: 'Shiva Parvati – Eternal Union',
    titleHindi: 'शिव पार्वती – शाश्वत मिलन',
    artist: 'Lalita Pathak',
    price: 3799,
    originalPrice: 40000,
    images: [shivparvatiblackwhite],
    category: 'godhana',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Godhana',
    description:
      'Traditional Mithila artwork portraying Lord Shiva and Goddess Parvati in sacred harmony, rendered through intricate monochrome linework reflecting devotion, love, and divine balance.',
    inStock: true,
    featured: true,
    isNew: true,
  },
  {
    id: 'p011',
    title: 'Godhana Mandala — Circle of Life',
    titleHindi: 'गोदना मण्डल — जीवन चक्र',
    artist: 'Lalita Pathak',
    price: 2099,
    images: ['https://picsum.photos/seed/mithila11/800/600'],
    category: 'godhana',
    size: '18 × 18 inches',
    medium: 'Ink and natural dyes on handmade paper',
    style: 'Godhana',
    description:
      'Concentric circles of tattoo-like motifs radiate outward — sun, moon, birds, snakes, and fish — mapping the Maithil cosmos in the Godhana tradition.',
    inStock: true,
    featured: false,
    isNew: true,
  },
  {
    id: 'p012',
    title: 'Salhes — The Folk Hero',
    titleHindi: 'सलहेस — लोक नायक',
    artist: 'Dulari Devi',
    price: 2999,
    originalPrice: 26000,
    images: ['https://picsum.photos/seed/mithila12/800/600'],
    category: 'godhana',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Godhana',
    description:
      'The legendary folk hero Salhes, revered in the Mithila Dalit community, depicted in bold Godhana patterns. His story of courage and justice resonates across generations.',
    inStock: true,
    featured: false,
    isNew: false,
  },

  // ── Tantric ─────────────────────────────────────────────
  {
    id: 'p013',
    title: 'Surya Chakra — Sacred Harmony',
    titleHindi: 'सूर्य चक्र — पवित्र समरसता',
    artist: 'Lalita Pathak',

    price: 9499,
	images: [suryaChakra1],
    category: 'tantric',
    size: '30 × 30 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Tantric',
    description:
      'A radiant Mithila composition centred around a sacred chakra motif symbolising harmony, prosperity, and cosmic balance. Handcrafted using traditional Maithili detailing with intricate symbolic storytelling and vibrant natural colours.',
    inStock: true,
    featured: true,
    isNew: false,
  },
  {
    id: 'p014',
    title: 'Kali Mandala — The Dark Mother',
    titleHindi: 'काली मण्डल — श्यामा माता',
    artist: 'Lalita Pathak',
    price: 6999,
    originalPrice: 58000,
    images: ['https://picsum.photos/seed/mithila14/800/600'],
    category: 'tantric',
    size: '24 × 24 inches',
    medium: 'Acrylic and ink on canvas',
    style: 'Tantric',
    description:
      'A fierce Kali Mandala painted in deep indigo and vermillion. The concentric skulls and lotus petals represent the eternal cycle of creation and dissolution.',
    inStock: true,
    featured: false,
    isNew: false,
  },

  // ── Contemporary ────────────────────────────────────────
  {
    id: 'p015',
    title: 'Metro Mithila — Urban Roots',
    titleHindi: 'मेट्रो मिथिला — शहरी जड़ें',
    artist: 'Bharti Dayal',
    price: 9999,
    images: ['https://picsum.photos/seed/mithila15/800/600'],
    category: 'contemporary',
    size: '36 × 48 inches',
    medium: 'Mixed media on canvas',
    style: 'Contemporary Bharni',
    description:
      'A bold commentary on migration and identity. Traditional Mithila fish, peacocks, and lotus motifs are superimposed on metro trains, high-rises, and digital screens — bridging village and city.',
    inStock: true,
    featured: true,
    isNew: true,
  },
  {
    id: 'p016',
    title: 'Climate Canvas — Earth in Peril',
    titleHindi: 'जलवायु चित्र — संकट में पृथ्वी',
    artist: 'Ranjit Jha',
    price: 4299,
    images: ['https://picsum.photos/seed/mithila16/800/600'],
    category: 'contemporary',
    size: '24 × 36 inches',
    medium: 'Acrylic on canvas',
    style: 'Contemporary Kachni',
    description:
      'Mithila motifs meet environmental activism. Dying rivers, vanishing forests, and rising waters are depicted through traditional iconography — a visual plea for ecological awareness.',
    inStock: true,
    featured: false,
    isNew: true,
  },
  {
    id: 'p017',
    title: 'Digital Devi — Goddess Online',
    titleHindi: 'डिजिटल देवी — ऑनलाइन देवी',
    artist: 'Ranjit Jha',
    price: 2399,
    images: ['https://picsum.photos/seed/mithila17/800/600'],
    category: 'contemporary',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Contemporary Bharni',
    description:
      'Goddess Saraswati holds a smartphone instead of a veena, surrounded by WiFi symbols rendered in traditional Bharni fill. A witty meditation on knowledge in the digital age.',
    inStock: false,
    featured: false,
    isNew: true,
  },

  // ── Nature ──────────────────────────────────────────────
  {
    id: 'p018',
    title: 'Mayura — The Dancing Peacock',
    titleHindi: 'मयूर — नृत्यरत मोर',
    artist: 'Lalita Pathak',
    price: 2699,
    images: ['https://picsum.photos/seed/mithila18/800/600'],
    category: 'nature',
    size: '24 × 30 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'A magnificent peacock unfurls its iridescent tail feathers amidst mango blossoms and lotus buds. The peacock symbolises beauty, rain, and renewal in Mithila iconography.',
    inStock: true,
    featured: false,
    isNew: false,
  },
  {
    id: 'p019',
    title: 'Hathi — The Auspicious Elephant',
    titleHindi: 'हाथी — शुभ गजराज',
    artist: 'Lalita Pathak',
    price: 4799,
    originalPrice: 37000,
    images: ['https://picsum.photos/seed/mithila19/800/600'],
    category: 'nature',
    size: '24 × 36 inches',
    medium: 'Acrylic on handmade paper',
    style: 'Bharni',
    description:
      'A regal elephant adorned with ceremonial patterns strides through a floral landscape. In Mithila tradition, the elephant represents wisdom, royalty, and unwavering strength.',
    inStock: true,
    featured: false,
    isNew: false,
  },
  {
    id: 'p020',
    title: 'Kamal Talab — The Lotus Pond',
    titleHindi: 'कमल तालाब — कमल सरोवर',
    artist: 'Shanti Devi',
    price: 2099,
    images: ['https://picsum.photos/seed/mithila20/800/600'],
    category: 'nature',
    size: '16 × 20 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'A tranquil lotus pond teeming with fish and turtles. The painting captures the sacred geometry of nature — repeating petal forms, concentric ripples, and interlocking leaf patterns.',
    inStock: true,
    featured: false,
    isNew: false,
  },

  // ── Religious ───────────────────────────────────────────
  {
    id: 'p021',
    title: 'Ram-Sita Vivah — The Divine Wedding',
    titleHindi: 'राम-सीता विवाह — दिव्य विवाह',
    artist: 'Mahasundari Devi',
    price: 6499,
    images: ['/src/assets/paintings/WhatsApp Image 2026-05-25 at 5.37.33 PM.jpeg'],
    category: 'religious',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'The celestial wedding of Lord Ram and Sita in the court of King Janaka at Janakpur. This grand composition features dozens of figures, ornate architecture, and sacred fire — a crown jewel of Mithila narrative art.',
    inStock: true,
    featured: true,
    isNew: false,
  },
  {
    id: 'p022',
    title: 'Krishna Leela — Butter Thief',
    titleHindi: 'कृष्ण लीला — माखन चोर',
    artist: 'Godavari Dutta',
    price: 2999,
    images: ['https://picsum.photos/seed/mithila22/800/600'],
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      'Baby Krishna caught stealing butter, surrounded by adoring gopis. Playful, charming, and richly detailed — a beloved narrative from the Bhagavata Purana.',
    inStock: true,
    featured: false,
    isNew: false,
  },
  {
    id: 'p023',
    title: 'Durga Mahishasura Mardini',
    titleHindi: 'दुर्गा महिषासुर मर्दिनी',
    artist: 'Lalita Pathak',

    price: 5599,
    originalPrice: 52000,
	images: ['/src/assets/paintings/WhatsApp Image 2026-05-25 at 8.28.36 AM.jpeg'],
    category: 'religious',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'Goddess Durga in her ten-armed form, slaying the buffalo demon Mahishasura. A powerful, dynamic composition in the classic Bharni palette of red, yellow, and black.',
    inStock: true,
    featured: false,
    isNew: false,
  },
  {
    id: 'p024',
    title: 'Lord Ganesh',
    titleHindi: '',
    artist: 'Godavari Dutta',
    price: 3199,
	images: [ganeshPainting],
    category: 'religious',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Intricate Lord Ganesh Mithila artwork rendered in traditional Kachni style featuring fine line detailing, sacred symbolism, and handcrafted Maithili artistry.',
    inStock: true,
    featured: false,
    isNew: true,
  },
];

// Add backward-compatible `image` property (first image in array)
// so all existing components work without changes.
paintings.forEach((p) => {
  if (p.images && p.images.length > 0 && !Object.getOwnPropertyDescriptor(p, 'image')) {
    Object.defineProperty(p, 'image', {
      get() { return this.images[0]; },
      enumerable: true,
      configurable: true,
    });
  }
});

export default paintings;
