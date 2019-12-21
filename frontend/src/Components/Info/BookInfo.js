import React from "react";
import {BASE_API} from "../../App";
import {
  Table,
  Layout,
  Row,
  Col,
  Modal,
  Checkbox,
  Button,
  List,
  Avatar,
  Icon,
  Rate,
  Divider,
  Tabs,
  Select,
  Dropdown,
  Menu,
  Empty,
  ConfigProvider,
  notification,
  message, Progress
} from "antd";
import NavBar from "../NavBar";
import axios from "axios";
import _ from "lodash";
import LoadingComponent from "../../LoadingComponent";
import Footer from "../Footer";
import Slider from "react-slick";
import { Line, Circle } from 'rc-progress';

class BookInfo extends React.Component {
  state = {
    selectedBookID: "",
    title: null,
    asin: null,
    description: null,
    price: null,
    allReviews: [],
    redirectCreateReview: false,
    totalStars: null,
    openNotify: false,
    loading: true,
    redirectEditReview: false,
    reviewID: null,
    imUrl: null,
    loadingDeleteBook: true,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0, 
    twoStars: 0,
    oneStar: 0,
    fiveNum: 0,
    fourNum: 0,
    threeNum: 0,
    twoNum:0,
    oneNum: 0,
    relatedBooks: null,
  };

