import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from "react-router-dom";

class NavBar extends React.Component {
    render(){
        return(
            <div>
                <Layout.Header style={{ zIndex: 1, width: '100%' }}>
                <div className="title"><Link to={{
                  pathname: `/`}}><h1>ZekeBook</h1></Link></div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                    className="menu">
                    <Menu.Item key="1">Home</Menu.Item>
                    {/* <Menu.Item key="2">Books</Menu.Item>
                    <Menu.Item key="3">Account</Menu.Item> */}
                </Menu>
                </Layout.Header>
            </div>
        )
    }
}

export default NavBar;