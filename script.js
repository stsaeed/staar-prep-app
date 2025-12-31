
class App {
    constructor() {
        this.PASSCODE = "STAR123"; // Configurable Code

        this.state = {
            currentView: 'login', // Default start
            currentSubject: null,
            currentQuestions: [],
            currentIndex: 0,
            score: 0,
            userAnswers: []
        };

        this.dom = {
            views: {
                login: document.getElementById('login-view'),
                home: document.getElementById('home-view'),
                quiz: document.getElementById('quiz-view'),
                results: document.getElementById('results-view')
            },
            login: {
                input: document.getElementById('passcode-input'),
                btn: document.getElementById('login-btn'),
                error: document.getElementById('login-error')
            },
            quiz: {
                subjectLabel: document.getElementById('subject-label'),
                counter: document.getElementById('question-counter'),
                questionText: document.getElementById('question-text'),
                optionsGrid: document.getElementById('options-grid')
            },
            results: {
                score: document.getElementById('final-score'),
                stars: document.getElementById('stars-display'),
                message: document.getElementById('motivational-text'),
                homeBtn: document.getElementById('home-btn')
            },
            modal: {
                overlay: document.getElementById('feedback-modal'),
                icon: document.getElementById('feedback-icon'),
                title: document.getElementById('feedback-title'),
                text: document.getElementById('feedback-explanation'),
                nextBtn: document.getElementById('next-btn')
            }
        };

        this.init();
    }

    init() {
        // Check Session
        if (sessionStorage.getItem('staar_auth') === 'true') {
            this.showView('home');
        }

        // Login Logic
        this.dom.login.btn.addEventListener('click', () => this.handleLogin());
        this.dom.login.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Setup Subject Clicks
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', () => {
                const subject = card.dataset.subject;
                this.startQuiz(subject);
            });
        });

        // Setup Modal Button
        this.dom.modal.nextBtn.addEventListener('click', () => {
            this.handleNextQuestion();
        });

        // Setup Home Button
        this.dom.results.homeBtn.addEventListener('click', () => {
            this.showView('home');
        });
    }

    handleLogin() {
        const input = this.dom.login.input.value.trim();
        if (input === this.PASSCODE) {
            sessionStorage.setItem('staar_auth', 'true');
            this.showView('home');
            this.dom.login.error.classList.add('hidden');
        } else {
            this.dom.login.error.classList.remove('hidden');
            this.dom.login.input.value = '';
            this.dom.login.input.focus();
        }
    }

    showView(viewName) {
        // Hide all views
        Object.values(this.dom.views).forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        // Show target view
        const target = this.dom.views[viewName];
        target.classList.remove('hidden');
        // Small timeout to allow display:block to apply before opacity transition if we wanted it
        // but for now simple class toggle
        setTimeout(() => target.classList.add('active'), 10);

        this.state.currentView = viewName;
    }

    startQuiz(subject) {
        this.state.currentSubject = subject;

        let questionsList;
        if (subject === 'math' && window.MathGenerator) {
            // Generate 5 random math questions
            questionsList = window.MathGenerator.generate(5);
        } else {
            // Use static questions for others
            questionsList = [...window.questions[subject]];
        }

        this.state.currentQuestions = this.shuffleArray(questionsList);
        this.state.currentIndex = 0;
        this.state.score = 0;
        this.state.userAnswers = [];

        this.renderQuestion();
        this.showView('quiz');
    }

    renderQuestion() {
        const q = this.state.currentQuestions[this.state.currentIndex];
        const total = this.state.currentQuestions.length;

        // Update Header
        this.dom.quiz.subjectLabel.textContent = this.state.currentSubject.toUpperCase();
        this.dom.quiz.counter.textContent = `Question ${this.state.currentIndex + 1}/${total}`;

        // Render Question
        this.dom.quiz.questionText.textContent = q.question;

        // Render Options
        this.dom.quiz.optionsGrid.innerHTML = '';
        const shuffledOptions = this.shuffleArray([...q.options]);

        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => this.handleAnswer(opt, btn);
            this.dom.quiz.optionsGrid.appendChild(btn);
        });
    }

    handleAnswer(selectedOption, btnElement) {
        // Prevent multiple clicks
        const allBtns = this.dom.quiz.optionsGrid.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        const currentQ = this.state.currentQuestions[this.state.currentIndex];
        const isCorrect = selectedOption === currentQ.correct;

        // Visual Feedback on buttons
        if (isCorrect) {
            btnElement.classList.add('correct');
            this.state.score++;
        } else {
            btnElement.classList.add('wrong');
            // Highlight correct one
            allBtns.forEach(b => {
                if (b.textContent === currentQ.correct) b.classList.add('correct');
            });
        }

        // Show Modal after short delay
        setTimeout(() => {
            this.showFeedback(isCorrect, currentQ.explanation);
        }, 800);
    }

    showFeedback(isCorrect, explanation) {
        this.dom.modal.icon.textContent = isCorrect ? '🎉' : '🤔';
        this.dom.modal.title.textContent = isCorrect ? 'Great Job!' : 'Not Quite...';
        this.dom.modal.title.style.color = isCorrect ? 'var(--color-success)' : 'var(--color-accent)';
        this.dom.modal.text.textContent = explanation;
        this.dom.modal.overlay.classList.add('visible');
    }

    handleNextQuestion() {
        this.dom.modal.overlay.classList.remove('visible');
        this.state.currentIndex++;

        if (this.state.currentIndex < this.state.currentQuestions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const total = this.state.currentQuestions.length;
        const percentage = Math.round((this.state.score / total) * 100);

        this.dom.results.score.textContent = `${percentage}%`;

        // Stars Logic
        let stars = '★';
        let message = 'Keep practicing!';
        if (percentage >= 100) { stars = '★★★'; message = 'Perfect Score! You are a genius!'; }
        else if (percentage >= 80) { stars = '★★★'; message = 'Amazing work!'; }
        else if (percentage >= 60) { stars = '★★'; message = 'Good job! Getting there.'; }

        this.dom.results.stars.textContent = stars;
        this.dom.results.message.textContent = message;

        this.showView('results');
    }

    // Utility
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Start App
const app = new App();
