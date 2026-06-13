const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const Collection = require('../models/Collection');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const sourceRoot = path.resolve(__dirname, '../../src/assets/paintings');
const publicRoot = path.resolve(__dirname, '../../public/paintings');

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const canUseCloudinary = Boolean(
  cloudinaryConfig.cloud_name &&
  cloudinaryConfig.api_key &&
  cloudinaryConfig.api_secret
);

if (canUseCloudinary) {
  cloudinary.config(cloudinaryConfig);
}

function normalizePath(value) {
  if (!value || typeof value !== 'string') return '';
  let normalized = value.replace(/\\/g, '/').trim();
  if (normalized.startsWith('./')) normalized = normalized.slice(2);
  return normalized;
}

function getRelativeAssetPath(localPath) {
  if (!localPath) return null;
  const normalized = normalizePath(localPath);
  const marker = 'src/assets/paintings/';
  const idx = normalized.indexOf(marker);
  if (idx !== -1) {
    return normalized.slice(idx + marker.length);
  }
  if (normalized.startsWith('assets/paintings/')) {
    return normalized.slice('assets/paintings/'.length);
  }
  if (normalized.startsWith('paintings/')) {
    return normalized.slice('paintings/'.length);
  }
  return normalized;
}

function buildAssetMaps() {
  const exactMap = new Map();
  const baseMap = new Map();

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        const rel = path.relative(sourceRoot, full).split(path.sep).join('/');
        exactMap.set(rel, full);
        const base = path.basename(rel);
        const list = baseMap.get(base) || [];
        list.push(rel);
        baseMap.set(base, list);
      }
    }
  }

  walk(sourceRoot);
  return { exactMap, baseMap };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyPublicAssets(exactMap) {
  const copied = [];
  for (const [rel, sourceFile] of exactMap.entries()) {
    const destFile = path.join(publicRoot, rel);
    ensureDir(path.dirname(destFile));
    const shouldCopy = !fs.existsSync(destFile) || fs.statSync(sourceFile).mtimeMs > fs.statSync(destFile).mtimeMs;
    if (shouldCopy) {
      fs.copyFileSync(sourceFile, destFile);
    }
    copied.push(rel);
  }
  return copied;
}

function buildPublicUrl(rel) {
  const encoded = rel.split('/').map(encodeURIComponent).join('/');
  return `/paintings/${encoded}`;
}

