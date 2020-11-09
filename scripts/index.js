Sortable.create(simpleList, {});

const getSimpleList = document.getElementById("simpleList");

const input = document.getElementById('inputTask');

let todayTasks = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

localStorage.setItem('items', JSON.stringify(todayTasks));

const data = JSON.parse(localStorage.getItem('items'));

var tomorrowTasks = [];
var finishedTasks = [];
var skippedTasks = [];

const liMaker = text => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'alert', 'fade', 'show');
  li.textContent = text;
  getSimpleList.appendChild(li);
}

data.forEach(item => {
  liMaker(item)
})

var addMoreButton = document.getElementById("add-more");
var mainButtons = document.getElementById("main-buttons");
var ribbitText = document.getElementById("ribbit");

const addScreen = document.getElementById("add-section");
const orderScreen = document.getElementById("order-section");
const doScreen = document.getElementById("do-section");
const settingsPage = document.getElementById("settings");
const devMode = document.getElementById("dev-mode");
const darkMode = document.getElementById("dark-mode");

//localStorage.setItem('dev', devMode.checked);

const progBar = document.getElementById("progress-bar");

const progCalc = () => {
  return Math.trunc(((finishedTasks.length + skippedTasks.length) / (todayTasks.length + finishedTasks.length + skippedTasks.length) * 100));
}

function randPlaceholder() {
  const arrPlaceholder = ['If you can imagine it, you can do it.', `Don't forget to write all the boring chores too.`, `What is important to do right now?`,
    `What can't wait until tomorrow?`, `Your limitation — it’s only your imagination.`, `Push yourself, because no one else is going to do it for you.`, `Sometimes later becomes never. Do it now.`,
    `Great things never come from comfort zones.`, `Dream it. Wish it. Do it.`, `Success doesn’t just find you. You have to go out and get it.`,
    `Dream bigger. Do bigger.`,
    `Don’t stop when you’re tired. Stop when you’re done.`, `Wake up with determination. Go to bed with satisfaction.`, `Do something today that your future self will thank you for.`,
    `It’s going to be hard, but hard does not mean impossible.`, `Don’t wait for opportunity. Create it.`,
    `The key to success is to focus on goals, not obstacles.`, `If you gotta eat a frog, best to do it first thing in the morning.`]

  var randNo = Math.floor(Math.random() * arrPlaceholder.length);
  input.placeholder = arrPlaceholder[randNo];
}

randPlaceholder();

document.getElementById("done-button").addEventListener("click", function () {
  progBar.style = `width: ${progCalc()}%`;
  if (todayTasks.length > 0) {
    progBar.innerHTML = `${todayTasks.length} to go`;
    if (todayTasks.length == 1) {
      document.title = `${todayTasks.length} task left | Ribbit.`;
    } else {
      document.title = `${todayTasks.length} tasks left | Ribbit.`;
    }
  }
  else {
    progBar.innerHTML = `Everything complete!`;
    document.title = `Everything complete! | Ribbit.`;
  }
});

document.getElementById("skip-button").addEventListener("click", function () {
  progBar.style = `width: ${progCalc()}%`;
  if (todayTasks.length > 0) {
    progBar.innerHTML = `${todayTasks.length} to go`;

    if (todayTasks.length == 1) {
      document.title = `${todayTasks.length} task left | Ribbit.`;
    } else {
      document.title = `${todayTasks.length} tasks left`;
    }
  }
  else {
    progBar.innerHTML = `Everything complete!`;
    document.title = `Everything complete! | Ribbit.`;
  }
})

function logResults() {
  console.log(`Today's tasks: ${todayTasks}\nFinished tasks: ${finishedTasks}\nSkipped tasks: ${skippedTasks}`);
}

window.onload = function () {
  document.getElementById("inputTask").focus();
};

function saveSettings() {
  if (todayTasks.length !== 0) {
    changeScreen('do')
  }
  else {
    changeScreen('add')
  }

  localStorage.setItem('pomodoro', JSON.stringify([pomodoroActive, +pomodoroTime.value, +shortBreakTime.value, +longBreakTime.value]));
}

