import React from 'react';
import './App.css';

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', submitted: false, onSubmit: this.props.onSubmit};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value.toUpperCase()});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.submitted === false) {
            this.setState({submitted: true});

            fetch('http://antonbox.local:3001/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.value
                })
            })
            .then(response => {
                console.log(response.status)
            })
            .catch(function(error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                throw error;
            });
        }

        this.state.onSubmit();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
               <Button text="Submit" onClick={this.handleSubmit} />
            </form>
        );
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

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Test Text"
        };
    }

    render() {
        return this.state.text;
    }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButtons: false,
    };
  }

  render() {
    if (this.state.showButtons) {
      return (
          <div className="buttons">
              <Header/>
            <div className="button-1">
              <Button text={"Ally"} onClick={increment}/>
            </div>
            <div className="button-2">
              <Button text={"Betray"} onClick={increment} />
            </div>
          </div>
      );
    }
    else {
      return (
          <div className="buttons">
              <Header/>
              <NameForm onSubmit={() => {this.setState({showButtons: true})}}/>
          </div>
      );
    }

  }
}

function increment()
{

}

export default Game;
