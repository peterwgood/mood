const foodInput = document.getElementById('foodInput');
const moodChart = document.getElementById('moodChart');
const foodLog = document.getElementById('foodLog');
const submitButton = document.getElementById('submitButton');




const goodFoods = [
  // Fruits
  'banana',
  // Legumes
  'beans',
  // Hydration
  'water', 'coffee',
  // Nuts & Proteins
  'nuts', 'chicken', 'steak','pork',
  // Positive Habits
  'good sleep', 'sunlight', 'run', 'productive',
  // Social & Emotional Well-being
  'social', 'paw', 'Fun todo', 'weightloss', 'looking forward', 'nap', 'beer', 'insight', 'flow', 'sec', 'challenged', 'run',
  // Other
  'full', 'tabasco'
];

const badFoods = [
  // Unhealthy Foods
  'chocolate', 'soda', 'fast food',
  // Negative Habits
  'bad sleep', 'hungry', 'conflict', 'workstress', 'no social', 'thirsty', 'sick', 'hangover', 'wan', 'unchallenged', 'sitting',
  // Other
  'TV'
];









// Load food log from local storage (if available)
const savedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
savedLog.forEach(entry => addToLog(entry.food, entry.mood, false));
updateMoodColor(); // New: Update the mood chart color after loading the food log

submitButton.addEventListener('click', addFoodEntry);
foodInput.addEventListener('keydown', addFoodEntry); // New: Add event listener for the Enter key

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

function addFoodEntry(event) {
    // Check if the event was triggered by a key press
    if (event && event.type === 'keydown') {
        // If the key pressed was not Enter, do nothing
        if (event.key !== 'Enter') {
            return;
        }
        // Prevent the default action of the Enter key
        event.preventDefault();
    }

    const food = foodInput.value.toLowerCase();
    if (food) {
        if (goodFoods.includes(food)) {
            addToLog(food, 'good');
            foodInput.value = ''; // Clear input field
            updateMoodColor(); // Update the mood chart color
        } else if (badFoods.includes(food)) {
            addToLog(food, 'bad');
            foodInput.value = ''; // Clear input field
            updateMoodColor(); // Update the mood chart color
        } else {
            alert('Please enter a valid food item (good or bad).');
        }
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
