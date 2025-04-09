import { Button, Container, Form, Table } from "react-bootstrap";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, totalQuantity } = location.state || { cart: [], totalPrice: 0, totalQuantity: 0 };
  const [paymentMethod, setPaymentMethod] = useState(""); // State to store selected payment method

  // Function to handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Function to handle checkout
  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    navigate("/checkout", { state: { cart, totalPrice, totalQuantity, paymentMethod } });
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.heading}>Order Confirmation</h2>
      <h4 style={styles.subHeading}>Thank you for your order!</h4>
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
      </div>

      {/* Payment Method Selection */}
      <Form style={styles.paymentForm}>
        <Form.Group>
          <Form.Label style={styles.paymentLabel}>Select Payment Method</Form.Label>
          <Form.Select
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            style={styles.paymentSelect}
          >
            <option value="">Choose a payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash-on-delivery">Cash on Delivery</option>
          </Form.Select>
        </Form.Group>
      </Form>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          Back to Home
        </Button>
        <Button variant="success" onClick={handleCheckout} style={styles.checkoutButton}>
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
};

export default OrderConfirmation;

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
  paymentForm: {
    marginTop: "2rem",
  },
  paymentLabel: {
    fontWeight: "600",
  },
  paymentSelect: {
    border: "1px solid #4ecdc4",
    fontWeight: "600",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "2rem",
  },
  backButton: {
    backgroundColor: "#4ecdc4",
    border: "none",
    fontWeight: "600",
    marginRight: "1rem",
  },
  checkoutButton: {
    backgroundColor: "#ff6b6b",
    border: "none",
    fontWeight: "600",
  },
};