import fs from "fs";
import path from "path";
import sharp from "sharp";

export const imageThumbnailGenerator = async (file: Express.Multer.File) => {
  sharp.cache(false);
  sharp.cache({files: 0});

  try {
    const thumbnailDir = './uploads/images/thumbnails/';
    const thumbnailPath = path.join(thumbnailDir, `${file.filename.split('.')[0]}.webp`);

    await fs.promises.mkdir(thumbnailDir, { recursive: true });

    const metadata = await sharp(file.path).metadata();

    const { width, height } = metadata;
    const divisor = width / 128;
    const thumbMaxWidth = Math.floor(width / divisor);
    const thumbMaxHeight = Math.floor(height / divisor);

    await sharp(file.path).resize(thumbMaxWidth, thumbMaxHeight, { fit: 'inside' }).webp().toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    // console.log('image thumb generator MD error: ', error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};