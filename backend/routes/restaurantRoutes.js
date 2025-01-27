const express = require('express');
const { fetchMenu, fetchAllMenus, addMenu, delMenu, updateMenu, getProfile, addProfile, getAllProfile, updateProfile, overview, categories } =  require('../controllers/restaurantController');
const { requireRestaurantAuth } = require('../middleware/authMiddleware')
const { upload } = require('../middleware/upload')
const router = express.Router();

router.get('/menu', fetchAllMenus); // fetch menu route
router.get('/menu/:restaurantId', fetchMenu); // fetch menu route
router.post('/menu', requireRestaurantAuth,upload.single('image'), addMenu);    // add menu route
router.put('/menu/:id', requireRestaurantAuth, upload.single('image'), updateMenu);   //update menu route
router.delete('/menu/:id', requireRestaurantAuth, delMenu);    //delete menu route
router.get('/categories', categories); // fetch menu route


// Profile routes
router.get('/profile', getAllProfile); // Fetch all restaurant profiles
router.get('/profile/:restaurantId', getProfile); // Fetch a specific restaurant profile
router.post('/profile', requireRestaurantAuth, upload.single('image'), addProfile); // Add a new restaurant profile
router.put('/profile', requireRestaurantAuth, upload.single('image'), updateProfile); // Update an existing restaurant profile


router.get("/overview", requireRestaurantAuth, overview);

module.exports = router;