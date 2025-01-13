import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Home = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">E-commerce</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="./category">Category</Nav.Link>
          <Nav.Link href="./product">Product</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Home;
