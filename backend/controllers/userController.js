import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Added expiration
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const SELECT_USER_QUERY = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(SELECT_USER_QUERY, [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user.UserID); // Changed from id to UserID
    res.json({ 
      success: true, 
      token,
      user: {
        UserID: user.UserID,
        name: user.name,
        email: user.email,
        tel_num: user.tel_num
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    res.json({ success: false, message: "Error logging in user" });
  }
};

const registerUser = async (req, res) => {
  const { name, password, email, tel_num } = req.body;
  try {
    const SELECT_USER_QUERY = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await pool.query(SELECT_USER_QUERY, [email]);

    if (existingUsers.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    
    if (tel_num.length != 10) {
      return res.json({
        success: false,
        message: "Please Enter Valid Phone Number"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const INSERT_USER_QUERY =
      "INSERT INTO users (name, email, password, tel_num) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(INSERT_USER_QUERY, [
      name,
      email,
      hashedPassword,
      tel_num
    ]);

    const token = createToken(result.insertId); // This will be the UserID
    res.json({ 
      success: true, 
      token,
      user: {
        UserID: result.insertId,
        name,
        email,
        tel_num
      }
    });
  } catch (error) {
    console.error("Error: ", error);
    res.json({ success: false, message: "Error registering user" });
  }
};
const getUsers = async (req, res) => {
  try {
    const SELECT_USERS_QUERY = "SELECT UserID, name, email,tel_num FROM users";
    const [users] = await pool.query(SELECT_USERS_QUERY);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.json({ success: false, message: "Error getting users" });
  }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.body.userId;

        const DELETE_USER_QUERY = 'DELETE FROM users WHERE UserID = ?';
        await pool.query(DELETE_USER_QUERY, [userId]);

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

export { loginUser, registerUser, getUsers, deleteUser };
