// JavaScript (script.js):
const foodInput = document.getElementById('foodInput');
const moodChart = document.getElementById('moodChart');
const foodLog = document.getElementById('foodLog');
const submitButton = document.getElementById('submitButton');

const goodFoods = ['banana', 'berries', 'leafy greens', 'nuts'];
const badFoods = ['chocolate', 'soda', 'fast food', 'processed snacks'];

// Load food log from local storage (if available)
const savedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
savedLog.forEach(entry => addToLog(entry.food, entry.mood));

submitButton.addEventListener('click', addFoodEntry);

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

function addToLog(food, mood) {
    const li = document.createElement('li');
    li.textContent = `${food} (${mood})`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteLogEntry(li, food, mood));
    li.appendChild(deleteButton);

    foodLog.appendChild(li);
    saveToLocalStorage(food, mood);
}

function addFoodEntry() {
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
