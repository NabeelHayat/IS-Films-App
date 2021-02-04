import multer from 'multer';
import { resolve, join } from 'path';
import fs from 'fs';

export function removeFailedFile (filename) {

  const path = join(__dirname, `../../../public/images/${filename}`);

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);

    }

    // file removed
  });
}

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, resolve(__dirname, '../../../public/images'));
  },
  filename (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `poster-${Date.now()}-${fileName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

export default upload;
