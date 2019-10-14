import React from 'react';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://antonbox.local:3001');

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Players:",
            players: []
        }
    }

    componentDidMount() {
        socket.on("players",  (data) => {
            this.setState({players: []});
            for (var key in data)
            {
                this.setState({players: this.state.players.concat([data[key].name])});
            }
        });
    }

    render() {
        const items = [];

        for (var i = 0; i < this.state.players.length; i++) {
            items.push(<li key={i}>{this.state.players[i]}</li>);
        }

        return (
            <div className="PlayerNames">
                <p> {this.state.text} </p>
                {items}
            </div>
        )
    }
}


class Button extends React.Component {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      return (
          <div className="buttons">
              <Button text={"Reset"} onClick={() => socket.emit('reset')} />
              <Header/>
          </div>
      );
  }
}



export default Game;
