import React, { useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';

const Delete = ({ contactId, closeModal, refreshRecord, contactDetails }) => {
    const mainUrl = sessionStorage.mainURL;
    const [contact, setContact] = useState(contactDetails || {});

    const deleteContact = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this contact?");
        if (confirmation) {
            const url = `${mainUrl}contacts.php`;

            const jsonData = {
                contactId: contactId,
            };

            const formData = new FormData();
            formData.append("operation", "deleteContact");
            formData.append("json", JSON.stringify(jsonData));

            try {
                const response = await axios.post(url, formData);

                if (response.data == 1) {
                    refreshRecord();
                    closeModal();
                    alert("You have successfully DELETED your contact!");
                } else {
                    alert("DELETE failed!");
                }
            } catch (error) {
                console.error("Delete operation failed:", error);
                alert("An error occurred while trying to delete the contact.");
            }
        }
    };

    return (
        <>
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
            <Button variant="danger" onClick={deleteContact}>
                Delete
            </Button>
        </>
    );
};

export default Delete;
