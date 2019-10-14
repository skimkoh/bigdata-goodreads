import React from 'react';
import { Table, Button } from 'antd';
import NavBar from '../NavBar';
import axios from 'axios';
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
  }

  OpenBookInfo = () => {
    this.setState({
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
        title: 'Book Title',
        dataIndex: 'title',
        key: 'title',

      },
      {
        title: 'Price ($)',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Genre',
        dataIndex: 'genre',
        key: 'genre',
      },
      {
        title: 'Synopsis',
        dataIndex: 'synopsis',
        key: 'synopsis',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.OpenBookInfo}>Open Book Info</a>
          </span>
        ),
      },
    ];
    if(this.state.redirectBookInfo){
      this.props.history.push('/info');
    }

    if(this.state.redirectCreateBook){
      this.props.history.push('/createbook');
    }
    
    return(
        <div>
          <NavBar/>
            <h1 style={{marginTop: 20}}>Books</h1>
            <Button type="primary" className="createBookbtn" onClick={this.createBook}> Create New Book </Button>
            <Table columns={columns} dataSource={data} style={{padding: 30}}/>

            
        </div>
    )
  }
}


export default Landing;