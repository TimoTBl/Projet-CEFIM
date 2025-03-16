/**
 * Fonction qui lance le quiz en masquant la section de bienvenue et en affichant la section du quiz.
 * Elle charge également la première question.
 */
function startQuiz() {
    // Masque la section de bienvenue
    document.querySelector('.quiz-description').style.display = 'none';

    // Affiche la section du quiz
    document.getElementById('quiz-section').style.display = 'block';
    document.querySelector('.quiz-container').style.display = 'flex';

    // Charge la première question
    loadQuestion(0);
}

// Variables globales pour suivre l'état du quiz
let currentQuestionIndex = 0; // Index de la question actuelle
let score = 0; // Score du joueur

// Liste des questions du quiz, avec les réponses et la/les réponse(s) correcte(s)
const questions = [
    {
        question: "Quel pays a remporté la Coupe du Monde de Football 2018 ?",
        answers: ["France", "Brésil", "Allemagne", "Espagne"],
        correctAnswer: "France"
    },
    {
        question: "Dans quel sport utilise-t-on un ballon ovale ?",
        answers: ["Football", "Rugby", "Handball", "Basketball"],
        correctAnswer: "Rugby"
    },
    {
        question: "Quel est le nom de la compétition annuelle entre les clubs européens de football ?",
        answers: ["La Ligue des champions de l'UEFA", "La Copa América", "La Ligue Europa", "La Ligue 1"],
        correctAnswer: "La Ligue des champions de l'UEFA"
    },
    {
        question: "Qui a remporté le dernier Tour de France (2024) ?",
        answers: ["Tadej Pogačar", "Jonas Vingegaard", "Chris Froome", "Egan Bernal"],
        correctAnswer: "Jonas Vingegaard"
    },
    {
        question: "Quel est le pays d’origine du sport du judo ?",
        answers: ["France", "Japon", "Brésil", "Corée du Sud"],
        correctAnswer: "Japon"
    },
    {
        question: "Dans quel sport les États-Unis ont-ils été particulièrement dominants aux Jeux Olympiques d’été ? (Plusieurs bonnes réponses)",
        answers: ["Football", "Basketball", "Athlétisme", "Natation"],
        correctAnswer: ["Basketball", "Athlétisme"] 
    },
    {
        question: "Qui détient le record du monde du 100 mètres chez les hommes ?",
        answers: ["Carl Lewis", "Usain Bolt", "Michael Johnson", "Tyson Gay"],
        correctAnswer: ["Usain Bolt"] 
    },
    {
        question: "Quels pays ont remporté la Coupe du Monde de Rugby à XV jusqu'en 2024 inclus ? (Plusieurs bonnes réponses)",
        answers: ["Nouvelle-Zélande", "Afrique du Sud", "France", "Australie"],
        correctAnswer: ["Nouvelle-Zélande", "Afrique du Sud", "Australie"]
    },
    {
        question: "Qui sont les trois meilleurs buteurs de l'histoire de la Ligue 1 ? (Plusieurs bonnes réponses)",
        answers: ["Thierry Henry", "Edinson Cavani", "Delio Onnis", "Jean-Pierre Papin"],
        correctAnswer: ["Edinson Cavani", "Delio Onnis", "Jean-Pierre Papin"]
    },
    {
        question: "Quel est le seul joueur à avoir remporté la Coupe du Monde de Cricket à la fois en tant que joueur et en tant que capitaine d'équipe ?",
        answers: ["Sachin Tendulkar", "Ricky Ponting", "Imran Khan", "Shane Warne"],
        correctAnswer: ["Imran Khan"]
    }
];


/**
 * Fonction qui charge la question actuelle en mettant à jour l'interface utilisateur.
 */
