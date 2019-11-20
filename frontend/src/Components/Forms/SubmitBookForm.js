import React from "react";
import ReactDOM from "react-dom";
//import  { Redirect } from 'react-router-dom'
import NavBar from "../NavBar";
import {
  Form,
  Select,
  Input,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Icon,
  Rate,
  Checkbox,
  Row,
  Col,
  message
} from "antd";
import axios from "axios";

const { Option } = Select;

const success = () => {
  message.success("This is a success message");
};
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

class SubmitBookForm extends React.Component {
  componentDidMount() {
    console.log(process.env.REACT_APP_CLOUDINARY_CLOUDNAME);
  }

  state = {
    asin: "",
    price: "",
    description: "",
    title: "",
    uploadedPhoto: "",
    categories: [],
    substate: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    //     var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    //     var token = randomToken(9);
    //     token = 'N' + token
    const book = {
      asin: this.state.title,
      price: this.state.price,
      description: this.state.description,
      title: this.state.title,
      imUrl: this.state.uploadedPhoto
    };
    console.log(book);
    axios.post("http://54.255.189.94/book", { book }).then(res => {
      console.log(res);
      this.setState({ substate: true });
      console.log(res.data);
      console.log("success");
      //if (res.status == 200) {
      //this.props.history.push("/");
      //}
    });
  };
  //);

  //submitbook() {}

  showWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: `${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}`,
        uploadPreset: `${process.env.REACT_APP_CLOUDINARY_PRESET}`
      },
      (error, result) => {
        console.log(result);
        if (result["event"] === "success") {
          this.setState({
            uploadedPhoto: result["info"]["secure_url"]
          });
        }
      }
    );
  };

  checkUploadResult = resultEvent => {
    if (resultEvent.event === "success") {
      console.log("success");
    }
  };
  render() {
    if (this.state.substate) {
      this.props.history.push({
        pathname: "/"
      });
    }
    //const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    //   const prefixSelector = getFieldDecorator('prefix', {
    //     initialValue: '86',
    //   })(
    //     <Select style={{ width: 70 }}>
    //       <Option value="86">+86</Option>
    //       <Option value="87">+87</Option>
    //     </Select>,
    //   );
    return (
      <div>
        <NavBar />

        <Form onSubmit={this.handleSubmit}>
          <div className="bookFormContainer">
            <h1>Submit Book Review</h1>
            <Row>
              <Col span={12}>
                <Form.Item label="Name Of Book">
                  <Input
                    name="title"
                    className="reviewFormInput"
                    onChange={this.handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Upload Thumbnail">
                  <Button type="dashed" onClick={this.showWidget}>
                    {" "}
                    Upload Photo
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Price (in USD)">
                  <Input
                    name="price"
                    className="reviewFormInput"
                    onChange={this.handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Synopsis">
                  <Input
                    name="description"
                    className="reviewFormInput"
                    onChange={this.handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              <Col span={12}>
                <Form.Item label="Select Genre" hasFeedback>
                  <Select placeholder="Please select a genre" onChange={this.handleChange}>
                    <Option value="fantasy">Fantasy</Option>
                    <Option value="scienceFiction">Science Fiction</Option>
                    <Option value="western">Western</Option>
                    <Option value="romance">Romance</Option>
                    <Option value="thriller">Thriller</Option>
                    <Option value="mystery">Mystery</Option>
                    <Option value="detective">Detective Story</Option>
                    <Option value="dystopia">Dystopia</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row> */}
            {/* <Form.Item label="Select" hasFeedback>
                        {getFieldDecorator('select', {
                            rules: [{ required: true, message: 'Please the genre of the book' }],
                        })(
                            <Select placeholder="Please select a genre">
                                <Option value="fantasy">Fantasy</Option>
                                <Option value="scienceFiction">Science Fiction</Option>
                                <Option value="western">Western</Option>
                                <Option value="romance">Romance</Option>
                                <Option value="thriller">Thriller</Option>
                                <Option value="mystery">Mystery</Option>
                                <Option value="detective">Detective Story</Option>
                                <Option value="dystopia">Dystopia</Option>
                            </Select>,
                        )}
                    </Form.Item> */}
            <Form.Item>
              <Button type="submit" htmlType="submit" onClick={success}>
                Submit
              </Button>
            </Form.Item>

            <Col span={12}></Col>
          </div>
        </Form>
      </div>
    );
  }
}

SubmitBookForm = Form.create({ name: "submitBookForm" })(SubmitBookForm);
export default SubmitBookForm;
