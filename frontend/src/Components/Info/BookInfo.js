import React from "react";
import { Table, Divider, Tag } from "antd";

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
  }
];

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
  render() {
    return (
      <div>
        <h1 style={{ marginTop: 20 }}>Adventures of a Lifetime</h1>
        <h3>Price of book: $22</h3>
        <h3>Genre: Science Fiction</h3>
        <h3>Synopsis: adventures of a little cat flying</h3>
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
