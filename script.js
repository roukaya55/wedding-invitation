const API_URL = "https://script.google.com/macros/s/AKfycbyUN94j0vezcgffVKFqRn2jGKdQ82LdV2MTmfVhZIOsc9QuLGd3LTsOUGr0IRClOJjV5w/exec";

// Translate everything that is already in the page (i18n.js is loaded in <head>)
I18N.apply();

document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const heroSection = document.getElementById('hero-section');
    const envelopeSection = document.getElementById('envelope-section');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const audioControl = document.getElementById('audio-control');
    const audioIcon = document.getElementById('audio-icon');
    const langToggle = document.getElementById('lang-toggle');

    // 0. Language switch button (EN <-> عربي). The choice is remembered.
    if (langToggle) {
        langToggle.addEventListener('click', () => I18N.toggle());
    }

    // 1. Click "Start" -> Hide Hero, Show Envelope Screen
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            heroSection.style.display = 'none';
            envelopeSection.classList.remove('hidden');
            fitNames();
            window.scrollTo(0, 0);

            if (bgMusic) {
                bgMusic.play().then(() => {
                    if (audioIcon) audioIcon.textContent = '🔊';
                }).catch(e => {
                    console.log("Audio autoplay restricted by browser policy");
                });
            }
        });
    }

    // 2. Click Envelope -> Open animation, hide envelope, show main content
    if (envelopeWrapper) {
        const openEnvelope = () => {
            if (envelopeWrapper.classList.contains('open')) return;

            envelopeWrapper.classList.add('open');
            envelopeWrapper.setAttribute('aria-expanded', 'true');
            const envelopeInstruction = document.getElementById('envelope-instruction');
            if (envelopeInstruction) {
                // remove the data-i18n hook so a language switch doesn't bring the text back
                envelopeInstruction.removeAttribute('data-i18n');
                envelopeInstruction.textContent = '';
            }
            
            setTimeout(() => {
                envelopeWrapper.classList.add('complete');
                setTimeout(() => {
                    envelopeSection.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    fitNames();
                    window.scrollTo(0, 0);
                    initScrollObserver(); // Initialize animations for revealed content
                }, 500);
            }, 4200);
        };

        envelopeWrapper.addEventListener('click', openEnvelope);
        envelopeWrapper.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openEnvelope();
            }
        });
    }

    if (audioControl && bgMusic) {
        audioControl.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                audioIcon.textContent = '🔊';
            } else {
                bgMusic.pause();
                audioIcon.textContent = '🔇';
            }
        });
    }
});

// ============================================
// SCROLL REVEAL OBSERVER ANIMATIONS
// ============================================
function initScrollObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
const WEDDING_DATE = new Date("2026-12-26T20:00:00");

// Arabic-Indic digits (٠١٢٣…) are applied by I18N.digits() when the page is in Arabic
function formatCount(n) {
    return I18N.digits(String(n).padStart(2, '0'));
}

function updateCountdown() {
    const now = new Date();
    let diff = WEDDING_DATE - now;

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl) return;

    if (diff <= 0) {
        daysEl.textContent = formatCount(0);
        hoursEl.textContent = formatCount(0);
        minsEl.textContent = formatCount(0);
        secsEl.textContent = formatCount(0);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);

    daysEl.textContent = formatCount(days);
    hoursEl.textContent = formatCount(hours);
    minsEl.textContent = formatCount(mins);
    secsEl.textContent = formatCount(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);
document.addEventListener('wedding:langchange', updateCountdown);

// ============================================
// STATE MANAGEMENT & RSVP BACKEND LOGIC
// ============================================
let currentGuest = {
    name: "",
    nameAr: "",       // optional: Arabic spelling of the guest name, if the sheet provides one
    seats: 0,
    maxSeats: 0,
    status: "",
    hasResponded: false,
    rowIndex: null
};

const rsvpSection = document.getElementById('rsvp-section');
const welcomeText = document.getElementById('welcome-text');
const seatNumber = document.getElementById('seat-number');
const seatLabel = document.getElementById('seat-label');
const messageDiv = document.getElementById('message');
const btnAccept = document.getElementById('btn-accept');
const btnDecline = document.getElementById('btn-decline');
const statusBadgeContainer = document.getElementById('status-badge-container');
const btnDecreaseSeat = document.getElementById('btn-decrease-seat');
const btnIncreaseSeat = document.getElementById('btn-increase-seat');
const seatWarning = document.getElementById('seat-warning');

// ---- Message area: we remember the message KEY so it can be re-translated on language switch ----
let currentMessage = { key: null, vars: null, type: '' };

function renderMessage() {
    if (!messageDiv) return;
    if (!currentMessage.key) {
        messageDiv.textContent = '';
        messageDiv.className = currentMessage.type || '';
        return;
    }
    const vars = Object.assign({}, currentMessage.vars);
    if (vars.status) vars.status = statusLabel(vars.status);
    messageDiv.textContent = I18N.t(currentMessage.key, vars);
    messageDiv.className = currentMessage.type || '';
}

