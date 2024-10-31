let player1Equation, player2Equation;
let player1Drawn, player2Drawn;
let player1Name, player2Name;

function startGame() {
  player1Name = document.getElementById("player1Name").value || "Player 1";
  player2Name = document.getElementById("player2Name").value || "Player 2";

  document.getElementById("player1Title").innerText = player1Name;
  document.getElementById("player2Title").innerText = player2Name;

  document.getElementById("nameEntry").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  player1Equation = generateComplexEquation();
  player2Equation = generateComplexEquation();

  displayEquations();
  drawNumbers();
}

function generateComplexEquation() {
  let operators = ['+', '-', '×', '÷'];
  let randomOperator = operators[Math.floor(Math.random() * operators.length)];

  // Generate more complex equations with multiple terms
  let leftSide = [getRandomTerm(), randomOperator, getRandomTerm(), randomOperator, "x"];
  let rightSide = [getRandomTerm(), randomOperator, getRandomTerm()];

  return {
    left: leftSide,
    right: rightSide
  };
}

function getRandomTerm() {
  return Math.floor(Math.random() * 10 + 1);
}

function displayEquations() {
  document.getElementById("p1Equation").innerText = formatEquation(player1Equation);
  document.getElementById("p2Equation").innerText = formatEquation(player2Equation);
}

function formatEquation(equation) {
  // Remove explicit multiplication symbol and simplify expressions
  let formattedLeft = equation.left.join(" ");
  formattedLeft = formattedLeft.replace("x *", "x");
  formattedLeft = simplifyExpression(formattedLeft);

  let formattedRight = equation.right.join(" ");
  formattedRight = formattedRight.replace("x *", "x");
  formattedRight = simplifyExpression(formattedRight);

  return formattedLeft + " = " + formattedRight;
}

function simplifyExpression(expression) {
  // Basic simplification rules (e.g., combining like terms)
  // ... (implementation of simplification rules)

  // For now, a simple approach can be to use regular expressions to identify patterns:
  const simplifiedExpression = expression.replace(/(\d+)x \+ (\d+)x/g, '($1 + $2)x');
  // ... (add more simplification rules as needed)

  return simplifiedExpression;
}

function drawNumbers() {
  player1Drawn = Math.floor(Math.random() * 10 + 1);
  player2Drawn = Math.floor(Math.random() * 10 + 1);
  document.getElementById("p1Drawn").innerText = player1Drawn;
  document.getElementById("p2Drawn").innerText = player2Drawn;
}

function applyOperation(player) {
  const operation = document.getElementById(player + "Operation").value;
  const drawnNumber = player === "player1" ? player1Drawn : player2Drawn;
  const equation = player === "player1" ? player1Equation : player2Equation;

  equation.left = equation.left.map(term => evaluateOperation(term, operation, drawnNumber));
  equation.right = equation.right.map(term => evaluateOperation(term, operation, drawnNumber));

  equation.left = simplifyEquationSide(equation.left);
  equation.right = simplifyEquationSide(equation.right);

  if (checkDecimalLimit(equation.left) || checkDecimalLimit(equation.right)) {
    document.getElementById("result").innerText = `${player === "player1" ? player2Name : player1Name} wins!`;
    document.getElementById("gameArea").style.display = "none";
    return;
  }

  document.getElementById(player + "ApplyBtn").classList.add("applied");

  displayEquations();
  checkSolution();
}

function evaluateOperation(term, operation, number) {
  if (typeof term === "number") {
    switch (operation) {
      case "+": return term + number;
      case "-": return term - number;
      case "*": return term * number;
      case "/": return term / number;
    }
  } else if (typeof term === "string") {
    if (term.includes("x")) {
      // Operations with terms involving 'x'
      switch (operation) {
        case "+": return term + " + " + number;
        case "-": return term + " - " + number;
        case "*": return term + " * " + number;
        case "/": return term + " / " + number;
      }
    } else if (term.includes("—")) { // Check for vinculum symbol
      // Operations with fractions
      const [numerator, denominator] = term.split("—");
      switch (operation) {
        case "+": return (parseFloat(numerator) + number) + "—" + denominator;
        case "-": return (parseFloat(numerator) - number) + "—" + denominator;
        case "*": return term + " × " + number;
        case "/": return term + " ÷ " + number;
      }
    } else {
      // Invalid term format
      return "Invalid term";
    }
  }
  return term;
}

function simplifyEquationSide(side) {
  const terms = side.filter(term => term !== "x");
  const xTerm = side.includes("x") ? ["x"] : [];
  const totalSum = terms.reduce((sum, term) => sum + term, 0);
  return totalSum ? [totalSum, ...xTerm] : xTerm;
}

function checkDecimalLimit(side) {
  return side.some(term => typeof term === "number" && term.toString().includes('.') && term.toString().split('.')[1].length > 2);
}

function checkSolution() {
  const p1Solved = player1Equation.left.length === 1 && player1Equation.left.includes("x");
  const p2Solved = player2Equation.left.length === 1 && player2Equation.left.includes("x");

  if (p1Solved || p2Solved) {
    const winner = p1Solved ? player1Name : player2Name;
    document.getElementById("result").innerText = `${winner} wins!`;
    document.getElementById("gameArea").style.display = "none";
  }
}

function nextTurn() {
  drawNumbers();

  document.getElementById("player1ApplyBtn").classList.remove("applied");
  document.getElementById("player2ApplyBtn").classList.remove("applied");

  displayEquations();
}
