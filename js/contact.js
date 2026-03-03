class SmoothAsyncTransition {
            constructor() {
                this.form = document.getElementById('profileForm');
                this.formContainer = document.getElementById('formContainer');
                this.submitBtn = document.getElementById('submitBtn');
                this.btnText = this.submitBtn.querySelector('.btn-text');
                this.statusMessage = document.getElementById('statusMessage');
                
                this.isPending = false;
                this.formData = {
                    name: '',
                    email: '',
                    bio: ''
                };

                this.typingTimeouts = {};
                this.init();
            }

            init() {
                // Add event listeners
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
                
                // Add input listeners for real-time updates
                ['name', 'email', 'bio'].forEach(field => {
                    const input = document.getElementById(field);
                    input.addEventListener('input', (e) => this.handleInputChange(e));
                    input.addEventListener('focus', (e) => this.handleInputFocus(e));
                    input.addEventListener('blur', (e) => this.handleInputBlur(e));
                });
            }

            handleInputChange(e) {
                const { name, value } = e.target;
                
                // Update form data immediately (non-blocking)
                this.formData[name] = value;
                
                // Show typing indicator
                this.showTypingIndicator(name);
                
                // Clear previous timeout
                if (this.typingTimeouts[name]) {
                    clearTimeout(this.typingTimeouts[name]);
                }
                
                // Hide typing indicator after delay
                this.typingTimeouts[name] = setTimeout(() => {
                    this.hideTypingIndicator(name);
                }, 1000);
                
                // Simulate real-time validation or processing
                this.startTransition(() => {
                    // This could be validation, auto-save, etc.
                    console.log(`Processing ${name}: ${value}`);
                });
            }

            handleInputFocus(e) {
                e.target.style.transform = 'translateY(-2px)';
            }

            handleInputBlur(e) {
                if (!e.target.value) {
                    e.target.style.transform = 'translateY(0)';
                }
                this.hideTypingIndicator(e.target.name);
            }

            showTypingIndicator(fieldName) {
                const indicator = document.getElementById(`${fieldName}Typing`);
                if (indicator) {
                    indicator.classList.add('show');
                }
            }

            hideTypingIndicator(fieldName) {
                const indicator = document.getElementById(`${fieldName}Typing`);
                if (indicator) {
                    indicator.classList.remove('show');
                }
            }

            async handleSubmit(e) {
                e.preventDefault();
                
                if (this.isPending) return;

                // Collect current form data
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData.entries());
                
                // Show optimistic update immediately (outside transition)
                this.showOptimisticUpdate();
                
                // Start async transition for the API call
                await this.startTransition(async () => {
                    try {
                        // Simulate API call
                        await fetch("https://formspree.io/f/meelyoko", {
    method: "POST",
    body: formData,
    headers: {
        Accept: "application/json"
    }
});

            async startTransition(callback) {
                // Set pending state
                this.setPending(true);
                
                try {
                    // Execute the callback (this is non-blocking for UI updates)
                    await callback();
                } finally {
                    // Always clear pending state
                    this.setPending(false);
                }
            }

            setPending(pending) {
                this.isPending = pending;
                
                if (pending) {
                    // Update UI to show pending state
                    this.submitBtn.disabled = true;
                    this.submitBtn.classList.add('loading');
                    this.btnText.textContent = 'Submit';
                    this.formContainer.classList.add('pending');
                    
                    // Slightly dim form inputs but keep them interactive
                    this.form.querySelectorAll('input, textarea').forEach(input => {
                        input.style.opacity = '0.8';
                    });
                } else {
                    // Reset UI
                    this.submitBtn.disabled = false;
                    this.submitBtn.classList.remove('loading');
                    this.btnText.textContent = 'Submit';
                    this.formContainer.classList.remove('pending');
                    
                    this.form.querySelectorAll('input, textarea').forEach(input => {
                        input.style.opacity = '1';
                    });
                }
            }

            showOptimisticUpdate() {
                this.showMessage("Sending...", 'optimistic');
            }

            clearOptimisticUpdate() {
                const optimisticMsg = this.statusMessage;
                if (optimisticMsg.classList.contains('optimistic')) {
                    this.hideMessage();
                }
            }

            showSuccessMessage(message) {
                this.showMessage(message, 'success');
                // Auto-hide success message after 3 seconds
                setTimeout(() => this.hideMessage(), 3000);
            }

            showErrorMessage(message) {
                this.showMessage(message, 'error');
                // Auto-hide error message after 5 seconds
                setTimeout(() => this.hideMessage(), 5000);
            }

            showMessage(text, type) {
                this.statusMessage.textContent = text;
                this.statusMessage.className = `status-message ${type} show`;
            }

            hideMessage() {
                this.statusMessage.classList.remove('show');
                setTimeout(() => {
                    this.statusMessage.textContent = '';
                    this.statusMessage.className = 'status-message';
                }, 300);
            }

            async simulateAPICall(data) {
                // Simulate network delay and potential failure
                const delay = 2000 + Math.random() * 1000; // 2-3 seconds
                const shouldFail = Math.random() < 0.2; // 20% chance of failure
                
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (shouldFail) {
                            reject(new Error('API Error'));
                        } else {
                            console.log('API Success:', data);
                            resolve(data);
                        }
                    }, delay);
                });
            }
        }

        // Initialize the smooth async transitions
        document.addEventListener('DOMContentLoaded', () => {
            new SmoothAsyncTransition();
        });

        // Add some extra interactivity
        document.addEventListener('mousemove', (e) => {
            const formContainer = document.getElementById('formContainer');
            const rect = formContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (y / rect.height) * 5;
            const rotateY = -(x / rect.width) * 5;
            
            formContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });

        document.addEventListener('mouseleave', () => {
            const formContainer = document.getElementById('formContainer');
            formContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });