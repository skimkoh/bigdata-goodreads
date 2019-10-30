import React from "react";
import ReactDOM from 'react-dom'
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
    message,
  } from 'antd';
import axios from 'axios';

  const {
      Option
  } = Select;

  const success = () => {
    message.success('This is a success message');
  };
function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}



class SubmitBookForm extends React.Component {
    componentDidMount() {
        console.log(process.env.REACT_APP_CLOUDINARY_CLOUDNAME)
    }

    state={
        asin: '',
        price: '',
        description: '',
        title: '',
        uploadedPhoto: '',
    }
    handleChange = event => {
        this.setState({
            asin: event.target.value,
            price: event.target.value,
            description: event.target.value,
            title: event.target.value,
        })
    }
    handleSubmit = event => {
        event.preventDefault();
        const book ={
            asin: this.state.asin,
            price: this.state.price,
            description: this.state.description,
            title: this.state.title,
        };
        axios.post('http://project-env.qfbxqtda8h.ap-southeast-1.elasticbeanstalk.com/book', {book})
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('success')
                if (res.status == 200){
                    this.props.history.push('/')
                    
                }
            })
        //this.props.form.validateFields((err, values) => {
          //  if (!err) {
            //    console.log('Received values of form: ', values);
            //}
        }
        //);
    
    //submitbook() {}

    showWidget = () => {
        window.cloudinary.openUploadWidget({
            cloudName: `${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}`,
            uploadPreset: `${process.env.REACT_APP_CLOUDINARY_PRESET}`,
        }, (error, result) => { 
            console.log(result)
            if(result['event'] === 'success'){
                this.setState({
                    uploadedPhoto: result['info']['secure_url'],
                })
            }
        })

    }

    checkUploadResult = (resultEvent) => {
        if(resultEvent.event === 'success'){
            console.log('success')
        }
    }
    render(){


        //const { getFieldDecorator } = this.props.form;
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
        //     initialValue: '86',
        //   })(
        //     <Select style={{ width: 70 }}>
        //       <Option value="86">+86</Option>
        //       <Option value="87">+87</Option>
        //     </Select>,
        //   );
        return(
            <div>
            <NavBar />
            <button onClick={this.showWidget}> upload photo</button>
             <h1 align="center"> 
                Submit Book Review
            </h1>
            <Form onSubmit={this.handleSubmit} style={{marginTop: 50, marginBottom: 50, marginLeft: 100, marginRight: 100}}>
            <Row>
                <Col span={12}>
                <div>
                    {/* <Form.Item label="asin"> */}
                        {/* {getFieldDecorator('asin', {
                            rules: [{ required: true, message: 'Please input the asin of the book!' }],
                        })()} */}
                        {/* <Input name="asin" className="reviewFormInput"/>
                    </Form.Item> */}
                    <Form.Item label="Name Of Book">
                        {/* {getFieldDecorator('bookName', {
                            rules: [{ required: true, message: 'Please input the name of the book!' }],
                        })()} */}
                        <Input name="title" className="reviewFormInput"/>
                    </Form.Item>
                    <Form.Item label="Price (in USD)">
                        {/* {getFieldDecorator('price', {
                            rules: [{ required: true, message: 'Please input the price of the book' }],
                        })()} */}
                        <Input name="price" className="reviewFormInput"/>
                    </Form.Item>
                    <Form.Item label="Synopsis">
                        {/* {getFieldDecorator('synopsis', {
                            rules: [{ required: true, message: 'Please input the synopsis of the book' }],
                        })()} */}
                        <Input name="description" className="reviewFormInput"/>
                    </Form.Item>
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
                    <Form.Item >
                        <Button type="submit" htmlType="submit" onClick={success} >
                            Submit
                        </Button>
                    </Form.Item>
                </div>
                

                
                </Col>
                <Col span={12}>
                </Col>
            </Row>
            </Form>
            </div>

           
        );
    };
};


SubmitBookForm = Form.create({name: "submitBookForm"})(SubmitBookForm)
export default SubmitBookForm;