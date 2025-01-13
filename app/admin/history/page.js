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
import { Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'; // Import required Chart.js components
import styles from "./dashboard.page.css";

// Register required components
Chart.register(ArcElement, Tooltip, Legend);

const History = () => {
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
        console.log(response.data);
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
            if (productCount[productName]) {
                productCount[productName] += quantity;
            } else {
                productCount[productName] = quantity;
            }
        });

        // Get an array of products sorted by quantity sold
        const sortedProducts = Object.entries(productCount)
            .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
            .slice(0, 5) // Get top 5
            .map(([productName, quantity]) => ({ productName, quantity }));

        setTopPurchasedProducts(sortedProducts);
    };

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
            <Navbar
                expand="lg"
                className={styles.navbar}
                style={{
                    borderBottom: "2px solid #444",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Container fluid className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <Navbar.Brand
                            className="m-0 mb-2 mb-lg-0 me-3"
                            style={{ color: "white" }}
                        >
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

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#fff",
                            }}
                        >
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
                    <div
                        className={styles.sidebar}
                        style={{
                            backgroundColor: "#3c7c59",
                            width: "200px",
                            height: "1000vh",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <h5 style={{ color: "white", margin: "60px 0" }}>
                            {firstname} {lastname}
                        </h5>
                        <Nav className="flex-column" style={{ width: "100%", textAlign: "center" }}>
                            <Nav.Link
                                href={`./dashboard?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
                                className="text-white"
                                style={{ cursor: "pointer", width: "100%" }}
                            >
                                Dashboard
                            </Nav.Link>
                            <Nav.Link
                                href={`./products?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
                                className="text-white"
                                style={{ cursor: "pointer", width: "100%" }}
                            >
                                Products
                            </Nav.Link>
                            <Nav.Link
                                href={`./history?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
                                className="text-white"
                                style={{ cursor: "pointer", width: "100%" }}
                            >
                                History
                            </Nav.Link>
                        </Nav>
                    </div>
                )}

                <div
                    className="main-content"
                    style={{
                        flex: 1,
                        marginLeft: "10px",
                        transition: "margin-left 0.3s",
                        margin: "20px 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "calc(100% - 220px)",
                    }}
                >
                    <Card
                        style={{
                            width: "170px",
                            marginBottom: "20px",
                            textAlign: "center",
                            alignSelf: "flex-start",
                            backgroundColor: "ashgray",
                            color: "black",
                        }}
                    >
                        <Card.Body>
                            <Card.Title>History</Card.Title>
                        </Card.Body>
                    </Card>
                    <Table striped bordered hover className="mt-4" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.order_id}>
                                    <td>{`${order.firstname} ${order.lastname}`}</td>
                                    <td>{order.product_name}</td>
                                    <td>{order.product_price}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default History;
