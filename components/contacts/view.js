import { useState } from "react";
import { Container, Table, Row, Col, Button } from "react-bootstrap";

const ViewContact = ({ contactDetails, closeModal }) => {
  const [contact, setContact] = useState({
    contactId: contactDetails.contactId,
    contactName: contactDetails.contactName,
    contactEmail: contactDetails.contactEmail,
    contactPhone: contactDetails.contactPhone,
    contactAddress: contactDetails.contactAddress,
    contactGroupId: contactDetails.contactGroupId,
    contactGroup: contactDetails.contactGroup,
  });

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{contact.contactName}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{contact.contactAddress}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{contact.contactPhone}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{contact.contactEmail}</td>
          </tr>
          <tr>
            <td>Group</td>
            <td>{contact.contactGroup}</td>
          </tr>
        </tbody>
      </Table>
      <Row>
        <Col lg={12} className="text-end">
          <Button variant="secondary" onClick={closeModal} className="w-25">
            Close
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewContact;