function loadQuestion(index) {
    const questionElement = document.getElementById('question'); // Élément pour afficher la question
    const answersElement = document.getElementById('answers'); // Élément pour afficher les réponses
    const resultMessage = document.getElementById('result-message'); // Élément pour afficher le message de résultat
    const validateButton = document.getElementById('validate-btn'); // Bouton pour valider la réponse
    const nextButton = document.getElementById('next'); // Bouton pour passer à la question suivante

    resultMessage.style.display = 'none'; // Cacher le message à chaque nouvelle question
    nextButton.disabled = true; // Désactiver "Suivant"
    validateButton.disabled = false; // Activer "Valider"

    const currentQuestion = questions[index]; // Récupérer la question actuelle
    questionElement.innerText = currentQuestion.question; // Afficher la question
    answersElement.innerHTML = ''; // Réinitialiser les anciennes réponses

    // Créer les boutons de réponse
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('answer');
        button.innerText = answer;
        button.onclick = () => toggleAnswerSelection(button); // Gérer la sélection de réponse
        answersElement.appendChild(button); // Ajouter le bouton à l'interface
    });

    startTimer(); // Lancer le minuteur pour la question actuelle
}


/**
 * Fonction qui gère la sélection et la désélection des réponses.
 */
function toggleAnswerSelection(button) {
    // Ajoute ou enlève la classe 'selected' du bouton pour indiquer qu'il a été sélectionné
    button.classList.toggle('selected');
}



/**
 * Fonction de validation de la réponse sélectionnée par l'utilisateur.
 * Elle vérifie si une réponse a été choisie, compare la réponse sélectionnée à la bonne réponse, 
 * et affiche un message en fonction de la réponse choisie.
 */
function validateAnswer() {
    clearInterval(timer); // Arrêter le timer

    const selectedAnswers = Array.from(document.querySelectorAll('.answer.selected')).map(button => button.innerText); // Récupérer les réponses sélectionnées
    const correctAnswer = questions[currentQuestionIndex].correctAnswer; // Récupérer la bonne réponse
    const resultMessage = document.getElementById('result-message'); // Élément pour afficher le message de résultat
    const validateButton = document.getElementById('validate-btn'); // Bouton de validation
    const nextButton = document.getElementById('next'); // Bouton "suivant"

    // Vérifier si l'utilisateur n'a rien sélectionné
    if (selectedAnswers.length === 0) {
        resultMessage.innerText = "⚠️ Veuillez choisir une réponse avant de valider.";
        resultMessage.className = 'result-message incorrect'; // Style pour mauvaise réponse
        resultMessage.style.display = 'block'; // Afficher le message
        return; // Stoppe la fonction ici si aucune réponse n'a été sélectionnée
    }

    // Vérification de la réponse
    let isCorrect = false;
    // Si la bonne réponse est une réponse multiples, vérifier que toutes les bonnes réponses sont sélectionnées
    if (Array.isArray(correctAnswer)) {
        isCorrect = correctAnswer.every(answer => selectedAnswers.includes(answer)) &&
                    selectedAnswers.every(answer => correctAnswer.includes(answer));
    } else {
        isCorrect = correctAnswer === selectedAnswers[0]; // Si la bonne réponse est une seule réponse
    }

    // Affichage du message en fonction de la réponse
    if (isCorrect) {
        resultMessage.innerText = "✅ Bonne réponse !";
        resultMessage.className = 'result-message correct'; // Style pour bonne réponse
        score++; // Augmenter le score si la réponse est correcte
    } else {
        resultMessage.innerText = `❌ Mauvaise réponse. La bonne réponse était : ${Array.isArray(correctAnswer) ? correctAnswer.join(", ") : correctAnswer}`;
        resultMessage.className = 'result-message incorrect'; // Style pour mauvaise réponse
    }

    resultMessage.style.display = 'block'; // Afficher le message de résultat

    // Désactiver le bouton "Valider" et activer "Suivant"
    validateButton.disabled = true;
    nextButton.disabled = false;

    // Désactiver les réponses après validation
    document.querySelectorAll('.answer').forEach(button => button.disabled = true);
}

/**
 * Fonction pour passer à la question suivante.
 * Si l'utilisateur n'a pas validé sa réponse, un message d'erreur s'affiche.
 * Si c'est la dernière question, le quiz est terminé et le score final est affiché.
 */
