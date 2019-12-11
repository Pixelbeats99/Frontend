
import React from 'react';
import {Form, Input, Button, Alert} from 'antd';
import { Link, Redirect} from 'react-router-dom' //importing redirect to take to main page


export class HomeGrid extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: false, //if the user is added successfully
            editMode: false, //Only display as editable boxes when edit mode is enabled
            showError: false, //if should we show an error feedback message after adding a user
            errorCode: 400, //to save the errorCode we recieved from the api server
            errorMessage: "", //the error message to display to the user after server rejects action
            userDetails: {},
            redirect: false,
            updatedSucessfully: false
          };
    
    }

    checkResponse = (data) => {
        
        if(this.state.updatedSucessfully){

          sessionStorage.removeItem("token");
          //SET SESSION STORAGE ABOVE^
          this.props.form.resetFields();
          this.setState({
            redirect: true
          })
        }else{
          //handle errors

          this.setState({
          errorMessage: "Remember: country ID must be an integer and please enter a valid email",
          isLoaded:false,
          showError : true,
          responseStatus: "error"
          });
        } 
      }

    
    componentDidMount(){
       // console.log('mounted component')
        fetch('http://localhost:5000/api/v1.0/home/getAccountInfo', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.token
            },
        })
        .then(res => res.json())
        .then(
            (result) => {
                //console.log(result[0])
            this.setState({
                isLoaded: true,
                // userDetails: result[0]
                userDetails: result[0]
            });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                //console.log(error)
                this.setState({
                updatedSucessfully: true,
            });
            }
        )
    }

    enterEditMode = e => {
        e.preventDefault();
        this.setState(prevState => ({
            editMode: !prevState.editMode
          }));
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                if(values.username === undefined) values.username = this.state.userDetails.username
                if(values.firstName === undefined) values.firstName = this.state.userDetails.firstName
                if(values.lastName === undefined) values.lastName = this.state.userDetails.lastName
                if(values.email === undefined) values.email = this.state.userDetails.email
                if(values.about === undefined) values.about = this.state.userDetails.about
                if(values.countryID === undefined) values.countryID = this.state.userDetails.countryID
                if(values.profileImageURL === undefined) values.profileImageURL = this.state.userDetails.profileImageURL
                //if any of these are undefined -> set to be the default sent within the state {userDetails}
                //then send an PUT request to api with all of these parameters in
                fetch('http://localhost:5000/api/v1.0/home/updateInfo', {
                    method: 'PUT',
                    headers: {
                      'Accept': 'application/json',
                      'Authorization': 'Bearer ' + sessionStorage.token,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({values})
                  }).then(res =>{
                    if(res.ok){
                      this.setState({
                          updatedSucessfully:true,
                          editMode: false
                        })
                      //console.log("Success")
                      return true //update success
                    } else{
                      //console.log("Fail")
                      this.setState({
                      editMode: false,
                      updatedSucessfully:false,
                      errorCode: res.status
                      })
                      return false //update failed
                    };
                  }).then(res => this.checkResponse(res))
    }}
    )};

    render() {
    let details = this.state.userDetails
    const { getFieldDecorator } = this.props.form;
    if(this.state.redirect === true){
        return <Redirect to={{pathname: '/'}}/>
      }
      return <> 
      {this.state.showError ? <Alert message={this.state.errorMessage} type="error" /> :null}
      <Form onSubmit={this.handleSubmit}>
      <h4>
            Username:
      </h4>
      {!this.state.editMode ? <p> {details.username} </p> :null}
        {this.state.editMode ? 
           <Form.Item >
           {getFieldDecorator('username')(<Input placeholder={details.username} ></Input>)} 
           </Form.Item>
        :null}
      <h4>
            First Name:
      </h4>
      {!this.state.editMode ? <p> {details.firstName} </p> :null}
           {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('firstName')(<Input placeholder={details.firstName} ></Input>)} 
            </Form.Item>
            :null}
      <h4>
            Last Name:
      </h4>
      {!this.state.editMode ? <p> {details.lastName} </p> :null}
        {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('lastName')(<Input placeholder={details.lastName} ></Input>)} 
            </Form.Item>
        :null}

      <h4>
            Email:
      </h4>
      {!this.state.editMode ? <p> {details.email} </p> :null}
      {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('email')(<Input placeholder={details.email} ></Input>)} 
            </Form.Item>
        :null}
      <h4>
            About:
      </h4>
      {!this.state.editMode ? <p> {details.about} </p> :null}
      {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('about')(<Input placeholder={details.about} ></Input>)} 
            </Form.Item>
        :null}
      <h4>
            Country (ID):
      </h4>
      {!this.state.editMode ? <p> {details.countryID} </p> :null}
      {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('countryID')(<Input placeholder={details.countryID} ></Input>)} 
            </Form.Item>
        :null}
      <h4>
            Profile Image URL:
      </h4>
      {!this.state.editMode ? <p> {details.profileImageURL} </p> :null}
      {this.state.editMode ?
           <Form.Item >
            {getFieldDecorator('profileImageURL')(<Input placeholder={details.profileImageURL} ></Input>)} 
            </Form.Item>
        :null}
      <h4>
            Date Registered: {details.dateRegistered}
      </h4>
      <Form.Item>
        {this.state.editMode ?
        <Button type="primary" htmlType="submit" className="changeSubmit">
            Confirm changes
        </Button>
        :null}
      </Form.Item>
      </Form>

      <br></br>
        {this.state.editMode ?
        <Button type="primary" htmlType="submit" className="enterEdit" onClick={this.enterEditMode}>
            Cancel
        </Button>
        :null}
        {!this.state.editMode ?
        <Button type="primary" htmlType="submit" className="enterEdit" onClick={this.enterEditMode}>
            Edit data
        </Button>
        :null}
      </>
    }
  }
const index = Form.create({ name: 'normal_home' })(HomeGrid);

export default index;



