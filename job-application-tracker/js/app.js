/* ============================================
   jobly — Main JavaScript
   ============================================ */

// State
let applications = [];
let editingId = null;
let interviewDoneId = null;
let userName = '';
let currentTheme = 'light';

// Motivational messages
const motivationalMessages = [
    "Every application is a step forward.",
    "Your next opportunity could start with one click.",
    "Consistency creates opportunities.",
    "Small actions build big careers.",
    "One application closer to the right role.",
    "Keep showing up for your future.",
    "Progress doesn't need to be loud.",
    "The right opportunity only needs one yes.",
    "Your career story is still being written.",
    "Keep moving. You're building momentum."
];

// DOM Elements - Wait for DOM to be ready
let onboardingScreen, onboardingForm, userNameInput, appContainer;
let addApplicationBtn, emptyStateAddBtn, themeToggle, sunIcon, moonIcon;
let searchInput, statusFilter, sortOptions, clearSearchBtn;
let applicationsList, emptyState, noResultsState;
let greetingText, greetingSubtitle, toastContainer;
let statTotal, statApplied, statInterview, statOffer, statRejected;
let todayInterviewSection, todayInterviewDetails;
let upcomingSection, upcomingCount, upcomingList;
let applicationModal, modalTitle, modalClose, cancelBtn;
let applicationForm, saveBtn, interviewDetailsGroup, interviewType;
let venueGroup, platformGroup, linkGroup, contactGroup;
let interviewDoneModal, interviewDoneModalClose, interviewConfirmText;
let cancelInterviewDoneBtn, confirmInterviewDoneBtn;

// Initialize DOM elements
function initDOMElements() {
    onboardingScreen = document.getElementById('onboardingScreen');
    onboardingForm = document.getElementById('onboardingForm');
    userNameInput = document.getElementById('userNameInput');
    appContainer = document.getElementById('appContainer');
    addApplicationBtn = document.getElementById('addApplicationBtn');
    emptyStateAddBtn = document.getElementById('emptyStateAddBtn');
    themeToggle = document.getElementById('themeToggle');
    sunIcon = document.querySelector('.sun-icon');
    moonIcon = document.querySelector('.moon-icon');
    searchInput = document.getElementById('searchInput');
    statusFilter = document.getElementById('statusFilter');
    sortOptions = document.getElementById('sortOptions');
    clearSearchBtn = document.getElementById('clearSearchBtn');
    applicationsList = document.getElementById('applicationsList');
    emptyState = document.getElementById('emptyState');
    noResultsState = document.getElementById('noResultsState');
    greetingText = document.getElementById('greetingText');
    greetingSubtitle = document.getElementById('greetingSubtitle');
    toastContainer = document.getElementById('toastContainer');
    statTotal = document.getElementById('statTotal');
    statApplied = document.getElementById('statApplied');
    statInterview = document.getElementById('statInterview');
    statOffer = document.getElementById('statOffer');
    statRejected = document.getElementById('statRejected');
    todayInterviewSection = document.getElementById('todayInterviewSection');
    todayInterviewDetails = document.getElementById('todayInterviewDetails');
    upcomingSection = document.getElementById('upcomingSection');
    upcomingCount = document.getElementById('upcomingCount');
    upcomingList = document.getElementById('upcomingList');
    applicationModal = document.getElementById('applicationModal');
    modalTitle = document.getElementById('modalTitle');
    modalClose = document.getElementById('modalClose');
    cancelBtn = document.getElementById('cancelBtn');
    applicationForm = document.getElementById('applicationForm');
    saveBtn = document.getElementById('saveBtn');
    interviewDetailsGroup = document.getElementById('interviewDetailsGroup');
    interviewType = document.getElementById('interviewType');
    venueGroup = document.getElementById('venueGroup');
    platformGroup = document.getElementById('platformGroup');
    linkGroup = document.getElementById('linkGroup');
    contactGroup = document.getElementById('contactGroup');
    interviewDoneModal = document.getElementById('interviewDoneModal');
    interviewDoneModalClose = document.getElementById('interviewDoneModalClose');
    interviewConfirmText = document.getElementById('interviewConfirmText');
    cancelInterviewDoneBtn = document.getElementById('cancelInterviewDoneBtn');
    confirmInterviewDoneBtn = document.getElementById('confirmInterviewDoneBtn');
}

// ============================================
// Utility Functions
// ============================================

