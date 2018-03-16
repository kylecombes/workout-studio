import React from "react";

export default class WorkoutPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSetIndex: 0,
            currentExerciseIndex: 0,
            exerciseRepsCompleted: 0,
            setRepsCompleted: 0,
            currentExerciseCompletion: 0,
            currentExerciseReps: 1,
            resting: false,
            timerTicking: true,
            workout: props.info,
            workoutCompleted: false,
        };

        this.state.currentExercise = this.state.workout.exerciseSets[0].exercises[0];
        if (!this.state.currentExercise.duration) {
            this.state.currentExercise.duration = this.state.workout.exerciseSets[0].defaultDuration || this.state.workout.defaultDuration;
        }
        this.state.currentExercise.timeRemaining = this.state.currentExercise.duration;

        // this.beep = new Audio('beep-beep.mp3');
    }

    componentDidMount() {
        this.start();
    }

    start = () => {
        this.timer = setInterval(this.timerTick, 1000);
    };

    timerTick = () => {
        let timeRemaining = this.state.currentExercise.timeRemaining - 1;
        if (timeRemaining === 0) {
            this.getNextExerciseOrRest(true);
        } else {
            this.setState({currentExercise: Object.assign({}, this.state.currentExercise, {timeRemaining})});
        }
        if (!this.state.timerTicking) {
            clearInterval(this.timer); // Stop the timer
            this.props.onFinish();
        }
    };

    getNextExerciseOrRest = (doApply = false) => {
        let setIndex = this.state.currentSetIndex;
        let exerciseIndex = this.state.currentExerciseIndex;
        let exerciseReps = this.state.currentExerciseReps;
        let exerciseRepsCompleted = this.state.exerciseRepsCompleted;
        let setRepsCompleted = this.state.setRepsCompleted;
        let currentlyResting = this.state.resting;
        let currentExercise = {};
        let workoutCompleted = false;
        const sets = this.state.workout.exerciseSets;

        const lastExerciseOfSet = exerciseIndex === sets[setIndex].exercises.length - 1;

        let rest = 0;

        // Check if we need to rest
        if (!currentlyResting) {
            // Not currently resting (which means we're in an exercise), so the next stage is a rest
            const lastRepOfExercise = exerciseRepsCompleted === exerciseReps - 1;
            // Determine rest duration
            rest = sets[setIndex].exercises[exerciseIndex].rest || sets[setIndex].defaultRest || this.state.workout.defaultRest || 0;
            // If we've finished an exercise set, we may want to use a longer rest
            if (lastExerciseOfSet && lastRepOfExercise) { // Finished exercise set
                // Load the final rest (likely longer) for the set
                rest = sets[setIndex].finalRest || this.state.workout.defaultSetFinalRest || rest;
            }
        }

        if (rest > 0) { // We need to rest
            // Save the rest info as the next "exercise"
            currentlyResting = true;
            currentExercise.name = 'Rest';
            currentExercise.timeRemaining = rest;
            currentExercise.duration = rest;
        } else { // Otherwise, go to the next exercise
            // Check if we've finished all the reps of the current exercise
            ++exerciseRepsCompleted;

            if (exerciseRepsCompleted === exerciseReps) { // Finished reps of this exercise
                // Reset rep counter
                exerciseRepsCompleted = 0;

                // Move onto the next exercise
                ++exerciseIndex;

                if (exerciseIndex === sets[setIndex].exercises.length) { // We've finished the set
                    // Go to next set
                    ++setRepsCompleted;
                    // Reset exercise index
                    exerciseIndex = 0;

                    let exerciseSetReps = sets[setIndex].reps || 1;

                    if (setRepsCompleted === exerciseSetReps) { // Finished reps of set
                        // Go onto next set
                        ++setIndex;
                        // Reset set reps counter
                        setRepsCompleted = 0;

                        if (setIndex === sets.length) { // Finished workout
                            workoutCompleted = true;
                            currentExercise.name = 'Done!';
                        }

                    } // Else: More reps of this set to go
                }
                if (!workoutCompleted) {
                    // Load the exercise reps
                    exerciseReps = sets[setIndex].exercises[exerciseIndex].reps || sets[setIndex].defaultExerciseReps || 1;
                }

            } // Else: load the same exercise again

            if (!workoutCompleted) {
                // Load the exercise info
                currentExercise.name = sets[setIndex].exercises[exerciseIndex].name;
                currentExercise.duration = sets[setIndex].exercises[exerciseIndex].duration || sets[setIndex].defaultDuration || this.state.workout.defaultDuration;
                currentExercise.timeRemaining = currentExercise.duration;
                currentlyResting = false;
            }
        }

        if (doApply) { // Update the state
            this.setState(Object.assign({}, this.state, {
                currentExerciseIndex: exerciseIndex,
                currentExerciseReps: exerciseReps,
                currentExercise,
                currentSetIndex: setIndex,
                exerciseRepsCompleted,
                resting: currentlyResting,
                setRepsCompleted,
                workoutCompleted,
                timerTicking: !workoutCompleted,
            }))
        }

        return currentExercise;

    };

    render() {

        let remaining = this.state.currentExercise.timeRemaining;
        let minutes = Math.floor(remaining / 60);
        let seconds = remaining % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        const currentExercise = this.state.currentExercise;
        let nextExerciseName;
        if (!this.state.workoutCompleted) {
            nextExerciseName = this.getNextExerciseOrRest();
            if (nextExerciseName) {
                nextExerciseName = nextExerciseName.name;
            }
        }

        let bgStyle = {
            top: (1-(currentExercise.timeRemaining / currentExercise.duration))*100 + '%',
            backgroundColor: this.state.resting ? 'red' : 'green',
        };

        let content = this.state.timerTicking
            ? <div className="exercise-info-container">
                <h1 className="current-exercise-title">{currentExercise.name}</h1>
                <div className="clock-container">
                    <div className="clock">
                        <span>{`${minutes}:${seconds}`}</span>
                    </div>
                </div>
                <div className="next-container">
                    <h1 className="next-exercise">Up next: <span className="next-exercise-title">{nextExerciseName}</span></h1>
                </div>
            </div>
            : <h1>Done!</h1>;

        return (
            <div className="workout-player">
                {content}
                <div className="background" style={bgStyle}></div>
            </div>
        )
    }

}