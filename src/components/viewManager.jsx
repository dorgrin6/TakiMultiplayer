import React from "react";
import gameUtils from "../utils/gameUtils.js";
import LoginContainer from "./login/loginContainer.jsx";
import LobbyContainer from "./lobby/lobbyContainer.jsx";
import GameContainer from "./gameRoom/gameContainer.jsx";


export default class ViewManager extends React.Component {
  constructor(props) {
    super(props);
    this.UPDATE_TIMEOUT = 500;
    this.state = {
      user: ""
    };

    this.fetchInterval = setInterval(
        this.getUser.bind(this),
        this.UPDATE_TIMEOUT
    );
  }

  clearUserInfo(){
    return {user: ""};
  }

  renderLogin(){
      return <LoginContainer/>;
  }

  renderLobby() {
    return (
        <LobbyContainer
          user={this.state.user}
        />
    );
  }

  renderGameRoom(){
    return (
        <GameContainer
          user={this.state.user}
        />
    );
  }

  getUser() {
    this.fetchUser()
      .then(user => {
        this.setState(() => ({ user: user}));
      })
      .catch(err => {
        if (err.status === 401) {
          // incase we're getting 'unautorithed' as response
          this.setState(() => (this.clearUserInfo()));
        } else {
          throw err; // in case we're getting an error
        }
      });
  }

  fetchUser() {
    return fetch("/users", { method: "GET", credentials: "include" }).then(
      response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      }
    );
  }

  render() {
    if (this.state.user !== ""){
        if (this.state.user.gameName !== "" && this.state.user.status === gameUtils.STATUS_CONSTS.PLAYING) {
            return this.renderGameRoom();
        }
        else if (this.state.user.name !== ""){
            return this.renderLobby();
        }
    }
    else {
      return this.renderLogin();
    }
  }
}
