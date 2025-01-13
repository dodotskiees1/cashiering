"use client";
import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import styles from "./category.css";

const Category = () => {
  const [category, setCategory] = useState("");

  const [showCanvas, setShowCanvas] = useState(false);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);

  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");

  const addCategory = async () => {
    if (!category) {
      alert("Input field required!");
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      categoryName: category,
      admin: adminId,
    };

    console.log(jsonData);
    const formData = new FormData();
    formData.append("operation", "adminAddCategory");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      alert("Add Category Successful!");
      setCategory("");
    } else {
      alert("Add Category Failed");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={styles.customModal}
        style={{ borderBottom: "2px solid #444" }}
      >
        <Container fluid className="d-flex align-items-center">
        <div className="d-flex align-items-center">
            <Navbar.Brand className="m-0 mb-2 mb-lg-0 me-3" style={{ color: 'white' }}>
              Admin Panel
            </Navbar.Brand>
            <Button
              onClick={handleShowCanvas}
              className="ms-2"
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

      {/* Off-canvas navigation */}
      <Offcanvas
        show={showCanvas}
        onHide={handleCloseCanvas}
        className={styles.offcanvas}
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            {firstname} {lastname}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
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
            <Nav.Link
              href={`./category?firstname=${firstname}&lastname=${lastname}&adminId=${adminId}`}
              onClick={handleCloseCanvas}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Category
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container
  fluid
  className="d-flex align-items-center justify-content-center"
  style={{
    minHeight: "100vh",
    margin: 0, 
    padding: 0,
    backgroundColor: "#c0cacc", 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%",
    zIndex: -1, 
  }}
>
  <Row className="justify-content-center">
    <Col xs={12} md={10} lg={8} className="d-flex justify-content-center">
      <div
        className=""
        style={{
          width: "500px", 
          maxWidth: "1000px",
          height: "400px", 
          backgroundImage: "url('/images/1.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
          backdropFilter: "blur(10px)", 
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center", 
          position: "relative", 
        }}
      >
        <Form.Group className="mb-4" style={{ width: "80%" }}>
        <Form.Label style={{ color: "white" }}>Category</Form.Label> {/* Set label color to white */}
        <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            autoComplete="on"
            style={{
              textTransform: "capitalize",
              padding: "15px", 
              fontSize: "18px",
              backgroundColor: "rgba(255, 255, 255, 0.8)", 
              border: "none",
              borderRadius: "10px",
              color: "black", 
            }}
          />
        </Form.Group>
        <Button
          variant="success"
          onClick={addCategory}
          className="w-90"
          style={{ padding: "15px", fontSize: "18px" }}
        >
          Submit
        </Button>
      </div>
    </Col>
  </Row>
</Container>


    </>
  );
};

export default Category;
