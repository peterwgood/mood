const moodChart = document.getElementById('moodChart');
const foodLog = document.getElementById('foodLog');
const goodFoodButtons = document.getElementById('goodFoodButtons');
const badFoodButtons = document.getElementById('badFoodButtons');

const goodFoods = ['Banana', 'Beans', 'Water', 'Coffee', 'Nuts', 'Chicken', 'Steak','Pork', 'Good Sleep', 'Sunlight', 'Run', 'Productive', 'Social', 'Paw', 'Fun Todo', 'Weightloss', 'Walk', 'Nap', 'Beer', 'Insight', 'Flow', 'Sec', 'Challenged', 'Lawn', 'Full', 'Tabasco', 'Clean'];
const badFoods = ['Chocolate', 'Soda', 'Fast food', 'Bad Sleep', 'Hungry', 'Conflict', 'Work-Stress', 'No Social', 'Thirsty', 'Sick', 'Hangover', 'Wan', 'Unchallenged', 'Sitting', 'TV', 'Missed Coffee'];

// Create buttons for each food item
goodFoods.forEach(food => createButton(food, 'good', goodFoodButtons));
badFoods.forEach(food => createButton(food, 'bad', badFoodButtons));

// Load food log from local storage (if available)
const savedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
savedLog.forEach(entry => addToLog(entry.food, entry.mood, false));
updateMoodColor(); // New: Update the mood chart color after loading the food log

function createButton(food, mood, container) {
  const button = document.createElement('button');
  button.textContent = food;
  button.className = 'btn btn-primary m-1'; // Add Bootstrap classes
  button.addEventListener('click', () => addFoodEntry(food, mood));
  container.appendChild(button);
}

function updateMoodColor() {
    const totalGood = countFoods(goodFoods);
    const totalBad = countFoods(badFoods);
    const averageColor = calculateAverageColor(totalGood, totalBad);
    moodChart.style.backgroundColor = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
}

function countFoods(foodArray) {
    const foodEntries = Array.from(foodLog.querySelectorAll('li'));
    let count = 0;
    foodArray.forEach(food => {
        foodEntries.forEach(entry => {
            if (entry.textContent.includes(food)) {
                count++;
            }
        });
    });
    return count;
}

function calculateAverageColor(totalGood, totalBad) {
    const goodColor = { r: 0, g: 255, b: 0 }; // Green
    const badColor = { r: 255, g: 0, b: 0 }; // Red

    const averageColor = {
        r: Math.round((goodColor.r * totalGood + badColor.r * totalBad) / (totalGood + totalBad)),
        g: Math.round((goodColor.g * totalGood + badColor.g * totalBad) / (totalGood + totalBad)),
        b: Math.round((goodColor.b * totalGood + badColor.b * totalBad) / (totalGood + totalBad)),
    };

    return averageColor;
}

function addToLog(food, mood, save = true) {
    const li = document.createElement('li');
    li.textContent = `${food} (${mood})`;
    li.className = 'list-group-item d-flex justify-content-between align-items-center'; // Add Bootstrap classes

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm'; // Add Bootstrap classes
    deleteButton.addEventListener('click', () => deleteLogEntry(li, food, mood));
    li.appendChild(deleteButton);

    foodLog.appendChild(li);
    if (save) {
        saveToLocalStorage(food, mood);
    }
}

function addFoodEntry(food, mood) {
    if (goodFoods.includes(food)) {
        addToLog(food, 'Pos');
        updateMoodColor(); // Update the mood chart color
    } else if (badFoods.includes(food)) {
        addToLog(food, 'Neg');
        updateMoodColor(); // Update the mood chart color
    } else {
        alert('Please enter a valid food item (good or bad).');
    }
}

function deleteLogEntry(li, food, mood) {
    foodLog.removeChild(li);
    removeFromLocalStorage(food, mood);
    updateMoodColor(); // Update color after deletion
}

function saveToLocalStorage(food, mood) {
    const existingLog = JSON.parse(localStorage.getItem('foodLog')) || [];
    existingLog.push({ food, mood });
    localStorage.setItem('foodLog', JSON.stringify(existingLog));
}

function removeFromLocalStorage(food, mood) {
    const existingLog = JSON.parse(localStorage.getItem('foodLog')) || [];
    const updatedLog = existingLog.filter(entry => !(entry.food === food && entry.mood === mood));
    localStorage.setItem('foodLog', JSON.stringify(updatedLog));
}
