import React from 'react';
import { Table, Divider, Tag, Layout, Row, Col, Modal, Checkbox } from "antd";
import NavBar from "../NavBar";

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
}

const { Header, Footer, Sider, Content } = Layout;

class SubmitBookForm extends React.Component {
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

export default SubmitBookForm;