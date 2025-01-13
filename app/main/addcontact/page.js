"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const AddContact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [groupId, setGroupId] = useState(0);
  const [groupsList, setGroupsList] = useState([]);

  const submit = async () => {
    const url = "http://localhost/contacts-api/contacts.php";

    const jsonData = {
      groupId: groupId,
      name: name,
      email: email,
      phone: phone,
      address: address,
      userId: sessionStorage.userId
    };

    const formData = new FormData();
    formData.append("operation", "addContact");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if(response.data == 1){
      alert("You have successfully added a new contact!");
    }else{
      alert("Contact registration failed!");
    }
  };

  const getGroups = async () => {
    const url = "http://localhost/contacts-api/groups.php";

    const response = await axios.get(url, {
      params: { json: "", operation: "getGroups" },
    });
    setGroupsList(response.data);
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      <h1>Add Contact</h1>
      <input
        type="text"
        value={name}
        placeholder="Contact Name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        value={phone}
        placeholder="Phone Number"
        onChange={(e) => {
          setPhone(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        value={email}
        placeholder="Email Address"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        value={address}
        placeholder="Home Address"
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />
      <br />
      <select
        value={groupId}
        onChange={(e) => {
          setGroupId(e.target.value);
        }}
      >
        {groupsList.map((group, index) => {
          return (
            <option value={group.grp_id} key={index}>
              {group.grp_name}
            </option>
          );
        })}
      </select>

      <br />
      <br />
      <button onClick={submit}>Submit</button>
    </>
  );
};

export default AddContact;
