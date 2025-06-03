// Import dependencies
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/bootstrap-icons.css';
import Chart from 'chart.js/auto';
import '../css/app.css';

// Make jQuery and Bootstrap available globally
window.$ = window.jQuery = $;
window.bootstrap = bootstrap;

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Chart instances
let fruitsChartCurrent = null;
let fleshChartCurrent = null;
let fruitsChartAll = null;
let fleshChartAll = null;

// Utility functions
const formatDate = (date) => {
    // Get the local date string in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseDate = (dateStr) => {
    // Parse the date string in local timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const isToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
};

const loadDataForDate = (dateStr) => {
    const existingData = localStorage.getItem(`data_${dateStr}`);
    if (existingData) {
        displayFormContent(JSON.parse(existingData));
    } else {
        clearForm();
    }
};

const displayFormContent = (data) => {
    clearForm();
    if (data.fruits) {
        data.fruits.forEach(fruit => {
            const element = document.querySelector(`.fruit-section td[data-value="${fruit}"]`);
            if (element) element.classList.add('selected');
        });
    }
    if (data.flesh) {
        data.flesh.forEach(work => {
            const element = document.querySelector(`.flesh-section td[data-value="${work}"]`);
            if (element) element.classList.add('selected');
        });
    }
};

const clearForm = () => {
    document.querySelectorAll('.fruit-section td, .flesh-section td')
        .forEach(td => td.classList.remove('selected'));
};

const updateNextButtonState = (dateStr) => {
    const date = parseDate(dateStr);
    const isCurrentDateToday = isToday(date);
    ['nextDateBtn', 'nextDateBtnBottom'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = isCurrentDateToday;
    });
};

// Date picker initialization
const initializeDatePickers = () => {
    const datePickerElements = ['datePicker', 'datePickerBottom']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (datePickerElements.length === 0) {
        console.error('Date picker elements not found');
        return;
    }

    const today = new Date();
    const datePickers = datePickerElements.map(element => {
        try {
            const picker = flatpickr(element, {
                dateFormat: 'Y-m-d',
                maxDate: 'today',
                defaultDate: today,
                clickOpens: false,
                time_24hr: false,
                onChange: (selectedDates, dateStr) => {
                    const otherId = element.id === 'datePicker' ? 'datePickerBottom' : 'datePicker';
                    const otherPicker = document.getElementById(otherId);
                    if (otherPicker) otherPicker.value = dateStr;
                    loadDataForDate(dateStr);
                    updateNextButtonState(dateStr);
                },
                onReady: function(selectedDates, dateStr, instance) {
                    // Add Today button to the calendar
                    const todayBtn = document.createElement('button');
                    todayBtn.className = 'flatpickr-today-button';
                    todayBtn.textContent = 'Today';
                    todayBtn.style.cssText = `
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        border: none;
                        border-top: 1px solid #e6e6e6;
                        background: #f8f9fa;
                        padding: 8px;
                        font-size: 14px;
                        color: #0d6efd;
                        cursor: pointer;
                        border-radius: 0 0 4px 4px;
                    `;
                    todayBtn.addEventListener('click', () => {
                        const today = new Date();
                        instance.setDate(today);
                        const dateStr = formatDate(today);
                        
                        // Update both date pickers
                        datePickerElements.forEach(element => {
                            element.value = dateStr;
                        });
                        
                        // Update other flatpickr instance
                        const otherId = element.id === 'datePicker' ? 'datePickerBottom' : 'datePicker';
                        const otherPicker = document.getElementById(otherId);
                        if (otherPicker) {
                            const otherInstance = otherPicker._flatpickr;
                            if (otherInstance) {
                                otherInstance.setDate(today, false);
                            }
                        }
                        
                        // Load data for today
                        loadDataForDate(dateStr);
                        updateNextButtonState(dateStr);
                    });
                    
                    // Add the button to the calendar
                    instance.calendarContainer.appendChild(todayBtn);
                }
            });

            // Set initial date
            element.value = formatDate(today);

            // Add click handler to the input-group to open the calendar
            const inputGroup = element.closest('.input-group');
            if (inputGroup) {
                inputGroup.style.cursor = 'pointer';
                inputGroup.addEventListener('click', (e) => {
                    e.preventDefault();
                    picker.open();
                });
            }

            return picker;
        } catch (error) {
            console.error('Error initializing flatpickr:', error);
            return null;
        }
    });

    // Setup navigation buttons
    const setupNavigationButton = (id, increment) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                const currentDate = parseDate(datePickerElements[0].value);
                currentDate.setDate(currentDate.getDate() + increment);
                const dateStr = formatDate(currentDate);
                
                // Update both date pickers
                datePickerElements.forEach(element => {
                    element.value = dateStr;
                });
                
                // Update flatpickr instances
                datePickers.forEach(picker => {
                    if (picker) {
                        picker.setDate(currentDate, false); // false to prevent triggering onChange
                    }
                });
                
                // Load data for the new date
                loadDataForDate(dateStr);
                updateNextButtonState(dateStr);
            });
        }
    };

    // Setup navigation buttons
    ['prevDateBtn', 'prevDateBtnBottom'].forEach(id => setupNavigationButton(id, -1));
    ['nextDateBtn', 'nextDateBtnBottom'].forEach(id => setupNavigationButton(id, 1));

    // Initial load
    const initialDate = formatDate(today);
    loadDataForDate(initialDate);
    updateNextButtonState(initialDate);
};

