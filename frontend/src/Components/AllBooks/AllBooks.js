import React from 'react';
import MUIDataTable from "mui-datatables";
import axios from 'axios'
import { Button } from 'antd';
import NavBar from '../NavBar';
import { Rating } from 'semantic-ui-react'
import LoadingComponent from '../../LoadingComponent';

class AllBooks extends React.Component {
    state = {
        books: [],
        redirectBookInfo: false,
        redirectCreateBook: false,
        currentBookID: '',
        loading: true,
    }


    componentDidMount(){
        axios.get(`http://54.255.189.94/book`)
        .then((res => {
            this.setState({
                books: res.data['books'],
                loading: false,
            }, () => console.log(this.state.books))
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
                name: 'asin',
                label: 'Book Title',
                options: {
                    display: true,
                    viewColumns: false,
                }
            },
            {
                name: 'imUrl',
                label: 'Book Image',
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return(
                            // <img src={`http://images.amazon.com/images/P/${tableMeta.rowData[0]}.jpg`} width='70'/>
                            <img src={value} width='70' />
                        )
                    }
                }
                
            }, 
            // {
            //     name: 'title',
            //     label: 'Book Title',
            // },
            
            {
                name: 'price',
                label: 'Price ($)',
            },
            {
                name: 'description',
                label: 'Description',
            },
            {
                name: 'Action',
                options: {
                    filter: false,
                    sort: false,
                    viewColumns: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Button onClick={() => this.OpenBookInfo(tableMeta.rowData[0])}>
                                See More
                                </Button>

                        )
                    }
                }
            }
        ];

        const options = {
            download: false,
            print: false,
            filter: false,
            selectableRows: 'none',
            elevation: 0,
            searchPlaceholder: 'Search Anything',
            searchOpen: true,
        
          };   
        

        if(this.state.redirectBookInfo){
        this.props.history.push({
            pathname:"/info",
            state:{
            currentBookID: this.state.currentBookID,
            }
        })
        }

        if(this.state.redirectCreateBook){
            this.props.history.push('/booksubmit');
        }

        return(
            this.state.loading ? <div><NavBar/><LoadingComponent loading={this.state.loading} /> </div>:
            <div>
                 <NavBar/>
                 <h1 style={{marginTop: 20}}>Books</h1>
                <Button type="primary" className="createBookbtn" onClick={this.createBook}> Create New Book </Button>
                <MUIDataTable
                data={this.state.books}
                columns={columns}
                options={options}
                className="booksTable"
                />
            </div>
        )
    };
};

export default AllBooks;