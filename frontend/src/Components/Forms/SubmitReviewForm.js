import React from 'react';

class SubmitReviewForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {valueBookName: '', valieUsername: '', valueRating: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('A new book review has been submitted: ' + this.state.value);
        event.preventDefault();
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        Name of Book:
                    </label>
                    <input type= "text" value = {this.state.valueBookName} onChange={this.handleChange} />
                </div>
                <div>
                    <label>
                        Username:
                    </label>
                    <input type= "text" value = {this.state.valieUsername} onChange={this.handleChange} />
                </div>
                <div>
                    <label>
                        Rating:
                    </label>
                    <input type= "text" value = {this.state.valueRating} onChange={this.handleChange} />
                </div>

            </form>
        )
    }
}


export default SubmitReviewForm;