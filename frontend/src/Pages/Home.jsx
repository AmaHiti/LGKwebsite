import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

const weeklySpecials = [
  { id: 1, name: "Hummus Bagel with Poached Eggs", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741529912/bagel.jpg" },
  { id: 2, name: "Grilled Chicken Wrap", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741529032/wrap.jpg" },
  { id: 3, name: "Vegan Avocado Toast", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741529011/avocado.jpg" },
];

const shortMenuItems = [
  { id: 1, name: "Pasta", price: "$12.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528960/pasta.jpg" },
  { id: 2, name: "Pizza", price: "$14.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528930/pizza.jpg" },
  { id: 3, name: "Burger", price: "$10.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528870/burger.jpg" },
  { id: 4, name: "Salad", price: "$8.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528842/salad.jpg" },
  { id: 5, name: "Pasta", price: "$12.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528960/pasta.jpg" },
  { id: 6, name: "Pizza", price: "$14.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528930/pizza.jpg" },
  { id: 1, name: "Pasta", price: "$12.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528960/pasta.jpg" },
  { id: 1, name: "Pasta", price: "$12.99", img: "https://res.cloudinary.com/dpl2srwzl/image/upload/v1741528960/pasta.jpg" },
  
];

export default function Home() {
  const [cart, setCart] = useState([]); // State to store cart items
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0); // State to track current special
  const navigate = useNavigate(); // For navigation to the cart page
  const timerRef = useRef(null); // Ref to store the timer

  // Function to handle adding items to the cart
  const handleAddToCart = (item) => {
    const token = localStorage.getItem("token"); // Check if the user is logged in

    if (!token) {
      alert("Please login to add items to the cart.");
      navigate("/"); // Redirect to the login page
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      // If item already exists, increment its quantity
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // If item is new, add it to the cart with quantity 1
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Function to get the quantity of an item in the cart
  const getItemQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  // Function to navigate to the cart page
  const goToCart = () => {
    const token = localStorage.getItem("token"); // Check if the user is logged in

    if (!token) {
      alert("Please login to view your cart.");
      navigate("/login"); // Redirect to the login page
      return;
    }

    navigate("/cart", { state: { cart } }); // Pass cart data to the cart page
  };

  // Function to start the carousel timer
  const startCarousel = () => {
    timerRef.current = setInterval(() => {
      setCurrentSpecialIndex((prevIndex) =>
        (prevIndex + 1) % weeklySpecials.length
      );
    }, 5000); // Change special every 5 seconds
  };

  // Start the carousel when the component mounts
  useEffect(() => {
    startCarousel();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clear the timer when the component unmounts
      }
    };
  }, []);

  return (
    <Container fluid className="p-0" style={styles.container}>
      {/* Weekly Special - Carousel */}
      <section className="bg-light py-5" style={styles.section}>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-center">
            <h2>Weekend Special</h2>
            <h1>{weeklySpecials[currentSpecialIndex].name}</h1>
            <Button variant="primary" className="m-2">
              ORDER NOW
            </Button>
            <span className="badge bg-success">Get Up to 15% OFF</span>
          </Col>
          <Col xs={12} md={6} className="position-relative">
            <img
              src={weeklySpecials[currentSpecialIndex].img}
              alt={weeklySpecials[currentSpecialIndex].name}
              className="img-fluid rounded heroImg"
              style={styles.heroImage}
            />
          </Col>
        </Row>
      </section>

      {/* Short Menu - Grid */}
      <section className="py-5" style={styles.section}>
        <h2 className="text-center mb-4">Our Special Menu</h2>
        <Row xs={1} md={2} lg={4} className="g-4">
          {shortMenuItems.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={item.img}
                  alt={item.name}
                  className="fixed-size-image"
                />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.price}</Card.Text>
                  <div style={{ position: "relative" }}>
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(item)}
                      style={styles.buyButton}
                    >
                      Buy
                    </Button>
                    {/* Quantity Badge */}
                    {getItemQuantity(item.id) > 0 && (
                      <span style={styles.quantityBadge}>
                        {getItemQuantity(item.id)}
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="success" onClick={goToCart} style={styles.cartButton}>
            Go to Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
        </div>
      </section>
    </Container>
  );
}

// Inline styles
const styles = {
  container: {
    paddingLeft: "20px", // Add padding to the left
    paddingRight: "20px", // Add padding to the right
  },
  section: {
    paddingLeft: "80px", // Add padding to the left for sections
    paddingRight: "80px", // Add padding to the right for sections
  },
  heroImage: {
    width: "100%",
    height: "400px", // Set a fixed height for the hero image
    objectFit: "cover", // Ensure the image covers the area without distortion
    borderRadius: "16px", // Add rounded corners
  },
  buyButton: {
    backgroundColor: "#4ecdc4", // Turquoise
    border: "none",
    fontWeight: "600",
    width: "100%",
    padding: "0.5rem",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
  quantityBadge: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    backgroundColor: "#ff6b6b", // Coral
    color: "#fff",
    borderRadius: "50%",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  cartButton: {
    backgroundColor: "#ff6b6b", // Coral
    border: "none",
    fontWeight: "600",
    padding: "0.75rem 2rem",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  },
};