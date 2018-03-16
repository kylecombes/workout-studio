import axios from 'axios';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import WorkoutPlayer from "./workout-player";
import WorkoutList from "./workout-list";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentWorkout: null,
            workouts: [],
        }
    }

    componentDidMount() {
        this.loadWorkouts('5a5fb7f72dff48a2973253f4');
    }

    loadWorkouts = (userId) => {
        axios.get(`http://localhost:2492/users/${userId}/workouts`).then((response) => {
            this.setState({workouts: response.data});
        });
    };

    setCurrentWorkout = (workoutInfo) => {
        this.setState({currentWorkout: workoutInfo});
    };

    workoutFinished = () => {
        this.setState({currentWorkout: null});
    };

    render() {
        let content = [];
        if (this.state.currentWorkout) {
            const workoutInfo = this.state.currentWorkout;
            content.push(<WorkoutPlayer key="workoutPlayer" info={workoutInfo} onFinish={this.workoutFinished}/>)
        } else {
            content.push(<WorkoutList key="workoutList" workouts={this.state.workouts} onWorkoutClick={this.setCurrentWorkout}/>)
        }
        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
