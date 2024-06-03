import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const upload = multer({
  dest: path.resolve(__dirname, "../uploads"), // Corrected the path
  limits: { fileSize: 3e7 },
});

export default upload;
