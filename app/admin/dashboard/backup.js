"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Table,
  Dropdown,
} from "react-bootstrap";
import styles from "./dashboard.page.css";

const Dashboard = () => {
  const [showCanvas, setShowCanvas] = useState(true); // Start with sidebar visible
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
        style={{ borderBottom: "2px solid #444" }}
      >
        <Container fluid className="d-flex align-items-center">
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
        </Container>
      </Navbar>

      {/* Sidebar navigation */}
      {showCanvas && (
        <div className={styles.sidebar}>
          <Nav className="flex-column">
            <Nav.Link
              href={`./dashboard?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href={`./products?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Products
            </Nav.Link>
          </Nav>
        </div>
      )}

      <div className={`main-content ${showCanvas ? '' : 'sidebar-hidden'}`} style={{ marginLeft: showCanvas ? '250px' : '0', transition: 'margin-left 0.3s' }}>
        <Container className="mt-4">
          <div className="d-flex justify-content-between">
            {/* Products Dropdown */}
            <Dropdown onSelect={(eventKey) => setSelectedProduct(eventKey)}>
              <Dropdown.Toggle variant="success" id="dropdown-products">
                {selectedProduct || "Select Product"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getProducts.map((product, index) => (
                  <Dropdown.Item key={index} eventKey={product.product_name}>
                    {product.product_name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Users Dropdown */}
            <Dropdown onSelect={(eventKey) => setSelectedUser(eventKey)}>
              <Dropdown.Toggle variant="success" id="dropdown-users">
                {selectedUser || "Select User"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {getUsers.map((user, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={`${user.firstname} ${user.lastname}`}
                  >
                    {user.firstname} {user.lastname}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="mt-4 text-center">
              {selectedProduct && !selectedUser && (
                <p>No users have ordered this product.</p>
              )}
              {selectedUser && !selectedProduct && (
                <p>This user hasnt ordered anything.</p>
              )}
              {selectedProduct && selectedUser && (
                <p>No matching orders for this user and product combination.</p>
              )}
            </div>
          ) : (
            <Table striped bordered hover className="mt-4 custom-table">
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
                    <td>
                      {orders.firstname} {orders.lastname}
                    </td>
                    <td>{orders.product_name}</td>
                    <td>{orders.product_price}</td>
                    <td>{orders.quantity}</td>
                    <td>{orders.category_name}</td>
                    <td>{orders.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
