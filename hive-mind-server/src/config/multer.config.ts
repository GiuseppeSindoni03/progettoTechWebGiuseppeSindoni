import multer from "multer";

const storage = multer.memoryStorage(); //  Salviamo i file in memoria temporaneamente
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //  Limite: 5MB per immagine
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

export default upload;
