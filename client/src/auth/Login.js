import React, { useState, useMemo } from "react";
import { navigate } from "@reach/router";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { login } from "../MongodbFunctions";
import { useCookies } from "react-cookie";
import userIcon from "../assets/icons/user.svg";
import passwordIcon from "../assets/icons/password.svg";

import "./auth.scss";

const Login = (props) => {
  // Input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);

  const submitForm = (e) => {
    e.preventDefault();
    login(username, password).then(async (response) => {
      const body = await response.json();
      if (username.length === 0 || password.length === 0) {
        setError("Please fill in all fields");
        return;
      }
      if (!response.ok) {
        setError(body.message);
      } else {
        setCookie("token", body.token);
        navigate("/");
      }
    });
  };

  const allFieldsFilled = useMemo(() => {
    return username.length !== 0 && password.length !== 0;
  }, [username, password]);

  return (
    <div className="auth_form_container">
      <Form className="auth_form" onSubmit={submitForm}>
        <h1 className="auth_header">Feeding San Diego</h1>
        <Form.Group className="input_field_container">
          <img class="icons" src={userIcon} alt="user icon"></img>
          <Form.Control
            type="text"
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value.trim());
            }}
            required
          />
        </Form.Group>

        <Form.Group className="input_field_container">
          <img class="icons" src={passwordIcon} alt="password icon"></img>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value.trim());
            }}
            required
          />
        </Form.Group>

        {error.length ? <p className="warning">{error}</p> : ""}
        <Button
          type="submit"
          onClick={submitForm}
          className={allFieldsFilled ? "active" : ""}
        >
          Log In
        </Button>

        <p className="white_text redirect">
          <a href="/signup" className="white_text">
            Create an account
          </a>
        </p>
      </Form>
    </div>
  );
};

export default Login;