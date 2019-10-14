import React from "react";
import { Table, Divider, Tag, Layout, Row, Col, Modal, Checkbox, Button } from "antd";
import NavBar from "../NavBar";

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
const { Header, Footer, Sider, Content } = Layout;


class EditReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.stateBookname = {valueBookName: 'Initial Book Name'};
        this.stateUsername = {valueUsername: 'Initial Username'};
        this.stateRating = {valueRating: 'Initial Rating'};
        this.stateSummary = {valueSummary: 'Initial Summary'}
        this.stateReview = {valueReview: 'Initial Review'}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState(
            {textValue: event.target.valueBookName}
        );
    }

    handleSubmit(event) {
        alert('A new book review has been submitted: ' + this.state.value);
        event.preventDefault();
    }

    submitReview() {
     
    }
    render(){
        return(
            <div>
                <NavBar/>
                    <Layout>
                        <form onSubmit={this.handleSubmit}>
                            <div floated> 
                                <label>
                                    Name of Book:
                                </label>
                                <input type= "text" value = {this.stateBookname.valueBookName} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>
                                    Username:
                                </label>
                                <input type= "text" value = {this.stateUsername.valueUsername} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>
                                    Rating:
                                </label>
                                <input type= "text" value = {this.stateRating.valueRating} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>
                                    Summary:
                                </label>
                                <input type= "text" value = {this.stateSummary.valueSummary} onChange={this.handleChange} />
                            </div>
                            <div>
                                <label>
                                    Review:
                                </label>
                                <input type= "text" value = {this.stateReview.valueReview} onChange={this.handleChange} />
                            </div>
                            <div>
                                <Button type="primary" className="submitReviewBtn" onClick={this.submitReview}> Submit Review </Button>
                            </div>

                        </form>
                </Layout>
            </div>            
        )
    
    }

}

export default EditReviewForm;