import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import WorkoutPlayer from "./workout-player";

class App extends Component {
  render() {
    return (
      <div className="App">
        <WorkoutPlayer/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
