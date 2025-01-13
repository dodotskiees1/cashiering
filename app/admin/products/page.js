"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Form,
  Card,
  Row,
  Col,
  Modal,
  Table,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import styles from "./Page.module.css";

const Products = () => {
  // State variables
  const [showCanvas, setShowCanvas] = useState(true);
  const handleCloseCanvas = () => setShowCanvas(false);
  const handleShowCanvas = () => setShowCanvas(true);
  const handleToggleCanvas = () => setShowCanvas((prevState) => !prevState);

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const handleCloseAddProductModal = () => setShowAddProductModal(false);
  const handleShowAddProductModal = () => setShowAddProductModal(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = () => setShowUpdateModal(true);

  const [showProductsModal, setShowProductsModal] = useState(false);
  const handleCloseProductsModal = () => setShowProductsModal(false);
  const handleShowProductsModal = () => setShowProductsModal(true);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const adminId = searchParams.get("adminId"); // Admin username

  const [getProducts, setGetProducts] = useState([]);
  const [getProductById, setProductById] = useState([]);
  const [getCategory, setGetCategory] = useState([]);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [productNameUpdate, setProductNameUpdate] = useState("");
  const [productPriceUpdate, setProductPriceUpdate] = useState("");
  const [productDescriptionUpdate, setProductDescriptionUpdate] = useState("");
  const [categoryUpdate, setCategoryUpdate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

  const addProduct = async () => {
    if (!productName || !productPrice || !productDescription || !category || !productImage) {
      alert("All input fields, including the image, are required!");
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php"; // API route

    // Create a FormData object to hold the data
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productDescription", productDescription);
    formData.append("category", category);
    formData.append("admin", adminId);
    formData.append("productImage", productImage); // Append the image file

    try {
      const response = await axios.post(url, formData, {
        params: {
          operation: "addProduct",
        },
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });

      if (response.data.success) {
        alert("Product added successfully!");
        // Reset fields
        setProductName('');
        setProductPrice('');
        setProductDescription('');
        setCategory('');
        setProductImage(null); // Reset image input
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };


  const updateProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productId,
      productName: productNameUpdate,
      productPrice: productPriceUpdate,
      productDescription: productDescriptionUpdate,
      category: categoryId,
      admin: adminId,
    };

    const formData = new FormData();
    formData.append("operation", "updateProduct");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url,
      method: "POST",
      data: formData,
    });

    if (response.data.success) {
      if (response.data.result === 1) {
        alert("Product updated successfully!");
        retrieveProducts();
      } else {
        alert("Failed to update product!");
      }
    } else {
      if (response.data.message === 'Product name already exists') {
        alert("Product name already exists! It can't have the same product name.");
      } else {
        alert(response.data.message);
      }
    }
  };

  const showUpdateModalForm = (productId) => {
    retrieveProductsById(productId);
    handleShowUpdateModal(true);
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

  const retrieveProductsById = async (productId) => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displayProductsbyId",
      },
    });
    setProductById(response.data);
    console.log("Selected Product:", response.data);

    const product = response.data[0];
    setProductNameUpdate(product.product_name);
    setProductPriceUpdate(product.product_price);
    setProductDescriptionUpdate(product.product_description);
    setCategoryUpdate(product.category_name);
    setCategoryId(product.category_id);
    setProductId(product.product_id);
  };

  const retrieveCategory = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify({}),
        operation: "displayCategory",
      },
    });
    setGetCategory(response.data);
  };

  useEffect(() => {
    retrieveProducts();
    retrieveCategory();
  }, []);

  const handleSelectionCategory = (event) => {
    setCategory(event.target.value);
  };

  const filteredAndSearchedProducts = getProducts
    .filter((product) =>
      selectedCategory
        ? product.category_name === selectedCategory
        : true
    )
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

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
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1"
            style={{ position: "relative", maxWidth: "350px", margin: "0 auto" }}
          >
            <Form.Control
              type="search"
              placeholder="Search Products"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              style={{
                paddingRight: "2rem",
                width: "100%",
              }}
            />
            <Icons.Search
              color="gray"
              size="1.2rem"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
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
          <div className={styles.sidebar} style={{ backgroundColor: '#3c7c59', width: '190px', height: '300vh', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            marginLeft: '200px',
            transition: 'margin-left 0.3s',
            margin: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >

          {/* for adding new product button */}
          <Container className="my-2 mt-4">
            <Row className="justify-content-end">
              <Col xs="auto">
                <Button
                  variant="success"
                  className="mt-3 d-flex align-items-center gap-2"
                  onClick={handleShowAddProductModal}
                >
                  Add Products
                </Button>
              </Col>
            </Row>
          </Container>

          {/* filter buttons category */}
          <Container className="my-2 mt-4">
            {/* Container Box with Border */}
            <div className="border p-3">
              {/* Title for the Category Section aligned to the left */}
              <Row>
                <Col>
                  <h3 className="text-left">Category</h3> {/* Text aligned to the left */}
                </Col>
              </Row>

              {/* Buttons Section */}
              <Row className="justify-content-center">
                {/* ALL Button */}
                <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
                  <Button
                    variant={selectedCategory === "" ? "primary" : "success"}
                    className="w-100"
                    onClick={() => setSelectedCategory("")} // Sets to empty string for all products
                    size="md"
                  >
                    ALL
                  </Button>
                </Col>

                {/* Category Buttons */}
                {getCategory.map((category) => (
                  <Col
                    key={category.category_id}
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    className="mb-2"
                  >
                    <Button
                      variant={
                        selectedCategory === category.category_name ? "primary" : "success"
                      }
                      className="w-100"
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.category_name
                            ? ""
                            : category.category_name
                        )
                      }
                      size="md"
                    >
                      {category.category_name}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>



          {/* display products by filter and search  */}
          <Container
            className="my-2"
            style={{
              backgroundColor: "",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <Row className="justify-content-center">
              {filteredAndSearchedProducts.length === 0 ? (
                <Col xs={12} className="text-center">
                  <h5>No products found</h5>
                </Col>
              ) : (
                filteredAndSearchedProducts.map((product, index) => (
                  <Col key={index} xs={6} sm={6} md={4} lg={3} className="mb-4">
                    <Card className={`shadow-sm ${styles.cardBackground}`}>
                      <Card.Img
                        variant="top"
                        src="/images/2.jpg"
                      />
                      <Card.Body
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "100%",
                        }}
                      >
                        <div>
                          <Card.Title
                            style={{
                              textTransform: "capitalize",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                            }}
                          >
                            {product.product_name}
                          </Card.Title>
                          <Card.Text style={{ fontSize: "0.95rem" }}>
                            ₱{product.product_price}
                          </Card.Text>
                        </div>
                      </Card.Body>
                      <Card.Footer className="bg-transparent border-0">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id={`tooltip-view`}>View</Tooltip>}
                        >
                          <Icons.Eye
                            color="red"
                            size={"1.50rem"}
                            onClick={() => {
                              handleShowProductsModal();
                              retrieveProductsById(product.product_id);
                            }}
                            style={{ marginRight: "0.85rem", cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id={`tooltip-edit`}>Edit</Tooltip>}
                        >
                          <Icons.PencilSquare
                            color="blue"
                            size={"1.5rem"}
                            onClick={() => showUpdateModalForm(product.product_id)}
                            style={{ marginRight: "0.85rem", cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Container>


          {/* add modal */}
          <Modal
  show={showAddProductModal}
  onHide={handleCloseAddProductModal}
  centered
>
  <Modal.Header
    closeButton
    className={styles.modalheader}
    style={{ backgroundColor: '#2c3e50', color: 'white' }}
  >
    <Modal.Title>Add Products</Modal.Title>
  </Modal.Header>
  <Modal.Body
    className={styles.customModal}
    style={{ backgroundColor: '#3c7c59', color: 'white' }}
  >
    <Form className="mt-3">
      <Row>
        <Col>
          <Form.Group controlId="productName">
            <Form.Label style={{ color: 'white' }}>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              autoComplete="on"
              style={{ textTransform: 'capitalize', backgroundColor: '#fff', color: 'black' }}
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="productPrice">
            <Form.Label style={{ color: 'white' }}>Product Price</Form.Label>
            <Form.Control
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter product price"
              style={{ backgroundColor: '#fff', color: 'black' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="productDescription">
            <Form.Label className="mt-2" style={{ color: 'white' }}>
              Product Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description"
              className="mb-2"
              style={{ backgroundColor: '#fff', color: 'black' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="category">
        <Form.Label style={{ color: 'white' }}>Category</Form.Label>
        <Form.Control
          as="select"
          value={category}
          onChange={handleSelectionCategory}
          style={{ backgroundColor: '#fff', color: 'black' }}
        >
          <option value="">--Select Category--</option>
          {getCategory.map((category, index) => (
            <option key={index} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* File input for image upload */}
      <Form.Group controlId="productImage">
        <Form.Label style={{ color: 'white' }}>Upload Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files[0])}
          style={{ backgroundColor: '#fff', color: 'black' }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer className={styles.modalfooter}>
    <Button variant="danger" onClick={handleCloseAddProductModal}>
      Close
    </Button>
    <Button
      variant="success"
      onClick={() => {
        addProduct();
      }}
    >
      Submit
    </Button>
  </Modal.Footer>
</Modal>



          {/* view modal */}
          <Modal
            show={showProductsModal}
            onHide={handleCloseProductsModal}
            centered
            size="md"
          >
            <Modal.Header closeButton className={styles.modalheader}>
              <Modal.Title style={{ color: 'white' }}>View Product</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${styles.customModal} ${styles.fullHeight}`}>
              <Card style={{ backgroundColor: '#3c7c59', border: 'none' }}>
                <Card.Img
                  variant="top"
                  src="/images/2.jpg"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: 'white' }}>{productNameUpdate}</Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: 'white' }}>
                    ₱
                    {Number(productPriceUpdate).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Card.Subtitle>
                  <Card.Text style={{ color: 'white' }}>{productDescriptionUpdate}</Card.Text>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer className={styles.modalfooter}>
              <Button variant="danger" onClick={handleCloseProductsModal} style={{ color: 'white' }}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>



          {/* update modal */}
          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered>
            <Modal.Header closeButton className={styles.modalheader} >
              <Modal.Title style={{ color: 'white' }}>Update Products</Modal.Title>
            </Modal.Header>
            <Modal.Body className={`${styles.customModal}`} style={{ backgroundColor: '#3c7c59', color: 'white' }}>
              <Table className="table-borderless" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <th style={{ width: "30%", backgroundColor: '#3c7c59', color: 'white' }}>Product Name</th>
                    <td>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={productNameUpdate}
                        onChange={(e) => setProductNameUpdate(e.target.value)}
                        className="mb-3"
                        style={{ backgroundColor: '#3c7c59', color: 'white' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#3c7c59', color: 'white' }}>Product Price</th>
                    <td>
                      <Form.Control
                        type="number"
                        placeholder="Enter product price"
                        value={productPriceUpdate}
                        onChange={(e) => setProductPriceUpdate(e.target.value)}
                        className="mb-3"
                        style={{ backgroundColor: '#3c7c59', color: 'white' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#3c7c59', color: 'white' }}>Product Description</th>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter product description"
                        value={productDescriptionUpdate}
                        onChange={(e) => setProductDescriptionUpdate(e.target.value)}
                        className="mb-3"
                        style={{ backgroundColor: '#3c7c59', color: 'white' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: '#3c7c59', color: 'white' }}>Category</th>
                    <td>
                      <Form.Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="mb-3"
                        style={{ backgroundColor: '#3c7c59', color: 'white' }}
                      >
                        <option>Select a category</option>
                        {getCategory.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer className={styles.modalfooter}>
              <Button variant="danger" onClick={handleCloseUpdateModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleCloseUpdateModal(false);
                  updateProducts();
                }}
              >
                Update Products
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Products;
