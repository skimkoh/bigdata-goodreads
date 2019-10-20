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


const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

console.log(listData)

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
    positiveReviews: [],
  };

  componentDidMount() {
    console.log('this book has this id ' + this.props.location.state.currentBookID);
    axios.get(`http://localhost:5000/book/${this.props.location.state.currentBookID}`)
    .then((res => {
      // console.log(res.data)
      this.setState({
        title: res.data['title'],
        price: res.data['price'],
        description: res.data['description'],
      })
    }))

    axios.get(`http://localhost:5000/reviews/${this.props.location.state.currentBookID}`)
    .then((res => {
      this.setState({
        allReviews: _.sortBy(res.data['reviews'], "overall").reverse(),
      }, () => console.log(this.state.allReviews))
    })
    )
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
    console.log('SORTED BY STARS: ' + this.state.allReviews)
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
  createBook = () => {
    this.setState({
      redirectCreateBook: true
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

    if (this.state.redirectCreateBook) {
      this.props.history.push("/createbook");
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
            <Col span={16}>
              <div className="floatleft marginleft20">
                <h1 style={{ marginTop: 20 }}>{this.state.title}</h1>
                <h3>Price of Book: ${this.state.price}</h3>
                {/* <h3>Genre: Science Fiction</h3> */}
                <h3>{this.state.description}</h3>
              </div>
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
            onClick={this.createBook}
          >
            {" "}
            Create New Review{" "}
          </Button>
          <Select defaultValue="stars" style={{ width: 120 }}>
            <Select.Option value="latestReview" onClick={this.sortbyTime}>
              Latest
            </Select.Option>
            <Select.Option value="stars" onClick={this.sortbyStars}>
              Most Stars
            </Select.Option>
          </Select>
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
      </List.Item>
    )}
  />
         
       
      </div>
      </div>
    );
  }
}

export default BookInfo;
