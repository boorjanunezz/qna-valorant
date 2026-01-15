// Base de conocimiento cargada desde el JSON
let knowledgeBase = [];

// Cargar preguntas y respuestas una sola vez
fetch("https://boorjanunezz.github.io/qna-valorant/qa.json")
  .then(response => response.json())
  .then(data => {
    knowledgeBase = data;
  })
  .catch(() => {
    showAnswer("Error al cargar la base de conocimiento.");
  });

/**
 * Normaliza el texto:
 * - minúsculas
 * - sin tildes
 * - sin signos raros
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "");
}

/**
 * Maneja la pregunta del usuario
 */
function askQuestion() {
  const input = document.getElementById("questionInput");
  const userQuestion = normalize(input.value);

  if (!userQuestion.trim()) {
    showAnswer("Escribe una pregunta sobre Valorant.");
    return;
  }

  let bestMatch = null;
  let highestScore = 0;

  // Comparar la pregunta con toda la base de conocimiento
  knowledgeBase.forEach(item => {
    const storedQuestion = normalize(item.question);
    let score = 0;

    userQuestion.split(" ").forEach(word => {
      if (storedQuestion.includes(word)) {
        score++;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  });

  // Mostrar resultado
  if (bestMatch && highestScore > 0) {
    showAnswer(bestMatch.answer);
  } else {
    showAnswer("No he encontrado una respuesta para esa pregunta.");
  }
}

/**
 * Muestra la respuesta con animación
 */
function showAnswer(text) {
  const answerBox = document.getElementById("answerBox");

  answerBox.textContent = text;
  answerBox.classList.remove("hidden");
  answerBox.classList.remove("show");

  // Forzar repaint para que la animación se reinicie
  void answerBox.offsetWidth;

  answerBox.classList.add("show");
}

// Evento del botón
document.getElementById("askBtn").addEventListener("click", askQuestion);

// Permitir enviar con Enter
document.getElementById("questionInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    askQuestion();
  }
});