// Event handlers for form elements
const setupFormHandlers = () => {
    document.querySelectorAll('.fruit-section td, .flesh-section td').forEach(td => {
        td.addEventListener('click', () => {
            const dateStr = document.getElementById('datePicker').value;
            const existingData = JSON.parse(localStorage.getItem(`data_${dateStr}`) || '{"fruits":[],"flesh":[]}');
            const section = td.closest('.fruit-section') ? 'fruits' : 'flesh';
            const value = td.dataset.value;
            
            if (existingData[section].includes(value)) {
                existingData[section] = existingData[section].filter(item => item !== value);
                td.classList.remove('selected');
            } else {
                existingData[section].push(value);
                td.classList.add('selected');
            }
            
            localStorage.setItem(`data_${dateStr}`, JSON.stringify(existingData));
        });
    });
};

// Chart functions
const initializeCharts = () => {
    console.log('Initializing charts...');
    
    // Initialize current date charts
    const fruitsCtxCurrent = document.getElementById('fruitsChartCurrent');
    const fleshCtxCurrent = document.getElementById('fleshChartCurrent');
    
    if (fruitsCtxCurrent && fleshCtxCurrent) {
        console.log('Creating current date charts...');
        
        // Destroy existing charts if they exist
        if (fruitsChartCurrent) fruitsChartCurrent.destroy();
        if (fleshChartCurrent) fleshChartCurrent.destroy();
        
        fruitsChartCurrent = new Chart(fruitsCtxCurrent, {
            type: 'pie',
            data: {
                labels: ['Love', 'Joy', 'Peace', 'Patience', 'Kindness', 'Goodness', 'Faithfulness', 'Gentleness', 'Self-control'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Fruits of the Spirit',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            filter: function(legendItem, data) {
                                return data.datasets[0].data[legendItem.index] > 0;
                            }
                        }
                    }
                }
            }
        });

        fleshChartCurrent = new Chart(fleshCtxCurrent, {
            type: 'pie',
            data: {
                labels: ['Sexual Immorality', 'Impurity', 'Sensuality', 'Idolatry', 'Sorcery',
                        'Enmity', 'Strife', 'Jealousy', 'Fits of Anger', 'Rivalries',
                        'Dissensions', 'Divisions', 'Envy', 'Drunkenness', 'Orgies'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Works of the Flesh',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            filter: function(legendItem, data) {
                                return data.datasets[0].data[legendItem.index] > 0;
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.error('Current date chart elements not found');
    }

    // Initialize all time charts
    const fruitsCtxAll = document.getElementById('fruitsChartAll');
    const fleshCtxAll = document.getElementById('fleshChartAll');
    
    if (fruitsCtxAll && fleshCtxAll) {
        console.log('Creating all time charts...');
        
        // Destroy existing charts if they exist
        if (fruitsChartAll) fruitsChartAll.destroy();
        if (fleshChartAll) fleshChartAll.destroy();
        
        fruitsChartAll = new Chart(fruitsCtxAll, {
            type: 'pie',
            data: {
                labels: ['Love', 'Joy', 'Peace', 'Patience', 'Kindness', 'Goodness', 'Faithfulness', 'Gentleness', 'Self-control'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Fruits of the Spirit (All Time)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            filter: function(legendItem, data) {
                                return data.datasets[0].data[legendItem.index] > 0;
                            }
                        }
                    }
                }
            }
        });

        fleshChartAll = new Chart(fleshCtxAll, {
            type: 'pie',
            data: {
                labels: ['Sexual Immorality', 'Impurity', 'Sensuality', 'Idolatry', 'Sorcery',
                        'Enmity', 'Strife', 'Jealousy', 'Fits of Anger', 'Rivalries',
                        'Dissensions', 'Divisions', 'Envy', 'Drunkenness', 'Orgies'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Works of the Flesh (All Time)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10,
                            filter: function(legendItem, data) {
                                return data.datasets[0].data[legendItem.index] > 0;
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.error('All time chart elements not found');
    }
    
    console.log('Chart initialization complete');
};

const updateCharts = () => {
    console.log('Updating charts...');
    
    const currentDate = document.getElementById('datePicker').value;
    const currentData = JSON.parse(localStorage.getItem(`data_${currentDate}`) || '{"fruits":[],"flesh":[]}');
    
    // Update current date charts
    if (fruitsChartCurrent) {
        console.log('Updating current fruits chart...');
        const fruitsData = Array(9).fill(0);
        currentData.fruits.forEach(fruit => {
            const index = ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control'].indexOf(fruit);
            if (index !== -1) fruitsData[index] = 1;
        });
        fruitsChartCurrent.data.datasets[0].data = fruitsData;
        fruitsChartCurrent.update();
    }

    if (fleshChartCurrent) {
        console.log('Updating current flesh chart...');
        const fleshData = Array(15).fill(0);
        currentData.flesh.forEach(work => {
            const index = ['sexual-immorality', 'impurity', 'sensuality', 'idolatry', 'sorcery',
                          'enmity', 'strife', 'jealousy', 'anger', 'rivalries',
                          'dissensions', 'divisions', 'envy', 'drunkenness', 'orgies'].indexOf(work);
            if (index !== -1) fleshData[index] = 1;
        });
        fleshChartCurrent.data.datasets[0].data = fleshData;
        fleshChartCurrent.update();
    }

    // Update all time charts
    const allFruitsData = Array(9).fill(0);
    const allFleshData = Array(15).fill(0);
    
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('data_')) {
            const data = JSON.parse(localStorage.getItem(key));
            
            // Count fruits
            data.fruits.forEach(fruit => {
                const index = ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control'].indexOf(fruit);
                if (index !== -1) allFruitsData[index]++;
            });
            
            // Count flesh
            data.flesh.forEach(work => {
                const index = ['sexual-immorality', 'impurity', 'sensuality', 'idolatry', 'sorcery',
                              'enmity', 'strife', 'jealousy', 'anger', 'rivalries',
                              'dissensions', 'divisions', 'envy', 'drunkenness', 'orgies'].indexOf(work);
                if (index !== -1) allFleshData[index]++;
            });
        }
    });

    if (fruitsChartAll) {
        console.log('Updating all time fruits chart...');
        fruitsChartAll.data.datasets[0].data = allFruitsData;
        fruitsChartAll.update();
    }

    if (fleshChartAll) {
        console.log('Updating all time flesh chart...');
        fleshChartAll.data.datasets[0].data = allFleshData;
        fleshChartAll.update();
    }
    
    console.log('Chart updates complete');
};

// Modal handlers
const setupModalHandlers = () => {
    console.log('Setting up modal handlers...');

    // Get modal elements
    const settingsModalEl = document.getElementById('settingsModal');
    const resetConfirmModalEl = document.getElementById('resetConfirmModal');
    const resultsModalEl = document.getElementById('resultsModal');
    const installPwaModalEl = document.getElementById('installPwaModal');

    if (!settingsModalEl || !resetConfirmModalEl || !resultsModalEl || !installPwaModalEl) {
        console.error('One or more modal elements not found');
        return;
    }

    // Initialize modals
    const settingsModal = new bootstrap.Modal(settingsModalEl);
    const resetConfirmModal = new bootstrap.Modal(resetConfirmModalEl);
    const resultsModal = new bootstrap.Modal(resultsModalEl);
    const installPwaModal = new bootstrap.Modal(installPwaModalEl);

    console.log('Modals initialized');

    // Results modal show event
    resultsModalEl.addEventListener('show.bs.modal', () => {
        console.log('Results modal showing...');
        // Reinitialize charts when modal opens
        initializeCharts();
        updateCharts();
    });

    // Results modal hidden event
    resultsModalEl.addEventListener('hidden.bs.modal', () => {
        console.log('Results modal hidden...');
        // Destroy charts when modal closes
        if (fruitsChartCurrent) fruitsChartCurrent.destroy();
        if (fleshChartCurrent) fleshChartCurrent.destroy();
        if (fruitsChartAll) fruitsChartAll.destroy();
        if (fleshChartAll) fleshChartAll.destroy();
    });

    // Reset data button
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        console.log('Reset data button found');
        resetDataBtn.addEventListener('click', () => {
            console.log('Reset data button clicked');
            settingsModal.hide();
            resetConfirmModal.show();
        });
    } else {
        console.error('Reset data button not found');
    }

    // Confirm reset button
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    if (confirmResetBtn) {
        console.log('Confirm reset button found');
        confirmResetBtn.addEventListener('click', () => {
            console.log('Confirm reset button clicked');
            // Clear all data from localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('data_')) {
                    localStorage.removeItem(key);
                    console.log(`Removed data for key: ${key}`);
                }
            });
            
            // Hide the confirmation modal
            resetConfirmModal.hide();
            
            // Clear the form and reload current date
            clearForm();
            const currentDate = document.getElementById('datePicker').value;
            loadDataForDate(currentDate);
            console.log('Data reset complete');
        });
    } else {
        console.error('Confirm reset button not found');
    }

    // Cancel reset button
    const cancelResetBtn = resetConfirmModalEl.querySelector('.btn-secondary');
    if (cancelResetBtn) {
        console.log('Cancel reset button found');
        cancelResetBtn.addEventListener('click', () => {
            console.log('Cancel reset button clicked');
            resetConfirmModal.hide();
        });
    } else {
        console.error('Cancel reset button not found');
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initializeDatePickers();
    setupFormHandlers();
    setupModalHandlers();
    initializeCharts();
    console.log('App initialization complete');
}); 

// Prevent zoom but allow scrolling, excluding canvas elements
function shouldPreventZoom(e) {
    return e.target.tagName.toLowerCase() !== 'canvas' && e.scale !== 1;
  }
  
  ['gesturestart', 'gesturechange', 'gestureend', 'touchmove'].forEach(event => {
    document.addEventListener(event, e => {
        if (shouldPreventZoom(e)) e.preventDefault();
    }, { passive: false });
  }); 