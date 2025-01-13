"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "react-bootstrap-icons";
import { useSearchParams } from "next/navigation";
import {
  Navbar,
  Container,
  Button,
  Form,
  Card,
  Row,
  Col,
  Modal,
  Badge,
  Table,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import styles from "./main.css";


const Main = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname");
  const lastname = searchParams.get("lastname");
  const userId = searchParams.get("userId");

  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [getCategory, setCategory] = useState([]);
  const [getProducts, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);

  const [showUsersCartModal, setShowUsersCartModal] = useState(false);
  const handleCloseUsersCartModal = () => setShowUsersCartModal(false);
  const handleShowUsersCartModal = () => setShowUsersCartModal(true);

  const [showDirectOrderModal, setShowDirectOrderModal] = useState(false);
  const handleCloseDirectOrderModal = () => setShowDirectOrderModal(false);
  const handleShowDirectOrderModal = () => setShowDirectOrderModal(true);

  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductPrice, setSelectedProductPrice] = useState("");
  const [selectedProductDescription, setSelectedProductDescription] =
    useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setproductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [cartItems, setCartItems] = useState([]);

  const userLogin = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      username: username,
      password: password,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "userLogin",
      },
    });

    if (response.data.length > 0) {
      let params = new URLSearchParams();
      params.append("userId", response.data[0].user_id);
      params.append("firstname", response.data[0].firstname);
      params.append("lastname", response.data[0].lastname);
      alert("Login Success");
      setUsername("");
      setPassword("");
      router.push(`/?${params}`);
    } else {
      alert("Login failed");
    }
  };

  const retrieveProducts = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    try {
      const response = await axios.get(url, {
        params: {
          json: JSON.stringify({}),
          operation: "displayProducts",
        },
      });
      setProducts(response.data);
    } catch (error) {
      if (!error.response) {
        console.error("Unable to connect to the server!");
      } else {
        console.error(error.response.data);
      }
    }
  };

  const retrieveProductsbyId = async (productId) => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      productId: productId,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "displayProductsbyId",
      },
    });
    setSelectedProduct(response.data);
    console.log("Selected Product: ", response.data);

    const product = response.data[0];
    setSelectedProductName(product.product_name);
    setSelectedProductPrice(product.product_price);
    setSelectedProductDescription(product.product_description);
    setCategoryId(product.category_id);
    setproductId(product.product_id);
  };

  const retrieveCategory = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    try {
      const response = await axios.get(url, {
        params: {
          json: JSON.stringify({}),
          operation: "displayCategory",
        },
      });
      setCategory(response.data);
    } catch (error) {
      if (!error.response) {
        console.error("Unable to connect to the server!");
      } else {
        console.error(
          "Error occurred while fetching categories:",
          error.response.data
        );
      }
    }
  };

  useEffect(() => {
    retrieveProducts();
    retrieveCategory();
  }, []);

  const handleShowModal = (productId) => {
    retrieveProductsbyId(productId);
    handleShow(true);
  };

  const handleShowCartModal = () => {
    handleShowUsersCartModal(true);
  };

  const handleDirectOrder = (productId) => {
    retrieveProductsbyId(productId);
    handleShowDirectOrderModal(true);
  };

  const filteredAndSearchedProducts = getProducts
    .filter((product) =>
      selectedCategory ? product.category_name === selectedCategory : true
    )
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

  const addToCart = async () => {
    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "addToCart",
      },
    });

    if (response.data == 1) {
      alert("Add to Cart successful!");
      setQuantity(1);
    } else {
      alert("Add to Cart failed!");
    }
  };

  const handleAddToCartClick = () => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }
    if (window.confirm("Add this item to your cart?")) {
      const newItem = {
        productId,
        productName: selectedProductName,
        price: selectedProductPrice,
        quantity,
        selected: false,
      };

      setCartItems((prevItems) => [...prevItems, newItem]);
      setQuantity(1);
      setShow(false);

      const isAddedSuccessfully = true;

      if (isAddedSuccessfully) {
        setCartCount((prevCount) => prevCount + 1);
      }

      if (userId) {
        addToCart();
      }
    }
  };

  const handleCheckboxChange = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].selected = !newCartItems[index].selected;
    setCartItems(newCartItems);
    const selectedItems = newCartItems.filter((item) => item.selected);
    console.log(selectedItems.map((item) => JSON.stringify(item)));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.selected ? item.price * item.quantity : 0),
      0
    );
  };

  const placeOrder = async (selectedItems = []) => {
    if (!userId) {
      handleShowLoginModal();
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    let jsonData;

    if (selectedItems.length === 0) {
      const confirmOrder = window.confirm(
        "Are you sure you want to order this product?"
      );
      if (!confirmOrder) {
        return;
      }
      jsonData = {
        orders: [
          {
            userId: userId,
            productId: productId,
            quantity: quantity,
          },
        ],
      };
    } else {
      const confirmCheckout = window.confirm(
        "Are you sure you want to checkout these items?"
      );
      if (!confirmCheckout) {
        return;
      }
      jsonData = {
        orders: selectedItems.map((item) => ({
          userId: userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
    }

    console.log(jsonData);

    const formData = new FormData();
    formData.append("operation", "orders");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      if (selectedItems.length === 0) {
        alert("Order Successfully!");
        retrieveProducts();
      } else {
        alert("Checkout Successfully!");
        setCartItems(cartItems.filter((item) => !item.selected));
        setCartCount(0);
      }
    } else {
      if (selectedItems.length === 0) {
        alert("Order Failed!");
      } else {
        alert("Checkout Failed!");
      }
    }
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/images/1.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      ></div>


      <Navbar
        expand="lg"
        className={styles.customModal}
        style={{ borderBottom: "2px solid #444" }}
      >
        <Container
          fluid
          className="d-flex flex-wrap align-items-center"
          style={{ minHeight: "56px" }}
        >
          <Navbar.Brand className="m-0 mb-2 mb-lg-0 me-3" style={{ color: 'white' }}>
            E-commerce
          </Navbar.Brand>

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

          <div className="d-flex align-items-center" style={{ marginLeft: "20px" }}>
            <div
              style={{
                display: "inline-block",
                position: "relative",
                marginRight: "20px",
              }}
            >
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="cart-tooltip">Cart</Tooltip>}
              >
                <Icons.Cart
                  color="white"
                  size="1.5rem"
                  className="ms-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleShowCartModal();
                  }}
                />
              </OverlayTrigger>
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-10px",
                  }}
                >
                  {cartCount}
                </Badge>
              )}
            </div>

            <Icons.Person
              color="white"
              size="1.5rem"
              className="ms-1"
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => {
                handleShowLoginModal();
              }}
            />

            <span
              style={{
                color: "white",
                marginLeft: "10px",
                marginTop: "2px",
              }}
            >

              <Dropdown align="end" style={{ display: 'inline-block', marginLeft: '10px' }}>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#fff",
                  }}
                >
                  {firstname} {lastname}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/">Sign Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            </span>

          </div>
        </Container>
      </Navbar>

      <Container className="my-2 mt-4">
        <div className="border border-black p-3">
          <Row>
            <Col>
              <h3 className="text-left">Category</h3>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Button
                variant={selectedCategory === "" ? "primary" : "success"}
                className="w-100"
                onClick={() => setSelectedCategory("")}
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
                      backgroundColor: " #b0e2ee",

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
                  <Card.Footer
                    style={{
                      backgroundColor: "#b0e2ee",
                      border: "none",
                    }}
                    className="border-0"
                  >
                    <Row>
                      <Col md={6} className="d-flex justify-content-between">
                        <Button
                          variant="success"
                          className="d-flex align-items-center me-md-2"
                          onClick={() => handleShowModal(product.product_id)}
                        >
                          <Icons.Cart className="me-2" /> Cart
                        </Button>
                        <Button
                          variant="warning"
                          className="d-flex align-items-center"
                          onClick={() => {
                            handleDirectOrder(product.product_id);
                          }}
                        >
                          <Icons.Basket className="me-2" /> Order
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>

      <Modal
        show={showLoginModal}
        onHide={handleCloseLoginModal}
        centered
        style={{
          background: 'none',
        }}
      >
        <div
          style={{
            backgroundImage: 'url(/images/1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            color: 'white',
            padding: '20px',
          }}
        >
          <Modal.Header closeButton style={{ background: 'transparent' }}>
            <Modal.Title className="w-100 text-center">
              Login to E-Commerce
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ background: 'transparent' }}>
            <Card className="p-3" style={{ background: 'transparent' }}>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      autoComplete="on"
                      style={{ backgroundColor: 'white' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'white' }}>password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="on"
                      style={{ backgroundColor: 'white' }}
                    />
                  </Form.Group>

                  <Form.Text className="text-center" style={{ color: 'white' }}>
                    No account?
                    <Link href="/user/register" className="text-primary ms-1">
                      Register here
                    </Link>
                  </Form.Text>
                </Form>
              </Card.Body>
            </Card>
          </Modal.Body>

          <Modal.Footer style={{ background: 'transparent' }}>
            <Button variant="secondary" onClick={handleCloseLoginModal}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={() => {
                userLogin();
                handleCloseLoginModal();
              }}
            >
              Login
            </Button>
          </Modal.Footer>
        </div>
      </Modal>


      <Modal show={show} onHide={handleClose} centered style={{ background: 'none' }}>
        <div
          style={{
            backgroundImage: 'url(/images/3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '35%',
            color: 'white',
            padding: '20px',
          }}
        >
          <Modal.Header closeButton style={{ background: 'transparent' }}>
            <Modal.Title style={{ color: 'white' }}>Product Detail</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ background: 'transparent' }}>
            <Card style={{ background: 'transparent' }}>
              <Card.Img
                variant="top"
                src="/images/2.jpg"
                style={{ height: '150px', objectFit: 'contain' }}
              />
              <Card.Body>
                <Card.Title style={{ color: 'white' }}>{selectedProductName}</Card.Title>
                <Card.Subtitle className="mb-2" style={{ color: 'white' }}>
                  ₱{Number(selectedProductPrice).toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Card.Subtitle>
                <Card.Text style={{ color: 'white' }}>{selectedProductDescription}</Card.Text>
              </Card.Body>
            </Card>
            <Form.Group className="mt-2">
              <Form.Label style={{ color: 'white' }}>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ backgroundColor: 'white' }}
              />
            </Form.Group>
            <Card.Text
              className="mt-2"
              style={{
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '1.15rem',
                color: 'white',
              }}
            >
              Total Price: ₱{(selectedProductPrice * quantity).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Card.Text>
          </Modal.Body>

          <Modal.Footer style={{ background: 'transparent' }}>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={handleAddToCartClick}
              className="d-flex align-items-center justify-content-center"
            >
              <Icons.Cart className="me-2" /> Add to Cart
            </Button>
          </Modal.Footer>
        </div>
      </Modal>



      {/* Users Cart Modal */}
      <Modal
        show={showUsersCartModal}
        onHide={handleCloseUsersCartModal}
        centered
        style={{ background: 'none' }}
      >
        <div
          style={{
            backgroundImage: 'url(/images/3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 'auto',
            color: 'black',
            padding: '20px',
          }}
        >
          <Modal.Header closeButton style={{ background: 'transparent', color: 'white' }}>
            <Modal.Title style={{ color: 'white' }}>Cart</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ background: 'transparent', color: 'black' }}>
            {cartItems.length === 0 ? (
              <p style={{ color: 'white' }}>Your cart is empty.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td>{item.productName}</td>
                      <td>
                        ₱
                        {item.price.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        ₱
                        {(item.price * item.quantity).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Modal.Body>

          <Modal.Footer style={{ background: 'transparent', color: 'white' }}>
            {cartItems.length > 0 && (
              <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}> {/* Increased font size and weight */}
                Total price: ₱
                {calculateTotalPrice().toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="danger" onClick={handleCloseUsersCartModal}>
                Close
              </Button>
              {cartItems.length > 0 &&
                cartItems.some((item) => item.selected) && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const selectedItems = cartItems.filter(
                        (item) => item.selected
                      );
                      placeOrder(selectedItems);
                      handleCloseUsersCartModal();
                    }}
                  >
                    Checkout
                  </Button>
                )}
            </div>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Direct Order Modal */}
      <Modal
        show={showDirectOrderModal}
        onHide={handleCloseDirectOrderModal}
        centered
        style={{ background: 'none' }}
      >
        <div
          style={{
            backgroundImage: 'url(/images/4.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 'auto',
            color: 'white',
            padding: '20px',
          }}
        >
          <Modal.Header closeButton style={{ background: 'transparent', color: 'white' }}>
            <Modal.Title style={{ color: 'white' }}>Product Detail</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ background: 'transparent', color: 'white' }}>
            <Card style={{ background: 'transparent' }}>
              <Card.Img
                variant="top"
                src="/images/2.jpg"
                style={{ height: "150px", objectFit: "contain" }} // Set your desired height here
              />
              <Card.Body>
                <Card.Title style={{ color: 'white' }}>{selectedProductName}</Card.Title>
                <Card.Subtitle className="mb-2" style={{ color: 'white' }}>
                  ₱{Number(selectedProductPrice).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Card.Subtitle>
                <Card.Text style={{ color: 'white' }}>{selectedProductDescription}</Card.Text>
              </Card.Body>
            </Card>
            <Form.Group className="mt-2">
              <Form.Label style={{ color: 'white' }}>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ backgroundColor: 'white' }}
              />
            </Form.Group>
            <Card.Text
              className="mt-2"
              style={{
                textAlign: "right",
                fontWeight: "bold",
                fontSize: "1.15rem",
                color: 'white',
              }}
            >
              Total Price: ₱
              {(selectedProductPrice * quantity).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Card.Text>
          </Modal.Body>

          <Modal.Footer style={{ background: 'transparent', color: 'white' }}>
            <Button variant="secondary" onClick={handleCloseDirectOrderModal}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                placeOrder();
                handleCloseDirectOrderModal();
              }}
              className="d-flex align-items-center justify-content-center"
            >
              <Icons.Basket2 className="me-2" /> Order Placed
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

    </>
  );
};

export default Main;
