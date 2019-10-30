import React from "react";
import {
  Table, Layout, Row, Col, Modal, Checkbox, Button, List, Avatar, Icon, Rate, Divider, Tabs, Select
} from "antd";
import NavBar from "../NavBar";
import axios from 'axios';
import _ from 'lodash';

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}


const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);


class BookInfo extends React.Component {
  state = {
    redirectreviewedit: false,
    visible: false,
    selectedBookID: '',
    title: null,
    description: null,
    price: null,
    allReviews: [],
    redirectCreateReview: false,
    totalStars: null,
  };

  componentDidMount() {
    console.log('this book has this id ' + this.props.location.state.currentBookID);
    axios.get(`http://project-env.qfbxqtda8h.ap-southeast-1.elasticbeanstalk.com/book/${this.props.location.state.currentBookID}`)
    .then((res => {
      // console.log(res.data)
      this.setState({
        title: res.data['title'],
        price: res.data['price'],
        description: res.data['description'],
      })
    }))

    axios.get(`http://project-env.qfbxqtda8h.ap-southeast-1.elasticbeanstalk.com/reviews/${this.props.location.state.currentBookID}`)
    .then((res => {
      this.setState({
        allReviews: _.sortBy(res.data['reviews'], "overall").reverse(),
        totalStars: Math.round((_.sumBy(res.data['reviews'], "overall") / res.data['reviews'].length) * 10) / 10,
      })
    })
    )

    // for(const i = 0; i <= this.state.allReviews.length; i++){
    //   AvgStars += this.state.allReviews[i]['overall']
    // }

  }

  sortbyTime = () => {
    this.setState({
      allReviews: _.sortBy(this.state.allReviews, "unixReviewTime").reverse()
    })
    console.log(this.state.allReviews)
  }

  sortbyStars = () => {
    this.setState({
      allReviews: _.sortBy(this.state.allReviews, "overall")
    })
    console.log('SORTED BY STARS: ' + (JSON.stringify(this.state.allReviews)))
  }

  sortByHelpful = () => {
    var helpfulLst = this.state.allReviews;
    helpfulLst.sort(function(a, b) {
      return isNaN(a.helpful[1]) === isNaN(b.helpful[1]) ? a.helpful[1].localeCompare(b.helpful[1]) : (isNaN(a.helpful[1] ? -1 : 1));
    });
    this.setState({
      allReviews: helpfulLst.reverse()
    })
  }

  editRowInfo = () => {
    this.setState({
      redirectreviewedit: true
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  createReview = () => {
    this.setState({
      redirectCreateReview: true
    });
  };
  render() {
    const reviewcolumns = [
      {
        title: "Reviewer Name",
        dataIndex: "reviewerName",
        key: "reviewerName",
      },
      {
        title: "Rating",
        dataIndex: "overall",
        key: "overall"
      },
      {
        title: "Title",
        dataIndex: "summary",
        key: "summary"
      },
      {
        title: "Review",
        dataIndex: "reviewText",
        key: "reviewText"
      },
      {
        title: "Review Time",
        dataIndex: "reviewTime",
        key: "reviewTime"
      },
      {
        title: "Edit",
        key: "edit",
        render: (text, record) => (
          <span>
            <a onClick={this.editRowInfo}>Edit</a>
          </span>
        )
      },
      {
        title: "Delete",
        key: "delete",
        render: (text, record) => (
          <span>
            <a onClick={this.showModal}>Delete</a>
          </span>
        )
      }
    ];

    if (this.state.redirectreviewedit) {
      this.props.history.push("/edit");
    }

    if (this.state.redirectCreateReview) {
      this.props.history.push("/submit");
    }
    return (
      <div>
        <NavBar />
        <div className="margintop20">
          <Row>
            <Col span={8}>
              <img
                src={`http://images.amazon.com/images/P/${this.props.location.state.currentBookID}.jpg`}
                width="100"
                className="floatright"
              ></img>
            </Col>
            <Col span={8}>
              <div className="floatleft marginleft20">
                <h1 style={{ marginTop: 20 }}>{this.state.title}</h1>
                <h3>Price of Book: ${this.state.price}</h3>
                {/* <h3>Genre: Science Fiction</h3> */}
                <h3>{this.state.description}</h3>
              </div>
            </Col>
            <Col span={8}>
              <div>{this.state.totalStars} / 5 </div>
              <div>{this.state.allReviews.length} reviews</div>

            </Col>
          </Row>
          <Modal
            title="Are you sure you want to delete this row?"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Checkbox onChange={onChange}>Yes</Checkbox>
          </Modal>
          {/* <Table
            columns={reviewcolumns}
            dataSource={this.state.allReviews}
            style={{ margin: 30 }}
          /> */}
        </div>
        <div className="reviewsHeader">
          <h1 className="reviewTitle">Reviews</h1>
           <Button
            type="primary"
            className="createReviewbtn" 
            onClick={this.createReview}
          >
            {" "}
            Create New Review{" "}
          </Button>
          {/* <Button onClick={this.sortByHelpful}>
            sort
          </Button> */}
          <div style={{marginTop: 10}}>
          <div className="reviewsSort"> Filters </div>
          <Select defaultValue="stars" style={{ width: 120 }} className="floatleft reviewsSortSelect">
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
        actions={[
          // <IconText type="star-o" text={item.helpful} key="list-vertical-star-o" />,
          // <IconText type="like-o" text={item.overall} key="list-vertical-like-o" />,
          // <IconText type="message" text="2" key="list-vertical-message" />,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar size="large" icon="user" />}
          title={
          <div>
            <div className="reviewSummary floatleft">{item.summary}</div>
            <div class="reviewStar"><Rate disabled defaultValue={item.overall}/></div>
            </div>}
          description={
            <div>
          <div className="floatleft">{item.reviewerName}</div>
          <div className="reviewDate">{item.reviewTime}</div>
          </div>  
        }
        />
        <div className="reviewText">{item.reviewText}</div>
        <div className="reviewHelpful">{item.helpful[1]} out of {item.helpful[4]} people found this review helpful.</div>
      </List.Item>
    )}
  />
         
       
      </div>
      </div>
    );
  }
}

export default BookInfo;
