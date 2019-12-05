import React from 'react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { Typography } from 'antd';

const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

class LoadingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    render(){
        return(
            <div style={style}>
                <ClimbingBoxLoader
                    loading={this.state.loading}
                />
                <p style={{marginTop: 20, fontSize: 25}}> Loading... </p>
            </div>
        )
    }

}

export default LoadingComponent;