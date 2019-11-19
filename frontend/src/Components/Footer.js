import React from 'react';
import { Row, Col } from 'antd';

class Footer extends React.Component {
    render(){
        return(
            <div style={{backgroundColor: '#001529', marginTop: 30}}>
                <Row>
                    <Col span={8} style={{marginTop: 40, marginBottom: 20}}>
                        <div style={{color: 'white', fontSize: 20}}>ZekeBook</div>
                        <div style={{color: 'grey'}}>All Rights Reserved 2019</div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Footer;