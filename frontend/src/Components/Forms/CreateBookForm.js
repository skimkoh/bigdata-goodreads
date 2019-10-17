import React from "react";
import { Form } from "antd";
import axios from 'axios';

class CreateBookForm extends React.Component {
  state={
    asin: '',
    price: '',
    description: '',
    title: '',

  }
  render() {
    return (
        <div>
            <Form>
                create book 
            </Form>
        </div>
    );
  }
}

export default CreateBookForm;
