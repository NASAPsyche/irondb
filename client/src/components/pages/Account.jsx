import React from "react";
import {
  Redirect
} from "react-router-dom";



class Account extends React.Component {
  state = {
    message: null,
    username: "Username",
    fname: "First",
    lname: "Last",
    password: null,
    changedEmail: false,
    cpassword: null,
    email: "email@email.com",
    emailCheck: null,
    role: "N/A",
    edit: false,
    apiResponse: null,
    error: null,
    nameChangedFirst: false,
    nameChangedLast: false,
    fnameCheck: null,
    lnameCheck: null,
    passCheck: null,
    passCheck2: null,
    success: null,
    editingPassword: false,
    user_id: null
  };


async changeName (value, field) {

  if (field === "updated-fname")
  {
      await this.setState({nameChangedFirst: true})
  }
  else if (field === "updated-lname")
  {
      await this.setState({nameChangedLast: true})
  }

  if (value !==null && value !== "") 
  {
    let letters = /^[a-zA-Z]+$/;
    let nameValid = value.match(letters);

    //Name Field is valid
    if (nameValid)
    {
      //Handle valid fname
      if (field === "fname")
      {
        await this.setState({fnameCheck: true})
        this.setState({ fname: value });
        await this.setState({error: ""})
        return true
      
      //Handle valid lname
      } else if (field === "lname")
      {
        await this.setState({lnameCheck: true})
        this.setState({ lname: value });
        await this.setState({error: ""})
        return true
      }
    }
    else
    {
      //Handle invalid name
      if (field === "fname")
      {
        await this.setState({fnameCheck: false})
        await this.setState({error: "Error: Only alphabetical characters allowed in names!"})
        return false
      
      //Handle invalid lname
      } else if (field === "lname")
      {
        await this.setState({lnameCheck: false})
        await this.setState({error: "Error: Only alphabetical characters allowed in names!"})
        return false
      }
    }
  }
}
  async cancel () {
    await this.grabUserInfo();
    await this.setState({edit: false})
    await this.setState({editingPassword:false}) 
    await this.setState({changedPassword:false}) 
    await this.setState({password: null})
    await this.setState({cpassword: null})
    await this.setState({passCheck: null})
    await this.setState({passCheck2: null})
    await this.setState({fnameCheck: null})
    await this.setState({lnameCheck: null})
    await this.setState({success: null})
    await this.setState({error: null})
    document.getElementById("user-update-form").reset();

  }
  async validatePassword(password,confirm) {

    //If password is blank, wipe passcheck
    if (!password)
    {
      await this.setState({passCheck:null})
      return false;
    }

    if (password !== "")
    {
      await this.setState({password:password})
      
        const pwd = password;

        //If there is a value in confirm box already...
        if (this.state.cpassword) 
        {
          await this.confirmPassword(this.state.cpassword)
        }

        // validate passwords match and have at least 1 lowercase, 1 uppercase and 1 number
          if (pwd.length >= 8) {
            const hasUpperCase = /[A-Z]/.test(pwd);
            const hasLowerCase = /[a-z]/.test(pwd);
            const hasNumbers = /\d/.test(pwd);
    
            if (hasUpperCase && hasLowerCase && hasNumbers) {
        
              if (confirm)
                await this.setState({passCheck:true})   

              await this.setState({editingPassword:true})  

              return true;
            } else {

              if (confirm)
                await this.setState({passCheck:false})

              await this.setState({editingPassword:false}) 

              return false;
            }
          }  else {
            if (confirm)
              await this.setState({passCheck:false})
            await this.setState({editingPassword:false}) 

            return false;
          }

      }  
  }

  async confirmPassword(password) {

    if (!password)
    {
      await this.setState({passCheck2:null})
      return false;
    }

    await this.setState({cpassword:password})

    if (this.state.cpassword === this.state.password && this.state.passCheck === true)
    {
      await this.setState({passCheck2:true})
      return true;
    }
    else
    {
      await this.setState({passCheck2:false})
      return false;
    }
    
  }

