import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const Update = ({ contactDetails, groupsList, closeModal, refreshRecord }) => {
  const mainUrl = sessionStorage.mainURL;

  const [contact, setContact] = useState({
    contactId: contactDetails.contactId,
    contactName: contactDetails.contactName,
    contactEmail: contactDetails.contactEmail,
    contactPhone: contactDetails.contactPhone,
    contactAddress: contactDetails.contactAddress,
    contactGroupId: contactDetails.contactGroupId,
  });

  const updateContact = async () => {
    const url = `${mainUrl}contacts.php`;

    const jsonData = {
      contactId: contact.contactId,
      contactName: contact.contactName,
      contactEmail: contact.contactEmail,
      contactPhone: contact.contactPhone,
      contactAddress: contact.contactAddress,
      contactGroupId: contact.contactGroupId,
    };

    const formData = new FormData();
    formData.append("operation", "updateContact");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if (response.data == 1) {
      //getContacts();
      alert("You have successfully UPDATED your contact!");
    } else {
      alert("UPDATE failed!");
    }
  };

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <Form.Control
                type="text"
                value={contact.contactName}
                onChange={(e) => {
                  setContact({ ...contact, contactName: e.target.value });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <Form.Control
                type="text"
                value={contact.contactAddress}
                onChange={(e) => {
                  setContact({ ...contact, contactAddress: e.target.value });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>
              <Form.Control
                type="text"
                value={contact.contactPhone}
                onChange={(e) => {
                  setContact({ ...contact, contactPhone: e.target.value });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <Form.Control
                type="text"
                value={contact.contactEmail}
                onChange={(e) => {
                  setContact({ ...contact, contactEmail: e.target.value });
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Group</td>
            <td>
              <Form.Select
                value={contact.contactGroupId}
                onChange={(e) => {
                  setContact({ ...contact, contactGroupId: e.target.value });
                }}
              >
                {groupsList.map((group, index) => {
                  return (
                    <option value={group.grp_id} key={group.grp_id}>
                      {group.grp_name}
                    </option>
                  );
                })}
              </Form.Select>
            </td>
          </tr>
        </tbody>
      </Table>

      <Row>
        <Col lg={6} className="text-end" >
          <Button variant="secondary" onClick={closeModal} className="me-2 w-75">
            Close
          </Button>
        </Col>
        <Col lg={6} className="text-start">
          <Button
            variant="primary"
            onClick={() => {
              updateContact();
              refreshRecord();
              closeModal();
            }}
            className="ms-2 w-75"
          >
            Update
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Update;
