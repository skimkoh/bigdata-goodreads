import React from 'react';
import { Table, Button, Carousel, Row, Col, Rate, Input, Icon } from 'antd';
import NavBar from '../NavBar';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

const data = [
    {
      key: '1',
      title: 'Adventures of a Lifetime',
      price: 22,
      genre: 'Science Fiction',
      synopsis: 'adventures of a little cat flying'
    },
    {
      key: '2',
      title: 'Mystery Day',
      price: 29,
      genre: 'Mystery',
      synopsis: 'a mystery man dressed in black'
    },
    {
      key: '3',
      title: 'White Sky',
      price: 12,
      genre: 'Children',
      synopsis: 'what a beautiful day today'

    },
  ];

  

class Landing extends React.Component {
  state = {
    redirectBookInfo: false,
    redirectCreateBook: false,
    allBooks: [],
    currentBookID: '',
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : ''}} />
    ),
    onFilter: (value, record) =>
      {if(record[dataIndex] != null){
        record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
      }
     },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={(text + " ").toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  componentDidMount(){
    // var randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    // var token = randomToken(13);
    // token = 'C' + token
    // console.log(token)
    axios.get(`http://localhost:5000/book`)
    .then((res => {
      this.setState({
        allBooks: res.data['books'],
      })
    }))
  }

  OpenBookInfo = (e) => {
    const currentBookID = e
    this.setState({
      currentBookID: currentBookID,
      redirectBookInfo: true,
    })
  }

  createBook = () => {
    this.setState({
      redirectCreateBook: true,
    })
  }
  

  render(){
    const columns = [
      {
        title: 'Picture',
        dataIndex: 'asin',
        key: 'imUrl',
        render: text => <img src={`http://images.amazon.com/images/P/${text}.jpg`} width='70'/>,
      },
      {
        title: 'Book Title',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title'),
      },
      
      {
        title: 'Price ($)',
        dataIndex: 'price',
        key: 'price',
        ...this.getColumnSearchProps('price'),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ...this.getColumnSearchProps('description'),
      },
      {
        title: 'Action',
        dataIndex: 'asin',
        key: 'asin',
        render: (text, record) => (
          <a onClick={()=> this.OpenBookInfo(record['asin'])}>
            Edit
          </a>
        ),
      },
    ];
    if(this.state.redirectBookInfo){
      this.props.history.push({
        pathname:"/info",
        state:{
          currentBookID: this.state.currentBookID,
        }
      })
    }

    if(this.state.redirectCreateBook){
      this.props.history.push('/submit');
    }
    
    return(
        <div>
          <NavBar/>
            <h1 style={{marginTop: 20}}>Books</h1>
            <Button type="primary" className="createBookbtn" onClick={this.createBook}> Create New Book </Button>
            <Table columns={columns} dataSource={this.state.allBooks} style={{padding: 30}}/>
            {/* <h1> Recently Reviewed Books </h1> */}
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

            
        </div>
    )
  }
}

export default Landing;