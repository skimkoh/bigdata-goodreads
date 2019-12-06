import React from "react";
import { Table, Button, Carousel, Row, Col, Rate } from "antd";
import NavBar from "../NavBar";
import axios from "axios";
import {BASE_API} from "../../App";
const data = [
  {
    key: "1",
    title: "Adventures of a Lifetime",
    price: 22,
    genre: "Science Fiction",
    synopsis: "adventures of a little cat flying"
  },
  {
    key: "2",
    title: "Mystery Day",
    price: 29,
    genre: "Mystery",
    synopsis: "a mystery man dressed in black"
  },
  {
    key: "3",
    title: "White Sky",
    price: 12,
    genre: "Children",
    synopsis: "what a beautiful day today"
  }
];

class LandingTrial extends React.Component {
  state = {
    redirectBookInfo: false,
    redirectCreateBook: false,
    allBooks: [],
    currentBookID: ""
  };

  componentDidMount() {
    // var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    // var token = randomToken(13);
    // token = 'C' + token
    // console.log(token)
    axios.get(`http://localhost:5000/book`).then(res => {
      // console.log(res.data['books'])
      this.setState({
        allBooks: res.data["books"]
      });
      console.log(this.state.allBooks);
    });
  }

  OpenBookInfo = () => {
    this.setState({
      // redirectBookInfo: true,
    });
  };

  createBook = () => {
    this.setState({
      redirectCreateBook: true
    });
  };

  render() {
    const columns = [
      {
        title: "Picture",
        dataIndex: "imUrl",
        key: "imUrl",
        render: text => <img src={text} width="100" />
      },
      {
        title: "Price ($)",
        dataIndex: "price",
        key: "price"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "BookID",
        dataIndex: "asin",
        key: "asin"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a onClick={this.OpenBookInfo}>Open Book Info</a>
          </span>
        )
      }
    ];
    if (this.state.redirectBookInfo) {
      this.props.history.push("/info");
    }

    if (this.state.redirectCreateBook) {
      this.props.history.push("/createbook");
    }

    return (
      <div>
        <NavBar />
        <ul class="list-inline">
          <li class="book">
            <img src="http://37signals.com/images/remote/remote_front.png" />
          </li>

          <li class="book">
            <img src="http://www.blanq.org/text/moleskine_iphone_wallpaper.jpg" />
          </li>

          <li class="book">
            <img src="https://d.gr-assets.com/books/1348927776l/8032112.jpg" />
          </li>

          <li class="book">
            <img src="http://ecx.images-amazon.com/images/I/51oXKWrcYYL.jpg" />
          </li>
        </ul>
        {/*  <h1 style={{marginTop: 20}}>Books</h1>
            <Button type="primary" className="createBookbtn" onClick={this.createBook}> Create New Book </Button>
            <Table columns={columns} dataSource={this.state.allBooks} style={{padding: 30}}/>
            <h1> Recently Reviewed Books </h1>
            {/* <Carousel dotPosition={"bottom"} draggable={true}>
              <div>
                <Row>
                  <Col span={6} className="landingBooks">
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                    <div className="landingBookInfo">
                     <p>Test Drive</p>
                     <Rate disabled defaultValue={3} className="rate"></Rate>
                    </div>
                  </Col>
                  <Col span={6} className="landingBooks">
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                    <div className="landingBookInfo">
                     <p>Adventures of a Lifetime</p>
                     <Rate disabled defaultValue={4} className="rate"></Rate>
                    </div>
                  </Col>
                  <Col span={6} className="landingBooks">
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                    <div className="landingBookInfo">
                     <p>Animal Farm</p>
                     <Rate disabled defaultValue={5} className="rate"></Rate>
                    </div>
                  </Col>
                  <Col span={6} className="landingBooks">
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                    <div className="landingBookInfo">
                     <p>Harry Potter and The Scar</p>
                     <Rate disabled defaultValue={1} className="rate"></Rate>
                    </div>
                  </Col>
                </Row>
              </div>
          <div>
          <Row>
                  <Col span={6} >
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                  </Col>
                  <Col span={6}>
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                  </Col>
                  <Col span={6}>
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                  </Col>
                  <Col span={6}>
                    <img src="https://images-na.ssl-images-amazon.com/images/I/51rs%2Br6OwwL._SX258_BO1,204,203,200_.jpg" style={{width: 100}}/>
                  </Col>
                </Row>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div></Carousel> */}
        */}
      </div>
    );
  }
}

export default LandingTrial;
