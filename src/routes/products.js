// ************ Require's ************
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { check, body, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../", "../public/images/products"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ************ Controller Require ************
const productsController = require("../controllers/productsController");

const validationCreate = [
  body("name")
    .notEmpty()
    .withMessage("este campo es obligatorio")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("debe tener min 3 carácteres y máx 30")
    .bail(),
  body("price")
    .notEmpty()
    .withMessage("este campo es obligatorio")
    .bail()
    .isNumeric()
    .withMessage("debe ingresar un valor númerico")
    .bail(),
  body("discount")
    .notEmpty()
    .withMessage("este campo es obligatorio")
    .bail()
    .isNumeric()
    .withMessage("debe ingresar un valor númerico")
    .bail(),
  body("description")
    .notEmpty()
    .withMessage("este campo es obligatorio")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("debe tener min 5 carácteres y máx 100")
    .bail(),
];

/*** GET ALL PRODUCTS ***/
router.get("/", productsController.index);

/*** CREATE ONE PRODUCT ***/
router.get("/create", productsController.create);
router.post(
  "/create",
  upload.single("image"),
  validationCreate,
  productsController.store
);

/*** GET ONE PRODUCT ***/
router.get("/detail/:id", productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get("/edit/:id", productsController.edit);
router.put("/edit/:id", productsController.update);

/*** DELETE ONE PRODUCT***/
router.delete("/delete/:id", productsController.destroy);

module.exports = router;