function setMessage(key, type = '', vars = null) {
    currentMessage = { key: key, vars: vars, type: type };
    renderMessage();
}

function statusLabel(status) {
    if (status === 'Attending') return I18N.t('statusAttending');
    if (status === 'Declined') return I18N.t('statusDeclined');
    return status;
}

function showStatusBadge(status) {
    if (!status) return '';
    const statusMap = {
        'Attending': 'attending',
        'Declined': 'declined'
    };
    const cls = statusMap[status];
    if (cls) {
        return `<span class="status-badge ${cls}">${statusLabel(status)}</span>`;
    }
    return '';
}

function displayName() {
    return (I18N.lang === 'ar' && currentGuest.nameAr) ? currentGuest.nameAr : currentGuest.name;
}

function renderButtons() {
    if (btnAccept) btnAccept.textContent = I18N.t(currentGuest.hasResponded ? 'btnUpdate' : 'btnAccept');
    if (btnDecline) btnDecline.textContent = I18N.t(currentGuest.hasResponded ? 'btnUpdateDecline' : 'btnDecline');
}

function updateSeatAdjustmentButtons() {
    if (!btnDecreaseSeat || !btnIncreaseSeat) return;
    btnDecreaseSeat.disabled = currentGuest.seats <= 1;
    btnIncreaseSeat.disabled = currentGuest.seats >= currentGuest.maxSeats;

    if (seatNumber) seatNumber.textContent = I18N.digits(currentGuest.seats);
    if (seatLabel) seatLabel.textContent = I18N.seats(currentGuest.seats, false);

    if (currentGuest.seats >= currentGuest.maxSeats) {
        seatWarning.innerHTML = I18N.t('seatMax', { count: I18N.seats(currentGuest.maxSeats, true) });
        seatWarning.style.color = "#A24B3E";
    } else {
        seatWarning.innerHTML = I18N.t('seatAllowed', { count: I18N.seats(currentGuest.maxSeats, true) });
        seatWarning.style.color = "";
    }
}

// Re-draw everything that JS fills in (runs after the language changes)
function renderDynamic() {
    renderMessage();
    renderButtons();
    if (welcomeText && currentGuest.name) welcomeText.textContent = displayName();
    if (statusBadgeContainer && currentGuest.hasResponded) {
        statusBadgeContainer.innerHTML = showStatusBadge(currentGuest.status);
    }
    if (currentGuest.maxSeats > 0) updateSeatAdjustmentButtons();
    else {
        if (seatNumber) seatNumber.textContent = I18N.digits(1);
        if (seatLabel) seatLabel.textContent = I18N.seats(1, false);
    }
}

document.addEventListener('wedding:langchange', renderDynamic);

window.addEventListener('DOMContentLoaded', async () => {
    renderDynamic();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('id');

    if (!token) {
        setMessage('invalidLink', 'error');
        return;
    }

    setMessage('readingLink', 'info');

    try {
        const response = await fetch(`${API_URL}?type=getGuestByToken&token=${encodeURIComponent(token.trim())}`);
        const data = await response.json();

        if (data.found) {
            setMessage(null);

            currentGuest = {
                name: data.name,
                nameAr: data.nameAr || '',
                seats: data.confirmedSeats,
                maxSeats: data.maxSeats || 1,
                status: data.status || '',
                hasResponded: data.hasResponded || false,
                rowIndex: data.rowIndex
            };

            if (welcomeText) welcomeText.textContent = displayName();

            if (rsvpSection) rsvpSection.classList.remove('hidden');
            updateSeatAdjustmentButtons();

            if (data.hasResponded) {
                if (statusBadgeContainer) statusBadgeContainer.innerHTML = showStatusBadge(data.status);
                setMessage('alreadyResponded', 'info', { status: data.status });
            } else {
                if (statusBadgeContainer) statusBadgeContainer.innerHTML = '';
                setMessage('confirmPrompt');
            }
            renderButtons();

        } else {
            setMessage('lookupFailed', 'error');
        }
    } catch (error) {
        console.error('Initial execution fetching loop error trace:', error);
        setMessage('networkFail', 'error');
    }
});

if (btnDecreaseSeat) {
    btnDecreaseSeat.addEventListener('click', () => {
        if (currentGuest.seats > 1) {
            currentGuest.seats--;
            updateSeatAdjustmentButtons();
        }
    });
}

if (btnIncreaseSeat) {
    btnIncreaseSeat.addEventListener('click', () => {
        if (currentGuest.seats < currentGuest.maxSeats) {
            currentGuest.seats++;
            updateSeatAdjustmentButtons();
        }
    });
}

