const router = require("express").Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/uplad.controller');
const multer = require('multer');
const uplad = multer()

// route menant aux operations d'authentification
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// route menant aux operationsuser sur l'utilisateur 
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// route menant aux operationsuser sur la mise en place d'un profil
router.post('/upload',uplad.single('file'),uploadController.upladProfil)

module.exports = router;