  async validateEmail(email,confirm) {
    if (email == null)
    {
      await this.setState({changedEmail: true})
    }
    else
    {
      await this.setState({changedEmail: false})
    }

    if (email!=="" && confirm)
    {
      await this.setState({email: email})
      let emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

      if (emailValid)
      {
        console.log("Email Valid")
        await this.setState({emailCheck: true})
        await this.setState({error: ""})
        return true
        
      }
      else
      {
        console.log("Email invalid")
        await this.setState({emailCheck: false})
        await this.setState({error: "Error: Invalid Email!"})
        return false
      }
  }
  }

  async edit() {
    await this.setState({success: null})
    await this.setState({error: null})
    await this.setState({edit: true})
  }

  async save() {

    let changedPassword = false;

    //Check Password
    if (this.state.password !== null)
    {
      let confirm = await this.confirmPassword(this.state.cpassword)

      //Show error message for not confirmed password
      if (!confirm)
        await this.setState({passCheck2: false})

      let validate = await this.validatePassword(this.state.password,true)
      if (!confirm || !validate)
      {
        return false
      } else 
      {
        changedPassword = true;
      }
        
    }

    //Check Email
    if (this.state.email !== null)
    {
      if (this.state.changedEmail && !this.validateEmail(this.state.email,true))
        return false
    }

    //Check Lname
    if (this.state.nameChangedLast !== null)
    {
      if (this.state.nameChangedLast && !this.changeName(this.state.fname,"lname"))
        return false
    }

    //Check Fname
    if (this.state.nameChangedFirst !== null)
    {
      if (this.state.nameChangedFirst && !this.changeName(this.state.lname,"fname"))
        return false
    }

    var payload = {
      username: this.state.username,
      first_name: this.state.fname,
      last_name: this.state.lname,
      password: this.state.password,
      email_address: this.state.email,
      user_id: this.state.user_id
    };

    fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ apiResponse: res });
        console.log("TEST");
        if (res !== undefined && res.ok === true) {
          console.log("account update success");
          console.log(this.state.apiResponse);

          this.setState({success: true})

          //Reset this page!
          this.grabUserInfo();
          this.setState({edit: false})
          this.setState({editingPassword:false}) 
          //Reset password field
          this.setState({password: null})
          this.setState({cpassword: null})
          this.setState({passCheck: null})
          this.setState({passCheck2: null})

        } else {
          console.log("account update failed");
          this.setState({success: false})
          console.log(this.state.apiResponse);
        }
      });
  }

  grabUserInfo(event) {
    var payload = {
      username: this.state.username
    };

    fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ apiResponse: res });
        console.log("TEST");
        if (res !== undefined) {
          console.log("account request success");
          console.log(res);
          console.log(this.state.apiResponse);
          //Let's set the user data now
          this.setState({ username: res.User.username });
          this.setState({ fname: res.User.first_name });
          this.setState({ lname: res.User.last_name });
          this.setState({ email: res.User.email_address });
          this.setState({ role: res.User.role_of });
          this.setState({ user_id: res.User.user_id });
        } else {
          console.log("account request failed");
          console.log(this.state.apiResponse);
        }
      });
  }

  componentDidMount() {
    this.grabUserInfo();
  }

  render() {

    if (this.state.username === "") {
        return (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        );
      }


    return (
      <div class="container-fluid mt-5 col-8 pb-4">
        <div class="card mt-5">
          <div class="container-fluid">
            <div class="pt-3 h1">
              <label>User: {this.state.username}</label>
            </div>

            {
              (this.state.passCheck === false) ? 
                  <div className="alert alert-danger alert-dismissible show"  id="reqs" role="alert">
                    <strong>Error:</strong> Password does not contain all necessary characters or length requirements!
                  </div>
              : (this.state.passCheck2 === false) ? 
                  <div className="alert alert-danger alert-dismissible show"  id="reqs" role="alert">
                      <strong>Error:</strong> Your passwords do not match!
                  </div>
             :""
            }

            { (this.state.error !== null && this.state.error !== "") 
                    ? <div className="alert alert-danger" role="alert" id="updateFail">
                            {this.state.error}
                        </div>
                    : null
                    }

            { (this.state.success === true) 
                    ? <div className="alert alert-success" role="alert" id="updateSuccess">
                            Changes successfully saved!
                        </div>
                    :  (this.state.success === false) ?
                       <div className="alert alert-danger" role="alert" id="updateFail">
                        An error occured!
                    </div>
                    : null
                    }

            {/* TODO: add action and method */}
            <form id="user-update-form">
              <div class="form-group">
                <label>Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  value={this.state.username}
                  readOnly
                />
              </div>
              <div class="form-row form-group">
                <div class="col">
                  <label>First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstname"
                    placeholder={this.state.fname}
                    className={
                      (this.state.fnameCheck === null) ? "form-control" 
                      :(this.state.fnameCheck === true) ? "form-control border border-success"
                      :(this.state.fnameCheck === false) ? "form-control border border-danger"
                      : "form-control"
                    }
                    onChange = {(event) => this.changeName(event.target.value, "updated-fname")}
                    onBlur = {(event) => this.changeName(event.target.value, "fname")} 
                    readOnly={!this.state.edit}
                    required
                  />
                </div>
                <div class="col">
                  <label>Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastname"
                    className={
                      (this.state.lnameCheck === null) ? "form-control" 
                      :(this.state.lnameCheck === true) ? "form-control border border-success"
                      :(this.state.lnameCheck === false) ? "form-control border border-danger"
                      : "form-control"
                    }
                    placeholder={this.state.lname}
                    onChange = {(event) => this.changeName(event.target.value, "updated-lname")}
                    onBlur = {(event) => this.changeName(event.target.value, "lname")} 
                    readOnly={!this.state.edit}
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  className={
                    (this.state.emailCheck === null) ? "form-control" 
                    :(this.state.emailCheck === true) ? "form-control border border-success"
                    :(this.state.emailCheck === false) ? "form-control border border-danger"
                    : "form-control"
                  }
                  id="email"
                  placeholder={this.state.email}
                  onChange = {(event) => this.validateEmail(event.target.value, false)} 
                  onBlur = {(event) => this.validateEmail(event.target.value, true)} 
                  readOnly={!this.state.edit}
                />
              </div>
              <div class="form-group">
                <label>Role</label>
                <input
                  type="text"
                  class="form-control"
                  id="role"
                  value={this.state.role}
                  readOnly
                />
              </div>

              <div class="form-group">
                <label id="passwordLabel">Password</label>
                <input
                  type="password"
                  className={
                    (this.state.passCheck === null) ? "form-control" 
                    :(this.state.passCheck === true) ? "form-control border border-success"
                    :(this.state.passCheck === false) ? "form-control border border-danger"
                    : "form-control"
                  }
                  id="password"
                  placeholder="************"
                  onChange={(event) => this.validatePassword(event.target.value,false)}
                  onBlur={(event) => this.validatePassword(event.target.value,true)}
                  readOnly={!this.state.edit}
                />
              </div>
              {this.state.editingPassword ? (
                <div class="form-group">
                <label id="passwordLabel">Confirm Password</label>
                <input
                  type="password"
                  className={
                    (this.state.passCheck2 === null) ? "form-control" 
                    :(this.state.passCheck2 === true) ? "form-control border border-success"
                    :(this.state.passCheck2 === false) ? "form-control border border-danger"
                    : "form-control"
                  }
                  id="passwordConfirm"
                  onBlur={(event) => this.confirmPassword(event.target.value)}
                  
                />
              </div>                

              )
              :null}

              {!this.state.edit ? (
                <div class="text-right form-group pb-2">
                  <button
                    class="btn btn-warning"
                    type="button"
                    id="update-btn"
                    onClick={() => this.edit()}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="text-right form-group pb-2">
                  <button
                    className="btn btn-danger mr-1"
                    type="reset"
                    id="cancel-btn"

                    onClick={() => this.cancel()}
                  >
                    Cancel
                  </button>

                  <button
                    class="btn btn-warning"
                    type="button"
                    id="update-btn"

                    disabled= { (this.state.error !== null && this.state.error !== "") 
                    ? true: false
                    }

                    onClick={() => this.save()}
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