function addTask() {
  let getTask = document.getElementById("inputTask").value;

  if (getTask !== '') {
    todayTasks.push(input.value)
    localStorage.setItem('items', JSON.stringify(todayTasks))
    liMaker(input.value)
    input.value = '';
    progBar.innerHTML = `${todayTasks.length} to go`;
    if (todayTasks.length == 1) {
      document.title = `${todayTasks.length} task left | Ribbit.`;
    } else {
      document.title = `${todayTasks.length} tasks left | Ribbit.`;
    }

    document.getElementById("addUpdate").innerHTML = `"${getTask}" has been added!`;
    setTimeout(function () {
      document.getElementById("addUpdate").innerHTML = "";
    }, 2000);
    randPlaceholder();
  }
  else {
    document.getElementById("addUpdate").innerHTML = "Please type something";
  }
  logResults();
  document.getElementById("inputTask").focus();
}

function addAndReset() {
  todayTasks = [];
  finishedTasks = [];
  skippedTasks = [];
  addDiv();
  //clearStorage(); // backup

  var results = document.getElementById("results")
  results.style.display = "none";
  randPlaceholder();
}

function finishAddTask() {
  if (getSimpleList.childElementCount >= 1) {
    if (devMode.checked === true) {
    }
    else {
      changeScreen('order');
    }
  }
  else {
    document.getElementById("addUpdate").innerHTML = "Please add something";
  }
}

function doTasks() {
  if (getSimpleList.children.length >= 1) {
    var focusTask = getSimpleList.firstElementChild.innerHTML;
    document.getElementById("focusTask").innerHTML = focusTask;

    if (devMode.checked === true) {
    }
    else {
      changeScreen('do');
    }
  }
  else {
    document.getElementById("inspireText").innerHTML = "Nice! You finished everything for today!";
  }
}

function finishedTask() {

  if (getSimpleList.children.length > 1) {
    finishedTasks.push(document.getElementById("focusTask").innerHTML);
    getSimpleList.removeChild(getSimpleList.firstElementChild);
    todayTasks.shift();
    doTasks();
    localStorage.setItem('items', JSON.stringify(todayTasks));
    doneInspireText();
    logResults();
  }

  else if (getSimpleList.children.length === 1) {
    doTasks();
    finishedTasks.push(document.getElementById("focusTask").innerHTML);
    getSimpleList.removeChild(getSimpleList.firstElementChild);
    todayTasks.shift();
    localStorage.setItem('items', JSON.stringify(todayTasks));
    document.getElementById("focusTask").innerHTML = "";
    document.getElementById("inspireText").innerHTML = "Nice! You finished everything for today!";

    var results = document.getElementById("results")
    addMoreButton.style.display = "inline-block";
    mainButtons.style.display = "none";
    results.style.display = "block";
    var completedResults = document.getElementById("completed-tasks");
    var skippedResults = document.getElementById("skipped-tasks");

    completedResults.innerHTML = `Completed: ${finishedTasks.length}`;
    skippedResults.innerHTML = `Skipped: ${skippedTasks.length}`;
  }
  else {
    console.log('Error');
  }
}

function skipTask() {
  var lastTask = getSimpleList.children.length;

  if (lastTask === 1) {
    skippedTasks.push(focusTask.innerHTML);
    getSimpleList.removeChild(getSimpleList.firstElementChild);

    document.getElementById("focusTask").innerHTML = "";
    document.getElementById("inspireText").innerHTML = "Nice! You finished everything for today!";

    addMoreButton.style.display = "inline-block";
    mainButtons.style.display = "none";

    var results = document.getElementById("results")
    results.style.display = "block";
    var completedResults = document.getElementById("completed-tasks");
    var skippedResults = document.getElementById("skipped-tasks");

    completedResults.innerHTML = `Completed: ${finishedTasks.length}`;
    skippedResults.innerHTML = `Skipped: ${skippedTasks.length}`;
  }

  else {
    skippedTasks.push(focusTask.innerHTML);
    getSimpleList.removeChild(getSimpleList.firstElementChild);
    doTasks();
  }
  logResults();
  todayTasks.shift();
}

function addDiv() {
  if (devMode.checked === true) {
  }
  else {
    changeScreen('add');
  }
  document.getElementById("addUpdate").innerHTML = "";
  addMoreButton.style.display = "none";
  mainButtons.style.display = "inline-block";
  document.getElementById("inspireText").innerHTML = "Let's go.";
  document.getElementById("inputTask").focus();
  progBar.style = `width: 0%;`;
  progBar.innerHTML = `Add tasks to get started`;
}

