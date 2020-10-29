import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";

function App() {
  return (
    <>
      <Form>
        <section id="scanBarCodeHead">
          <Form.Group controlId="data">
            <Form.Control as="textarea" rows={1} />
          </Form.Group>
          <Form.Group controlId="submit">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form.Group>
        </section>
        <section id="scanResults">
          <Form.Group controlId="inputFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="type" placeholder="First Name" />
          </Form.Group>
        </section>
      </Form>
    </>
  );
}

export default App;
