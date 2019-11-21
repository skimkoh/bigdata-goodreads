import React from "react";
import { List, Card, Input, Row, Col, Menu, Icon } from "antd";
import axios from "axios";
import { Button } from "antd";
import _ from "lodash";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import Catalog from "./Catalog";
import Carousel from "./Carousel";
import Slider from "react-slick";

class Test extends React.Component {
  state = {
    books: [],
    redirectBookInfo: false,
    selectedBookID: "",
    redirectSearchPage: false
  };

  // getData = () => {
  //   axios.get(`http://54.255.189.94/book`).then(res => {
  //     var data = res.data["books"].filter(function(el) {
  //       return el.asin != "B0002IQ15S" && el.sin != "B000F83STC";
  //     });
  //     this.setState({
  //       books: data
  //     });
  //   });
  // };

  filterByValue(array, string) {
    return array.filter(o =>
      Object.keys(o).some(k =>
        o[k]
          .toString()
          .toLowerCase()
          .includes(string.toLowerCase())
      )
    );
  }

  componentDidMount() {
    // this.getData();
    axios.get(`http://54.255.189.94/newbooks`)
    .then((res => {
      console.log(res.data['books'])
      this.setState({
        books: res.data['books'],
      })
    }))

    const category = {
      category: ["Science Fiction"]
    }

    // axios({
    //   method: "get",
    //   url: "http://54.255.189.94/bookcategory",
    //   body: {
    //     category: ["Science Fiction"],
    //   }
    // })
    // .then((res => {
    //   console.log('please work: ' + res.data)
    // }))
    
    axios.get(`http://54.255.189.94/bookcategory`, {category})
    .then(res => {
      console.log('help: ' + res.data)
    })
  }

  handleClick = () => {
    this.setState(
      {
        books: this.filterByValue(this.state.books, "7.6")
      },
      () => console.log(this.state.books)
    );
  };

  handleChange = e => {
    this.setState({
      books: this.filterByValue(this.state.books, e.target.value)
    });
  };

  // OpenBookInfo = e => {
  //   const currentBookID = e;
  //   this.setState({
  //     selectedBookID: currentBookID,
  //     redirectBookInfo: true
  //   });
  // };

  redirectSearchPage = () => {
    this.setState({
      redirectSearchPage: true
    });
  };

  handleRedirectInfo = (e) => {
    this.setState({
      selectedBookID: e,
      redirectBookInfo: true,
    })
  } 

  render() {
    if (this.state.redirectBookInfo) {
      this.props.history.push({
        pathname: "/info",
        state: {
          currentBookID: this.state.selectedBookID
        }
      });
    }

    if (this.state.redirectSearchPage) {
      this.props.history.push("/search");
    }

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
    };

    return (
      <div>
        <Router>
        <NavBar />
        <div style={{ marginTop: 50, marginLeft: 50, marginRight: 50 }}>
          <Row>
            <Col span={6}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["d1"]}
                className="landingSideMenu"
              >
                <Menu.ItemGroup key="gp1" title="For You">
                  <Menu.Item key="d1" className="landingSideMenuItem">
                    <Icon type="appstore" />
                    Home
                  </Menu.Item>
                  <Menu.Item
                    key="d2"
                    className="landingSideMenuItem"
                    onClick={this.redirectSearchPage}
                  >
                    <Icon type="search" />
                    Search
                  </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="gp2" title="Discover">
                  <Menu.Item key="k1" className="landingSideMenuItem">
                    <Icon type="star" />
                    Popular Books
                  </Menu.Item>
                  <Menu.Item key="k2" className="landingSideMenuItem">
                    <Icon type="rise" />
                    Recently Reviewed
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu>
            </Col>

            {/* <Col span={18}>
              <div className="landingBookContain">
                <List
                  grid={{ column: 3 }}
                  dataSource={this.state.books}
                  pagination={{
                    onChange: page => {
                      console.log(page);
                    },
                    pageSize: 18
                  }}
                  renderItem={item => (
                    <List.Item>
                      <p>{item.asin}</p>
                      <img
                        src={item.imUrl}
                        width="130"
                        className="individualBook"
                        onClick={() => this.OpenBookInfo(item.asin)}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Col> */}

            <Col span={18}>
              <h2>Recently Added Books</h2>
              <Slider {...settings}>
                 {this.state.books.map((item, index) =>(
                    <div key={item} className="carosuel">
                      <img src={item.imUrl} width="100" />
                      <p>{item.asin}</p>
                      <Button onClick={() => this.handleRedirectInfo(item.asin)}> See More</Button>
                    </div>
                 ))}
              </Slider>
            </Col>   
            <Col span={18}>
            <h2>Category: Science Fiction</h2>
              {/* <Slider {...settings}>
                 {this.state.books.map((item, index) =>(
                    <div key={item} className="carosuel">
                      <img src={item.imUrl} width="100" />
                      <p>{item.asin}</p>
                      <Button onClick={() => this.handleRedirectInfo(item.asin)}> See More</Button>
                    </div>
                 ))}
              </Slider> */}
              </Col>     
          </Row>
        </div>
        </Router>
      </div>
    );
  }
}

export default Test;
