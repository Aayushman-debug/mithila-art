/**
 * Mithila Art Assets Uploader v2
 * Downloads images locally then uploads to Cloudinary (bypasses Wikimedia rate limit)
 * Run: cd backend && node scripts/uploadAssets.js
 */

require('dotenv').config({ path: '../.env' });
const https = require('https');
const http = require('http');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Parse env from raw file to handle UTF-16 BOM issues
const envRaw = fs.readFileSync(path.join(__dirname, '../.env'));
const envStr = envRaw.toString('utf16le');
const getEnvVal = (key) => {
  const match = envStr.match(new RegExp(key + '=([^\r\n]+)'));
  return match ? match[1].trim() : process.env[key];
};

cloudinary.config({
  cloud_name: getEnvVal('CLOUDINARY_CLOUD_NAME') || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: getEnvVal('CLOUDINARY_API_KEY') || process.env.CLOUDINARY_API_KEY,
  api_secret: getEnvVal('CLOUDINARY_API_SECRET') || process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloudinary config: cloud=' + getEnvVal('CLOUDINARY_CLOUD_NAME') + 
  ' key=...' + (getEnvVal('CLOUDINARY_API_KEY') || '').slice(-4) + '\n');

const TMP_DIR = path.join(__dirname, '../../tmp_assets');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// ─── ASSET MANIFEST ──────────────────────────────────────────────────────────
const ASSETS = [
  { key: 'artist_mahasundari_devi', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Devi6.JPG', folder: 'mithila_art_assets/artists', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Devi6.JPG', attribution: 'Mahasundari Devi (own work) / Wikimedia Commons CC BY 3.0', subject: 'Mahasundari Devi' },
  { key: 'artist_baua_devi', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/The_President%2C_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Smt._Baoa_Devi%2C_at_a_Civil_Investiture_Ceremony%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_March_30%2C_2017.jpg', folder: 'mithila_art_assets/artists', license: 'GODL-India', source: 'https://commons.wikimedia.org/wiki/File:The_President,_Shri_Pranab_Mukherjee_presenting_the_Padma_Shri_Award_to_Smt._Baoa_Devi.jpg', attribution: 'Government of India (GODL-India)', subject: 'Baua Devi receiving Padma Shri, 2017' },
  { key: 'artist_dulari_devi', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Dulari_Devi.jpg', folder: 'mithila_art_assets/artists', license: 'GODL-India', source: 'https://commons.wikimedia.org/wiki/File:Dulari_Devi.jpg', attribution: 'Rashtrapati Bhavan / Wikimedia Commons GODL-India', subject: 'Dulari Devi' },
  { key: 'art_madhubani_main', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Madhubani_art.jpg', folder: 'mithila_art_assets/artworks', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_art.jpg', attribution: 'Wikimedia Commons', subject: 'Traditional Madhubani painting' },
  { key: 'art_madhubani_painting', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Madhubani_painting.jpg', folder: 'mithila_art_assets/artworks', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_painting.jpg', attribution: 'Wikimedia Commons', subject: 'Mithila painting' },
  { key: 'art_sita_vivah', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg', folder: 'mithila_art_assets/artworks', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg', attribution: 'Wikimedia Commons', subject: 'Madhubani painting — Ram Sita Vivah' },
  { key: 'art_sita_birth', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg', folder: 'mithila_art_assets/artworks', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:The_Birth_of_Sita_-_Raja_Janaka_of_Mithila_carrying_her_in_his_lap.jpg', attribution: 'Public Domain / Wikimedia Commons', subject: 'Birth of Sita — Raja Janaka carrying her' },
  { key: 'art_kohbar', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Sohrai_and_Kohbar_Paintings_03.jpg', folder: 'mithila_art_assets/artworks', license: 'CC0 1.0', source: 'https://commons.wikimedia.org/wiki/File:Sohrai_and_Kohbar_Paintings_03.jpg', attribution: 'CC0 / Wikimedia Commons', subject: 'Kohbar (nuptial chamber) painting' },
  { key: 'art_exhibition', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Madhubani_Painting_Exhibition.jpg', folder: 'mithila_art_assets/artworks', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_Painting_Exhibition.jpg', attribution: 'Wikimedia Commons CC BY-SA 3.0', subject: 'Madhubani Painting Exhibition' },
  { key: 'art_dilli_haat', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Dilli_Haat_Madhubani_Mithila_Painting_Artist.jpg', folder: 'mithila_art_assets/artworks', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Dilli_Haat_Madhubani_Mithila_Painting_Artist.jpg', attribution: 'Wikimedia Commons CC BY 2.0', subject: 'Mithila artist at Dilli Haat' },
  { key: 'art_patna_junction', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Mithila_Painting_at_Patna_Junction.jpg', folder: 'mithila_art_assets/artworks', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Mithila_Painting_at_Patna_Junction.jpg', attribution: 'Wikimedia Commons CC BY-SA 4.0', subject: 'Mithila mural at Patna Junction' },
  { key: 'art_fish_motif', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Madhubani_Fish_Motif_with_Stylized_Geometric_Scales_and_Red-Toned_Accents_from_Mithila_India.png', folder: 'mithila_art_assets/artworks', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_Fish_Motif_with_Stylized_Geometric_Scales_and_Red-Toned_Accents_from_Mithila_India.png', attribution: 'Wikimedia Commons CC BY-SA 4.0', subject: 'Madhubani fish motif' },
  { key: 'festival_chhath', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Chhath_Puja_Worship.jpg', folder: 'mithila_art_assets/festivals', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Chhath_Puja_Worship.jpg', attribution: 'Wikimedia Commons', subject: 'Chhath Puja worship at the riverside' },
  { key: 'festival_sama_chakeva', url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Sama_chakeva.jpg', folder: 'mithila_art_assets/festivals', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Sama_chakeva.jpg', attribution: 'Wikimedia Commons', subject: 'Sama Chakeva festival' },
  { key: 'festival_sama_2', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Sama_Chakeva_is_a_native_festival_of_Mithila.jpg', folder: 'mithila_art_assets/festivals', license: 'Public Domain', source: 'https://commons.wikimedia.org/wiki/File:Sama_Chakeva_is_a_native_festival_of_Mithila.jpg', attribution: 'Wikimedia Commons', subject: 'Sama Chakeva — native festival of Mithila' },
  { key: 'art_mixed', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Madhubani_paintings_or_Milithila_Painting_-IMG_0028.jpg', folder: 'mithila_art_assets/artworks', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Madhubani_paintings_or_Milithila_Painting_-IMG_0028.jpg', attribution: 'Wikimedia Commons CC BY 2.0', subject: 'Madhubani paintings collection' },
];

// ─── DOWNLOAD HELPER ─────────────────────────────────────────────────────────
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'MithilaArtProject/1.0 (pathakaayushman57@gmail.com)',
        'Referer': 'https://commons.wikimedia.org/',
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error('HTTP ' + response.statusCode));
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function uploadAll() {
  console.log('🚀 Starting download + upload to Cloudinary...\n');
  const results = {};

  for (let i = 0; i < ASSETS.length; i++) {
    const asset = ASSETS[i];
    const ext = asset.url.split('.').pop().split('?')[0].toLowerCase();
    const tmpFile = path.join(TMP_DIR, asset.key + '.' + ext);

    process.stdout.write(`[${i+1}/${ASSETS.length}] ${asset.key}...\n`);
    
    try {
      // Step 1: Download locally
      process.stdout.write('  Downloading... ');
      await downloadFile(asset.url, tmpFile);
      console.log('✓');

      // Step 2: Upload to Cloudinary
      process.stdout.write('  Uploading to Cloudinary... ');
      const result = await cloudinary.uploader.upload(tmpFile, {
        folder: asset.folder,
        public_id: asset.key,
        overwrite: false,
        resource_type: 'image',
      });
      
      results[asset.key] = {
        cloudinary_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        license: asset.license,
        source: asset.source,
        attribution: asset.attribution,
        subject: asset.subject,
        uploaded: new Date().toISOString(),
      };
      console.log('✅ ' + result.secure_url.substring(0, 80));
      
      // Clean up temp file
      fs.unlinkSync(tmpFile);
    } catch (err) {
      const msg = err.message || String(err);
      if (msg.includes('already exists')) {
        // Try to get existing URL
        try {
          const info = await cloudinary.api.resource(asset.folder + '/' + asset.key);
          results[asset.key] = {
            cloudinary_url: info.secure_url,
            public_id: info.public_id,
            license: asset.license,
            source: asset.source,
            attribution: asset.attribution,
            subject: asset.subject,
            note: 'already existed',
          };
          console.log('⚠️  Already exists: ' + info.secure_url.substring(0, 80));
        } catch(e2) {
          results[asset.key] = { error: msg, source: asset.source };
          console.log('❌ Already exists but could not fetch: ' + e2.message.substring(0,60));
        }
      } else {
        results[asset.key] = { error: msg, source: asset.source };
        console.log('❌ ' + msg.substring(0, 100));
      }
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }

    // Small delay to be respectful to APIs
    if (i < ASSETS.length - 1) await sleep(1500);
  }

  // Write results
  const outPath = path.join(__dirname, '../../src/data/cloudinaryAssets.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('\n📁 Results saved to src/data/cloudinaryAssets.json');

  const ok = Object.values(results).filter(r => r.cloudinary_url).length;
  const fail = Object.values(results).filter(r => r.error).length;
  console.log(`\n✅ Uploaded/Available: ${ok}  ❌ Failed: ${fail}`);

  // Cleanup tmp dir
  try { fs.rmdirSync(TMP_DIR); } catch(e) {}
}

uploadAll().catch(console.error);
