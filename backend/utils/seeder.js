const Product = require('../models/Product');

const seedPaintings = [
  {
    productId: 'p001',
    title: 'Radha Krishna',
    price: 3499,
    category: 'kohbar',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'Hand-painted Radha Krishna Mithila artwork by Lalita Pathak created in traditional Madhubani style.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 8.02.39 AM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 8.02.39 AM.jpeg',
      '/paintings/shivparvatiblacknwhite.jpeg',
      'https://picsum.photos/seed/detail_p001_1/800/600',
      'https://picsum.photos/seed/detail_p001_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p002',
    title: 'Shiv Parvati',
    price: 2599,
    category: 'kohbar',
    size: '18 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description: 'Beautiful Shiv Parvati painting in vibrant colors.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 8.28.34 AM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 8.28.34 AM.jpeg',
      'https://picsum.photos/seed/detail_p002_1/800/600',
      'https://picsum.photos/seed/detail_p002_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p003',
    title: 'Ram Sita Darshan',
    price: 7499,
    category: 'kohbar',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'Traditional Mithila painting depicting Lord Rama, Sita, and Hanuman in devotional composition with intricate Madhubani detailing and sacred symbolism.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 5.43.37 PM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 5.43.37 PM.jpeg',
      'https://picsum.photos/seed/detail_p003_1/800/600',
      'https://picsum.photos/seed/detail_p003_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p004',
    title: 'Peacock Harmony',
    price: 4999,
    category: 'bharni',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'A vibrant Madhubani composition featuring symbolic peacocks, floral borders, and sacred folk motifs rendered in traditional Bharni style with intricate detailing.',
    image: '/paintings/peacockOne.jpeg',
    gallery: [
      '/paintings/peacockOne.jpeg',
      'https://picsum.photos/seed/detail_p004_1/800/600',
      'https://picsum.photos/seed/detail_p004_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p005',
    title: 'Bridal Kohbar Ceremony',
    price: 6299,
    category: 'kohbar',
    size: '24 × 30 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Kohbar',
    description: 'Traditional Mithila Kohbar painting depicting a sacred bridal ceremony composition with intricate folk detailing, ceremonial motifs, and symbolic elements celebrating marriage traditions.',
    image: '/paintings/bride.jpeg',
    gallery: [
      '/paintings/bride.jpeg',
      'https://picsum.photos/seed/detail_p005_1/800/600',
      'https://picsum.photos/seed/detail_p005_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p006',
    title: 'Shiv Parvati Divine Union',
    price: 8999,
    category: 'bharni',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'Traditional Madhubani painting portraying Lord Shiva and Goddess Parvati in sacred union, symbolising love, devotion, and cosmic harmony through intricate Bharni folk detailing.',
    image: '/paintings/Shivparvatimarriage.jpeg',
    gallery: [
      '/paintings/Shivparvatimarriage.jpeg',
      'https://picsum.photos/seed/detail_p006_1/800/600',
      'https://picsum.photos/seed/detail_p006_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p007',
    title: 'Matsya Avatar – Sacred Waters',
    price: 2499,
    category: 'kachni',
    size: '18 × 24 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'Traditional Madhubani artwork portraying a divine Matsya-inspired figure surrounded by sacred waters, lotus motifs, and intricate Mithila patterns symbolising life, spirituality, and devotion.',
    image: '/paintings/idkthecontext.jpeg',
    gallery: [
      '/paintings/idkthecontext.jpeg',
      'https://picsum.photos/seed/detail_p007_1/800/600',
      'https://picsum.photos/seed/detail_p007_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p008',
    title: 'Matsya – The Divine Fish',
    price: 5399,
    category: 'kachni',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'Pairs of divine fish symbolising fertility, prosperity, and marital love in Mithila culture. Rendered in traditional Madhubani style.',
    image: '/paintings/fish.jpeg',
    gallery: [
      '/paintings/fish.jpeg',
      'https://picsum.photos/seed/detail_p008_1/800/600',
      'https://picsum.photos/seed/detail_p008_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p009',
    title: 'Divine Couple Radha Krishna',
    price: 3800,
    category: 'religious',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'Lord Krishna and Radha beautifully rendered in the Kachni line-art style with striking black, red, and blue motifs under the Kadamba tree.',
    image: '/paintings/gallery_batch_1/radha_krishna_kachni.jpg',
    gallery: [
      '/paintings/gallery_batch_1/radha_krishna_kachni.jpg',
      'https://picsum.photos/seed/detail_p009_1/800/600',
      'https://picsum.photos/seed/detail_p009_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p010',
    title: 'Shiva Parvati – Eternal Union',
    price: 3799,
    category: 'godhana',
    size: '16 × 20 inches',
    medium: 'Ink on handmade paper',
    style: 'Godhana',
    description: 'Traditional Mithila artwork portraying Lord Shiva and Goddess Parvati in sacred harmony, rendered through intricate monochrome linework reflecting devotion, love, and divine balance.',
    image: '/paintings/shivparvatiblacknwhite.jpeg',
    gallery: [
      '/paintings/shivparvatiblacknwhite.jpeg',
      'https://picsum.photos/seed/detail_p010_1/800/600',
      'https://picsum.photos/seed/detail_p010_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p011',
    title: 'Goddess Durga Triumphant',
    price: 4500,
    category: 'religious',
    size: '18 × 18 inches',
    medium: 'Ink and natural dyes on handmade paper',
    style: 'Traditional Mithila',
    description: 'A powerful red monochrome depiction of Goddess Durga on her lion mount, wielding weapons in her many hands to defeat evil. Hand-painted in traditional Mithila style.',
    image: '/paintings/gallery_batch_1/durga_red.jpg',
    gallery: [
      '/paintings/gallery_batch_1/durga_red.jpg',
      'https://picsum.photos/seed/detail_p011_1/800/600',
      'https://picsum.photos/seed/detail_p011_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p012',
    title: 'Krishna Leela — Divine Herder',
    price: 4200,
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description: 'A colorful and vibrant painting in the Bharni style depicting Lord Krishna playing with a cow. Rendered with rich primary colors and traditional decorative elements.',
    image: '/paintings/gallery_batch_2/krishna_cow.jpg',
    gallery: [
      '/paintings/gallery_batch_2/krishna_cow.jpg',
      'https://picsum.photos/seed/detail_p012_1/800/600',
      'https://picsum.photos/seed/detail_p012_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p013',
    title: 'Surya Chakra — Sacred Harmony',
    price: 9499,
    category: 'tantric',
    size: '30 × 30 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Tantric',
    description: 'A radiant Mithila composition centred around a sacred chakra motif symbolising harmony, prosperity, and cosmic balance. Handcrafted using traditional Maithili detailing with intricate symbolic storytelling and vibrant natural colours.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 5.40.19 PM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 5.40.19 PM.jpeg',
      'https://picsum.photos/seed/detail_p013_1/800/600',
      'https://picsum.photos/seed/detail_p013_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p014',
    title: 'Maa Durga Mahishasura Mardini',
    price: 5800,
    category: 'religious',
    size: '24 × 24 inches',
    medium: 'Acrylic and ink on canvas',
    style: 'Kachni',
    description: 'A dramatic black and red Kachni style painting of Goddess Durga slaying the demon Mahishasura. Shows incredible detail in the linework and shading.',
    image: '/paintings/gallery_batch_1/durga_black_red.jpg',
    gallery: [
      '/paintings/gallery_batch_1/durga_black_red.jpg',
      'https://picsum.photos/seed/detail_p014_1/800/600',
      'https://picsum.photos/seed/detail_p014_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p015',
    title: 'Eternal Love Radha Krishna',
    price: 5200,
    category: 'religious',
    size: '36 × 48 inches',
    medium: 'Mixed media on canvas',
    style: 'Bharni',
    description: 'A vibrant and colorful Bharni style painting of Radha and Krishna, filled with intricate patterns, bright natural dyes, and surrounded by nature motifs.',
    image: '/paintings/gallery_batch_1/radha_krishna_bharni.jpg',
    gallery: [
      '/paintings/gallery_batch_1/radha_krishna_bharni.jpg',
      'https://picsum.photos/seed/detail_p015_1/800/600',
      'https://picsum.photos/seed/detail_p015_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p016',
    title: 'Auspicious Lord Ganesha',
    price: 4200,
    category: 'religious',
    size: '24 × 36 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description: 'An intricate portrayal of Lord Ganesha with his vahana (mouse) and a beautifully detailed peacock. Features traditional Mithila geometric borders and bright floral elements.',
    image: '/paintings/gallery_batch_1/ganesha_colored.jpg',
    gallery: [
      '/paintings/gallery_batch_1/ganesha_colored.jpg',
      'https://picsum.photos/seed/detail_p016_1/800/600',
      'https://picsum.photos/seed/detail_p016_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p017',
    title: 'Radha Krishna — Kadamba Tree',
    price: 3500,
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'An exquisite black and white Kachni painting with delicate red and yellow accents. It portrays the eternal love of Radha and Krishna standing gracefully under a Kadamba tree.',
    image: '/paintings/gallery_batch_2/radha_krishna_kachni_2.jpg',
    gallery: [
      '/paintings/gallery_batch_2/radha_krishna_kachni_2.jpg',
      'https://picsum.photos/seed/detail_p017_1/800/600',
      'https://picsum.photos/seed/detail_p017_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p018',
    title: 'Vighnaharta Ganesha',
    price: 2800,
    category: 'religious',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'A striking contemporary take on Lord Ganesha using a unique pink palette. Masterfully detailed in the Kachni line-art style alongside his faithful vahana, Mooshak.',
    image: '/paintings/gallery_batch_2/ganesha_pink.jpg',
    gallery: [
      '/paintings/gallery_batch_2/ganesha_pink.jpg',
      'https://picsum.photos/seed/detail_p018_1/800/600',
      'https://picsum.photos/seed/detail_p018_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p019',
    title: 'Mithila Wearable Art Saree',
    price: 7500,
    category: 'contemporary',
    size: 'Saree',
    medium: 'Fabric paint on silk',
    style: 'Wearable Art',
    description: 'Authentic, hand-painted wearable art. This stunning silk saree is intricately hand-painted with traditional Mithila motifs, transforming an ancient art form into a breathtaking fashion statement.',
    image: '/paintings/gallery_batch_2/painted_saree.jpg',
    gallery: [
      '/paintings/gallery_batch_2/painted_saree.jpg',
      'https://picsum.photos/seed/detail_p019_1/800/600',
      'https://picsum.photos/seed/detail_p019_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p020',
    title: 'Kamal Talab — The Lotus Pond',
    price: 2099,
    category: 'nature',
    size: '16 × 20 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'A tranquil lotus pond teeming with fish and turtles. The painting captures the sacred geometry of nature — repeating petal forms, concentric ripples, and interlocking leaf patterns.',
    image: 'https://picsum.photos/seed/mithila20/800/600',
    gallery: [
      'https://picsum.photos/seed/mithila20/800/600',
      'https://picsum.photos/seed/detail_p020_1/800/600',
      'https://picsum.photos/seed/detail_p020_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p021',
    title: 'Ram-Sita Vivah — The Divine Wedding',
    price: 6499,
    category: 'religious',
    size: '30 × 40 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'The celestial wedding of Lord Ram and Sita in the court of King Janaka at Janakpur. This grand composition features dozens of figures, ornate architecture, and sacred fire — a crown jewel of Mithila narrative art.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 5.37.33 PM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 5.37.33 PM.jpeg',
      'https://picsum.photos/seed/detail_p021_1/800/600',
      'https://picsum.photos/seed/detail_p021_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p022',
    title: 'Krishna Leela — Butter Thief',
    price: 2999,
    category: 'religious',
    size: '20 × 24 inches',
    medium: 'Acrylic on canvas',
    style: 'Bharni',
    description: 'Baby Krishna caught stealing butter, surrounded by adoring gopis. Playful, charming, and richly detailed — a beloved narrative from the Bhagavata Purana.',
    image: 'https://picsum.photos/seed/mithila22/800/600',
    gallery: [
      'https://picsum.photos/seed/mithila22/800/600',
      'https://picsum.photos/seed/detail_p022_1/800/600',
      'https://picsum.photos/seed/detail_p022_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p023',
    title: 'Durga Mahishasura Mardini',
    price: 5599,
    category: 'religious',
    size: '24 × 36 inches',
    medium: 'Natural dyes on handmade paper',
    style: 'Bharni',
    description: 'Goddess Durga in her ten-armed form, slaying the buffalo demon Mahishasura. A powerful, dynamic composition in the classic Bharni palette of red, yellow, and black.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 8.28.36 AM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 8.28.36 AM.jpeg',
      'https://picsum.photos/seed/detail_p023_1/800/600',
      'https://picsum.photos/seed/detail_p023_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  },
  {
    productId: 'p024',
    title: 'Lord Ganesh',
    price: 3199,
    category: 'religious',
    size: '24 × 30 inches',
    medium: 'Ink on handmade paper',
    style: 'Kachni',
    description: 'Intricate Lord Ganesh Mithila artwork rendered in traditional Kachni style featuring fine line detailing, sacred symbolism, and handcrafted Maithili artistry.',
    image: '/paintings/WhatsApp Image 2026-05-25 at 8.28.30 AM.jpeg',
    gallery: [
      '/paintings/WhatsApp Image 2026-05-25 at 8.28.30 AM.jpeg',
      'https://picsum.photos/seed/detail_p024_1/800/600',
      'https://picsum.photos/seed/detail_p024_2/800/600'
    ],
    availabilityStatus: 'available',
    stock: 1,
    available: true
  }
];

const Collection = require('../models/Collection');

const seedProducts = async () => {
  try {
    console.log('Database seeding checks started...');
    for (const item of seedPaintings) {
      const exists = await Product.findOne({ productId: item.productId });
      if (!exists) {
        const product = new Product(item);
        await product.save();
        console.log(`✓ Seeded missing product: ${item.title} (${item.productId})`);
      }
    }
    console.log('✓ Seeding database verification complete.');

    // Auto-migration logic for Collections
    const collectionCount = await Collection.countDocuments();
    if (collectionCount === 0) {
      console.log('No collections found. Running auto-migration...');
      const products = await Product.find({ collectionId: { $exists: false } });
      console.log(`Found ${products.length} products to migrate.`);

      const titleGroups = {};
      for (const product of products) {
        if (!titleGroups[product.title]) {
          titleGroups[product.title] = [];
        }
        titleGroups[product.title].push(product);
      }

      let orderIndex = 0;
      for (const title in titleGroups) {
        const group = titleGroups[title];
        const firstProduct = group[0];

        const collection = new Collection({
          collectionId: `c_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          title: title,
          titleHindi: firstProduct.titleHindi || '',
          description: firstProduct.description,
          coverImage: firstProduct.image || (firstProduct.gallery && firstProduct.gallery[0]) || '',
          category: firstProduct.category,
          orderIndex: orderIndex++,
          isFeatured: firstProduct.featured || false,
        });

        const savedCollection = await collection.save();
        console.log(`Created Collection: ${title}`);

        for (const product of group) {
          product.collectionId = savedCollection._id;
          if (product.image && (!product.images || product.images.length === 0)) {
            product.images = [{ url: product.image, public_id: '' }];
          } else if (product.gallery && product.gallery.length > 0 && (!product.images || product.images.length === 0)) {
            product.images = product.gallery.map(img => ({ url: img, public_id: '' }));
          }
          await product.save();
        }
      }
      console.log('✓ Auto-migration complete!');
    }

  } catch (error) {
    console.error('✗ Product seeding/migration failed:', error);
  }
};

module.exports = seedProducts;
