Sortable.create(simpleList, {});

const getSimpleList = document.getElementById("simpleList");

const input = document.getElementById('inputTask');

let todayTasks = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
//let getDev = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

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

document.getElementById("done-button").addEventListener("click", function () {
  progBar.style = `width: ${progCalc()}%`;
  if (todayTasks.length > 0) {
    progBar.innerHTML = `${todayTasks.length} to go`;
  }
  else {
    progBar.innerHTML = `Everything complete!`;
  }
});

document.getElementById("skip-button").addEventListener("click", function () {
  progBar.style = `width: ${progCalc()}%`;
  if (todayTasks.length > 0) {
    progBar.innerHTML = `${todayTasks.length} to go`;
  }
  else {
    progBar.innerHTML = `Everything complete!`;
  }
})

function logResults() {
  console.log(`Today's tasks: ${todayTasks}\nFinished tasks: ${finishedTasks}\nSkipped tasks: ${skippedTasks}`);
}

window.onload = function () {
  document.getElementById("inputTask").focus();
};

function saveSettings() {
  if (devMode.checked === true) {
    changeScreen('dev');
    console.log('Dev Mode On');
  }
  else {
    changeScreen('add');
    console.log('Dev Mode Off');
  }
  if (darkMode.checked === true){
  }
  else{
  }
}

function addTask() {
  let getTask = document.getElementById("inputTask").value;

  if (getTask !== '') {
    todayTasks.push(input.value)
    localStorage.setItem('items', JSON.stringify(todayTasks))
    liMaker(input.value)
    input.value = '';
    progBar.innerHTML = `${todayTasks.length} to go`;

    document.getElementById("addUpdate").innerHTML = `"${getTask}" has been added!`;
    setTimeout(function () {
      document.getElementById("addUpdate").innerHTML = "";
    }, 2000);
  }
  else {
    document.getElementById("addUpdate").innerHTML = "Please type something";
  }
  logResults();
}

function addAndReset() {
  todayTasks = [];
  finishedTasks = [];
  skippedTasks = [];
  addDiv();
  clearStorage()

  var results = document.getElementById("results")
  results.style.display = "none";
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
    doneInspireText();
    logResults();
  }

  else if (getSimpleList.children.length === 1) {
    doTasks();
    finishedTasks.push(document.getElementById("focusTask").innerHTML);
    getSimpleList.removeChild(getSimpleList.firstElementChild);
    todayTasks.shift();

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

/*
function ribbit() {
  ribbitText.innerHTML = "ribbit! Time to get stuff done!";
  setTimeout(function () {
    ribbitText.innerHTML = "";
  }, 3000);
}*/

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
  }
}

if (localStorage.getItem('items') !== '[]') {
  doTasks();
  document.getElementById("inspireText").innerHTML = "Welcome back. Let's do this!";
  progBar.style = `width: ${progCalc()}%`;
  progBar.innerHTML = `${todayTasks.length} to go`;
}
else {
  changeScreen('add');
}

function clearStorage() {
  localStorage.clear();
  document.getElementById('clearText').innerHTML = 'Please refresh the page to see changes';
}