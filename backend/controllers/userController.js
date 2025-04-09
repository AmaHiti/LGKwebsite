// userController.js
import pool from "../config/db.js"; 
import bcrypt from "bcrypt";
import validator from "validator";
import { createToken } from "../middleware/token.js";


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const SELECT_USER_QUERY = "SELECT * FROM customers WHERE email = ?";
    const [rows] = await pool.query(SELECT_USER_QUERY, [email]);

    if (rows.length === 0) {
      
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user.CustomerID);
    
    res.json({ success: true, token });
  } catch (error) {
   
   
    res.json({ success: false, message: "Error logging in user" });
  }
};

const registerUser = async (req, res) => {
  const { name, password, email, tel_num } = req.body;
  try {
    // Validation checks
    if (!validator.isEmail(email)) {
     
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
   
      return res.json({ success: false, message: "Please enter a strong password" });
    }
    if (tel_num.length !== 10) {
     
      return res.json({ success: false, message: "Please enter a valid phone number" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const INSERT_USER_QUERY =
      "INSERT INTO customers (customer_name, email, password, tel_num) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(INSERT_USER_QUERY, [name, email, hashedPassword, tel_num]);

    // Generate token for the newly registered user
    const token = createToken(result.insertId);
   
    res.json({ success: true, token });
  } catch (error) {
    
    res.json({ success: false, message: "Email already exists" });
  }
};

const getUsers = async (req, res) => {
  try {
    const SELECT_USERS_QUERY = "SELECT CustomerID, customer_name, email, tel_num FROM customers";
    const [users] = await pool.query(SELECT_USERS_QUERY);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ success: false, message: "Error getting users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const DELETE_USER_QUERY = 'DELETE FROM customers WHERE CustomerID = ?';
    await pool.query(DELETE_USER_QUERY, [userId]);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

export { loginUser, registerUser, getUsers, deleteUser };
