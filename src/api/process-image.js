const express = require('express');
const sharp = require('sharp');

function extractDimension(req) {
  const { width, height } = req.query;
  return {
    width: Number(width),
    height: Number(height),
  };
}

const router = express.Router();

router.get('/stats', async (req, res) => {
  await sharp('input.jpg')
    .stats()
    .then((stats) => {
      res.json(stats);
    });
});

router.get('/jpeg', async (req, res) => {
  const { width, height } = extractDimension(req);
  const originalMetadata = await sharp('input.jpg').metadata();

  const resizedImage = await sharp('input.jpg')
    .resize({
      width,
      height,
      fit: sharp.fit.outside,
      withoutEnlargement: true,
    })
    .toBuffer();
  const resizedMetadata = await sharp(resizedImage).metadata();
  await sharp(resizedImage)
    .toFile(`output-${width}-${height}-jpg.jpg`);

  await sharp(resizedImage)
    .toFile(`output-${width}-${height}-jpg.webp`)
    .then((convertedMetadata) => {
      res.json({ originalMetadata, resizedMetadata, convertedMetadata });
    });
});

router.get('/png', async (req, res) => {
  const { width, height } = extractDimension(req);
  const originalMetadata = await sharp('input.png').metadata();

  const resizedImage = await sharp('input.png')
    .resize({
      width,
      height,
      fit: sharp.fit.outside,
      withoutEnlargement: true,
    })
    .toBuffer();
  const resizedMetadata = await sharp(resizedImage).metadata();
  await sharp(resizedImage)
    .toFile(`output-${width}-${height}-png.png`);

  await sharp(resizedImage)
    .toFile(`output-${width}-${height}-png.webp`)
    .then((convertedMetadata) => {
      res.json({ originalMetadata, resizedMetadata, convertedMetadata });
    });
});

router.get('/gif', async (req, res) => {
  const { width, height } = extractDimension(req);
  const originalMetadata = await sharp('input.gif').metadata();
  const originalPages = originalMetadata.pages;

  await sharp('input.gif', { pages: originalPages })
    .toFile(`output-${width}-${height}-gif.webp`)
    .then((convertedMetadata) => res.json({ originalMetadata, convertedMetadata }));
});

module.exports = router;
