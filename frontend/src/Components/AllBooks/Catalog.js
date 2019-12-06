import React, { Component } from 'react'
import { List, Card, Input, Row, Col, Menu, Icon, Select } from "antd";
import axios from "axios";
import { Button } from "antd";
import _ from "lodash";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom";
import Carousel from "./Carousel";
import Slider from "react-slick";
import {BASE_API} from "../../App";

export default class Catalog extends Component {

    state = {
        books: [],
        redirectBookInfo: false,
        selectedBookID: "",
        redirectSearchPage: false
      };
    
      // getData = () => {
      //   axios.get(`${BASE_API}/book`).then(res => {
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
        axios.get(`${BASE_API}/book`)
        .then((res => {
            this.setState({
                books: res.data['books'],
            })
            return axios.get(`${BASE_API}/newbooks`)
            .then((res => {
                this.setState({
                    books: this.state.books.concat(res.data['books'])
                })
            }))
        }))

        // axios.get(`${BASE_API}/newbooks`)
        // .then((res =>{
        //     this.setState({
        //         books: this.state.books.concat(res.data['books']),
        //     })
        // }), ()=> console.log(this.state.books))

     
        const category = {
          category: ["Science Fiction"]
        }
    
        // axios({
        //   method: "get",
        //   url: "${BASE_API}/bookcategory",
        //   body: {
        //     category: ["Science Fiction"],
        //   }
        // })
        // .then((res => {
        //   console.log('please work: ' + res.data)
        // }))
        
        // axios.get(`${BASE_API}/bookcategory`, {category})
        // .then(res => {
        //   console.log('help: ' + res.data)
        // })

        axios.get(`${BASE_API}/bookcategory`, {
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

      handleCategoryChange = (e) => {
          axios.get(`${BASE_API}/bookcategory`, {
              params: {
                  category: e
              }
          })
          .then((res => {
              this.setState({
                  books: res.data['books']
              })
          }))
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
                <p className="floatleft">Filters</p>
                <Select
                style={{ width: '30%', clear: 'both' }}
                onChange={this.handleCategoryChange}
                placeholder="Choose a category"
                className="floatleft">
                    <Select.Option value="Science Fiction">
                        Science Fiction
                    </Select.Option>
                    <Select.Option value="Fantasy">
                        Fantasy
                    </Select.Option>
                    <Select.Option value="Humor">
                        Humor
                    </Select.Option>
                    <Select.Option value="Humor">
                        Humor
                    </Select.Option>
                    <Select.Option value="Children">
                        Children
                    </Select.Option>

                </Select>
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
                      <img
                        src={item.imUrl}
                        width="130"
                        className="individualBook"
                        onClick={() => this.OpenBookInfo(item.asin)}
                      />
                     <a onClick={() => this.OpenBookInfo(item.asin)} className="list_anchor">{item.asin}</a>
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