function doneInspireText(DoNo) {
  var DoNo = Math.floor(Math.random() * 5);
  console.log(DoNo);

  if (DoNo === 0) {
    document.getElementById("inspireText").innerHTML = "Great! Now try this one!";
  }
  else if (DoNo === 1) {
    document.getElementById("inspireText").innerHTML = "Keep it up! Now this one.";
  }
  else if (DoNo === 2) {
    document.getElementById("inspireText").innerHTML = "You're on a roll";
  }
  else if (DoNo === 3) {
    document.getElementById("inspireText").innerHTML = "Doing great so far!";
  }
  else if (DoNo === 4) {
    document.getElementById("inspireText").innerHTML = "That was easy wasn't it?";
  }
  else {
    document.getElementById("inspireText").innerHTML = "Error";
  }
}

function skipInspireText() {
  var skipNo = Math.floor(Math.random() * 5);
  console.log(skipNo);

  if (skipNo === 0) {
    document.getElementById("inspireText").innerHTML = "No worries! Try this one instead.";
  }
  else if (skipNo === 1) {
    document.getElementById("inspireText").innerHTML = "We can come back to that one. Have a go at this one.";
  }
  else if (skipNo === 2) {
    document.getElementById("inspireText").innerHTML = "What about this one?";
  }
  else if (skipNo === 3) {
    document.getElementById("inspireText").innerHTML = "We've got the whole day ahead of us. This seems easy.";
  }
  else if (skipNo === 4) {
    document.getElementById("inspireText").innerHTML = "This one isn't too difficult.";
  }
  else {
    document.getElementById("inspireText").innerHTML = "Error";
  }
}

// Enter key
document.getElementById("inputTask")
  .addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById("add-button").click();
    }
  });

function changeScreen(div) {
  if (div === 'add') {
    addScreen.style.display = "block";
    orderScreen.style.display = "none";
    doScreen.style.display = "none";
    settingsPage.style.display = "none";
  }

  else if (div === 'order') {

    if (devMode.checked === true) {
    }
    else {
      addScreen.style.display = "none";
      orderScreen.style.display = "block";
      doScreen.style.display = "none";
      settingsPage.style.display = "none";
    }
  }

  else if (div === 'do') {
    addScreen.style.display = "none";
    orderScreen.style.display = "none";
    doScreen.style.display = "block";
    settingsPage.style.display = "none";
  }

  else if (div === 'dev') {
    addScreen.style.display = "block";
    orderScreen.style.display = "block";
    doScreen.style.display = "block";
    settingsPage.style.display = "none";
  }

  else if (div === 'settings') {
    addScreen.style.display = "none";
    orderScreen.style.display = "none";
    doScreen.style.display = "none";
    settingsPage.style.display = "block";
    document.getElementById('navbarNav').className = 'navbar-collapse collapse'
  }
}

if (localStorage.getItem('items') !== '[]') {
  doTasks();
  document.getElementById("inspireText").innerHTML = "Welcome back. Let's do this!";
  progBar.style = `width: ${progCalc()}%`;
  progBar.innerHTML = `${todayTasks.length} to go`;
  if (todayTasks.length == 1) {
    document.title = `${todayTasks.length} task left | Ribbit.`;
  } else {
    document.title = `${todayTasks.length} tasks left | Ribbit.`;
  }
}
else {
  changeScreen('add');
}

function clearStorage() {
  localStorage.clear();
  document.getElementById('clearText').innerHTML = 'Please refresh the page to see changes';
}

const pomodoroContainer = document.getElementById('pomodoro-container')
const pomodoroLink = document.getElementById('pomodoro-link')
const pomodoroTime = document.getElementById("pomodoro-input");
const shortBreakTime = document.getElementById("short-break-input");
const longBreakTime = document.getElementById("long-break-input");
const countdown = document.getElementById("countdown");
var pomodoroActive;

var counter = 0;
var minutes = 0;
var seconds = 0;
var interval;
var paused;

let pomodoroParsed = localStorage.getItem('pomodoro') ? JSON.parse(localStorage.getItem('pomodoro')) : [];

