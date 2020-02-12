import React from 'react';
import * as Cookies from "js-cookie";


const UserContext = React.createContext();

var sessionCookie = Cookies.get("username");



class UserContextProvider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: sessionCookie
    };
  }

  setUser = key => {
    Cookies.set('username',key);
    this.setState({ user: key });
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser
        }}
      >
        <div>{this.props.children}</div>
      </UserContext.Provider>
    );
  }
}

export { UserContextProvider, UserContext };
