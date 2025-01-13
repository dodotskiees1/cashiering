"use client";
import React, { useEffect, useState } from 'react';
import Home from '@/components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost/ecomm/api/category.php') 
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleAddCategory = () => {
    fetch('http://localhost/ecomm/api/category.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_name: newCategory }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCategories([...categories, { category_id: data.category_id, category_name: newCategory }]);
          setNewCategory('');
          setShowModal(false);
        } else {
          console.error('Error adding category:', data.message);
        }
      })
      .catch(error => console.error('Error adding category:', error));
  };

  return (
    <div>
      <Home />
      <div className="container mt-4">
      
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Category
        </Button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Category ID</th>
              <th scope="col">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.category_id}>
                <td>{category.category_id}</td>
                <td>{category.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
       
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCategoryName">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Add Category
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Category;