function generateId() {
    return Date.now();
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Still going';
}

function getGreetingEmoji() {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 17) return '👋';
    if (hour < 21) return '✨';
    return '🌙';
}

function getGreetingSubtitle() {
    const hour = new Date().getHours();
    if (hour < 12) return "A fresh day. Another chance to move closer to the right opportunity.";
    if (hour < 17) return "Every application is a step forward. Keep building your path.";
    if (hour < 21) return "Small progress still counts. You're moving forward.";
    return "Your future career is built one small step at a time.";
}

function getStatusClass(status) {
    const map = {
        'Applied': 'app-status-applied',
        'Interview Scheduled': 'app-status-interview-scheduled',
        'Interview Done': 'app-status-interview-done',
        'Offer': 'app-status-offer',
        'Rejected': 'app-status-rejected'
    };
    return map[status] || 'app-status-applied';
}

function getInterviewCountdown(interviewDate, interviewTime) {
    if (!interviewDate) return null;
    
    const interview = new Date(`${interviewDate}T${interviewTime || '00:00'}`);
    const now = new Date();
    const diffMs = interview - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return null;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return null;
}

function isToday(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function isUpcoming(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================
// Data Management
// ============================================

function saveApplications() {
    localStorage.setItem('jobApplications', JSON.stringify(applications));
}

function loadApplications() {
    const stored = localStorage.getItem('jobApplications');
    applications = stored ? JSON.parse(stored) : [];
}

function saveUser() {
    localStorage.setItem('joblyUser', JSON.stringify({ name: userName, theme: currentTheme }));
}

function loadUser() {
    const stored = localStorage.getItem('joblyUser');
    if (stored) {
        const user = JSON.parse(stored);
        userName = user.name || '';
        currentTheme = user.theme || 'light';
    }
}

// ============================================
// Core Functions
// ============================================

function getFilteredApplications() {
    let filtered = [...applications];
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(app => 
            app.company.toLowerCase().includes(searchTerm) ||
            app.position.toLowerCase().includes(searchTerm) ||
            app.location.toLowerCase().includes(searchTerm)
        );
    }
    
    const statusValue = statusFilter.value;
    if (statusValue !== 'all') {
        filtered = filtered.filter(app => app.status === statusValue);
    }
    
    const sortValue = sortOptions.value;
    filtered.sort((a, b) => {
        switch(sortValue) {
            case 'newest': return new Date(b.appliedDate) - new Date(a.appliedDate);
            case 'oldest': return new Date(a.appliedDate) - new Date(b.appliedDate);
            case 'company-asc': return a.company.localeCompare(b.company);
            case 'company-desc': return b.company.localeCompare(a.company);
            default: return 0;
        }
    });
    
    return filtered;
}

function renderApplications() {
    const filtered = getFilteredApplications();
    applicationsList.innerHTML = '';
    
    if (applications.length === 0) {
        emptyState.style.display = 'block';
        noResultsState.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
    }
    
    if (filtered.length === 0) {
        noResultsState.style.display = 'block';
        return;
    } else {
        noResultsState.style.display = 'none';
    }
    
    filtered.forEach(app => {
        const card = document.createElement('div');
        card.className = 'application-card';
        
        const hasInterview = app.interviewDate && isUpcoming(app.interviewDate);
        const countdown = getInterviewCountdown(app.interviewDate, app.interviewTime);
        
        let interviewInfo = '';
        if (hasInterview) {
            let venueInfo = '';
            if (app.interviewType === 'In Person' && app.interviewVenue) {
                venueInfo = app.interviewVenue;
            } else if (app.interviewType === 'Online' && app.interviewPlatform) {
                venueInfo = app.interviewPlatform;
            } else if (app.interviewType === 'Phone Call') {
                venueInfo = 'Phone Call';
            }
            
            interviewInfo = `
                <div class="app-interview-info">
                    <div class="app-interview-label">🗓 Interview</div>
                    <div class="app-interview-time">${formatDate(app.interviewDate)} • ${formatTime(app.interviewTime)}</div>
                    ${venueInfo ? `<div class="app-interview-venue">${venueInfo}</div>` : ''}
                    ${countdown ? `<div class="app-interview-countdown">${countdown}</div>` : ''}
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="app-card-header">
                <div class="app-company">${app.company}</div>
            </div>
            <div class="app-position">${app.position}</div>
            <div class="app-meta">
                <span class="app-location">📍 ${app.location}</span>
                <span class="app-date">📅 Applied ${formatDate(app.appliedDate)}</span>
            </div>
            <div class="app-status-badge ${getStatusClass(app.status)}">${app.status}</div>
            ${interviewInfo}
            <div class="app-actions">
                <button class="btn-app" onclick="editApplication(${app.id})">Edit</button>
                <button class="btn-app" onclick="deleteApplication(${app.id})">Delete</button>
            </div>
        `;
        applicationsList.appendChild(card);
    });
    
    updateStatistics();
    renderTodayInterview();
    renderUpcomingInterviews();
}

function updateStatistics() {
    const total = applications.length;
    const applied = applications.filter(app => app.status === 'Applied').length;
    const interviews = applications.filter(app => 
        app.status === 'Interview Scheduled' || app.status === 'Interview Done'
    ).length;
    const offers = applications.filter(app => app.status === 'Offer').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    statTotal.textContent = total;
    statApplied.textContent = applied;
    statInterview.textContent = interviews;
    statOffer.textContent = offers;
    statRejected.textContent = rejected;
}

function updateGreeting() {
    greetingText.textContent = `${getGreeting()}, ${userName} ${getGreetingEmoji()}`;
    greetingSubtitle.textContent = getGreetingSubtitle();
}

function renderTodayInterview() {
    const todayInterviews = applications.filter(app => 
        app.status === 'Interview Scheduled' && 
        app.interviewDate && 
        isToday(app.interviewDate)
    );
    
    if (todayInterviews.length === 0) {
        todayInterviewSection.style.display = 'none';
        return;
    }
    
    todayInterviewSection.style.display = 'block';
    todayInterviewDetails.innerHTML = todayInterviews.map(app => {
        let venueInfo = '';
        if (app.interviewType === 'In Person' && app.interviewVenue) {
            venueInfo = app.interviewVenue;
        } else if (app.interviewType === 'Online' && app.interviewPlatform) {
            venueInfo = app.interviewPlatform;
        }
        
        return `
            <div class="today-interview-item">
                <div>
                    <div class="today-company">${app.company}</div>
                    <div class="today-position">${app.position}</div>
                </div>
                <div class="today-time">${formatTime(app.interviewTime)}${venueInfo ? ` • ${venueInfo}` : ''}</div>
            </div>
        `;
    }).join('');
}

function renderUpcomingInterviews() {
    const upcoming = applications.filter(app => 
        app.status === 'Interview Scheduled' && 
        app.interviewDate && 
        isUpcoming(app.interviewDate) &&
        !isToday(app.interviewDate)
    ).sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
    
    upcomingCount.textContent = upcoming.length;
    
    if (upcoming.length === 0) {
        upcomingSection.style.display = 'none';
        return;
    }
    
    upcomingSection.style.display = 'block';
    upcomingList.innerHTML = upcoming.map(app => {
        const countdown = getInterviewCountdown(app.interviewDate, app.interviewTime);
        let venueInfo = '';
        if (app.interviewType === 'In Person' && app.interviewVenue) {
            venueInfo = app.interviewVenue;
        } else if (app.interviewType === 'Online' && app.interviewPlatform) {
            venueInfo = app.interviewPlatform;
        }
        
        return `
            <div class="upcoming-card">
                <div class="upcoming-header">
                    <div class="upcoming-company">${app.company}</div>
                </div>
                <div class="upcoming-position">${app.position}</div>
                <div class="upcoming-meta">📅 ${formatDate(app.interviewDate)} • ${formatTime(app.interviewTime)}</div>
                ${venueInfo ? `<div class="upcoming-venue">📍 ${venueInfo}</div>` : ''}
                ${countdown ? `<div class="upcoming-countdown">${countdown}</div>` : ''}
                <div class="upcoming-motivation">You've got this.</div>
                <div class="upcoming-actions">
                    <button class="btn-app" onclick="editApplication(${app.id})">Edit</button>
                    <button class="btn-app btn-app-primary" onclick="confirmInterviewDone(${app.id})">Mark Done</button>
                </div>
            </div>
        `;
    }).join('');
}

function createApplication(data) {
    const newApp = {
        id: generateId(),
        company: data.company,
        position: data.position,
        location: data.location,
        appliedDate: data.appliedDate,
        status: data.status,
        interviewDate: data.interviewDate || '',
        interviewTime: data.interviewTime || '',
        interviewType: data.interviewType || '',
        interviewVenue: data.interviewVenue || '',
        interviewPlatform: data.interviewPlatform || '',
        interviewLink: data.interviewLink || '',
        interviewContact: data.interviewContact || '',
        jobLink: data.jobLink || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
    };
    
    applications.push(newApp);
    saveApplications();
    renderApplications();
    showToast('One opportunity at a time. ✨');
}

function updateApplication(data) {
    const index = applications.findIndex(app => app.id === editingId);
    if (index !== -1) {
        applications[index] = { ...applications[index], ...data };
        saveApplications();
        renderApplications();
        showToast('Application updated');
    }
}

function deleteApplication(id) {
    if (!confirm('Delete this application?')) return;
    
    applications = applications.filter(app => app.id !== id);
    saveApplications();
    renderApplications();
    showToast('Keep moving. Your story doesn\'t end here.');
}

function confirmInterviewDone(id) {
    const app = applications.find(a => a.id === id);
    if (app) {
        interviewDoneId = id;
        interviewConfirmText.textContent = `You've completed your interview with ${app.company}.`;
        interviewDoneModal.classList.add('active');
    }
}

function markInterviewDone() {
    if (interviewDoneId) {
        const index = applications.findIndex(app => app.id === interviewDoneId);
        if (index !== -1) {
            applications[index].status = 'Interview Done';
            saveApplications();
            renderApplications();
            showToast('Interview completed. Another step forward. 🎯');
            interviewDoneId = null;
        }
    }
}

function editApplication(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    editingId = id;
    modalTitle.textContent = 'Update opportunity';
    saveBtn.textContent = 'Save changes';
    
    document.getElementById('companyName').value = app.company;
    document.getElementById('position').value = app.position;
    document.getElementById('location').value = app.location;
    document.getElementById('appliedDate').value = app.appliedDate;
    
    const statusRadios = document.querySelectorAll('input[name="status"]');
    statusRadios.forEach(radio => {
        radio.checked = radio.value === app.status;
    });
    
    document.getElementById('interviewDate').value = app.interviewDate || '';
    document.getElementById('interviewTime').value = app.interviewTime || '';
    document.getElementById('interviewType').value = app.interviewType || '';
    document.getElementById('interviewVenue').value = app.interviewVenue || '';
    document.getElementById('interviewPlatform').value = app.interviewPlatform || '';
    document.getElementById('interviewLink').value = app.interviewLink || '';
    document.getElementById('interviewContact').value = app.interviewContact || '';
    document.getElementById('jobLink').value = app.jobLink || '';
    document.getElementById('notes').value = app.notes || '';
    
    if (app.status === 'Interview Scheduled' || app.interviewDate) {
        interviewDetailsGroup.classList.remove('hidden');
        updateInterviewFields();
    } else {
        interviewDetailsGroup.classList.add('hidden');
    }
    
    openModal();
}

function updateInterviewFields() {
    const type = interviewType.value;
    
    if (type === 'In Person') {
        venueGroup.classList.remove('hidden');
        platformGroup.classList.add('hidden');
        linkGroup.classList.add('hidden');
        contactGroup.classList.add('hidden');
    } else if (type === 'Online') {
        venueGroup.classList.add('hidden');
        platformGroup.classList.remove('hidden');
        linkGroup.classList.remove('hidden');
        contactGroup.classList.add('hidden');
    } else if (type === 'Phone Call') {
        venueGroup.classList.add('hidden');
        platformGroup.classList.add('hidden');
        linkGroup.classList.add('hidden');
        contactGroup.classList.remove('hidden');
    } else {
        venueGroup.classList.add('hidden');
        platformGroup.classList.add('hidden');
        linkGroup.classList.add('hidden');
        contactGroup.classList.add('hidden');
    }
}

function openModal() {
    applicationModal.classList.add('active');
    document.getElementById('companyName').focus();
}

function closeModal() {
    applicationModal.classList.remove('active');
    editingId = null;
    modalTitle.textContent = 'Add a new opportunity';
    saveBtn.textContent = 'Save opportunity';
    applicationForm.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appliedDate').value = today;
    interviewDetailsGroup.classList.add('hidden');
}

function showDashboard() {
    document.getElementById('dashboardView').classList.add('active');
}

// ============================================
// Theme
// ============================================

function loadTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-theme');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveUser();
    loadTheme();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // ONBOARDING - CRITICAL FIX
    onboardingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = userNameInput.value.trim();
        
        if (name) {
            userName = name;
            saveUser();
            
            // Show brief transition
            const btn = this.querySelector('button[type="submit"]');
            btn.textContent = 'Nice to meet you, ' + name + '.';
            
            setTimeout(() => {
                onboardingScreen.style.display = 'none';
                appContainer.style.display = 'block';
                updateGreeting();
                renderApplications();
                loadTheme();
            }, 800);
        }
    });
    
    // Add Application
    addApplicationBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Add a new opportunity';
        saveBtn.textContent = 'Save opportunity';
        openModal();
    });
    
    emptyStateAddBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Add a new opportunity';
        saveBtn.textContent = 'Save opportunity';
        openModal();
    });
    
    // Modal
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    applicationModal.addEventListener('click', (e) => {
        if (e.target === applicationModal) closeModal();
    });
    
    // Interview Done Modal
    interviewDoneModalClose.addEventListener('click', () => {
        interviewDoneModal.classList.remove('active');
        interviewDoneId = null;
    });
    
    cancelInterviewDoneBtn.addEventListener('click', () => {
        interviewDoneModal.classList.remove('active');
        interviewDoneId = null;
    });
    
    confirmInterviewDoneBtn.addEventListener('click', () => {
        markInterviewDone();
        interviewDoneModal.classList.remove('active');
    });
    
    interviewDoneModal.addEventListener('click', (e) => {
        if (e.target === interviewDoneModal) {
            interviewDoneModal.classList.remove('active');
            interviewDoneId = null;
        }
    });
    
    // Form Submit
    applicationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const status = document.querySelector('input[name="status"]:checked').value;
        const hasInterview = status === 'Interview Scheduled';
        
        const data = {
            company: document.getElementById('companyName').value.trim(),
            position: document.getElementById('position').value.trim(),
            location: document.getElementById('location').value.trim(),
            appliedDate: document.getElementById('appliedDate').value,
            status: status,
            interviewDate: hasInterview ? document.getElementById('interviewDate').value : '',
            interviewTime: hasInterview ? document.getElementById('interviewTime').value : '',
            interviewType: hasInterview ? document.getElementById('interviewType').value : '',
            interviewVenue: hasInterview ? document.getElementById('interviewVenue').value : '',
            interviewPlatform: hasInterview ? document.getElementById('interviewPlatform').value : '',
            interviewLink: hasInterview ? document.getElementById('interviewLink').value : '',
            interviewContact: hasInterview ? document.getElementById('interviewContact').value : '',
            jobLink: document.getElementById('jobLink').value.trim(),
            notes: document.getElementById('notes').value.trim()
        };
        
        if (hasInterview) {
            if (!data.interviewDate || !data.interviewTime || !data.interviewType) {
                showToast('Please add interview date, time and type');
                return;
            }
            
            if (data.interviewType === 'In Person' && !data.interviewVenue) {
                showToast('Where is the interview happening?');
                return;
            }
            
            if (data.interviewType === 'Online' && !data.interviewPlatform) {
                showToast('Which platform will you use?');
                return;
            }
        }
        
        if (editingId) {
            updateApplication(data);
        } else {
            createApplication(data);
        }
        
        closeModal();
    });
    
    // Interview Type Change
    interviewType.addEventListener('change', updateInterviewFields);
    
    // Status Change
    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Interview Scheduled') {
                interviewDetailsGroup.classList.remove('hidden');
            } else {
                interviewDetailsGroup.classList.add('hidden');
            }
        });
    });
    
    // Search & Filter
    searchInput.addEventListener('input', renderApplications);
    statusFilter.addEventListener('change', renderApplications);
    sortOptions.addEventListener('change', renderApplications);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderApplications();
    });
    
    // Theme
    themeToggle.addEventListener('click', toggleTheme);
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            interviewDoneModal.classList.remove('active');
        }
    });
}

// ============================================
// Initialize
// ============================================

function init() {
    // Initialize DOM elements
    initDOMElements();
    
    // Load data
    loadUser();
    loadApplications();
    
    if (userName) {
        // Returning user
        onboardingScreen.style.display = 'none';
        appContainer.style.display = 'block';
        updateGreeting();
        renderApplications();
        loadTheme();
    } else {
        // New user - show onboarding
        onboardingScreen.style.display = 'flex';
        appContainer.style.display = 'none';
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appliedDate').value = today;
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}