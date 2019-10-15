import React from "react";
import ReactDOM from 'react-dom'

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
  } from 'antd';

  const {
      Option
  } = Select;

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}

class SubmitBookForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        }
        );
    };
    //submitbook() {}

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
          const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };
          
          const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
          })(
            <Select style={{ width: 70 }}>
              <Option value="86">+86</Option>
              <Option value="87">+87</Option>
            </Select>,
          );
        return(
            //Book title, price, genre, synopsis

            <Form labelCol={{ span: 5}} wrapperCol ={{ span: 12}} onSubmit={this.handleSubmit}>
                <div>
                    <NavBar />
                    <h1 align="center"> 
                        Submit Book Review
                    </h1>
                </div>
                <div>
                    <Form.Item label="Name Of Book">
                        {getFieldDecorator('bookName', {
                            rules: [{ required: true, message: 'Please input the name of the book!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Price (in USD)">
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: 'Please input the price of the book' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Synopsis">
                        {getFieldDecorator('synopsis', {
                            rules: [{ required: true, message: 'Please input the synopsis of the book' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Select" hasFeedback>
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
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
                
            </Form>
                
        );
    }
}

SubmitBookForm = Form.create({name: "submitBookForm"})(SubmitBookForm)
export default SubmitBookForm;