  componentDidMount() {
    console.log(
      "this book has this id " + this.props.location.state.currentBookID
    );
    axios.get(`http://${BASE_API}/book/${this.props.location.state.currentBookID}`)
      .then(res => {
        this.setState({
          asin: res.data["asin"],
          title: res.data["title"],
          price: res.data["price"],
          description: res.data["description"],
          imUrl: res.data["imUrl"],
          selectedBookID: this.props.location.state.currentBookID,
        });
        return axios
          .get(
            `http://${BASE_API}/reviews/${this.props.location.state.currentBookID}`
          )
          .then(res => {
            if(res.status === 200){
              this.setState({
                allReviews: _.sortBy(res.data["reviews"], "overall").reverse(),
                totalStars:
                  Math.round(
                    (_.sumBy(res.data["reviews"], "overall") /
                      res.data["reviews"].length) * 10) / 10,
                loading: false,
                // fiveStars: (_.filter(res.data['reviews'], ["overall", 5]).length / res.data['reviews'].length) * 100,
                // fourStars: (_.filter(res.data['reviews'], ["overall", 4]).length / res.data['reviews'].length) * 100,
                // threeStars: (_.filter(res.data['reviews'], ["overall", 3]).length / res.data['reviews'].length) * 100,
                // twoStars: (_.filter(res.data['reviews'], ["overall", 2]).length / res.data['reviews'].length) * 100,
                // oneStar: (_.filter(res.data['reviews'], ["overall", 1]).length / res.data['reviews'].length) * 100,
                // fiveNum: _.filter(res.data['reviews'], ["overall", 5]).length,
                // fourNum: _.filter(res.data['reviews'], ["overall", 4]).length,
                // threeNum: _.filter(res.data['reviews'], ["overall", 3]).length,
                // twoNum: _.filter(res.data['reviews'], ["overall", 2]).length,
                // oneNum: _.filter(res.data['reviews'], ["overall", 1]).length,
              });
              if(res.data['reviews'].length > 0){
                this.setState({
                  fiveStars: Math.round((_.filter(res.data['reviews'], ["overall", 5]).length / res.data['reviews'].length) * 100),
                  fourStars: Math.round((_.filter(res.data['reviews'], ["overall", 4]).length / res.data['reviews'].length) * 100),
                  threeStars: Math.round((_.filter(res.data['reviews'], ["overall", 3]).length / res.data['reviews'].length) * 100),
                  twoStars: Math.round((_.filter(res.data['reviews'], ["overall", 2]).length / res.data['reviews'].length) * 100),
                  oneStar: Math.round((_.filter(res.data['reviews'], ["overall", 1]).length / res.data['reviews'].length) * 100),
                  fiveNum: _.filter(res.data['reviews'], ["overall", 5]).length,
                  fourNum: _.filter(res.data['reviews'], ["overall", 4]).length,
                  threeNum: _.filter(res.data['reviews'], ["overall", 3]).length,
                  twoNum: _.filter(res.data['reviews'], ["overall", 2]).length,
                  oneNum: _.filter(res.data['reviews'], ["overall", 1]).length,
                }, () => console.log('onestar: ' + this.state.oneStar))
              }
            }
          })
          .catch((er => {
            this.setState({
              loading: false,
            })
          }));

      });
  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.location !== this.props.location){
  //     window.location.reload()
  //   }
  // }

  sortbyTime = () => {
    this.setState({
      allReviews: _.sortBy(this.state.allReviews, "unixReviewTime").reverse()
    });
    console.log(this.state.allReviews);
  };

  sortbyStars = () => {
    this.setState({
      allReviews: _.sortBy(this.state.allReviews, "overall")
    });
    console.log("SORTED BY STARS: " + JSON.stringify(this.state.allReviews));
  };

  sortByHelpful = () => {
    var helpfulLst = this.state.allReviews;
    helpfulLst.sort(function(a, b) {
      return isNaN(a.helpful[1]) === isNaN(b.helpful[1])
        ? a.helpful[1].localeCompare(b.helpful[1])
        : isNaN(a.helpful[1] ? -1 : 1);
    });
    this.setState({
      allReviews: helpfulLst.reverse()
    });
  };

  createReview = () => {
    this.setState({
      redirectCreateReview: true
    });
  };

  customizeRenderEmpty = () => (
    <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
      <Icon type="read" style={{ fontSize: 40, paddingBottom: 10 }} />
      <p>No reviews available. Add one!</p>
    </div>
  );

  redirectEdit = e => {
    this.setState({
      reviewID: e,
      redirectEditReview: true
    });
  };

  showDeleteConfirm = e => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to proceed? This process cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        console.log(e);
        axios.delete(`http://${BASE_API}/review/${e}`).then(res => {
          console.log(res);
          message.success("Review deleted. Updating ratings and reviews...")
          axios
            .get(`http://${BASE_API}/reviews/${this.state.selectedBookID}`)
            .then(res => {
              this.setState({
                allReviews: _.sortBy(res.data["reviews"], "overall").reverse(),
                totalStars:
                  Math.round(
                    (_.sumBy(res.data["reviews"], "overall") /
                      res.data["reviews"].length) *
                      10
                  ) / 10,
                  fiveStars: Math.round((_.filter(res.data['reviews'], ["overall", 5]).length / res.data['reviews'].length) * 100),
                  fourStars: Math.round((_.filter(res.data['reviews'], ["overall", 4]).length / res.data['reviews'].length) * 100),
                  threeStars: Math.round((_.filter(res.data['reviews'], ["overall", 3]).length / res.data['reviews'].length) * 100),
                  twoStars: Math.round((_.filter(res.data['reviews'], ["overall", 2]).length / res.data['reviews'].length) * 100),
                  oneStar: Math.round((_.filter(res.data['reviews'], ["overall", 1]).length / res.data['reviews'].length) * 100),
                  fiveNum: _.filter(res.data['reviews'], ["overall", 5]).length,
                  fourNum: _.filter(res.data['reviews'], ["overall", 4]).length,
                  threeNum: _.filter(res.data['reviews'], ["overall", 3]).length,
                  twoNum: _.filter(res.data['reviews'], ["overall", 2]).length,
                  oneNum: _.filter(res.data['reviews'], ["overall", 1]).length,

              });
            });
        });
      },
      onCancel: () => {}
    });
  };

  showDeleteBookConfirm = e => {
    Modal.confirm({
      title: "Are you sure you want to delete this book?",
      content: "All reviews for this book will also be deleted. This process cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        console.log(e);
        axios.delete(`http://${BASE_API}/book/${e}`)
        .then((res => { 
         message.success("Book has been deleted. Returning you to homepage.")
         this.props.history.push('/')
        }))
      },
      onCancel: () => {}
    });
  };

  render() {

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
    };

    if (this.state.redirectEditReview) {
      this.props.history.push({
        pathname: "/edit",
        state: {
          selectedBookID: this.state.selectedBookID,
          reviewID: this.state.reviewID
        }
      });
    }

    if (this.state.redirectCreateReview) {
      this.props.history.push({
        pathname: "/submit",
        state: {
          selectedBookID: this.state.selectedBookID
        }
      });
    }
    let totalReviewsNum;
    if (this.state.totalStars !== null) {
      totalReviewsNum = <div>{this.state.allReviews.length} reviews</div>;
    } else {
      totalReviewsNum = (
        <p style={{ color: "#5FB2FF" }}> No reviews available </p>
      );
    }

    let starReviews;

    if (this.state.totalStars !== null) {
      starReviews = (
        <div>
          {/* <h4 style={{ display: "inline" }}> Rating: </h4> */}
          <h1 style={{display: "inline", lineHeight: 0}}><Rate disabled value={this.state.totalStars}/></h1>
          <h4 style={{ display: "inline", paddingLeft: 20}}>{this.state.totalStars}</h4>
          <h4 style={{ display: "inline" }}>/5</h4>
          <p  style={{ display: "inline", paddingLeft: 10 }}>({this.state.allReviews.length} reviews)</p>
        </div>
      );
    } else {
      starReviews = <h4> No ratings </h4>;
    }

  let bookPrice;
  if(this.state.price != null || this.state.price !== undefined){
    console.log('this is the current price: ' + this.state.price)
    bookPrice = <h4>Price of Book: ${this.state.price}</h4>
  }
  else {
    console.log('this is the current price: ' + this.state.price)
    bookPrice = <h4>No Price Given</h4>
  }

    return this.state.loading ? (
      <div>
        <NavBar />
        <LoadingComponent loading={this.state.loading} />{" "}
      </div>
    ) : (
      <div>
        <NavBar />
        <div className="margintop20">
          <Row>
            <Col span={4}></Col>
            <Col span={4}>
              <div className="">
                <div className="bookImgContainer">
                  <img
                    // src={`http://images.amazon.com/images/P/${this.props.location.state.currentBookID}.jpg`}
                    src={this.state.imUrl}
                    width="250"
                    className="bookInfoPic"
                  ></img>
                </div>
              </div>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              <div className="floatleft marginleft20 bookInfoText">
                <div>
                  <h1 style={{ display: "inline" }}>{this.state.asin}</h1>
                  {starReviews}
                </div>
                {bookPrice}
                {/* <h3>Genre: Science Fiction</h3> */}
                <p>{this.state.description}</p>
              </div>
            </Col>
            {/* <Col span={6}>
              <div className="">
              {starReview}
              </div>
            </Col> */}
            <Col span={4}>
            <button className="deleteBookbtn" onClick={() => this.showDeleteBookConfirm(this.state.asin)}>
              <Icon type="book"/>&nbsp; Delete Book
            </button>
            </Col>
          </Row>
        </div>
        <div className="reviewsHeader">
          <h1 className="reviewTitle">Reviews </h1>
          <div className="reviewSub">{totalReviewsNum}</div>
          <Button
            type="primary"
            className="createReviewbtn"
            onClick={this.createReview}
            icon="plus"
          >
            {" "}
            Create New Review{" "}
          </Button>
          {/* <Button onClick={this.sortByHelpful}>
            sort
          </Button> */}
          <div style={{ marginTop: 10 }}>
            <div className="reviewsSort"> Sort By </div>
            <Select
              defaultValue="stars"
              style={{ width: 120 }}
              className="floatleft reviewsSortSelect"
            >
              <Select.Option value="latestReview" onClick={this.sortbyTime}>
                Latest
              </Select.Option>
              <Select.Option value="stars" onClick={this.sortbyStars}>
                Most Stars
              </Select.Option>
              <Select.Option value="helpful" onClick={this.sortByHelpful}>
                Helpful
              </Select.Option>
            </Select>
          </div>
        </div>
        <div style={{backgroundColor: '#edf1f7'}}>
          <div className="reviewDetails">
            <Row>
            <Col span={8}>
            <div style={{paddingTop: 20}}>
              <h3 className="floatleft">Rating Details</h3>
              <p style={{clear: 'both'}} className="floatleft DetailStars">5 stars - {this.state.fiveStars}% ({this.state.fiveNum})</p>
              <Line percent={this.state.fiveStars} strokeColor="#fadb14" trailColor="#fff" />
              <p style={{clear: 'both'}} className="floatleft DetailStars">4 stars - {this.state.fourStars}% ({this.state.fourNum})</p>
              <Line percent={this.state.fourStars} strokeColor="#fadb14" trailColor="#fff" />
              <p style={{clear: 'both'}} className="floatleft DetailStars">3 stars - {this.state.threeStars}% ({this.state.threeNum})</p>
              <Line percent={this.state.threeStars} strokeColor="#fadb14" trailColor="#fff" />
              <p style={{clear: 'both'}} className="floatleft DetailStars">2 stars - {this.state.twoStars}% ({this.state.twoNum})</p>
              <Line percent={this.state.twoStars} strokeColor="#fadb14" trailColor="#fff" />
              <p style={{clear: 'both'}} className="floatleft DetailStars">1 stars - {this.state.oneStar}% ({this.state.oneNum})</p>
              <Line percent={this.state.oneStar} strokeColor="#fadb14" trailColor="#fff" />
            </div>
          </Col>
          </Row>
         
          </div>
        <div className="bookReviews">
          <Row>
            <div className="bookReviewsText"> 
            <ConfigProvider renderEmpty={this.customizeRenderEmpty}>
            <List
              itemLayout="vertical"
              size="large"
              // pagination={{
              //   onChange: page => {
              //     console.log(page);
              //   },
              //   pageSize: 10,
              // }}
              dataSource={this.state.allReviews}
              renderItem={item => (
                <List.Item
                  key={item.reviewerID}
                  className="reviewsTable"
                  actions={
                    [
                      // <Button onClick={this.deleteReview}><Icon type="delete"></Icon>Delete</Button>
                      // <IconText type="delete" text="Delete" key="delete" onClick={this.deleteReview}/>,
                      // <IconText type="like-o" text={item.overall} key="list-vertical-like-o" />,
                      // <IconText type="message" text="2" key="list-vertical-message" />,
                    ]
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar size="large" icon="user" />}
                    title={
                      <div>
                        <div className="reviewSummary floatleft">
                          {item.summary}
                        </div>
                        <div className="reviewStar">
                          <Rate disabled value={item.overall} />
                        </div>
                        <button
                          className="reviewsDeleteBtn"
                          onClick={() => this.showDeleteConfirm(item.id)}
                        >
                          <Icon type="delete"></Icon>&nbsp; Delete
                        </button>

                        <button
                          className="reviewsDeleteBtn"
                          onClick={() => this.redirectEdit(item.id)}
                        >
                          <Icon type="edit"></Icon>&nbsp; Edit &nbsp;
                        </button>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 25 }}>
                        <div className="floatleft">{item.reviewerName}</div>
                        <div className="reviewDate">{item.reviewTime}</div>
                      </div>
                    }
                  />
                  <div className="reviewText">{item.reviewText}</div>
                  <div className="reviewHelpful">
                    {item.helpful[1]} out of {item.helpful[4]} people found this
                    review helpful.
                  </div>
                </List.Item>
              )}
            />
          </ConfigProvider>
          </div>
          </Row>
        </div>
        </div>
       
        {/* <Footer/> */}
      </div>
    );
  }
}

export default BookInfo;
