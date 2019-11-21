import React from "react";
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
  notification
} from "antd";
import NavBar from "../NavBar";
import axios from "axios";
import _ from "lodash";
import LoadingComponent from "../../LoadingComponent";

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
  };

  componentDidMount() {
    console.log(
      "this book has this id " + this.props.location.state.currentBookID
    );
    axios.get(`http://54.255.189.94/book/${this.props.location.state.currentBookID}`)
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
            `http://54.255.189.94/reviews/${this.props.location.state.currentBookID}`
          )
          .then(res => {
            this.setState({
              allReviews: _.sortBy(res.data["reviews"], "overall").reverse(),
              totalStars:
                Math.round(
                  (_.sumBy(res.data["reviews"], "overall") /
                    res.data["reviews"].length) * 10) / 10,
              loading: false
            });
          })
          .catch((er => {
            this.setState({
              loading: false,
            })
          }));
      });
  }

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
        axios.delete(`http://54.255.189.94/review/${e}`).then(res => {
          console.log(res);
          notification["success"]({
            message: "Success!",
            description:
              "Review has been deleted. Updating reviews and rating..."
          });
          axios
            .get(`http://54.255.189.94/reviews/${this.state.selectedBookID}`)
            .then(res => {
              this.setState({
                allReviews: _.sortBy(res.data["reviews"], "overall").reverse(),
                totalStars:
                  Math.round(
                    (_.sumBy(res.data["reviews"], "overall") /
                      res.data["reviews"].length) *
                      10
                  ) / 10
              });
            });
        });
      },
      onCancel: () => {}
    });
  };

  render() {
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
          <h4 style={{ display: "inline" }}> Rating: </h4>
          <h1 style={{ display: "inline" }}>{this.state.totalStars}</h1>
          <h4 style={{ display: "inline" }}>/5 </h4>
        </div>
      );
    } else {
      starReviews = <h4> No ratings </h4>;
    }

  let bookPrice;
  if(this.state.price !== null || this.state.price !== undefined){
    bookPrice = <h4>Price of Book: ${this.state.price}</h4>
  }
  else {
    bookPrice = <h4>No Price</h4>
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
                    width="150"
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
            <Col span={4}></Col>
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
            <div className="reviewsSort"> Filters </div>
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

        <div className="bookReviews">
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
      </div>
    );
  }
}

export default BookInfo;