async function fetchSavedStatus() {
    // Ask the sheet what it actually has saved for this guest
    const token = new URLSearchParams(window.location.search).get('id');
    const res = await fetch(`${API_URL}?type=getGuestByToken&token=${encodeURIComponent(token.trim())}`);
    const data = await res.json();
    return data.found ? data : null;
}

function applySuccess(status, seatsParam) {
    setMessage(status === 'Attending' ? 'thanksAttending' : 'thanksDeclined', 'success');

    currentGuest.status = status;
    currentGuest.hasResponded = true;
    if (statusBadgeContainer) statusBadgeContainer.innerHTML = showStatusBadge(status);

    if (status === 'Declined') {
        currentGuest.seats = 0;
    }
    updateSeatAdjustmentButtons();
    renderButtons();
}

async function submitRSVP(status) {
    if (btnAccept) btnAccept.disabled = true;
    if (btnDecline) btnDecline.disabled = true;
    setMessage(status === 'Attending' ? 'accepting' : 'declining', 'info');

    if (status === 'Attending' && currentGuest.seats < 1) {
        currentGuest.seats = 1;
        updateSeatAdjustmentButtons();
    }

    const seatsParam = status === 'Attending' ? Math.max(currentGuest.seats, 1) : 0;
    // NOTE: always send the original (sheet) name, never the Arabic display name
    const postUrl = `${API_URL}?type=submit&name=${encodeURIComponent(currentGuest.name)}&seats=${seatsParam}&status=${encodeURIComponent(status)}&rowIndex=${currentGuest.rowIndex}`;

    let saved = false;

    try {
        const response = await fetch(postUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        let data = null;
        try { data = JSON.parse(text); }
        catch (e) { const m = text.match(/\{.*\}/s); if (m) data = JSON.parse(m[0]); }
        if (data && (data.success === true || data.success === 'true')) saved = true;
        else throw new Error((data && data.error) || 'Server did not confirm the save');
    } catch (error) {
        console.error('RSVP submit error:', error);
        // The request may have gone through even though the reply was blocked. Check the sheet.
        try {
            const check = await fetchSavedStatus();
            if (check && check.status === status) saved = true;
        } catch (e) { /* still unconfirmed */ }
    }

    if (saved) {
        applySuccess(status, seatsParam);
        const summaryMsg = encodeURIComponent(I18N.t('waSummary', {
            name: currentGuest.name,
            status: statusLabel(status),
            seats: seatsParam
        }));
        window.open(`https://wa.me/96170510183?text=${summaryMsg}`, '_blank');
    } else {
        setMessage('saveFailed', 'error');
    }

    // Always allow another try / later update
    if (btnAccept) btnAccept.disabled = false;
    if (btnDecline) btnDecline.disabled = false;
}

if (btnAccept) btnAccept.addEventListener('click', () => { if (!btnAccept.disabled) submitRSVP('Attending'); });
if (btnDecline) btnDecline.addEventListener('click', () => { if (!btnDecline.disabled) submitRSVP('Declined'); });


// ============================================
// FULL NAMES: keep each person's name on ONE line
// Shrinks the font (never grows it) until the longest name fits its container.
// Works for any name length, in English and Arabic.
// ============================================
const NAME_GROUPS = ['.hero-names', '.couple-full-names', '.closing-names', '.insert-names'];
const MIN_NAME_FONT = 16;

function fitNames() {
    NAME_GROUPS.forEach(sel => {
        document.querySelectorAll(sel).forEach(group => {
            const names = group.querySelectorAll(':scope > span:not(.script)');
            const parent = group.parentElement;
            if (!names.length || !parent) return;

            names.forEach(n => { n.style.fontSize = ''; });          // back to the CSS size

            const cs = (el) => getComputedStyle(el);
            const pad = (el) => parseFloat(cs(el).paddingLeft) + parseFloat(cs(el).paddingRight);
            const avail = parent.clientWidth - pad(parent) - pad(group);
            if (avail <= 0) return;                                   // section is hidden right now

            const widest = () => Math.max(...Array.from(names, n => n.getBoundingClientRect().width));
            let w = widest();
            if (w <= avail) return;

            let size = parseFloat(cs(names[0]).fontSize) * (avail / w) * 0.98;
            for (let i = 0; i < 6; i++) {
                size = Math.max(MIN_NAME_FONT, size);
                names.forEach(n => { n.style.fontSize = size + 'px'; });
                w = widest();
                if (w <= avail || size <= MIN_NAME_FONT) break;
                size *= (avail / w) * 0.98;
            }
        });
    });
}

fitNames();
window.addEventListener('load', fitNames);
window.addEventListener('resize', fitNames);
document.addEventListener('wedding:langchange', fitNames);
if (document.fonts) {
    document.fonts.ready.then(fitNames);
    document.fonts.addEventListener('loadingdone', fitNames);        // fires when Arabic fonts arrive
}
