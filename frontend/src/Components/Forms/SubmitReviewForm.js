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
import axios from 'axios';

  const {
      Option
  } = Select;

//const { Header, Footer, Sider, Content } = Layout;

	
function onChange(e) {
    console.log(`checked = ${e.target.checked}`);	
}

class SubmitReviewForm extends React.Component {
    state={
        asin: '',
        helpful: '',
        overall: '',
        reviewText: '',
        reviewTime: '',
        reviewerID: '',
        reviewerName: '',
        summary: '',
        unixReviewTime: '',
    }
    handleChange = event => {
        this.setState({
            asin: event.target.value,
            helpful: event.target.value,
            overall: event.target.value,
            reviewText: event.target.value,
            reviewTime: event.target.value,
            reviewerID: event.target.value,
            reviewerName: event.target.value,
            summary: event.target.value,
            unixReviewTime: event.target.value,
        })
    }
    handleSubmit = event => {
        event.preventDefault();
        const review ={
            asin: this.state.asin,
            helpful: this.state.helpful,
            overall: this.state.overall,
            reviewText: this.state.reviewText,
            reviewTime: this.state.reviewTime,
            reviewerID: this.state.reviewerID,
            reviewerName: this.state.reviewerName,
            summary: this.state.summary,
            unixReviewTime: this.state.unixReviewTime,
        };
        axios.post('http://localhost:5000/review', {review})
        .then(res => {
            console.log(res);
            console.log(res.data);
            })

        //this.props.form.validateFields((err, values) => {
          //  if (!err) {
            //    console.log('Received values of form: ', values);
            //}
        }
        //);
    //};
    
    //submitReview() {}
     
    

    render(){

        // const { getFieldDecorator } = this.props.form;
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
          
        //   const prefixSelector = getFieldDecorator('prefix', {
        //     //initialValue: '86',
        //   })(
        //     <Select style={{ width: 70 }}>
        //       <Option value="86">+86</Option>
        //       <Option value="87">+87</Option>
        //     </Select>,
        //   );
// Name of book, username, rating, summary, review
        return(
            
            <Form labelCol={{ span: 5}} wrapperCol ={{ span: 12}} onSubmit={this.handleSubmit}>
                <div>
                    <NavBar />
                    <h1 align="center"> 
                        Submit Book Review
                    </h1>
                </div>
                <div>
                    <Form.Item label="Book ID">
                        {/* {getFieldDecorator('asin', {
                            rules: [{ required: true, message: 'Please input the id of the book!' }],
                        })()} */}
                        <Input name="asin"/>
                    </Form.Item>
                    <Form.Item label="Helpful">
                        {/* {getFieldDecorator('helpful', {
                            rules: [{ required: true, message: 'Please input helpfulness level' }],
                        })()} */}
                        <Input name="helpful"/>
                    </Form.Item>
                    <Form.Item label="Rating">
                        {/* {getFieldDecorator('overall', {
                            rules: [{ required: true, message: 'Please input overall rating' }],
                        })()} */}
                        <Input name="overall"/>
                    </Form.Item>
                    <Form.Item label="Review">
                        {/* {getFieldDecorator('reviewText', {
                            rules: [{ required: true, message: 'Please input your review' }],
                        })(<Input name="reviewText" />)} */}
                        <Input name="reviewText" />
                    </Form.Item>
                    <Form.Item label="Review Time">
                        {/* {getFieldDecorator('reviewTime', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input your review time' }],
                        })()} */}
                        <Input name="reviewTime" />
                    </Form.Item>
                    <Form.Item label="Reviewer ID">
                        {/* {getFieldDecorator('reviewerID', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input your reviewer ID' }],
                        })(<Input name="reviewerID" />)} */}
                        <Input name="reviewerID" />
                    </Form.Item>
                    <Form.Item label="Reviewer Name">
                        {/* {getFieldDecorator('reviewerName', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input your name' }],
                        })()} */}
                        <Input name="reviewerName" />
                    </Form.Item>
                    <Form.Item label="Summary">
                        {/* {getFieldDecorator('summary', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input your summary' }],
                        })(<Input name="summary" />)} */}
                        <Input name="summary" />
                    </Form.Item>
                    <Form.Item label="Unix Review Time">
                        {/* {getFieldDecorator('unixReviewTime', {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input the unix review time' }],
                        })()} */}
                        <Input name="unixReviewTime" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="submit" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
                
            </Form>
                
        );
    };
};
SubmitReviewForm = Form.create({name: "submitReviewForm"})(SubmitReviewForm)
export default SubmitReviewForm;