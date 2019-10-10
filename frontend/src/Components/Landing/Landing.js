import React from 'react';
import { Table, Divider, Tag } from 'antd';

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

  const columns = [
    {
      title: 'Book Title',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
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
          <a>Open Book Info</a>
        </span>
      ),
    },
  ];

class Landing extends React.Component {
    render(){
        return(
            <div>
                <h1 style={{marginTop: 20}}>Books</h1>
                <Table columns={columns} dataSource={data} style={{margin: 30}}/>
            </div>
        )
    }
}


export default Landing;