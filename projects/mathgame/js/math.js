// Generate random exercise based on selected range and operator
function generateExercise() {
    const range = document.getElementById('rangeSelect').value;
    const operator = document.getElementById('operatorSelect').value;
    const [min, max] = range.split('-').map(Number);
    
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    let exercise = '';
    let correctAnswer = 0;

    switch(operator) {
        case '+':
            exercise = `${num1} + ${num2}`;
            correctAnswer = num1 + num2;
            break;
        case '-':
            exercise = `${num1} - ${num2}`;
            correctAnswer = num1 - num2;
            break;
        case '*':
            exercise = `${num1} × ${num2}`;
            correctAnswer = num1 * num2;
            break;
        case '/':
            // Ensure division results in a whole number
            num2 = num2 === 0 ? 1 : num2; // Avoid division by zero
            num1 = num1 * num2;
            exercise = `${num1} ÷ ${num2}`;
            correctAnswer = num1 / num2;
            break;
        case 'sqrt':
            exercise = `√${num1}`;
            correctAnswer = Math.sqrt(num1);
            break;
        case '%':
            exercise = `${num1} % ${num2}`;
            correctAnswer = num1 % num2;
            break;
    }

    return { exercise, correctAnswer };
}

// Display exercise in the container
function displayExercise() {
    const { exercise, correctAnswer } = generateExercise();
    const exerciseContainer = document.getElementById('exerciseResult');
    exerciseContainer.textContent = `${exercise} = `;
    return { exercise, correctAnswer };
}

// Check the user's answer
function checkAnswer(correctAnswer, userAnswer) {
    return Math.abs(userAnswer - correctAnswer) < 0.01;
}

// Add exercise to the table
function addExerciseToTable(exercise, correctAnswer, userAnswer, points) {
    const table = document.getElementById('exerciseTable');
    const row = table.insertRow(0);
    row.innerHTML = `
        <td>${points}</td>
        <td>${correctAnswer.toFixed(2)}</td>
        <td>${userAnswer}</td>
        <td>${exercise}</td>
    `;
}

// Main game logic
let currentExercise;

// Initialize the game and set up event listeners
function initGame() {
    currentExercise = displayExercise();

    const newExerciseBtn = document.getElementById('newExerciseBtn');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const answerInput = document.getElementById('userAnswer');

    newExerciseBtn.addEventListener('click', function() {
        currentExercise = displayExercise();
        answerInput.value = '';
    });

    checkAnswerBtn.addEventListener('click', function() {
        const userAnswer = parseFloat(answerInput.value);
        if (!isNaN(userAnswer)) {
            const isCorrect = checkAnswer(currentExercise.correctAnswer, userAnswer);
            const points = isCorrect ? 1 : 0;
            
            addExerciseToTable(currentExercise.exercise, currentExercise.correctAnswer, userAnswer, points);
            
            // Add animation class based on correct/incorrect answer
            checkAnswerBtn.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                checkAnswerBtn.classList.remove('correct-answer', 'incorrect-answer');
            }, 500);

            currentExercise = displayExercise();
            answerInput.value = '';
        } else {
            alert('אנא הכנס מספר תקין.');
        }
    });

    // Add event listener for Enter key on input
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswerBtn.click();
        }
    });
}

// Run initGame when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);