pomodoroParsed[1] ? pomodoroTime.value = pomodoroParsed[1] : pomodoroTime.value = 25;
pomodoroParsed[2] ? shortBreakTime.value = pomodoroParsed[2] : shortBreakTime.value = 5;
pomodoroParsed[3] ? longBreakTime.value = pomodoroParsed[3] : longBreakTime.value = 15;

function pomodoro() {
  if (counter < 3) {
    if (paused === true) {
      console.log("timer unpaused")
      paused = false;
    }
    else {
      counter += 1;
      console.log(counter)
      console.log("pomodoro")
      seconds = pomodoroTime.value * 60 || 0;
    }

    interval = setInterval(function () {
      seconds--;
      countdown.innerText = `${(minutes = Math.floor(seconds / 60))}:${seconds -
        minutes * 60}`;
      if (!seconds) {
        clearInterval(interval);
        shortBreak()
      }
    }, 1000);
  }

  else {
    counter += 1;
    console.log(counter)
    console.log("pomodoro")
    seconds = pomodoroTime.value * 60 || 0;
    interval = setInterval(function () {
      seconds--;
      countdown.innerText = `${(minutes = Math.floor(seconds / 60))}:${seconds -
        minutes * 60}`;
      if (!seconds) {
        clearInterval(interval);
        longBreak()
      }
    }, 1000);
  }
}

function shortBreak() {
  console.log("short break")
  seconds = shortBreakTime.value * 60 || 0;
  interval = setInterval(function () {
    seconds--;
    countdown.innerText = `${(minutes = Math.floor(seconds / 60))}:${seconds -
      minutes * 60}`;
    if (!seconds) {
      clearInterval(interval);
      pomodoro();
    }
  }, 1000);
}

function longBreak() {
  console.log("long break")
  seconds = longBreakTime.value * 60 || 0;
  interval = setInterval(function () {
    seconds--;
    countdown.innerText = `${(minutes = Math.floor(seconds / 60))}:${seconds -
      minutes * 60}`;
    if (!seconds) {
      clearInterval(interval);
      counter = 0;
      pomodoro();
    }
  }, 1000);
}

function pauseTimer() {
  if (!paused) {
    console.log('timer paused')
    paused = true;
    clearInterval(interval);
  } else {
    console.log('already paused!')
  }
}

function resetTimer() {
  console.log('timer reset')
  clearInterval(interval);
  updateSettings();
  paused = false;
  counter = 0;
}

function updateSettings() {
  if (!Number.isInteger(+pomodoroTime.value) || !Number.isInteger(+shortBreakTime.value) || !Number.isInteger(+longBreakTime.value)) {
    window.alert("please enter an integer")
  } else {
    countdown.innerText = `${pomodoroTime.value}:00`;
  }
  counter = 0;
  clearInterval(interval);
}

function resetSettings() {
  pomodoroTime.value = 25;
  shortBreakTime.value = 5;
  longBreakTime.value = 10;
  counter = 0;
  resetTimer();
}

if (pomodoroParsed[0]) {
  pomodoroContainer.style.display = "block";
  pomodoroLink.innerHTML = 'Pomodoro: On';
  pomodoroActive = true;
} else {
  pomodoroContainer.style.display = "none";
  pomodoroLink.innerHTML = 'Pomodoro: Off';
  pomodoroActive = false;
}

function openPomodoro() {
  if (pomodoroContainer.style.display === "block") {
    pomodoroActive = false;
    pomodoroContainer.style.display = "none";
    pomodoroLink.innerHTML = 'Pomodoro: Off';
  } else {
    pomodoroActive = true;
    pomodoroContainer.style.display = "block";
    pomodoroLink.innerHTML = 'Pomodoro: On';
  }
  document.getElementById('navbarNav').className = 'navbar-collapse collapse'
  localStorage.setItem('pomodoro', JSON.stringify([pomodoroActive, +pomodoroTime.value, +shortBreakTime.value, +longBreakTime.value]));
  pomodoroParsed = JSON.parse(localStorage.getItem('pomodoro'));
}

var elem = document.querySelector('.draggable');
var draggie = new Draggabilly(elem, {
  // options...
});

countdown.innerText = `${pomodoroParsed[1] ? countdown.innerHTML = pomodoroParsed[1] : 25}:00`;