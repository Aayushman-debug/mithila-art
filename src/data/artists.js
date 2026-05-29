const imgSita = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_art.jpg';
const imgGanga = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mithila_Painting_-_Krishna_with_Gopis.jpg';
const imgMaha = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_Painting.jpg';
const imgDulari = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_painting_from_bihar.jpg';
const imgGodavari = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mithila_Painting_Display.jpg';
const imgBaua = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_art_from_Bihar.jpg';
const imgBharti = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mithila_art.jpg';
const imgYamuna = 'https://commons.wikimedia.org/wiki/Special:FilePath/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg';

export const artists = [
  {
    id: 'sita-devi',
    name: 'Sita Devi',
    born: '1914',
    died: '2005',
    village: 'Jitwarpur, Madhubani',
    style: 'Bharni',
    awards: ['Padma Shri (1981)', 'Bihar Ratna (1984)', 'Shilp Guru (2006, posthumous)'],
    bio: 'Sita Devi was a pioneer who brought Mithila art from the walls of Jitwarpur village to global prominence. Specializing in the Bharni style, she was instrumental in translating the ancient wall murals onto paper, ensuring the survival and commercial viability of the art form.',
    contributions: 'She was one of the first artists to transfer traditional wall paintings to paper, helping create a new economic lifeline for the women of Mithila.',
    legacy: 'Her work is displayed in museums worldwide, including the Victoria and Albert Museum in London.',
    achievements: ['Introduced Mithila art to international audiences', 'Empowered hundreds of local women economically'],
    famousWorks: ['Radha Krishna', 'Sita Swayamvar', 'Kadam Tree'],
    image: imgSita
  },
  {
    id: 'ganga-devi',
    name: 'Ganga Devi',
    born: '1928',
    died: '1991',
    village: 'Rasidpur, Madhubani',
    style: 'Kachni',
    awards: ['Padma Shri (1984)', 'National Master Craftsman Award (1976)'],
    bio: 'Ganga Devi was a master of the Kachni style, characterized by fine line work using natural dyes. After facing personal hardships, she found solace in art, eventually gaining international acclaim for her highly intricate and narrative-driven paintings.',
    contributions: 'Pioneered the narrative style in Mithila art, depicting personal experiences and contemporary events alongside traditional mythological scenes.',
    legacy: 'Her "Festival of American Folklife" mural in Washington D.C. remains a landmark achievement in Indian folk art history.',
    achievements: ['Created the famous "Cycle of Life" series', 'Painted the Crafts Museum mural in New Delhi'],
    famousWorks: ['Cycle of Life', 'Ramayana Series', 'Festival of American Folklife'],
    image: imgGanga
  },
  {
    id: 'mahasundari-devi',
    name: 'Mahasundari Devi',
    born: '1922',
    died: '2013',
    village: 'Ranti, Madhubani',
    style: 'Bharni & Kachni',
    awards: ['Padma Shri (2011)', 'Tulsi Samman (1995)', 'National Award (1982)'],
    bio: 'Breaking traditional social barriers, Mahasundari Devi removed her veil (purdah) to paint and sell her artwork. She was a prolific artist and a fierce advocate for women\'s independence through art.',
    contributions: 'Founded the Mithila Hastashilp Kalakar Audyogik Sahyog Samiti, an artists\' cooperative that empowered local women.',
    legacy: 'She created a thriving ecosystem for female artists in Ranti village, inspiring generations of women to pursue art professionally.',
    achievements: ['Established an artist cooperative', 'Mastered multiple traditional styles'],
    famousWorks: ['Kohbar Ghar', 'Dashavatar', 'Krishna Leela'],
    image: imgMaha
  },
  {
    id: 'dulari-devi',
    name: 'Dulari Devi',
    born: '1968',
    died: null,
    village: 'Ranti, Madhubani',
    style: 'Godhana',
    awards: ['Padma Shri (2021)', 'State Award, Bihar (2012)'],
    bio: 'From working as a domestic helper to becoming a Padma Shri awardee, Dulari Devi\'s journey is legendary. Mentored by Mahasundari Devi, she popularized the Godhana style (Dalit tattoo art).',
    contributions: 'Introduced scenes of everyday rural life, marginalized communities, and personal struggles into the traditionally mythology-dominated Mithila painting landscape.',
    legacy: 'Her life story is documented in the book "Following My Paint Brush," serving as an inspiration for underprivileged artists.',
    achievements: ['Elevated Godhana art to national recognition', 'Documented contemporary rural life in traditional styles'],
    famousWorks: ['Village Life Series', 'Following My Paint Brush (Illustrations)', 'Kamla River Rituals'],
    image: imgDulari
  },
  {
    id: 'godavari-dutta',
    name: 'Godavari Dutta',
    born: '1930',
    died: null,
    village: 'Bahadurpur, Darbhanga',
    style: 'Kachni',
    awards: ['Padma Shri (2019)', 'National Award (1980)', 'Shilp Guru (2006)'],
    bio: 'Known for her impeccable mastery of the Kachni (line drawing) style, Godavari Dutta uses only black and red ink to create mesmerizing, intricate patterns. She has spent decades training younger artists.',
    contributions: 'Mentored over 50,000 students and educators globally in the techniques of Mithila art.',
    legacy: 'Credited with founding a Mithila art museum in Japan, cementing the art form\'s global presence.',
    achievements: ['Set up the Mithila Museum in Tokamachi, Japan', 'Trained thousands of rural women'],
    famousWorks: ['Trishul Series', 'Ramayana Epochs', 'Intricate Peacock Patterns'],
    image: imgGodavari
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
    contributions: 'Consistently experimented with scale and surrealism while maintaining traditional Mithila motifs.',
    legacy: 'She is the only Mithila artist to have her work exhibited at the prestigious Centre Pompidou in Paris.',
    achievements: ['Exhibited at Centre Pompidou (1989)', 'Pioneered large-scale Mithila canvases'],
    famousWorks: ['Naga Devata Series', 'Cosmic Serpent', 'Sita\'s Agnipariksha'],
    image: imgBaua
  },
  {
    id: 'bharti-dayal',
    name: 'Bharti Dayal',
    born: '1961',
    died: null,
    village: 'Darbhanga',
    style: 'Contemporary Mithila',
    awards: ['National Award (2006)', 'Indira Gandhi Priyadarshini Award (2013)'],
    bio: 'Bharti Dayal has played a crucial role in contemporizing Mithila art. While maintaining its traditional grammar, she introduces modern themes and refines the aesthetic to appeal to international galleries.',
    contributions: 'Fused modern socio-political themes with ancient Mithila aesthetics, pushing the boundaries of what the art can communicate.',
    legacy: 'Her works are widely published and collected globally, serving as a bridge between traditional folk art and contemporary fine art.',
    achievements: ['Brought Mithila art into contemporary fine art galleries', 'Authored extensive literature on the art form'],
    famousWorks: ['Tree of Life', 'Contemporary Radha Krishna', 'Global Warming Series'],
    image: imgBharti
  },
  {
    id: 'yamuna-devi',
    name: 'Yamuna Devi',
    born: '1929',
    died: '2010',
    village: 'Jitwarpur, Madhubani',
    style: 'Godhana & Mixed',
    awards: ['National Award (1990)'],
    bio: 'A visionary artist from a marginalized community, Yamuna Devi was instrumental in gaining recognition for the Godhana (tattoo) painting style, traditionally practiced by Dalit women.',
    contributions: 'Transformed traditional body tattoo motifs into a distinctive painting style using cow dung washes and natural pigments.',
    legacy: 'She opened the doors for Dalit artists to be recognized as master craftsmen in a field previously dominated by upper castes.',
    achievements: ['First Dalit woman to win a National Award in Mithila art', 'Pioneered the use of cow dung wash as a canvas base'],
    famousWorks: ['Chhath Festival Scenes', 'Rahu & Ketu', 'Godhana Motifs'],
    image: imgYamuna
  }
];
