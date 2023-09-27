import multer from "multer";
import path from "path";

// Multer File Storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath = path.join("public", "uploads");

    if (file.fieldname === "productImage") {
      destinationPath = path.join(destinationPath, "products");
    } else if (file.fieldname === "categoriesImage") {
      destinationPath = path.join(destinationPath, "categories");
    }

    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

export default upload;