async function uploadLocalToCloudinary(sourceFile, rel) {
  const uploadOptions = {
    folder: 'mithila_art_uploads/paintings',
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  const result = await cloudinary.uploader.upload(sourceFile, uploadOptions);
  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

function resolveLocalUrl(rawUrl, exactMap, baseMap) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const normalized = normalizePath(rawUrl);

  if (/^https?:\/\//i.test(normalized) || normalized.includes('cloudinary.com')) {
    return normalized;
  }

  const rel = getRelativeAssetPath(normalized);
  if (!rel) return null;

  if (exactMap.has(rel)) {
    return buildPublicUrl(rel);
  }

  const basename = path.basename(rel);
  const candidates = baseMap.get(basename) || [];
  if (candidates.length === 1) {
    return buildPublicUrl(candidates[0]);
  }

  return null;
}

async function resolveUrl(rawUrl, exactMap, baseMap, cache) {
  const normalized = normalizePath(rawUrl);
  if (!normalized) return null;
  if (/^https?:\/\//i.test(normalized) || normalized.includes('cloudinary.com')) {
    return normalized;
  }

  const rel = getRelativeAssetPath(normalized);
  if (!rel) return null;

  if (exactMap.has(rel)) {
    const sourceFile = exactMap.get(rel);
    if (canUseCloudinary) {
      if (cache.has(rel)) {
        return cache.get(rel).url;
      }
      try {
        const upload = await uploadLocalToCloudinary(sourceFile, rel);
        cache.set(rel, upload);
        return upload.url;
      } catch (error) {
        console.warn(`Failed Cloudinary upload for ${rel}, falling back to local public URL.`, error.message);
        return buildPublicUrl(rel);
      }
    }
    return buildPublicUrl(rel);
  }

  const basename = path.basename(rel);
  const candidates = baseMap.get(basename) || [];
  if (candidates.length === 1) {
    if (canUseCloudinary) {
      const chosen = candidates[0];
      if (cache.has(chosen)) {
        return cache.get(chosen).url;
      }
      try {
        const upload = await uploadLocalToCloudinary(path.join(sourceRoot, chosen), chosen);
        cache.set(chosen, upload);
        return upload.url;
      } catch (error) {
        console.warn(`Failed Cloudinary upload for ${chosen}, falling back to local public URL.`, error.message);
        return buildPublicUrl(chosen);
      }
    }
    return buildPublicUrl(candidates[0]);
  }

  return null;
}

function resolveArrayField(arrayField, exactMap, baseMap, cache) {
  if (!Array.isArray(arrayField)) return [];
  return arrayField
    .map((item) => (typeof item === 'string' ? item : item?.url || null))
    .map((raw) => resolveLocalUrl(raw, exactMap, baseMap))
    .filter(Boolean);
}

async function main() {
  const localFiles = buildAssetMaps();
  if (!localFiles.exactMap.size) {
    console.error('No artwork files found in', sourceRoot);
    process.exit(1);
  }

  ensureDir(publicRoot);
  copyPublicAssets(localFiles.exactMap);

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mithilaReviews';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const urlCache = new Map();
  let productUpdates = 0;
  let collectionUpdates = 0;

  const products = await Product.find().exec();
  for (const product of products) {
    let changed = false;

    const resolvedGallery = product.gallery ? [] : undefined;
    if (Array.isArray(product.gallery)) {
      const resolved = await Promise.all(
        product.gallery.map((entry) => resolveUrl(entry, localFiles.exactMap, localFiles.baseMap, urlCache))
      );
      if (resolved.some((u, idx) => u && product.gallery[idx] !== u)) {
        product.gallery = resolved.filter(Boolean);
        changed = true;
      }
    }

    const resolvedImages = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const imageItem of product.images) {
        let rawUrl = null;
        let public_id = '';
        if (typeof imageItem === 'string') {
          rawUrl = imageItem;
        } else if (imageItem && typeof imageItem.url === 'string') {
          rawUrl = imageItem.url;
          public_id = imageItem.public_id || '';
        }
        const resolved = await resolveUrl(rawUrl, localFiles.exactMap, localFiles.baseMap, urlCache);
        if (resolved) {
          resolvedImages.push({ url: resolved, public_id });
        }
      }
    }

    if (resolvedImages.length === 0 && Array.isArray(product.gallery)) {
      for (const rawUrl of product.gallery) {
        const resolved = await resolveUrl(rawUrl, localFiles.exactMap, localFiles.baseMap, urlCache);
        if (resolved) {
          resolvedImages.push({ url: resolved, public_id: '' });
        }
      }
    }

    if (resolvedImages.length === 0 && product.image) {
      const resolved = await resolveUrl(product.image, localFiles.exactMap, localFiles.baseMap, urlCache);
      if (resolved) {
        resolvedImages.push({ url: resolved, public_id: '' });
      }
    }

    if (resolvedImages.length > 0) {
      if (!Array.isArray(product.images) || product.images.length !== resolvedImages.length || product.images.some((item, idx) => {
        const currentUrl = typeof item === 'string' ? item : item?.url;
        return currentUrl !== resolvedImages[idx].url;
      })) {
        product.images = resolvedImages;
        changed = true;
      }

      const firstUrl = resolvedImages[0].url;
      if (!product.image || product.image !== firstUrl) {
        product.image = firstUrl;
        changed = true;
      }
    }

    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      const firstGalleryUrl = product.gallery[0];
      if (!product.image || product.image !== firstGalleryUrl) {
        product.image = firstGalleryUrl;
        changed = true;
      }
    }

    if (changed) {
      await product.save();
      productUpdates += 1;
    }
  }

  const collections = await Collection.find().exec();
  for (const collection of collections) {
    let changed = false;
    let coverImage = collection.coverImage;
    const resolvedCover = await resolveUrl(coverImage, localFiles.exactMap, localFiles.baseMap, urlCache);
    if (resolvedCover && coverImage !== resolvedCover) {
      collection.coverImage = resolvedCover;
      changed = true;
    }

    if (!collection.coverImage) {
      const fallbackProduct = await Product.findOne({ collectionId: collection._id }).exec();
      if (fallbackProduct) {
        const fallbackUrl = fallbackProduct.images?.[0]?.url || fallbackProduct.image || null;
        if (fallbackUrl && collection.coverImage !== fallbackUrl) {
          collection.coverImage = fallbackUrl;
          changed = true;
        }
      }
    }

    if (changed) {
      await collection.save();
      collectionUpdates += 1;
    }
  }

  console.log(`Updated ${productUpdates} products and ${collectionUpdates} collections.`);
  await mongoose.disconnect();
  console.log('Done. Artwork image records are repaired.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Restore failed:', err);
  process.exit(1);
});
