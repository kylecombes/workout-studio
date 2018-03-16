import React from 'react';
import WorkoutListItem from './workout-list-item';

export default class WorkoutList extends React.Component {

    render() {
        let workoutElems = [];
        this.props.workouts.forEach((workout) => {
            workoutElems.push(<WorkoutListItem info={workout} onClick={this.props.onWorkoutClick}/>)
        });
        return (
            <section className="workout-list">
                <h1>Workouts</h1>
                {workoutElems}
            </section>
        )
    }

}