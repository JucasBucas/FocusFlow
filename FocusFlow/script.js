
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const progressRing = document.querySelector('.progress-ring-fill');
const timerText = document.querySelector('.timer-text');
const customTimerSection = document.getElementById('customTimerSection');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const setCustomBtn = document.getElementById('setCustomBtn');
const themeToggle = document.getElementById('themeToggle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const themeOptions = document.querySelectorAll('.theme-option');
const soundButtons = document.querySelectorAll('.sound-btn');
const completionEffects = document.getElementById('completionEffects');

let timer;
let isRunning = false;
let timeLeft = 25 * 60;
let totalTime = 25 * 60;
let currentMode = 'focus';
let currentTheme = 'default';
let currentSound = 'bell';

const circumference = 2 * Math.PI * 130;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    progressRing.style.strokeDashoffset = offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = displayText;
    timerText.textContent = displayText;
    
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    setProgress(progress);
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.textContent = 'Resume';
    startBtn.style.background = 'var(--theme-2)';
    
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            startBtn.style.background = 'var(--gradient)';
            startBtn.textContent = 'Start';
            
            if (currentMode === 'focus') {
                triggerCelebration();
                
                if (Math.random() > 0.5) {
                    switchMode('longBreak');
                } else {
                    switchMode('shortBreak');
                }
            } else {
                switchMode('focus');
            }
            
            playCompletionSound();
        }
    }, 1000);
}

function triggerCelebration() {
    createConfetti();
    createFloatingEmojis();
    showCelebrationMessage();
}

function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { 
                transform: 'translateY(0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translateY(${Math.random() * 500 + 500}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

function createFloatingEmojis() {
    const emojis = ['🎉', '✨', '⭐', '🔥', '💪', '🚀', '🎯', '🏆'];
    
    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.fontSize = (Math.random() * 20 + 20) + 'px';
        emoji.style.animationDelay = (Math.random() * 1) + 's';
        
        completionEffects.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 3000);
    }
}

function showCelebrationMessage() {
    const messages = [
        'Great Job! 🎯',
        'Session Complete! ✨',
        'Productivity Boost! 🚀',
        'Focus Master! 💪',
        'Well Done! ⭐'
    ];
    
    const message = document.createElement('div');
    message.className = 'celebration-message';
    message.textContent = messages[Math.floor(Math.random() * messages.length)];
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 3000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Resume';
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = totalTime;
    updateDisplay();
    startBtn.textContent = 'Start';
    startBtn.style.background = 'var(--gradient)';
}

function skipSession() {
    clearInterval(timer);
    isRunning = false;
    
    if (currentMode === 'focus') {
        switchMode('shortBreak');
    } else {
        switchMode('focus');
    }
}

function switchMode(mode) {
    modeBtns.forEach(btn => btn.classList.remove('active'));
    customTimerSection.style.display = 'none';
    
    if (mode === 'focus') {
        timeLeft = 25 * 60;
        totalTime = 25 * 60;
        modeBtns[0].classList.add('active');
        currentMode = 'focus';
    } else if (mode === 'shortBreak') {
        timeLeft = 5 * 60;
        totalTime = 5 * 60;
        modeBtns[1].classList.add('active');
        currentMode = 'shortBreak';
    } else if (mode === 'longBreak') {
        timeLeft = 15 * 60;
        totalTime = 15 * 60;
        modeBtns[2].classList.add('active');
        currentMode = 'longBreak';
    } else if (mode === 'custom') {
        customTimerSection.style.display = 'block';
        modeBtns[3].classList.add('active');
        currentMode = 'custom';
        return;
    }
    
    updateDisplay();
    resetTimer();
}

function setCustomTime() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds > 0) {
        timeLeft = totalSeconds;
        totalTime = totalSeconds;
        updateDisplay();
        resetTimer();
        customTimerSection.style.display = 'none';
        modeBtns[3].classList.remove('active');
        modeBtns[0].classList.add('active');
        currentMode = 'focus';
    }
}

function playCompletionSound() {
    if (currentSound === 'none') return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (currentSound === 'bell') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    } else if (currentSound === 'chime') {
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.1);
    } else if (currentSound === 'beep') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    }
    
    oscillator.type = currentSound === 'beep' ? 'square' : 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    if (isDark) {
        document.body.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.style.setProperty('--primary', getThemeColor(theme).primary);
    document.documentElement.style.setProperty('--primary-dark', getThemeColor(theme).primaryDark);
    document.documentElement.style.setProperty('--primary-light', getThemeColor(theme).primaryLight);
}

function getThemeColor(theme) {
    const themes = {
        default: { primary: '#6366f1', primaryDark: '#4f46e5', primaryLight: '#8b5cf6' },
        green: { primary: '#10b981', primaryDark: '#059669', primaryLight: '#34d399' },
        orange: { primary: '#f59e0b', primaryDark: '#d97706', primaryLight: '#fbbf24' },
        pink: { primary: '#ec4899', primaryDark: '#db2777', primaryLight: '#f472b6' }
    };
    return themes[theme] || themes.default;
}

function setSound(sound) {
    currentSound = sound;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) pauseTimer(); else startTimer();
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
    } else if (e.code === 'KeyS') {
        e.preventDefault();
        skipSession();
    } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
    } else if (e.code === 'Digit1') {
        e.preventDefault();
        switchMode('shortBreak');
    } else if (e.code === 'Digit2') {
        e.preventDefault();
        switchMode('longBreak');
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipSession);
setCustomBtn.addEventListener('click', setCustomTime);
themeToggle.addEventListener('click', toggleTheme);
fullscreenBtn.addEventListener('click', toggleFullscreen);

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const time = btn.getAttribute('data-time');
        if (time === '25') switchMode('focus');
        else if (time === '5') switchMode('shortBreak');
        else if (time === '15') switchMode('longBreak');
        else if (time === 'custom') switchMode('custom');
    });
});

themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        setTheme(this.getAttribute('data-theme'));
    });
});

soundButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        soundButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        setSound(this.getAttribute('data-sound'));
    });
});

minutesInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 90) this.value = 90;
});

secondsInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (value < 0) this.value = 0;
    if (value > 59) this.value = 59;
});

updateDisplay();
