import pool from "../config/db.js";

const addToCart = async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res
      .status(400)
      .json({ success: false, message: "userId and itemId are required" });
  }
  try {
    const SELECT_CART_ITEM_QUERY = `
            SELECT * FROM cart_items
            WHERE CustomerID = ? AND FoodID = ?
        `;
    const [existingCartItem] = await pool.query(SELECT_CART_ITEM_QUERY, [
      userId,
      itemId,
    ]);

    if (existingCartItem.length > 0) {
      const UPDATE_CART_ITEM_QUERY = `
                UPDATE cart_items
                SET quantity = quantity + 1
                WHERE CustomerID = ? AND FoodID= ?
            `;
      await pool.query(UPDATE_CART_ITEM_QUERY, [userId, itemId]);
    } else {
      const INSERT_CART_ITEM_QUERY = `
                INSERT INTO cart_items (CustomerID, FoodID, quantity)
                VALUES (?, ?, 1)
            `;
      await pool.query(INSERT_CART_ITEM_QUERY, [userId, itemId]);
    }

    res
      .status(201)
      .json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item to cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res
      .status(400)
      .json({ success: false, message: "userId and itemId are required" });
  }
  try {
    const SELECT_CART_ITEM_QUERY = `
            SELECT * FROM cart_items
            WHERE CustomerID = ? AND FoodID = ?
        `;
    const [existingCartItem] = await pool.query(SELECT_CART_ITEM_QUERY, [
      userId,
      itemId,
    ]);

    if (existingCartItem.length > 0) {
      const quantity = Math.max(existingCartItem[0].quantity - 1, 0);

      if (quantity === 0) {
        const DELETE_CART_ITEM_QUERY = `
                    DELETE FROM cart_items
                    WHERE CustomerID = ? AND FoodID = ?
                `;
        await pool.query(DELETE_CART_ITEM_QUERY, [userId, itemId]);
      } else {
        const UPDATE_CART_ITEM_QUERY = `
                    UPDATE cart_items
                    SET quantity = ?
                    WHERE CustomerID = ? AND FoodID = ?
                `;
        await pool.query(UPDATE_CART_ITEM_QUERY, [quantity, userId, itemId]);
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing item from cart" });
  }
};

const getCart = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }
  try {
    const SELECT_CART_ITEMS_QUERY = `
            SELECT ci.FoodID, ci.quantity, f.name, f.price
            FROM cart_items ci
            INNER JOIN foods f ON ci.FoodID = f.FoodID
            WHERE ci.CustomerID = ?

        `;
    const [cartItems] = await pool.query(SELECT_CART_ITEMS_QUERY, [userId]);
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error("Error getting user's cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error getting user's cart" });
  }
};
const clearCart = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId is required" });
  }
  try {
    const DELETE_CART_ITEMS_QUERY = `
            DELETE FROM cart_items
            WHERE CustomerID = ?
        `;
    await pool.query(DELETE_CART_ITEMS_QUERY, [userId]);

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };
