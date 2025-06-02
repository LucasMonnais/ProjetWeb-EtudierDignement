// Fonctionnalités communes à toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger pour la version mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        handleContactForm();
    }

    // Gestion du mini-jeu
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        initGame();
    }
});

// Fonctions pour le formulaire de contact
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('confirmation-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const statutSelect = document.getElementById('statut');
    const etablissementContainer = document.getElementById('etablissement-container');

    // Gestion du compteur de caractères
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;

            // Vérification de la limite de caractères
            if (this.value.length > 500) {
                charCount.style.color = 'red';
                this.value = this.value.substring(0, 500);
                charCount.textContent = '500';
            } else {
                charCount.style.color = '';
            }
        });
    }

    // Afficher/masquer le champ établissement selon le statut
    if (statutSelect && etablissementContainer) {
        statutSelect.addEventListener('change', function() {
            if (this.value === 'etudiant' || this.value === 'enseignant') {
                etablissementContainer.style.display = 'block';
                document.getElementById('etablissement').setAttribute('required', 'true');
            } else {
                etablissementContainer.style.display = 'none';
                document.getElementById('etablissement').removeAttribute('required');
            }
        });
    }

    // Validation du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Réinitialisation des messages d'erreur
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.textContent = '');

            let isValid = true;

            // Validation du nom
            const nom = document.getElementById('nom');
            if (!nom.value.trim()) {
                document.getElementById('nom-error').textContent = 'Veuillez entrer votre nom';
                isValid = false;
            }

            // Validation du prénom
            const prenom = document.getElementById('prenom');
            if (!prenom.value.trim()) {
                document.getElementById('prenom-error').textContent = 'Veuillez entrer votre prénom';
                isValid = false;
            }

            // Validation de l'email
            const email = document.getElementById('email');

            if (!email.value.trim()) {
                document.getElementById('email-error').textContent = 'Veuillez entrer votre email';
                isValid = false;
            }


            // Validation du statut
            const statut = document.getElementById('statut');
            if (!statut.value) {
                document.getElementById('statut-error').textContent = 'Veuillez sélectionner votre statut';
                isValid = false;
            }


            // Validation du sujet
            const sujet = document.getElementById('sujet');
            if (!sujet.value) {
                document.getElementById('sujet-error').textContent = 'Veuillez sélectionner un sujet';
                isValid = false;
            }

            // Validation du message
            const message = document.getElementById('message');
            if (!message.value.trim()) {
                document.getElementById('message-error').textContent = 'Veuillez entrer votre message';
                isValid = false;
            } else if (message.value.trim().length < 10) {
                document.getElementById('message-error').textContent = 'Votre message est trop court (minimum 10 caractères)';
                isValid = false;
            }

            // Validation des conditions
            const conditions = document.getElementById('conditions');
            if (!conditions.checked) {
                document.getElementById('conditions-error').textContent = 'Veuillez accepter les conditions d\'utilisation';
                isValid = false;
            }

            // Si le formulaire est valide, afficher le modal de confirmation
            if (isValid) {
                modal.style.display = 'block';
                contactForm.reset();
            }
        });
    }

    // Fermer le modal
    if (modalCloseBtn) {

        modalCloseBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}
// Fonctions pour le mini-jeu "Prison ou CROUS"
let gameImages = [
    { url: '../images/jeu/image1.png', type: 'crous', info: 'Cette image est une photo d\' couloir menant à une chambre CROUS de 9m² est située dans une résidence universitaire à Lille.' },
    { url: '../images/jeu/image6.png', type: 'prison', info: 'Cette cellule de prison individuelle se trouve dans un centre pénitentiaire modernisé.' },
    { url: '../images/jeu/image2.png', type: 'crous', info: 'Cette chambre CROUS de Lille a été rénovée en 2020 mais reste très insalubre.' },
    { url: '../images/jeu/image8.png', type: 'prison', info: 'Cette cellule de prison pour deux détenus dispose d\'une salle d\'eau séparée.' },
    { url: '../images/jeu/image3.png', type: 'crous', info: 'Ce studio CROUS à Bordeaux mesure 12m² et coûte 650€ par mois.' },
    { url: '../images/jeu/image7.png', type: 'prison', info: 'Cette cellule de la prison de Fleury-Mérogis a été rénovée en 2018.' },
    { url: '../images/jeu/image4.png', type: 'crous', info: 'Cette chambre CROUS à Lyon vous propose de vous raprocher de la nature :)' },
    { url: '../images/jeu/image9.png', type: 'prison', info: 'Cette cellule double de la maison d\'arrêt de Nanterre est équipée d\'une télévision.' },
    { url: '../images/jeu/image5.png', type: 'crous', info: 'Cette chambre CROUS de Toulouse est proposée à 490€ par mois aux étudiants boursiers.' },
    { url: '../images/jeu/image10.png', type: 'prison', info: 'Cette cellule individuelle dans un quartier disciplinaire mesure 6m².' }
];

