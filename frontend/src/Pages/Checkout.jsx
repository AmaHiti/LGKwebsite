import { Button, Container, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import React from "react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, totalQuantity, paymentMethod } = location.state || {
    cart: [],
    totalPrice: 0,
    totalQuantity: 0,
    paymentMethod: "",
  };

  // Function to handle order placement
  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    navigate("/"); // Redirect to home page after placing the order
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>
      <h4 style={styles.subHeading}>Review Your Order</h4>
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
        <h4 style={styles.summaryText}>Payment Method: {paymentMethod}</h4>
      </div>

      {/* Place Order Button */}
      <div style={styles.buttonContainer}>
        <Button variant="success" onClick={handlePlaceOrder} style={styles.placeOrderButton}>
          Place Order
        </Button>
      </div>
    </Container>
  );
};

export default Checkout;


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
  subHeading: {
    color: "#292f36",
    textAlign: "center",
    marginBottom: "2rem",
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
  buttonContainer: {
    textAlign: "center",
    marginTop: "2rem",
  },
  placeOrderButton: {
    backgroundColor: "#ff6b6b",
    border: "none",
    fontWeight: "600",
  },
};