function nextQuestion() {
    const resultMessage = document.getElementById('result-message');
    const nextButton = document.getElementById('next');

    // Vérifier si le bouton "Valider" a été désactivé (ce qui signifie qu'il n'a pas été cliqué)
    if (nextButton.disabled === true) {
        resultMessage.innerText = "Veuillez valider votre réponse avant de passer à la question suivante.";
        resultMessage.className = 'result-message incorrect';
        resultMessage.style.display = 'block'; // Afficher le message d'erreur
        return; // Ne pas passer à la question suivante si le bouton "Valider" n'a pas été cliqué
    }

    // Passer à la question suivante
    currentQuestionIndex++;

    // Vérifier si c'est la dernière question
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex); // Charger la question suivante
    } else {
        endQuiz(); // Si c'est la dernière question, afficher le score final
    }
}

let timer;
let timeLeft = 20; // Temps en secondes

/**
 * Fonction qui démarre un minuteur pour chaque question et met à jour la barre de progression.
 * Si le temps est écoulé, elle appelle la fonction handleTimeout.
 */
function startTimer() {
    clearInterval(timer); // Réinitialiser le timer précédent
    timeLeft = 20;
    const progressBar = document.getElementById('progress-bar'); // Élément de la barre de progression
    progressBar.style.width = "100%"; // La barre commence pleine

    // Décrémenter le temps chaque seconde
    timer = setInterval(() => {
        timeLeft--;
        progressBar.style.width = (timeLeft / 20) * 100 + "%"; // Ajuster la largeur de la barre

        // Si le temps est écoulé
        if (timeLeft <= 0) {
            clearInterval(timer); // Arrêter le timer
            handleTimeout(); // Si le temps est écoulé, appeler la fonction handleTimeout
        }
    }, 1000);
}

/**
 * Fonction qui gère le cas où le temps est écoulé sans que l'utilisateur ait répondu.
 * Affiche un message d'erreur et désactive les réponses et le bouton "Valider".
 */
function handleTimeout() {
    const resultMessage = document.getElementById('result-message');
    resultMessage.innerText = "⏳ Réponse trop lente !";
    resultMessage.className = 'result-message incorrect';
    resultMessage.style.display = 'block';

    document.getElementById('validate-btn').disabled = true;
    document.getElementById('next').disabled = false;

    // Désactiver les réponses
    document.querySelectorAll('.answer').forEach(button => button.disabled = true);
}

/**
 * Fonction pour terminer le quiz et afficher le score final.
 * Affiche un message personnalisé selon le score de l'utilisateur.
 */
function endQuiz() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.score-container').style.display = 'block';

    const scoreMessage = document.getElementById('score-message');
    let message = "";

    // Afficher un message selon le score de l'utilisateur
    if (score === questions.length) {
        message = "🏆 Champion ! Tu as une excellente culture sportive !";
    } else if (score >= questions.length * 0.8) { // 80% ou plus
        message = "🔥 Très bien joué ! Tu connais vraiment bien le sport.";
    } else if (score >= questions.length * 0.5) { // 50% ou plus
        message = "🙂 Pas mal ! Mais tu peux encore progresser.";
    } else if (score > 0) {
        message = "😕 Oups ! Il faudrait peut-être réviser un peu.";
    } else {
        message = "❌ Aïe... On dirait que le sport, ce n'est pas trop ton domaine !";
    }

    scoreMessage.innerText = `Votre score final est : ${score} / ${questions.length} \n\n${message}`;
}

/**
 * Fonction qui réinitialise le quiz et permet de recommencer depuis la page d'accueil.
 */
function goToHomePage() {
    // Réinitialiser l'index et le score
    currentQuestionIndex = 0;
    score = 0;
   
    // Masquer la page de score et afficher l'écran d'accueil
    document.querySelector('.score-container').style.display = 'none';
    document.querySelector('.quiz-description').style.display = 'block';
    
    // Réinitialiser l'affichage du quiz si nécessaire
    document.querySelector('.quiz-container').style.display = 'none';
}

// Initialiser le quiz
loadQuestion(currentQuestionIndex);