"use client";

import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const submit = async() => {
    const url = "http://localhost/contacts-api/users.php";

    const jsonData = {
      username: username,
      password: password,
      fullname: fullname,
    };

    const formData = new FormData();
    formData.append("operation", "save");
    formData.append("json", JSON.stringify(jsonData));

    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    if(response.data == 1){
      alert("You have successfully registered!");
    }else{
      alert("REgistration failed!");
    }

  };

  return (
    <>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="Full Name"
        value={fullname}
        onChange={(e) => {
          setFullname(e.target.value);
        }}
      />
      <br />
      <button onClick={submit}>Submit</button>
      <br />
    </>
  );
};

export default Register;
