const { log } = require('console');
const db = require('../dbconnection'); // Assuming this is where your db pool is created
const path = require('path');

// You don't need a custom query function anymore since db.query is already promisified.
const query = (sql, params) => db.query(sql, params);

// Get restaurant profile (public access allowed)
exports.getProfile = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  console.log(restaurantId);

  try {
    const sql = 'SELECT * FROM restaurants WHERE user_id = ?';
    const [result] = await query(sql, [restaurantId]);

    if (result.length === 0) return res.status(404).json({ error: 'Restaurant not found' });

    res.status(200).json({ profile: result[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllProfile = async (req, res) => {
  try {
    const sql = 'SELECT * FROM restaurants';
    const [results] = await query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Add profile
exports.addProfile = async (req, res) => {
  const { name, description, address, contact_number } = req.body;
  const image_url = req.file ? req.file.filename : null;
  const restaurantId = req.user.id;

  if (!name || !description || !address || !contact_number) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const sql = `
    INSERT INTO restaurants (name, description, address, contact_number, image_url, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    await query(sql, [name, description, address, contact_number, image_url, restaurantId]);
    res.status(201).json({ message: "Restaurant profile created successfully!" });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  const { id } = req.user;
  console.log('User ID:', id);

  const { name, description, address, contact_number } = req.body;
  let image_url = req.file ? req.file.filename : undefined;

  const updateSQL = `
      UPDATE restaurants 
      SET 
          name = ?, 
          description = ?, 
          address = ?, 
          contact_number = ?, 
          image_url = COALESCE(?, image_url) 
      WHERE user_id = ?
  `;

  try {
    await query(updateSQL, [name, description, address, contact_number, image_url, id]);
    res.status(200).json({ message: 'Profile updated successfully' });
    console.log("successfully updated.");
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch menu
exports.fetchMenu = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  console.log("requested restaurantId:", restaurantId);
  
  if (!restaurantId) {
    return res.status(400).json({ error: "Restaurant ID is required" });
  }

  const sql = 'SELECT * FROM menu WHERE restaurant_id = ?';
  try {
    const [results] = await query(sql, [restaurantId]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.fetchAllMenus = async (req, res) => {
  const sql = 'SELECT * FROM menu';
  try {
    const [results] = await query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.addMenu = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Destructure required fields from the request body
    const { name, price, description, availability, category_name } = req.body;
    const picture_url = req.file ? req.file.filename : null;
    const restaurantId = req.user.id;

    console.log("Category Name:", category_name);

    // Check if category_name is provided
    if (!category_name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    // Fetch category id from the database
    console.log('Executing query to find category by name:', category_name);
    const [category] = await query('SELECT id FROM categories WHERE name = ?', [category_name]);

    console.log('Query result:', category);

    if (!category || category.length === 0) {
      return res.status(400).json({ error: `Category "${category_name}" not found.` });
    }

    const category_id = category[0].id;
    console.log('Category ID:', category_id);

    // Validate other fields
    if (!name || !price || !description || availability === undefined) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Convert availability to integer (1 for true, 0 for false)
    const availabilityInt = availability === 'true' ? 1 : 0;

    // SQL Query to insert menu item into the database
    const sql = `
      INSERT INTO menu (name, price, description, availability, picture_url, restaurant_id, category_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute SQL query
    await query(sql, [name, price, description, availabilityInt, picture_url, restaurantId, category_id]);

    // Send success response
    res.json({ message: "Menu item added successfully!" });
  } catch (err) {
    console.error("Error:", err);
    // Send a generic error response for any issues
    res.status(500).json({ error: "Database error." });
  }
};




// Update a menu item
exports.updateMenu = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Destructure required fields from the request body
    const { name, price, description, availability, category_name } = req.body;
    const picture_url = req.file ? req.file.filename : null; 
    const menuId = req.params.id;

    // Ensure category_name is provided
    if (!category_name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    // Fetch category id from the database
    console.log('Executing query to find category by name:', category_name);
    const [category] = await query('SELECT id FROM categories WHERE name = ?', [category_name]);

    console.log('Query result:', category);

    if (!category || category.length === 0) {
      return res.status(400).json({ error: `Category "${category_name}" not found.` });
    }

    const category_id = category[0].id;
    console.log('Category ID:', category_id);

    // Validate other fields
    if (!name || !price || !description || availability === undefined) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Convert availability to integer (1 for true, 0 for false)
    const availabilityInt = availability === 'true' ? 1 : 0;

    // SQL Query to update menu item in the database
    const sql = `
      UPDATE menu 
      SET 
        name = ?, 
        price = ?, 
        description = ?, 
        availability = ?, 
        picture_url = COALESCE(?, picture_url),
        category_id = ?
      WHERE id = ?
    `;

    // Execute SQL query
    await query(sql, [name, price, description, availabilityInt, picture_url, category_id, menuId]);

    // Send success response
    res.json({ message: "Menu item updated successfully!" });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Database error." });
  }
};


// Delete a menu item
exports.delMenu = async (req, res) => {
  const menuId = req.params.id;

  try {
    // First, delete the dependent rows in order_items
    await db.execute('DELETE FROM order_items WHERE food_item_id = ?', [menuId]);
    
    // Then, delete the menu item
    const sql = 'DELETE FROM menu WHERE id = ?';
    const [result] = await db.execute(sql, [menuId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Menu item deleted successfully!' });
    } else {
      res.status(404).json({ error: 'Menu item not found' });
    }
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ error: 'Failed to delete menu item', details: err.message });
  }
};


exports.categories = async(req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

// Overview of restaurant statistics
exports.overview = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const [totalMenuItems] = await query("SELECT COUNT(*) AS count FROM menu WHERE restaurant_id = ?", [restaurantId]);
    const [totalOrders] = await query("SELECT COUNT(*) AS count FROM orders WHERE restaurant_id = ?", [restaurantId]);
    const [totalRevenue] = await query("SELECT SUM(total) AS total FROM orders WHERE restaurant_id = ? AND status = 'Completed'", [restaurantId]);
    const [pendingOrders] = await query("SELECT COUNT(*) AS count FROM orders WHERE restaurant_id = ? AND status = 'Pending'", [restaurantId]);

    res.json({
      totalMenuItems: totalMenuItems[0]?.count || 0,
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({ error: "Failed to fetch overview stats" });
  }
};

