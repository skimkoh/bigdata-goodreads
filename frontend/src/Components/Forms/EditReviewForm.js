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
//onst { Header, Footer, Sider, Content } = Layout;


class EditReviewForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        }
        );
    };
    
    //submitReview() {}
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
// Name of book, username, rating, summary, review
        return(
            
            <Form labelCol={{ span: 5}} wrapperCol ={{ span: 12}} onSubmit={this.handleSubmit}>
                <div>
                    <NavBar />
                    <h1 align="center"> 
                        Edit Book Review
                    </h1>
                </div>
                <div>
                    <Form.Item label="Name Of Book">
                        {getFieldDecorator('bookName', {
                            rules: [{ required: true, message: 'Please input the name of the book!' }],
                        })(<Input placeholder="Old Book Name" id="oldBookName"/>)}
                    </Form.Item>
                    <Form.Item label="Username">
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username' }],
                        })(<Input placeholder="Old Username" id="oldUsername"/>)}
                    </Form.Item>
                    <Form.Item label="Summary">
                        {getFieldDecorator('summary', {
                            rules: [{ required: true, message: 'Please input your summary' }],
                        })(<Input placeholder="Old Summary" id="oldSummary"/>)}
                    </Form.Item>
                    <Form.Item label="Review">
                        {getFieldDecorator('review', {
                            rules: [{ required: true, message: 'Please input your review' }],
                        })(<Input placeholder="Old Review" id="oldReview"/>)}
                    </Form.Item>
                    <Form.Item label="Rating">
                        {getFieldDecorator('rating', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input your rating' }],
                        })(<Rate />)}
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

EditReviewForm = Form.create({name: 'editReviewForm'})(EditReviewForm)
export default EditReviewForm;