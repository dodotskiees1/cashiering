"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Row,
  Col,
  Modal,
  Container,
  Form,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import Update from "@/components/contacts/update";
import ViewContact from "@/components/contacts/view";
import Delete from "@/components/contacts/delete";

const Main = () => {
  const searchParams = useSearchParams();
  const [contactsList, setContactsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [currentModal, setCurrentModal] = useState({
    updateModal: false,
    viewModal: false,
  });

  const fullName = searchParams.get("fullname");
  const userId = sessionStorage.userId;
  const router = useRouter();

  //======== contact details ===================
  const [contact, setContact] = useState({
    contactId: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    contactGroupId: "",
    contactGroup: "",
  });
  const mainUrl = sessionStorage.mainURL;

  const getContacts = async () => {
    const url = "http://localhost/contacts-api/contacts.php";
    const jsonData = { userId: userId };

    const response = await axios.get(url, {
      params: { json: JSON.stringify(jsonData), operation: "getContacts" },
    });

    setContactsList(response.data);
  };

  // const getGroups = async () => {
  //   const url = "http://localhost/contacts-api/groups.php";

  //   const response = await axios.get(url, {
  //     params: { json: "", operation: "getGroups" },
  //   });
  //   setGroupsList(response.data);
  // };

  const addContact = () => {
    sessionStorage.setItem("userId", userId);
    router.push("/addcontact");
  };

  const getContactDetails = async (contactId) => {
    const url = `${mainUrl}contacts.php`;
    const jsonData = { contactId: contactId };
    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "getContactDetails",
      },
    });
    const thisContact = response.data[0];
    setContact({
      contactId: thisContact.contact_id,
      contactName: thisContact.contact_name,
      contactPhone: thisContact.contact_phone,
      contactEmail: thisContact.contact_email,
      contactAddress: thisContact.contact_address,
      contactGroupId: thisContact.contact_group,
      contactGroup: thisContact.grp_name,
    });
  };

  const showViewModalForm = async (contactId) => {
    await getContactDetails(contactId);
    setCurrentModal({
      updateModal: false,
      viewModal: true,
      deleteModal: false,
    });
    setModalTitle("VIEW CONTACT");
    setShowModal(true);
  };

  const showUpdateModalForm = async (contactId) => {
    await getContactDetails(contactId);
    setCurrentModal({
      updateModal: true,
      viewModal: false,
      deleteModal: false,
    });
    setModalTitle("UPDATE CONTACT");
    setShowModal(true);
  };

  const showDeleteModalForm = async (contactId) => {
    await getContactDetails(contactId); 
    setCurrentModal({
      updateModal: false,
      viewModal: false,
      deleteModal: true,
    });
    setModalTitle("DELETE CONTACT");
    setShowModal(true);
  };

  const closeModal = () => {
    setCurrentModal({ updateModal: false, viewModal: false });
    setShowModal(false);
  };

  const deleteContact = async (contactId) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      const url = `${mainUrl}contacts.php`;

      const jsonData = {
        contactId: contactId,
      };

      const formData = new FormData();
      formData.append("operation", "deleteContact");
      formData.append("json", JSON.stringify(jsonData));

      const response = await axios({
        url: url,
        method: "POST",
        data: formData,
      });

      if (response.data == 1) {
        getContacts();
        alert("You have successfully DELETED your contact!");
      } else {
        alert("DELETE failed!");
      }
    }
  };

  const searchContact = async () => {
    const url = `${mainUrl}contacts.php`;
    const jsonData = { userId: userId, searchKey: searchKey };

    const response = await axios.get(url, {
      params: { json: JSON.stringify(jsonData), operation: "searchContact" },
    });

    setContactsList(response.data);
  };

  const getRecords = async () => {
    const url = `${mainUrl}utilities.php`;
    const jsonData = { userId: userId };

    const response = await axios.get(url, {
      params: {
        json: JSON.stringify(jsonData),
        operation: "getContactsGroups",
      },
    });
    setContactsList(response.data.contacts);
    setGroupsList(response.data.groups);
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <>
      <Container>
        <h1>Contacts of {fullName}</h1>
        <Row className="d-flex align-items-center">
          <Col md={10}>
            <Form.Control
              type="search"
              placeholder="Search Contacts"
              size="sm"
              className="m-3"
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            />
          </Col>
          <Col md={2} className="text-center">
            <Button onClick={searchContact} size="sm" className="w-100">
              <Icon.Search size={15} /> Search
            </Button>
          </Col>
        </Row>
        <Table striped hover>
          <thead bgcolor="red">
            <tr>
              <th className="bg-dark text-white">Name</th>
              <th className="bg-dark text-white">Address</th>
              <th className="bg-dark text-white">Phone</th>
              <th className="bg-dark text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactsList.map((contact, index) => {
              return (
                <tr key={index}>
                  <td>{contact.contact_name}</td>
                  <td>{contact.contact_address}</td>
                  <td>{contact.contact_phone}</td>
                  <td>
                    <Icon.Eye
                      className="ms-3"
                      color="green"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        showViewModalForm(contact.contact_id);
                      }}
                    />
                    <Icon.Pen
                      className="ms-3"
                      color="blue"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        showUpdateModalForm(contact.contact_id);
                      }}
                    />
                    <Icon.Trash
                      className="ms-3"
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        showDeleteModalForm(contact.contact_id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="fixed-bottom right-0 text-end p-2">
          <Button onClick={addContact}>
            <Icon.PlusCircle size={25} />
          </Button>
        </div>

        {/* PUBLIC MODAL */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentModal.updateModal && (
              <Update
                contactDetails={contact}
                groupsList={groupsList}
                closeModal={closeModal}
                refreshRecord={getContacts}
              />
            )}
            {currentModal.viewModal && (
              <ViewContact contactDetails={contact} closeModal={closeModal} />
            )}
            {currentModal.deleteModal && (
              <Delete
                contactId={contact.contactId} 
                closeModal={closeModal}
                refreshRecord={getContacts}
                contactDetails={contact} 
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Main;