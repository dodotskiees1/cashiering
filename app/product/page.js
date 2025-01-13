"use client"
import React, { useEffect, useState } from 'react';
import Home from '@/components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    product_price: '',
    category_id: ''
  });

  useEffect(() => {
    fetch('http://localhost/ecomm/api/product.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error('Failed to fetch data:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));

    // Fetch categories for the dropdown
    fetch('http://localhost/ecomm/api/category.php')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/ecomm/api/product.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Refresh the product list or handle success
          console.log('Product added successfully');
          handleClose();
        } else {
          console.error('Failed to add product:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <Home />
      <div className="container mt-4">
        <Button variant="primary" onClick={handleShow}>
          Add Product
        </Button>

        <table className="table table-striped table-bordered mt-4">
          <thead className="thead-dark">
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.product_price}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formProductPrice">
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter product price"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formProductCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Product
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Product;
