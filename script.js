const moodChart = document.getElementById('moodChart');
const foodLog = document.getElementById('foodLog');
const goodFoodButtons = document.getElementById('goodFoodButtons');
const badFoodButtons = document.getElementById('badFoodButtons');

const goodFoods = [
 'Good Sleep', 'Nap', 'Coffee', 'Water/Gatorade', 'Beans', 'Bananas', 'Apples', 'Yogurt', 'Advocado', 'Eggs', 'Pickles', 'Nuts', 'Sunlight', 'Beer', 'Sec', 'Protein'
];

const badFoods = [
   'Bad Sleep', 'Hungry', 'Dyhydrated', 'Sick', 'Hangover', 'Coffeeless', 'Lack of Protein'
];

let goodCount = 0;
let badCount = 0;

const chart = new Chart(moodChart, {
  type: 'pie',
  data: {
    labels: ['Good', 'Bad'],
    datasets: [{
      data: [goodCount, badCount],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

goodFoods.forEach(food => createButton(food, 'good', goodFoodButtons));
badFoods.forEach(food => createButton(food, 'bad', badFoodButtons));

const savedLog = JSON.parse(localStorage.getItem('foodLog')) || [];
savedLog.forEach(entry => {
  addToLog(entry.food, entry.mood, false);
  if (entry.mood === 'Pos') {
    goodCount++;
  } else if (entry.mood === 'Neg') {
    badCount++;
  }
});
updateMoodChart();

function createButton(food, mood, container) {
  const button = document.createElement('button');
  button.textContent = food;
  button.className = 'btn m-1';
  button.classList.add(mood === 'good' ? 'btn-outline-success' : 'btn-outline-danger');
  button.addEventListener('click', () => addFoodEntry(food, mood));
  container.appendChild(button);
}

function updateMoodChart() {
  chart.data.datasets[0].data = [goodCount, badCount];
  chart.update();
}

function addToLog(food, mood, save = true) {
  const li = document.createElement('li');
  li.textContent = `${food} (${mood})`;
  li.className = 'list-group-item d-flex justify-content-between align-items-center';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'btn btn-danger btn-sm';
  deleteButton.addEventListener('click', () => deleteLogEntry(li, food, mood));
  li.appendChild(deleteButton);

  foodLog.appendChild(li);
  if (save) {
    saveToLocalStorage(food, mood);
  }
}

function addFoodEntry(food, mood) {
  if (goodFoods.includes(food)) {
    goodCount++;
  } else if (badFoods.includes(food)) {
    badCount++;
  }
  addToLog(food, mood);
  updateMoodChart();
}

function deleteLogEntry(li, food, mood) {
  foodLog.removeChild(li);
  if (mood === 'good') {
    goodCount--;
  } else if (mood === 'bad') {
    badCount--;
  }
  removeFromLocalStorage(food, mood);
  updateMoodChart();
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