const startBtn = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const introSection = document.querySelector('.game-intro');
const imgElem = document.getElementById('game-image');
const prisonBtn = document.getElementById('prison-btn');
const crousBtn = document.getElementById('crous-btn');
const resultDisplay = document.getElementById('result-display');
const resultMsg = document.getElementById('result-message');
const resultInfo = document.getElementById('result-explanation');
const nextBtn = document.getElementById('next-question');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total-questions');
const progressBar = document.getElementById('progress');
const endSection = document.getElementById('game-end');
const finalScoreSpan = document.getElementById('final-score');
const finalTotalSpan = document.getElementById('final-total');
const conclusionDiv = document.getElementById('game-conclusion');
const restartBtn = document.getElementById('restart-game');

let currentIndex = 0;
let score = 0;

// Functions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    const percent = ((currentIndex) / gameImages.length) * 100;
    progressBar.style.width = `${percent}%`;
}

function showQuestion() {
    const item = gameImages[currentIndex];
    imgElem.src = item.url;
    imgElem.alt = `Question ${currentIndex + 1}`;
    totalSpan.textContent = gameImages.length;
    scoreSpan.textContent = score;
    updateProgress();
    prisonBtn.disabled = false;
    crousBtn.disabled = false;
    resultDisplay.style.display = 'none';
}

function handleAnswer(type) {
    const item = gameImages[currentIndex];
    const correct = (type === item.type);
    if (correct) { score++; scoreSpan.textContent = score; resultMsg.textContent = 'Correct !'; resultMsg.className = 'result-message correct'; }
    else { resultMsg.textContent = 'Incorrect !'; resultMsg.className = 'result-message incorrect'; }
    resultInfo.textContent = item.info;
    prisonBtn.disabled = true;
    crousBtn.disabled = true;
    resultDisplay.style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < gameImages.length) {
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    gameArea.style.display = 'none';
    endSection.style.display = 'block';
    finalScoreSpan.textContent = score;
    finalTotalSpan.textContent = gameImages.length;
    const pct = (score / gameImages.length) * 100;
    let msg;
    if (pct >= 80) msg = `Bravo ! Vous avez obtenu ${score}/${gameImages.length}.`;
    else if (pct >= 50) msg = `Vous avez obtenu ${score}/${gameImages.length}. Score moyen.`;
    else msg = `Vous avez obtenu ${score}/${gameImages.length}. Ne vous inquiétez pas.`;
    conclusionDiv.textContent = msg;
}

function startGame() {
    introSection.style.display = 'none';
    endSection.style.display = 'none';
    gameArea.style.display = 'block';
    shuffle(gameImages);
    currentIndex = 0;
    score = 0;
    showQuestion();
}

// Event Listeners
startBtn.addEventListener('click', startGame);
prisonBtn.addEventListener('click', () => handleAnswer('prison'));
crousBtn.addEventListener('click', () => handleAnswer('crous'));
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', startGame);

// Animation pour les statistiques (compteur)
const statElements = document.querySelectorAll('.number');
if (statElements.length > 0) {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-value'));
                let current = 0;
                const duration = 2000; // ms
                const increment = value / (duration / 16);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        clearInterval(timer);
                        current = value;
                    }
                    target.textContent = Math.round(current);
                }, 16);

                observer.unobserve(target);
            }
        });
    }, options);

    statElements.forEach(stat => {
        observer.observe(stat);
    });
}

// Animation pour les éléments au défilement
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 50) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
document.addEventListener('DOMContentLoaded', animateOnScroll);