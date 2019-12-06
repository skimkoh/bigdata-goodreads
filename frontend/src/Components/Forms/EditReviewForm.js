import { Form, Input, Button, Radio, Row, Col, Rate, message } from "antd";
import React from "react";
import axios from "axios";
import NavBar from "../NavBar";
import { withRouter } from 'react-router'
import Footer from "../Footer";
import {BASE_API} from "../../App";


const { TextArea } = Input;

// const success = () => {
//   message.success("This is a success message");
// };

class EditReviewForm extends React.Component {
  state = {
    asin: "",
    imUrl: "",
    helpful: "",
    overall: "",
    reviewText: "",
    reviewTime: "",
    reviewerID: "",
    reviewerName: "",
    summary: "",
    unixReviewTime: "",
    substate: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(`http://${BASE_API}/book/${this.props.location.state.selectedBookID}`)
    .then((res => {
        this.setState({
            imUrl: res.data['imUrl'],
        })
    }))

    axios.get(`http://${BASE_API}/review/${this.props.location.state.reviewID}`)
    .then((res => {
        this.setState({
            reviewerName: res.data['reviewerName'],
            summary: res.data['summary'],
            reviewText: res.data['reviewText'],
            overall: res.data['overall'],
            reviewTime: res.data['reviewTime'],

        })
    }))

    console.log('this review ID is: ' + this.props.location.state.reviewID)
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleRateChange = e => {
    var stars = e.toString();
    this.setState(
      {
        overall: stars
      },
      () => console.log(this.state.overall)
    );
  };

  handleSubmit = event => {
    console.log("weeee");
    event.preventDefault();
    var submitDate = new Date();
    var dd = String(submitDate.getDate()).padStart(2, "0");
    var mm = String(submitDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = submitDate.getFullYear();
    submitDate = mm + " " + dd + ", " + yyyy;
    var unixTime = require("unix-time");
    const review = {
    //   asin: this.props.location.state.selectedBookID,
    //   helpful: "[0, 0]",
      overall: this.state.overall,
      reviewText: this.state.reviewText,
      reviewTime: submitDate,
    //   reviewerID: token,
      reviewerName: this.state.reviewerName,
      summary: this.state.summary,
      unixReviewTime: unixTime(new Date()).toString()
    };

    console.log(review);
    axios
      .put(
        (`http://${BASE_API}/review/${this.props.location.state.reviewID}`),
        {review})
      .then(res => {
        console.log(res);
        // this.setState({ substate: true });
        // console.log(res.data);
        // console.log("success");
        message.success("Review edited. Redirecting back to book details.")
        this.props.history.go(-1);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    // if (this.state.substate) {
    //   this.props.history.push({
    //     pathname: "/info",
    //     state: {
    //       currentBookID: this.props.location.state.selectedBookID
    //     }
    //   });
    // }
    return (
      <div className="blue-bg">
        <NavBar />
        <Form onSubmit={this.handleSubmit}>
          <div className="reviewFormContainer">
            <h1>Edit a Book Review</h1>
            <Row>
              <Col span={12}>
                <Form.Item label="Reviewer Name">
                  <Input
                    name="reviewerName"
                    className="reviewFormInput"
                    placeholder="Enter your name"
                    onChange={this.handleChange}
                    value={this.state.reviewerName}
                  />
                </Form.Item>
              </Col>
            </Row>
            <img
            //   src={`http://images.amazon.com/images/P/${this.props.location.state.selectedBookID}.jpg`}
              src={this.state.imUrl}
              width="200"
              className="submitReviewImg"
            ></img>
            <Row>
              <Col span={12}>
                <Form.Item label="Rate the Book">
                  <Rate
                    className="reviewFormInput"
                    onChange={this.handleRateChange}
                    value={this.state.overall}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Review Title">
                  <Input
                    name="summary"
                    className="reviewFormInput"
                    placeholder="Summarise your review in a one-liner"
                    onChange={this.handleChange}
                    value={this.state.summary}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Your Review">
                  <TextArea
                    rows={5}
                    name="reviewText"
                    placeholder="Write your review"
                    className="submitReviewTA"
                    onChange={this.handleChange}
                    value={this.state.reviewText}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="submit" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(EditReviewForm);
