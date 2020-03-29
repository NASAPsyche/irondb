import React from "react";

const myName = "Cody";

class Account extends React.Component {
  
  state = {
    message: null,
    username: "Username",
    fname: "First",
    lname: "Last",
    password: null,
    email: "email@email.com",
    role: "N/A",
    edit: false,
    user_id: null
  };

  save() {
    var payload = {
      username: this.state.username,
      first_name: this.state.fname,
      last_name: this.state.lname,
      password: this.state.password,
      email: this.state.email,
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
        if (res !== undefined) {
          console.log("account update success");
          console.log(this.state.apiResponse);
          //Reset this page!
          this.grabUserInfo();
          this.state.edit = false;
        } else {
          console.log("account update failed");
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
        this.setState({ apiResponse: res });
        console.log("TEST");
        if (res !== undefined) {
          console.log("account request success");
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
    return (
      
        <div className='container-fluid mt-5 col-8 pb-4'>
            <div className='card mt-5'>
                <div className="container-fluid">
                    <div className="pt-3 h1">
                        <label>User: {this.state.username}</label>
                    </div>

                    {/* TODO: add action and method */}
                    <form id="user-update-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" className="form-control" id="username" value={this.state.username} readonly />
                        </div>
                        <div className="form-row form-group">
                            <div className="col">
                                <label>First Name</label>
                                <input type="text" className="form-control" id="firstname" placeholder={this.state.fname} onChange = {(event) => this.setState({fname:event.target.value})}  readOnly={!this.state.edit} required />
                            </div>
                            <div className="col">
                                <label>Last Name</label>
                                <input type="text" className="form-control" id="lastname" placeholder={this.state.lname} onChange = {(event) => this.setState({lname:event.target.value})} readOnly={!this.state.edit} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" id="email" placeholder={this.state.email} onChange = {(event) => this.setState({email:event.target.value})}  readOnly={!this.state.edit} />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <input type="text" className="form-control" id="role" value={this.state.role}  readonly />
                        </div>
                        <div className="form-group">
                            <label id="passwordLabel">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="************" onChange = {(event) => this.setState({email:event.target.value})} readOnly={!this.state.edit} />
                        </div>
                    {(!this.state.edit)?
                        <div className="text-right form-group pb-2">
                            <button className='btn btn-warning' type="button" id='update-btn' onClick={(event) => this.setState({edit:true})}>Edit</button>
                        </div>
                    :
                        <div className="text-right form-group pb-2">
                            <button className='btn btn-warning' type="button" id='update-btn' onClick={() => this.save()}>Save</button>
                        </div>
                    }
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
                    placeholder={this.state.lname}
                    onChange={event =>
                      this.setState({ lname: event.target.value })
                    }
                    readOnly={!this.state.edit}
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder={this.state.email}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
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
                  readonly
                />
              </div>
              <div class="form-group">
                <label id="passwordLabel">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="************"
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                  readOnly={!this.state.edit}
                />
              </div>
              {!this.state.edit ? (
                <div class="text-right form-group pb-2">
                  <button
                    class="btn btn-warning"
                    type="button"
                    id="update-btn"
                    onClick={event => this.setState({ edit: true })}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div class="text-right form-group pb-2">
                  <button
                    class="btn btn-warning"
                    type="button"
                    id="update-btn"
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
