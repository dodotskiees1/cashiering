"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Container, Button, Form, Row, Col, Card } from "react-bootstrap";

const Register = () => {
  const [registerForm, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    username: "",
    password: "",
  });

  const userRegister = async () => {
    if (
      !registerForm.firstname ||
      !registerForm.lastname ||
      !registerForm.gender ||
      !registerForm.username ||
      !registerForm.password
    ) {
      alert("All fields are required!");
      return;
    }

    const url = "http://localhost/nextjs/api/e-commerce/e-commerce.php";

    const jsonData = {
      firstname: registerForm.firstname,
      lastname: registerForm.lastname,
      gender: registerForm.gender,
      username: registerForm.username,
      password: registerForm.password,
    };

    const formData = new FormData();
    formData.append("operation", "userRegister");
    formData.append("json", JSON.stringify(jsonData));

    try {
      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      // Check for success response
      if (response.data.success) {
        alert("Register Successful!");
        console.log(response.data)
        setRegisterForm({
          firstname: "",
          lastname: "",
          gender: "",
          username: "",
          password: "",
        });
      } else {
        // If the username already exists, display the error message
        if (response.data.message === 'Username already exists') {
          alert("Username already exists! Please choose a different one.");
        } else {
          alert("Register Failed: " + response.data.message);
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while trying to register.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Card.Body>
          <Card.Title className="text-center" style={{ fontSize: "2.25rem" }}>
            Register
          </Card.Title>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Label>Firstname</Form.Label>
                <Form.Control
                  type="text"
                  value={registerForm.firstname}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      firstname: e.target.value,
                    })
                  }
                  placeholder="Enter firstname"
                  style={{ textTransform: "capitalize" }}
                  autoComplete="on"
                />
              </Col>
              <Col>
                <Form.Label>Lastname</Form.Label>
                <Form.Control
                  type="text"
                  value={registerForm.lastname}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      lastname: e.target.value,
                    })
                  }
                  autoComplete="on"
                  placeholder="Enter lastname"
                  style={{ textTransform: "capitalize" }}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={registerForm.gender}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, gender: e.target.value })
                }
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </Form.Group>
            <Button variant="success" onClick={userRegister} className="mb-3">
              Register
            </Button>
            <div>
              Already have an account?
              <Link href={"/"}>Login</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
