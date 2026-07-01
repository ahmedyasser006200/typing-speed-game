// DOM Elements
let startButton = document.querySelector(".start");
let selectedLvl = document.querySelector(".message .lvl select");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let instructions = document.querySelector(".instructions");

// Prevent users from cheating by pasting the word
input.onpaste = function () {
  return false;
};

// Words For Each Difficulty Level
const easyWords = [
  "Cat",
  "Dog",
  "Book",
  "Pen",
  "Milk",
  "Ball",
  "Fish",
  "Tree",
  "Door",
  "Car",
  "Sun",
  "Moon",
  "Food",
  "Game",
  "Rain",
];
const normalWords = [
  "Computer",
  "Keyboard",
  "Monitor",
  "Internet",
  "JavaScript",
  "Function",
  "Variable",
  "Browser",
  "Document",
  "Programming",
  "Developer",
  "Practice",
  "Challenge",
  "Testing",
  "Storage",
];
const hardWords = [
  "Destructuring",
  "Asynchronous",
  "Encapsulation",
  "Implementation",
  "Authentication",
  "Microservices",
  "Responsibility",
  "Cryptography",
  "Documentation",
  "Initialization",
  "Interoperability",
  "Accessibility",
  "Configuration",
  "Multithreading",
  "Infrastructure",
];

// Time allowed for each difficulty
const lvls = {
  Easy: 5,
  Normal: 3,
  Hard: 2,
};

// Words grouped by difficulty
const levelsWords = {
  Easy: easyWords,
  Normal: normalWords,
  Hard: hardWords,
};

// Description shown in the instructions section
const levelsDescription = {
  Easy: "Simple words",
  Normal: "Medium words",
  Hard: "Advanced words",
};

// Game State
let words = [];
let defaultLevelSeconds;

// Update game data whenever the player changes the level
selectedLvl.addEventListener("change", function () {
  updateLevel();
});

// Update Selected Level
function updateLevel() {
  words = [...levelsWords[selectedLvl.value]];
  defaultLevelSeconds = lvls[selectedLvl.value];
  secondsSpan.innerHTML = defaultLevelSeconds;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
  scoreTotal.innerHTML = words.length;
}

// Start Game
startButton.addEventListener("click", function () {
  finishMessage.innerHTML = "";
  // Prevent starting the game without selecting a level
  if (selectedLvl.value === "") {
    showMessage("error", "Select Level");
  } else {
    this.remove();
    instructions.remove();
    input.focus();
    genWords();
  }
});

// Generate Random Word
function genWords() {
  let randomWord = words[Math.floor(Math.random() * words.length)];
  let wordIndex = words.indexOf(randomWord);
  words.splice(wordIndex, 1);
  theWord.innerHTML = randomWord;
  upcomingWords.innerHTML = "";
  generateWords();
  startPlay();
}

// Render Upcoming Words
function generateWords() {
  for (let i = 0; i < words.length; i++) {
    let div = document.createElement("div");
    let txt = document.createTextNode(words[i]);
    div.appendChild(txt);
    upcomingWords.appendChild(div);
  }
}

// Main Game Loop
function startPlay() {
  let time = defaultLevelSeconds;
  // Give the player 3 bonus seconds for the first word only
  if (words.length === levelsWords[selectedLvl.value].length - 1) {
    time += 3;
  }
  timeLeftSpan.innerHTML = time;
  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;
    if (timeLeftSpan.innerHTML === "0") {
      clearInterval(start);
      if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        input.value = "";
        scoreGot.innerHTML++;
        if (words.length > 0) {
          genWords();
        } else {
          showMessage("good", "Congratulations");
          upcomingWords.remove();
          saveScore();
        }
      } else {
        showMessage("bad", "Game Over");
        saveScore();
      }
    }
  }, 1000);
}

// Save Score To Local Storage
function saveScore() {
  let gameData = {
    score: scoreGot.textContent,
    total: scoreTotal.textContent,
    date: new Date(),
  };
  localStorage.setItem("gameData", JSON.stringify(gameData));
}

// Generate Instructions
function createInstructions() {
  for (let level in lvls) {
    let div = document.createElement("div");
    div.className = "instruction";
    div.textContent = `${level} => ${lvls[level]} Seconds | ${levelsDescription[level]}`;
    instructions.appendChild(div);
  }
}
createInstructions();

// Display Feedback Messages
function showMessage(className, message) {
  finishMessage.style.padding = "15px";
  let span = document.createElement("span");
  span.className = className;
  span.textContent = message;
  finishMessage.appendChild(span);
}
