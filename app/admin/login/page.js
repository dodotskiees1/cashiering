"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import styles from "./login.css";
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [showFieldError, setShowFieldError] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  const adminLogin = async () => {
    setShowFieldError(false);
    setShowLoginSuccess(false);
    setShowLoginError(false);

    if (!username || !password) {
      setShowFieldError(true);
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.get(url, {
        params: {
          json: JSON.stringify(jsonData),
          operation: "adminLogin",
        },
      });

      if (response.data.length > 0) {
        let params = new URLSearchParams();
        params.append("adminId", response.data[0].admin_id);
        params.append("firstname", response.data[0].firstname);
        params.append("lastname", response.data[0].lastname);
        setShowLoginSuccess(true);
        router.push(`/admin/dashboard?${params}`);
      } else {
        setShowLoginError(true);
      }
    } catch (error) {
      console.error("Login failed", error);
      setShowLoginError(true);
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center full-page-background" 
      >
        <Card
         style={{
          padding: "50px",
          borderRadius: "15px",
          backgroundColor: "#b0e2ee", 
          }}
        >
          <Card.Body style={{ padding: "20px" }}>
            <h2 className="text-center mb-4">Login Admin</h2>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="on"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="on"
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={adminLogin}
                className="w-100 mb-3"
              >
                Login
              </Button>

              {/* Error when input fields are missing */}
              {showFieldError && (
                <Alert
                  variant="warning"
                  onClose={() => setShowFieldError(false)}
                  dismissible
                >
                  Input fields are required to login.
                </Alert>
              )}

              {/* Login Success */}
              {showLoginSuccess && (
                <Alert
                  variant="success"
                  onClose={() => setShowLoginSuccess(false)}
                  dismissible
                >
                  Login Successful!
                </Alert>
              )}

              {/* Error when login credentials are incorrect */}
              {showLoginError && (
                <Alert
                  variant="danger"
                  onClose={() => setShowLoginError(false)}
                  dismissible
                >
                  Invalid username or password!
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AdminLogin;