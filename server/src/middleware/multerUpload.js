import Multer from 'multer';
import { join } from 'path';
import fs from 'fs';

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

export function removeFailedFile (filename) {

  const path = join(__dirname, `../../../client/public/images/${filename}`);

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);

    }

    // file removed
  });
}

// const storage = multer.diskStorage({
//   destination (req, file, cb) {
//     cb(null, resolve(__dirname, '../../../client/public/images'));
//   },
//   filename (req, file, cb) {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, `poster-${Date.now()}-${fileName}`);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   },
// });

export default multer;
