import React from "react";
import { Table, Divider, Tag, Layout, Row, Col, Modal, Checkbox } from "antd";
//import NavBar from "../NavBar";
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
const { Header, Footer, Sider, Content } = Layout;

const reviewdata = [
  {
    key: "1",
    reviewername: "Peppa Pig",
    overall: 5,
    summary: "gr8 book",
    reviewText: "i love this",
    reviewTime: "01/01/18 00:00:00"
  },
  {
    key: "2",
    reviewername: "Postman Pat",
    overall: 8,
    summary: "amazing book",
    reviewText: "it changed my life",
    reviewTime: "01/02/18 10:10:00"
  },
  {
    key: "3",
    reviewername: "Tom Jerry",
    overall: 2,
    summary: "shitty book",
    reviewText: "was disappointed, no pictures",
    reviewTime: "21/04/18 18:00:00"
  }
];

class BookInfo extends React.Component {
  state = {
    redirectreviewedit: false,
    visible: false
  };

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
  render() {
    const reviewcolumns = [
      {
        title: "Reviewer Name",
        dataIndex: "reviewername",
        key: "reviewername",
        render: text => <a>{text}</a>
      },
      {
        title: "Rating",
        dataIndex: "overall",
        key: "overall"
      },
      {
        title: "Summary",
        dataIndex: "summary",
        key: "summary"
      },
      {
        title: "Reviewer Text",
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
    return (
      <div>
          <Row>
            <Col span={8}>
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/81NVgyaD2xL.jpg"
                width="150"
                float="right"
              ></img>
            </Col>
            <Col span={16}>
              <div>
                <h1 style={{ marginTop: 20 }}>Adventures of a Lifetime</h1>
                <h3>Price of book: $22</h3>
                <h3>Genre: Science Fiction</h3>
                <h3>Synopsis: adventures of a little cat flying</h3>
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

          <Table
            columns={reviewcolumns}
            dataSource={reviewdata}
            style={{ margin: 30 }}
          />
      </div>
    );
  }
}

export default BookInfo;
