import React from 'react';

export default class WorkoutListItem extends React.Component {

    render() {
        return (
            <div className="workout-list-item" onClick={() => this.props.onClick(this.props.info)}>
                <p>Workout name: {this.props.info.name}</p>
            </div>
        )
    }

}