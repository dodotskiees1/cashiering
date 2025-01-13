"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Table,
  Dropdown,
  Button,
  Card,
} from "react-bootstrap";
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from "./dashboard.page.css";

// Register required components
Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [showCanvas, setShowCanvas] = useState(true);
  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const adminId = searchParams.get("adminId");

  const [getOrders, setGetOrders] = useState([]);
  const [getProducts, setGetProducts] = useState([]);
  const [getUsers, setGetUsers] = useState([]);
  const [topPurchasedProducts, setTopPurchasedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const retrieveOrders = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayOrdersOnDashboard",
      },
    });
    setGetOrders(response.data);
    calculateTopPurchasedProducts(response.data);
  };

  const retrieveProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayProducts",
      },
    });
    setGetProducts(response.data);
  };

  const retrieveUsers = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayUsers",
      },
    });
    setGetUsers(response.data);
  };

  useEffect(() => {
    retrieveOrders();
    retrieveProducts();
    retrieveUsers();
  }, []);

  // Calculate top 5 purchased products
  const calculateTopPurchasedProducts = (orders) => {
    const productCount = {};
    orders.forEach((order) => {
      const productName = order.product_name;
      const quantity = parseInt(order.quantity, 10);
      productCount[productName] = (productCount[productName] || 0) + quantity;
    });

    const sortedProducts = Object.entries(productCount)
      .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
      .slice(0, 5)
      .map(([productName, quantity]) => ({ productName, quantity }));

    setTopPurchasedProducts(sortedProducts);
  };

  // Prepare data for Pie Chart
  const pieChartData = {
    labels: topPurchasedProducts.map(product => product.productName),
    datasets: [
      {
        label: 'Top 5 Products Sold',
        data: topPurchasedProducts.map(product => product.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#c0cacc",
          zIndex: -1,
        }}
      ></div>
      <Navbar expand="lg" className={styles.navbar} style={{ borderBottom: "2px solid #444" }}>
        <Container fluid className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Navbar.Brand className="m-0" style={{ color: "white" }}>Admin Panel</Navbar.Brand>
            <Button
              onClick={() => setShowCanvas(!showCanvas)}
              className="ms-4"
              style={{ backgroundColor: "transparent", border: "none", padding: 0, fontSize: "1.5rem", color: "#fff" }}
              aria-label="Toggle navigation"
            >
              ☰
            </Button>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ backgroundColor: "transparent", border: "none", color: "#fff" }}>
              Welcome, Admin
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/admin/login">Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      <div style={{ display: "flex", position: "relative", zIndex: 1 }}>
        {showCanvas && (
          <div className={styles.sidebar} style={{ backgroundColor: "#3c7c59", width: "200px", height: "100vh", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h5 style={{ color: "white", margin: "60px 0" }}>{firstname} {lastname}</h5>
            <Nav className="flex-column" style={{ width: "100%", textAlign: "center" }}>
              <Nav.Link href={`./dashboard?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`} className="text-white" style={{ cursor: "pointer", width: "100%" }}>Dashboard</Nav.Link>
              <Nav.Link href={`./products?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`} className="text-white" style={{ cursor: "pointer", width: "100%" }}>Products</Nav.Link>
              <Nav.Link href={`./history?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`} className="text-white" style={{ cursor: "pointer", width: "100%" }}>History</Nav.Link>
            </Nav>
          </div>
        )}

        <div className="main-content" style={{ flex: 1, margin: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center", width: "calc(100% - 220px)" }}>
          <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
            {/* Dashboard Card on the left */}
            <Card style={{ width: "170px", marginBottom: "20px", textAlign: "center", backgroundColor: "ashgray", color: "black" }}>
              <Card.Body>
                <Card.Title>Dashboard</Card.Title>
              </Card.Body>
            </Card>
          </div>

          <div className="row justify-content-center" style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
            {[{ title: "Total Users", value: getUsers.length, bgColor: "#007bff" },
            { title: "Total Products", value: getProducts.length, bgColor: "#b0e0e6" },
            { title: "Total Orders", value: getOrders.length, bgColor: "#ffe600" },
            {
              title: "Total Earnings",
              value: Math.floor(getOrders.reduce((acc, order) => acc + (parseFloat(order.total_price) || 0), 0)).toString(),
              bgColor: "#f0e68c",
            }            
            ].map((card, index) => (
              <div key={index} className="col-6 col-md-3 mb-3">
                <Card style={{ textAlign: "center", backgroundColor: card.bgColor }}>
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text>{card.value}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          {/* New Section for Top Purchased Products */}
          <div className="mt-4" style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "600px" }}>
            <div style={{ flex: 1, marginRight: "20px" }}>
              <h4>Top 5 Purchased Products</h4>
              {topPurchasedProducts.length > 0 ? (
                <ul>
                  {topPurchasedProducts.map((product, index) => (
                    <li key={index}>
                      {product.productName}: {product.quantity} sold
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No data available</p>
              )}
            </div>

            {/* Pie Chart for Top 5 Products */}
            {topPurchasedProducts.length > 0 && (
              <div style={{ width: "300px", height: "300px" }}>
                <Pie data={pieChartData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
