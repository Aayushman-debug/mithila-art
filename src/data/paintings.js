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
import shivParvatiMarriage from "../assets/paintings/Shivparvatimarriage.jpeg";
import fish from "../assets/paintings/fish.jpeg";
import idkthecontext from '../assets/paintings/idkthecontext.jpeg';
import shivparvatiblackwhite from '../assets/paintings/shivparvatiblacknwhite.jpeg';

import durgaRed from '../assets/paintings/gallery_batch_1/durga_red.jpg';
import radhaKrishnaKachni from '../assets/paintings/gallery_batch_1/radha_krishna_kachni.jpg';
import radhaKrishnaBharni from '../assets/paintings/gallery_batch_1/radha_krishna_bharni.jpg';
import ganeshaColored from '../assets/paintings/gallery_batch_1/ganesha_colored.jpg';
import durgaBlackRed from '../assets/paintings/gallery_batch_1/durga_black_red.jpg';

import krishnaCow from '../assets/paintings/gallery_batch_2/krishna_cow.jpg';
import radhaKrishnaKachni2 from '../assets/paintings/gallery_batch_2/radha_krishna_kachni_2.jpg';
import ganeshaPink from '../assets/paintings/gallery_batch_2/ganesha_pink.jpg';
import paintedSaree from '../assets/paintings/gallery_batch_2/painted_saree.jpg';
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
	images: [radhaKrishna1, shivparvatiblackwhite, 'https://picsum.photos/seed/detail_p001_1/800/600', 'https://picsum.photos/seed/detail_p001_2/800/600'],
    category: 'kohbar',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      ' Hand-painted Radha Krishna Mithila artwork by Lalita Pathak created in traditional Madhubani style.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: false,
  },
  {
    id: 'p002',
    title: 'Shiv Parvati',
    titleHindi: 'कोहबर — कमल और मछली तालाब',
    artist: 'Lalita Pathak',
    price: 2599,
	images: [shivParvatiPainting, 'https://picsum.photos/seed/detail_p002_1/800/600', 'https://picsum.photos/seed/detail_p002_2/800/600'],
    category: 'kohbar',
    size: '18 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      '',
    inStock: true,
    availabilityStatus: 'available',
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
	images: [ramSitaDarshan, 'https://picsum.photos/seed/detail_p003_1/800/600', 'https://picsum.photos/seed/detail_p003_2/800/600'],
    category: 'kohbar',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'Traditional Mithila painting depicting Lord Rama, Sita, and Hanuman in devotional composition with intricate Madhubani detailing and sacred symbolism.',
    inStock: true,
    availabilityStatus: 'available',
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
   images: [peacockOne, 'https://picsum.photos/seed/detail_p004_1/800/600', 'https://picsum.photos/seed/detail_p004_2/800/600'],
   category: 'bharni',
   size: '30 × 40 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Bharni',
   description:
     'A vibrant Madhubani composition featuring symbolic peacocks, floral borders, and sacred folk motifs rendered in traditional Bharni style with intricate detailing.',
   inStock: true,
   availabilityStatus: 'available',
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
   images: [bridePainting, 'https://picsum.photos/seed/detail_p005_1/800/600', 'https://picsum.photos/seed/detail_p005_2/800/600'],
   category: 'kohbar',
   size: '24 × 30 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Kohbar',
   description:
     'Traditional Mithila Kohbar painting depicting a sacred bridal ceremony composition with intricate folk detailing, ceremonial motifs, and symbolic elements celebrating marriage traditions.',
   inStock: true,
   availabilityStatus: 'available',
   featured: true,
   isNew: false,
  },
  {
   id: 'p006',
   title: 'Shiv Parvati Divine Union',
   titleHindi: 'शिव पार्वती मिलन',
   artist: 'Lalita Pathak',
  price: 8999,
   images: [shivParvatiMarriage, 'https://picsum.photos/seed/detail_p006_1/800/600', 'https://picsum.photos/seed/detail_p006_2/800/600'],
   category: 'bharni',
   size: '24 × 36 inches',
   medium: 'Natural dyes on handmade paper',
   style: 'Bharni',
   description:
     'Traditional Madhubani painting portraying Lord Shiva and Goddess Parvati in sacred union, symbolising love, devotion, and cosmic harmony through intricate Bharni folk detailing.',
   inStock: true,
   availabilityStatus: 'available',
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
    images: [idkthecontext, 'https://picsum.photos/seed/detail_p007_1/800/600', 'https://picsum.photos/seed/detail_p007_2/800/600'],
    category: 'kachni',
    size: '18 × 24 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Traditional Madhubani artwork portraying a divine Matsya-inspired figure surrounded by sacred waters, lotus motifs, and intricate Mithila patterns symbolising life, spirituality, and devotion.',
    inStock: true,
    availabilityStatus: 'available',
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
    images: [fish, 'https://picsum.photos/seed/detail_p008_1/800/600', 'https://picsum.photos/seed/detail_p008_2/800/600'],
    category: 'kachni',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Pairs of divine fish symbolising fertility, prosperity, and marital love in Mithila culture. Rendered in traditional Madhubani style.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: false,
  },
  {
    id: 'p009',
    title: 'Divine Couple Radha Krishna',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 3800,
    images: [radhaKrishnaKachni, 'https://picsum.photos/seed/detail_p009_1/800/600', 'https://picsum.photos/seed/detail_p009_2/800/600'],
    category: 'religious',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Lord Krishna and Radha beautifully rendered in the Kachni line-art style with striking black, red, and blue motifs under the Kadamba tree.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },

  // ── Godhana ─────────────────────────────────────────────
  {
    id: 'p010',
    title: 'Shiva Parvati – Eternal Union',
    titleHindi: 'शिव पार्वती – शाश्वत मिलन',
    artist: 'Lalita Pathak',
    price: 3799,
    originalPrice: 40000,
    images: [shivparvatiblackwhite, 'https://picsum.photos/seed/detail_p010_1/800/600', 'https://picsum.photos/seed/detail_p010_2/800/600'],
    category: 'godhana',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Godhana',
    description:
      'Traditional Mithila artwork portraying Lord Shiva and Goddess Parvati in sacred harmony, rendered through intricate monochrome linework reflecting devotion, love, and divine balance.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: true,
  },
  {
    id: 'p011',
    title: 'Goddess Durga Triumphant',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 4500,
    images: [durgaRed, 'https://picsum.photos/seed/detail_p011_1/800/600', 'https://picsum.photos/seed/detail_p011_2/800/600'],
    category: 'religious',
    size: '18 × 18 inches',
    medium: 'Ink and natural dyes on handmade paper',
    style: 'Traditional Mithila',
    description:
      'A powerful red monochrome depiction of Goddess Durga on her lion mount, wielding weapons in her many hands to defeat evil. Hand-painted in traditional Mithila style.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },
  {
    id: 'p012',
    title: 'Krishna Leela — Divine Herder',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 4200,
    images: [krishnaCow, 'https://picsum.photos/seed/detail_p012_1/800/600', 'https://picsum.photos/seed/detail_p012_2/800/600'],
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      'A colorful and vibrant painting in the Bharni style depicting Lord Krishna playing with a cow. Rendered with rich primary colors and traditional decorative elements.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },

  // ── Tantric ─────────────────────────────────────────────
  {
    id: 'p013',
    title: 'Surya Chakra — Sacred Harmony',
    titleHindi: 'सूर्य चक्र — पवित्र समरसता',
    artist: 'Lalita Pathak',

    price: 9499,
	images: [suryaChakra1, 'https://picsum.photos/seed/detail_p013_1/800/600', 'https://picsum.photos/seed/detail_p013_2/800/600'],
    category: 'tantric',
    size: '30 × 30 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Tantric',
    description:
      'A radiant Mithila composition centred around a sacred chakra motif symbolising harmony, prosperity, and cosmic balance. Handcrafted using traditional Maithili detailing with intricate symbolic storytelling and vibrant natural colours.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: false,
  },
  {
    id: 'p014',
    title: 'Maa Durga Mahishasura Mardini',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 5800,
    originalPrice: 7000,
    images: [durgaBlackRed, 'https://picsum.photos/seed/detail_p014_1/800/600', 'https://picsum.photos/seed/detail_p014_2/800/600'],
    category: 'religious',
    size: '24 × 24 inches',
    medium: 'Acrylic and ink on canvas',
    style: 'Kachni',
    description:
      'A dramatic black and red Kachni style painting of Goddess Durga slaying the demon Mahishasura. Shows incredible detail in the linework and shading.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },

  // ── Contemporary ────────────────────────────────────────
  {
    id: 'p015',
    title: 'Eternal Love Radha Krishna',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 5200,
    images: [radhaKrishnaBharni, 'https://picsum.photos/seed/detail_p015_1/800/600', 'https://picsum.photos/seed/detail_p015_2/800/600'],
    category: 'religious',
    size: '36 × 48 inches',
    medium: 'Mixed media on canvas',
    style: 'Bharni',
    description:
      'A vibrant and colorful Bharni style painting of Radha and Krishna, filled with intricate patterns, bright natural dyes, and surrounded by nature motifs.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: true,
  },
  {
    id: 'p016',
    title: 'Auspicious Lord Ganesha',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 4200,
    images: [ganeshaColored, 'https://picsum.photos/seed/detail_p016_1/800/600', 'https://picsum.photos/seed/detail_p016_2/800/600'],
    category: 'religious',
    size: '24 × 36 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      'An intricate portrayal of Lord Ganesha with his vahana (mouse) and a beautifully detailed peacock. Features traditional Mithila geometric borders and bright floral elements.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },
  {
    id: 'p017',
    title: 'Radha Krishna — Kadamba Tree',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 3500,
    images: [radhaKrishnaKachni2, 'https://picsum.photos/seed/detail_p017_1/800/600', 'https://picsum.photos/seed/detail_p017_2/800/600'],
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'An exquisite black and white Kachni painting with delicate red and yellow accents. It portrays the eternal love of Radha and Krishna standing gracefully under a Kadamba tree.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: true,
  },

  // ── Nature ──────────────────────────────────────────────
  {
    id: 'p018',
    title: 'Vighnaharta Ganesha',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 2800,
    images: [ganeshaPink, 'https://picsum.photos/seed/detail_p018_1/800/600', 'https://picsum.photos/seed/detail_p018_2/800/600'],
    category: 'religious',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'A striking contemporary take on Lord Ganesha using a unique pink palette. Masterfully detailed in the Kachni line-art style alongside his faithful vahana, Mooshak.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: true,
  },
  {
    id: 'p019',
    title: 'Mithila Wearable Art Saree',
    titleHindi: '',
    artist: 'Lalita Pathak',
    price: 7500,
    images: [paintedSaree, 'https://picsum.photos/seed/detail_p019_1/800/600', 'https://picsum.photos/seed/detail_p019_2/800/600'],
    category: 'contemporary',
    size: 'Saree',
    medium: 'Fabric paint on silk',
    style: 'Wearable Art',
    description:
      'Authentic, hand-painted wearable art. This stunning silk saree is intricately hand-painted with traditional Mithila motifs, transforming an ancient art form into a breathtaking fashion statement.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: true,
  },
  {
    id: 'p020',
    title: 'Kamal Talab — The Lotus Pond',
    titleHindi: 'कमल तालाब — कमल सरोवर',
    artist: 'Shanti Devi',
    price: 2099,
    images: ['https://picsum.photos/seed/mithila20/800/600', 'https://picsum.photos/seed/detail_p020_1/800/600', 'https://picsum.photos/seed/detail_p020_2/800/600'],
    category: 'nature',
    size: '16 × 20 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'A tranquil lotus pond teeming with fish and turtles. The painting captures the sacred geometry of nature — repeating petal forms, concentric ripples, and interlocking leaf patterns.',
    inStock: true,
    availabilityStatus: 'available',
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
    images: ['/src/assets/paintings/WhatsApp Image 2026-05-25 at 5.37.33 PM.jpeg', 'https://picsum.photos/seed/detail_p021_1/800/600', 'https://picsum.photos/seed/detail_p021_2/800/600'],
    category: 'religious',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'The celestial wedding of Lord Ram and Sita in the court of King Janaka at Janakpur. This grand composition features dozens of figures, ornate architecture, and sacred fire — a crown jewel of Mithila narrative art.',
    inStock: true,
    availabilityStatus: 'available',
    featured: true,
    isNew: false,
  },
  {
    id: 'p022',
    title: 'Krishna Leela — Butter Thief',
    titleHindi: 'कृष्ण लीला — माखन चोर',
    artist: 'Godavari Dutta',
    price: 2999,
    images: ['https://picsum.photos/seed/mithila22/800/600', 'https://picsum.photos/seed/detail_p022_1/800/600', 'https://picsum.photos/seed/detail_p022_2/800/600'],
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description:
      'Baby Krishna caught stealing butter, surrounded by adoring gopis. Playful, charming, and richly detailed — a beloved narrative from the Bhagavata Purana.',
    inStock: true,
    availabilityStatus: 'available',
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
	images: ['/src/assets/paintings/WhatsApp Image 2026-05-25 at 8.28.36 AM.jpeg', 'https://picsum.photos/seed/detail_p023_1/800/600', 'https://picsum.photos/seed/detail_p023_2/800/600'],
    category: 'religious',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description:
      'Goddess Durga in her ten-armed form, slaying the buffalo demon Mahishasura. A powerful, dynamic composition in the classic Bharni palette of red, yellow, and black.',
    inStock: true,
    availabilityStatus: 'available',
    featured: false,
    isNew: false,
  },
  {
    id: 'p024',
    title: 'Lord Ganesh',
    titleHindi: '',
    artist: 'Godavari Dutta',
    price: 3199,
	images: [ganeshPainting, 'https://picsum.photos/seed/detail_p024_1/800/600', 'https://picsum.photos/seed/detail_p024_2/800/600'],
    category: 'religious',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description:
      'Intricate Lord Ganesh Mithila artwork rendered in traditional Kachni style featuring fine line detailing, sacred symbolism, and handcrafted Maithili artistry.',
    inStock: true,
    availabilityStatus: 'available',
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
