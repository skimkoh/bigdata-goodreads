import React, { Component } from 'react'
import { List, Card, Input, Row, Col, Menu, Icon } from "antd";
import axios from "axios";
import { Button } from "antd";
import _ from "lodash";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import Carousel from "./Carousel";
import Slider from "react-slick";

export default class Catalog extends Component {

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
        axios.get(`http://54.255.189.94/book`)
        .then((res => {
            this.setState({
                books: res.data['books'],
            })
        }))

        axios.get(`http://54.255.189.94/newbooks`)
        .then((res =>{
            this.setState({
                books: this.state.books.concat(res.data['books']),
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
        
        // axios.get(`http://54.255.189.94/bookcategory`, {category})
        // .then(res => {
        //   console.log('help: ' + res.data)
        // })

        axios.get(`http://54.255.189.94/bookcategory`, {
            category: ["LGBT"],
        })
        .then((res => {
            console.log('works')
        }))
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
    
      OpenBookInfo = e => {
        this.props.history.push({
            pathname: "/info",
            state: {
                currentBookID: e,
            }
        })
      };
    
      redirectSearchPage = () => {
        this.props.history.push('/search')
      };

      redirectHome = () => {
          this.props.history.push('/')
      }
    
      handleRedirectInfo = (e) => {
        this.setState({
          selectedBookID: e,
          redirectBookInfo: true,
        })
      } 

    render() {
        return (
            <div>
                 <NavBar />
        <div style={{ marginTop: 50, marginLeft: 50, marginRight: 50 }}>
          <Row>
            <Col span={6}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["k3"]}
                className="landingSideMenu"
              >
                <Menu.ItemGroup key="gp1" title="For You">
                  <Menu.Item key="d1" className="landingSideMenuItem" onClick={this.redirectHome}>
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
                  <Menu.Item key="k3" className="landingSideMenuItem">
                    <Icon type="book" />
                    Catalog
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu>
            </Col>

            <Col span={18}>
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
            </Col>
          </Row>
        </div>
            </div>
        )
    }
}
