import React from 'react';
import { List, Card, Input, Row, Col, Menu, Icon } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import _ from 'lodash';
import NavBar from '../NavBar';
import Footer from '../Footer';


class Test extends React.Component {
  state = {
    books: [],
    redirectBookInfo: false,
    selectedBookID: '',
  }

    getData = () => {
      axios.get(`http://dbproject-env.dpfzvxygsf.ap-southeast-1.elasticbeanstalk.com/book`)
      .then((res => {
        var data = res.data['books'].filter(function(el){
          return el.asin != "B0002IQ15S"
        })
        this.setState({
          books: data,
        })
      }))
    }

    filterByValue(array, string) {
      return array.filter(o =>
      Object.keys(o).some(k => o[k].toString().toLowerCase().includes(string.toLowerCase())));
    }

    componentDidMount(){
      this.getData()
    }

    handleClick = () => {
      this.setState({
        books: this.filterByValue(this.state.books, '7.6')
      }, () => console.log(this.state.books))
    }


    handleChange = (e) => {
      this.setState({
        books: this.filterByValue(this.state.books, e.target.value)
      })

    }

    OpenBookInfo = (e) => {
      const currentBookID = e
      this.setState({
        selectedBookID: currentBookID,
        redirectBookInfo: true,
      })
    }

    render(){
      if(this.state.redirectBookInfo){
        this.props.history.push({
          pathname: "/info",
          state: {
            currentBookID: this.state.selectedBookID,
          }
        })
      }
      
        return(
          <div>
            <NavBar/>
            <div style={{marginTop: 50, marginLeft: 50, marginRight: 50}}>
            <Row>
              <Col span={6}>
                <Menu mode="inline" defaultSelectedKeys={['d1']} className="landingSideMenu">
                  <Menu.ItemGroup key="gp1" title="For You">
                    <Menu.Item key="d1" className="landingSideMenuItem"><Icon type="appstore" />Home</Menu.Item>
                    <Menu.Item key="d2" className="landingSideMenuItem"><Icon type="search" />Search</Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup key="gp2" title="Discover">
                    <Menu.Item key="k1" className="landingSideMenuItem"><Icon type="star" />Popular Books</Menu.Item>
                    <Menu.Item key="k2" className="landingSideMenuItem"><Icon type="rise" />Recently Reviewed</Menu.Item>

                  </Menu.ItemGroup>
                </Menu>
              </Col>
              <Col span={18}>
                <div className="landingBookContain">
                  <div className="landingSort">
                    sortfilter
                  </div>
                <List 
            grid={{column: 4 }}
            dataSource={this.state.books}
            pagination={{
      onChange: page => {
        console.log(page);
      },
      pageSize: 16,
    }}
            renderItem={item => (
      <List.Item>
        <img src={`http://images.amazon.com/images/P/${item.asin}.jpg`} width='100' className="individualBook" onClick={() => this.OpenBookInfo(item.asin)}/>
        {/* <p>{item.asin}</p>
        <p>{item.price}</p>
        <p>{item.description}</p> */}
      </List.Item>
    )}
    />
  </div>
              </Col>
            </Row>
            </div>
            <Footer/>
          </div>
        )
    }





}

export default Test;