const imgSita = 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Madhubani_painting.jpg';
const imgGanga = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Madhubani_art.jpg';
const imgMaha = 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Devi6.JPG';
const imgJagdamba = 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Madhubani_Art_-_2.jpg';
const imgBaua = 'https://upload.wikimedia.org/wikipedia/commons/2/25/The_President%2C_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Smt._Baoa_Devi%2C_at_a_Civil_Investiture_Ceremony%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_March_30%2C_2017.jpg';
const imgDulari = 'https://upload.wikimedia.org/wikipedia/commons/4/41/Madhubani_Art_-_1.jpg';

export const artists = [
  {
    id: 'sita-devi',
    name: 'Sita Devi',
    born: '1914',
    died: '2005',
    village: 'Jitwarpur, Madhubani',
    style: 'Bharni',
    awards: ['Padma Shri (1981)', 'Bihar Ratna Samman (1984)', 'Shilp Guru (2006, posthumous)', 'National Award (1975)'],
    bio: 'Sita Devi was a legendary pioneer who brought Mithila art from the walls of Jitwarpur village to global prominence. Specializing in the Bharni style, she made the historic decision during the 1960s drought to transfer traditional ritualistic wall paintings onto handmade paper, ensuring the survival of the art form.',
    contributions: 'She successfully lobbied for the development of roads and schools for her village and taught the craft to hundreds of local women, empowering them to achieve financial independence.',
    legacy: 'Known as the "mother" of Jitwarpur, her work is held in major international collections including the Victoria and Albert Museum (London) and the Musée du Quai Branly (Paris).',
    achievements: ['Introduced Mithila art to international audiences', 'Empowered hundreds of local women economically'],
    famousWorks: ['Radha Krishna', 'The World Trade Center', 'Kadam Tree'],
    image: imgSita
  },
  {
    id: 'ganga-devi',
    name: 'Ganga Devi',
    born: '1928',
    died: '1991',
    village: 'Mithila Region, Bihar',
    style: 'Kachni',
    awards: ['Padma Shri (1984)', 'National Master Craftsman Award'],
    bio: 'Ganga Devi was a master of the Kachni style, characterized by extremely fine line work using intricate black-and-white outlines. After facing profound personal hardships, she found solace in art, eventually gaining international acclaim for her highly intricate and narrative-driven paintings.',
    contributions: 'Pioneered the narrative style in Mithila art, blending traditional iconography with her own life experiences and contemporary events.',
    legacy: 'Her celebrated Kohbar Ghar mural at the National Crafts Museum in New Delhi and her "America series" remain landmark achievements in Indian folk art history.',
    achievements: ['Created the famous "America Series"', 'Painted the Crafts Museum mural in New Delhi'],
    famousWorks: ['Ride in a Roller Coaster', 'Moscow Hotel', 'Kohbar Ghar'],
    image: imgGanga
  },
  {
    id: 'mahasundari-devi',
    name: 'Mahasundari Devi',
    born: '1922',
    died: '2013',
    village: 'Chatra, Bihar',
    style: 'Bharni & Kachni',
    awards: ['Padma Shri (2011)', 'Tulsi Samman (1995)', 'National Award (1982)', 'Shilp Guru (2007)'],
    bio: 'Breaking traditional social barriers, Mahasundari Devi famously moved beyond the purdah system in 1961 to practice her art publicly. She was a prolific artist and a fierce advocate for women\'s independence through art.',
    contributions: 'Founded the Mithila Hastashilp Kalakar Audyogki Sahyog Samiti, an artists\' cooperative that empowered and supported local women.',
    legacy: 'Beyond painting, she was skilled in sikki grasswork and papier-mâché, inspiring generations of women to pursue art professionally.',
    achievements: ['Established an artist cooperative', 'Created murals at Madhubani railway station'],
    famousWorks: ['Kohbar', 'Sita Swayamvar', 'Sanmaika Panels'],
    image: imgMaha
  },
  {
    id: 'jagdamba-devi',
    name: 'Jagdamba Devi',
    born: '1901',
    died: '1984',
    village: 'Jitwarpur, Madhubani',
    style: 'Traditional/Bharni',
    awards: ['Padma Shri (1975)', 'National Award (1970)'],
    bio: 'Jagdamba Devi was a pioneering master of Madhubani painting and the very first artist of this tradition to receive prestigious national recognition in India. Orphaned at a young age, she possessed a profound, intuitive approach to art.',
    contributions: 'Elevated Madhubani art from a domestic ritual practice to a globally recognized fine art in the early 1960s with the encouragement of the All India Handicrafts Board.',
    legacy: 'She was particularly noted for her mastery of natural pigments, famously preparing her signature red color using a mixture of gum and goat milk.',
    achievements: ['First Madhubani artist to receive the National Award', 'First Madhubani artist to receive the Padma Shri'],
    famousWorks: ['Dashavatar', 'Krishna Leela', 'Traditional Kohbar'],
    image: imgJagdamba
  },
  {
    id: 'baua-devi',
    name: 'Baua Devi',
    born: '1940',
    died: null,
    village: 'Jitwarpur, Madhubani',
    style: 'Bharni',
    awards: ['Padma Shri (2017)', 'National Award (1984)'],
    bio: 'Baua Devi was the youngest of the original group of artists who transferred wall paintings to paper in the 1960s. Her bold, imaginative reinterpretations of mythological themes, particularly snake motifs, are highly celebrated.',
    contributions: 'Consistently experimented with scale and surrealism while maintaining traditional Mithila motifs, often depicting stories from a female perspective.',
    legacy: 'She is the only Mithila artist to have her work included in the seminal "Magiciens de la Terre" exhibition at the Centre Pompidou in Paris in 1989.',
    achievements: ['Exhibited at Centre Pompidou (1989)', 'Pioneered large-scale Mithila canvases'],
    famousWorks: ['Naga Kanya (Snake Maiden) Series', 'Cosmic Serpent', 'Sita\'s Agnipariksha'],
    image: imgBaua
  },
  {
    id: 'dulari-devi',
    name: 'Dulari Devi',
    born: '1968',
    died: null,
    village: 'Ranti, Madhubani',
    style: 'Kachni & Bharni',
    awards: ['Padma Shri (2021)', 'State Award, Bihar (2012)'],
    bio: 'Born into a marginalized fishing community and working initially as a domestic helper for Mahasundari Devi, Dulari Devi\'s journey is legendary. Mentored by master artists, she became a renowned artist and instructor.',
    contributions: 'Introduced scenes of her fishing community, everyday rural life, and personal struggles into the traditionally mythology-dominated Mithila painting landscape.',
    legacy: 'Her life story is documented in her celebrated autobiography "Following My Paintbrush" (2011), serving as a massive inspiration for underprivileged artists.',
    achievements: ['Instructor at the Mithila Art Institute', 'Authored "Following My Paintbrush"'],
    famousWorks: ['Village Life Series', 'Following My Paint Brush (Illustrations)', 'Kamla River Rituals'],
    image: imgDulari
  }
];
