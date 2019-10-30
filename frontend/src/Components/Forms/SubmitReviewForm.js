import { Form, Input, Button, Radio, Row, Col, Rate } from 'antd';
import React from 'react';
import axios from 'axios';
import NavBar from '../NavBar';


const { TextArea } = Input;


class SubmitReviewForm extends React.Component {
    state={
        asin: '',
        helpful: '',
        overall: '',
        reviewText: '',
        reviewTime: '',
        reviewerID: '',
        reviewerName: '',
        summary: '',
        unixReviewTime: '',
    }

    componentDidMount(){
      window.scrollTo(0, 0)
    }
    
    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value,
        })
    }

    handleRateChange = (e) => {
        var stars = e.toString()
        this.setState({
            overall: stars,
        }, () => console.log(this.state.overall))
     }


 handleSubmit = event => {
    console.log('weeee')
    event.preventDefault();
    var submitDate = new Date();
    var dd = String(submitDate.getDate()).padStart(2, '0');
    var mm = String(submitDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = submitDate.getFullYear();
    submitDate = mm + ' ' + dd + ', ' + yyyy; 
    var unixTime = require('unix-time');
    var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    var token = randomToken(13);
    token = 'C' + token
    console.log(token);
    const review = {
        asin: this.props.location.state.selectedBookID,
        helpful: '[0, 0]',
        overall: this.state.overall,
        reviewText: this.state.reviewText,
        reviewTime: submitDate,
        reviewerID: token,
        reviewerName: this.state.reviewerName,
        summary: this.state.summary,
        unixReviewTime: unixTime(new Date()).toString(),
    };

    console.log(review)
    axios.post('http://project-env.qfbxqtda8h.ap-southeast-1.elasticbeanstalk.com/review', {review})
    .then((res => {
        console.log(res)
    }))
    .catch(error => {
        console.log(error)
    })

        // this.props.form.validateFields((err, values) => {
        //    if (!err) {
        //        console.log('Received values of form: ', values);
        //     }
        }


  render() {
  
    return (
      <div>
        <NavBar/>
        <Form onSubmit={this.handleSubmit}>
            <div className="reviewFormContainer">
            <h1>Submit a book review</h1>
            <Row>
                <Col span={12}>
                <Form.Item label="Reviewer Name">
                <Input name="reviewerName" className="reviewFormInput" placeholder="Enter your name" onChange={this.handleChange}/>
                </Form.Item>
                </Col>
            </Row>
                <img
                src={`http://images.amazon.com/images/P/${this.props.location.state.selectedBookID}.jpg`}
                width="150"
                className="submitReviewImg"
              ></img>
            <Row>
                <Col span={12}>
                <Form.Item label="Rate the Book">
                <Rate className="reviewFormInput" onChange={this.handleRateChange}/>
                </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                <Form.Item label="Review Title">
                <Input name="summary" className="reviewFormInput" placeholder="Summarise your review in a one-liner" onChange={this.handleChange}/>
                </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                <Form.Item label="Your Review">
                <TextArea rows={5} name="reviewText" placeholder="Write your review" className="submitReviewTA" onChange={this.handleChange}/>
                </Form.Item>
                </Col>
            </Row>
          <Form.Item >
            <Button type="submit" htmlType="submit">Submit</Button>
          </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default SubmitReviewForm;