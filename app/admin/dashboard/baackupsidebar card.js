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
import styles from "./dashboard.page.css";

const Dashboard = () => {
  const [showCanvas, setShowCanvas] = useState(true);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const adminId = searchParams.get("adminId");

  const [getOrders, setGetOrders] = useState([]);
  const [getProducts, setGetProducts] = useState([]);
  const [getUsers, setGetUsers] = useState([]);

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

  const filteredOrders = getOrders.filter((order) => {
    if (selectedProduct && selectedUser) {
      return (
        order.product_name === selectedProduct &&
        `${order.firstname} ${order.lastname}` === selectedUser
      );
    } else if (selectedProduct) {
      return order.product_name === selectedProduct;
    } else if (selectedUser) {
      return `${order.firstname} ${order.lastname}` === selectedUser;
    }
    return true;
  });

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
      <Navbar
        expand="lg"
        className={styles.navbar}
        style={{ borderBottom: "2px solid #444", display: 'flex', alignItems: 'center' }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Navbar.Brand className="m-0 mb-2 mb-lg-0 me-3" style={{ color: 'white' }}>
              Admin Panel
            </Navbar.Brand>
            <Button
              onClick={showCanvas ? handleCloseCanvas : handleShowCanvas}
              className="ms-4"
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: 0,
                fontSize: "1.5rem",
                color: "#fff",
              }}
              aria-label="Toggle navigation"
            >
              ☰
            </Button>
          </div>

          {/* Username Dropdown */}
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

      <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
        {showCanvas && (
          <div className={styles.sidebar} style={{ backgroundColor: '#3c7c59', width: '200px', height: '1000vh', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5 style={{ color: 'white', margin: '60px 0' }}>{firstname} {lastname}</h5>
            <Nav className="flex-column" style={{ width: '100%', textAlign: 'center' }}>
              <Nav.Link
                href={`./dashboard?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
                className="text-white"
                style={{ cursor: "pointer", width: '100%' }}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                href={`./products?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
                className="text-white"
                style={{ cursor: "pointer", width: '100%' }}
              >
                Products
              </Nav.Link>
            </Nav>
          </div>
        )}

        <div
          className="main-content"
          style={{
            flex: 1,
            marginLeft: '10px',
            transition: 'margin-left 0.3s',
            margin: '20px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 'calc(100% - 220px)', 
          }}
        >
          <Card style={{ width: '170px', marginBottom: '20px', textAlign: 'center', alignSelf: 'flex-start', backgroundColor: 'ashgray', color: 'black' }}>
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
            </Card.Body>
          </Card>

          <div className="row justify-content-center" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
            {[ 
              { title: "Total Users", value: getUsers.length, bgColor: "#007bff" },
              { title: "Total Products", value: getProducts.length, bgColor: "#b0e0e6" },
              { title: "Total Orders", value: getOrders.length, bgColor: "#ffe600" },
              { title: "Total Earnings", value: getOrders.reduce((acc, order) => acc + (parseFloat(order.total_price) || 0), 0).toFixed(2), bgColor: "#f0e68c" }
            ].map((card, index) => (
              <div key={index} className="col-6 col-md-3 mb-3">
                <Card style={{ textAlign: 'center', backgroundColor: card.bgColor }}>
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text>{card.value}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          <div
            className="d-flex justify-content-between"
            style={{
              width: '100%',
              maxWidth: '600px',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Dropdown style={{ flex: 1, marginRight: '10px' }} onSelect={(eventKey) => setSelectedProduct(eventKey)}>
              <Dropdown.Toggle variant="success" id="dropdown-products" style={{ width: '100%' }}>
                {selectedProduct || 'Select Product'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getProducts.map((product, index) => (
                  <Dropdown.Item key={index} eventKey={product.product_name}>
                    {product.product_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown style={{ flex: 1 }} onSelect={(eventKey) => setSelectedUser(eventKey)}>
              <Dropdown.Toggle variant="success" id="dropdown-users" style={{ width: '100%' }}>
                {selectedUser || 'Select User'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getUsers.map((user, index) => (
                  <Dropdown.Item key={index} eventKey={`${user.firstname} ${user.lastname}`}>
                    {user.firstname} {user.lastname}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="mt-4 text-center">
              {selectedProduct && !selectedUser && <p>No users have ordered this product.</p>}
              {selectedUser && !selectedProduct && <p>This user hasn't ordered anything.</p>}
              {selectedProduct && selectedUser && <p>No matching orders for this user and product combination.</p>}
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
              <Table striped bordered hover className="mt-4 custom-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((orders, index) => (
                    <tr key={index}>
                      <td>{orders.firstname} {orders.lastname}</td>
                      <td>{orders.product_name}</td>
                      <td>{orders.product_price}</td>
                      <td>{orders.quantity}</td>
                      <td>{orders.category_name}</td>
                      <td>{orders.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
