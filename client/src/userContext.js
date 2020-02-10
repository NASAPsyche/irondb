import React from 'react';

const UserContext = React.createContext();

class UserContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: String
    };
  }

  setUser = key => {
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
