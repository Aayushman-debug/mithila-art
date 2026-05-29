const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
    "chhath_puja.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/95/Celebrating_Chhath_Puja.jpg",
    "sama_chakeva.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/48/Sama_Chakeva_Festival.jpg",
    "mithila_cuisine.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Bihari_thali.jpg",
    "kohbar.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Kohbar_Ghar.jpg",
    "fish_motif.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Madhubani_painting.jpg",
    "peacock_motif.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Mithila_Painting.jpg",
    "lotus_motif.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/77/Madhubani_Painting.jpg",
    "tree_of_life.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/de/Tree_of_life_in_Madhubani_Art.jpg",
    "janakpur.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Janaki_Mandir_Janakpur_Nepal.jpg",
    "sita_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mithila_Painting_-_Krishna_with_Gopis.jpg",
    "ganga_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/28/Madhubani_art.jpg",
    "dulari_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg",
    "mahasundari_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Mithila_Painting.jpg",
    "godavari_dutta.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/91/Mithila_Painting_Display.jpg",
    "baua_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mithila_painting_from_bihar.jpg",
    "bharti_dayal.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/41/Madhubani_art.jpg",
    "yamuna_devi.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/df/Madhubani_art_from_Bihar.jpg",
    "bharni.jpg": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mithila_Painting_-_Krishna_with_Gopis.jpg",
    "kachni.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/91/Mithila_Painting_Display.jpg",
    "godhana.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/df/Madhubani_art_from_Bihar.jpg",
    "tantrik.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/23/Madhubani_painting.jpg",
    "hero.jpg": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mithila_painting_from_bihar.jpg",
    "origins.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/41/Madhubani_art.jpg",
    "sita.jpg": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Madhubani_Painting_of_Ram_-_Sita_Vivah.jpg"
};

const outDir = path.join(__dirname, 'src', 'assets', 'reference');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, function (response) {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // follow redirect
                console.log(`Redirected to ${response.headers.location}`);
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            }
            response.pipe(file);
            file.on('finish', function () {
                file.close(resolve);
            });
        }).on('error', function (err) {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    for (const [name, url] of Object.entries(images)) {
        const dest = path.join(outDir, name);
        console.log(`Downloading ${name}...`);
        try {
            await download(url, dest);
            console.log(`Successfully downloaded ${name}`);
            // Wait 1 second to avoid 429
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error(`Error downloading ${name}:`, e.message);
        }
    }
}

run();
