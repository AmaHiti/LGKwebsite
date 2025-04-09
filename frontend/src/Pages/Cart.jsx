import { Button, Container, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import React from "react";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || []; // Retrieve cart data from navigation state

  // Calculate total price and total quantity
  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price.replace("$", "")) * item.quantity,
    0
  );
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  // Function to handle order confirmation
  const handleConfirmOrder = () => {
    navigate("/order-confirmation", { state: { cart, totalPrice, totalQuantity } });
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>
      <Table striped bordered hover style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Item</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td style={styles.tableCell}>{item.name}</td>
              <td style={styles.tableCell}>{item.price}</td>
              <td style={styles.tableCell}>{item.quantity}</td>
              <td style={styles.tableCell}>
                ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={styles.summary}>
        <h4 style={styles.summaryText}>Total Quantity: {totalQuantity}</h4>
        <h4 style={styles.summaryText}>Total Price: ${totalPrice.toFixed(2)}</h4>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          style={styles.continueShoppingButton}
        >
          Continue Shopping
        </Button>
        <Button variant="success" onClick={handleConfirmOrder} style={styles.confirmOrderButton}>
          Confirm Order
        </Button>
      </div>
    </Container>
  );
};

export default Cart;

// Inline styles
const styles = {
  container: {
    backgroundColor: "#f7fff7",
    padding: "4rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    color: "#4ecdc4",
    textAlign: "center",
    marginBottom: "2rem",
    fontWeight: "700",
  },
  table: {
    marginTop: "1rem",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#4ecdc4",
    color: "#fff",
    fontWeight: "600",
  },
  tableCell: {
    verticalAlign: "middle",
    color: "#292f36",
  },
  summary: {
    textAlign: "right",
    marginTop: "2rem",
  },
  summaryText: {
    color: "#292f36",
  },
  continueShoppingButton: {
    backgroundColor: "#4ecdc4",
    border: "none",
    fontWeight: "600",
    marginRight: "1rem",
  },
  confirmOrderButton: {
    backgroundColor: "#ff6b6b",
    border: "none",
    fontWeight: "600",
  },
};