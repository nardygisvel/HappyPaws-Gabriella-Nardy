// --- Custom Modal Functions ---
        const customModal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        function showModal(title, message) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            customModal.style.display = 'flex';
        }

        function hideModal() {
            customModal.style.display = 'none';
        }


        // --- Booking Widget Logic ---
        let currentStep = 1;
        let selectedService = 'Consultation';
        let selectedDate = '';
        let selectedTime = '';
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        
        const stepTitles = {
            1: 'Choose a Date',
            2: 'Select a Time',
            3: 'Your Information',
            4: 'All Set!'
        };
        
        const stepDescriptions = {
            1: 'Select your preferred appointment date',
            2: 'Pick a time that works best for you',
            3: 'Just a few details to complete your booking',
            4: 'Your appointment has been confirmed'
        };
        
        function updateProgress() {
            const progress = (currentStep / 4) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('stepTitle').textContent = stepTitles[currentStep];
            document.getElementById('stepDescription').textContent = stepDescriptions[currentStep];
            
            document.getElementById('backBtn').style.display = currentStep > 1 && currentStep < 4 ? 'inline-block' : 'none';
            document.getElementById('submitBtn').style.display = currentStep === 3 ? 'inline-block' : 'none';
        }
        
        function generateCalendar() {
            const grid = document.getElementById('calendarGrid');
            grid.innerHTML = '';
            
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            document.getElementById('currentMonth').textContent = 
                new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
            
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                grid.appendChild(emptyDay);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayDate = new Date(currentYear, currentMonth, day);
                dayDate.setHours(0, 0, 0, 0);
                const isPast = dayDate < today;
                
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day' + (isPast ? ' disabled' : '');
                dayDiv.textContent = day;
                dayDiv.dataset.day = day;
                
                if (!isPast) {
                    dayDiv.addEventListener('click', function() {
                        selectDate(this.dataset.day);
                    });
                }
                
                grid.appendChild(dayDiv);
            }
        }
        
        function changeMonth(delta) {
            currentMonth += delta;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar();
        }
        
        function selectDate(day) {
            selectedDate = new Date(currentYear, currentMonth, day);
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            
            const days = document.querySelectorAll('.calendar-day');
            days.forEach(d => {
                if (d.dataset.day == day) {
                    d.classList.add('selected');
                }
            });
            
            setTimeout(() => nextStep(), 300);
        }
        
        function generateTimeSlots() {
            const container = document.getElementById('timeSlots');
            container.innerHTML = '';
            document.getElementById('selectedDate').textContent = 
                selectedDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' });
            
            const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
            
            times.forEach(time => {
                const col = document.createElement('div');
                col.className = 'col-6 col-md-3';
                
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = time;
                slot.dataset.time = time;
                
                slot.addEventListener('click', function() {
                    selectTime(this.dataset.time);
                });
                
                col.appendChild(slot);
                container.appendChild(col);
            });
        }
        
        function selectTime(time) {
            selectedTime = time;
            document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
            
            const slots = document.querySelectorAll('.time-slot');
            slots.forEach(slot => {
                if (slot.dataset.time === time) {
                    slot.classList.add('selected');
                }
            });
            
            setTimeout(() => nextStep(), 300);
        }
        
        function nextStep() {
            if (currentStep < 4) {
                document.getElementById('step' + currentStep).classList.add('step-hidden');
                currentStep++;
                document.getElementById('step' + currentStep).classList.remove('step-hidden');
                updateProgress();
                
                if (currentStep === 2) {
                    generateTimeSlots();
                } else if (currentStep === 4) {
                    showConfirmation();
                }
            }
        }
        
        function previousStep() {
            if (currentStep > 1) {
                document.getElementById('step' + currentStep).classList.add('step-hidden');
                currentStep--;
                document.getElementById('step' + currentStep).classList.remove('step-hidden');
                updateProgress();
            }
        }
        
        function showConfirmation() {
            document.getElementById('confirmService').textContent = selectedService;
            document.getElementById('confirmDate').textContent = selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            document.getElementById('confirmTime').textContent = selectedTime;
        }
        
        // Validation logic for the booking form (Step 3)
        function validateAndSubmitBooking() {
            let isValid = true;
            
            const nameInput = document.getElementById('bookingName');
            const emailInput = document.getElementById('bookingEmail');
            const phoneInput = document.getElementById('bookingPhone');
            
            // Re-using validation helpers from below
            if (nameInput.value.trim() === '') {
                showError('bookingName', 'bookingNameError', true);
                isValid = false;
            } else {
                showError('bookingName', 'bookingNameError', false);
            }

            if (!validateEmail(emailInput.value.trim())) {
                showError('bookingEmail', 'bookingEmailError', true);
                isValid = false;
            } else {
                showError('bookingEmail', 'bookingEmailError', false);
            }

            if (!validatePhone(phoneInput.value.trim())) {
                showError('bookingPhone', 'bookingPhoneError', true);
                isValid = false;
            } else {
                showError('bookingPhone', 'bookingPhoneError', false);
            }

            if (isValid) {
                // Since validation passed, move to confirmation step
                nextStep();
            }
        }
        
        function resetForm() {
            currentStep = 1;
            selectedService = 'Consultation';
            selectedDate = '';
            selectedTime = '';
            
            document.querySelectorAll('.step').forEach(step => step.classList.add('step-hidden'));
            document.getElementById('step1').classList.remove('step-hidden');
            document.getElementById('contactFormBooking').reset();
            generateCalendar();
            updateProgress();
        }
        
        generateCalendar();
        updateProgress();

        // --- General Contact Form Validation (contactForm2) ---
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function validatePhone(phone) {
            const re = /^[\d\s\-\+\(\)]{10,}$/;
            return re.test(phone);
        }

        function showError(fieldId, errorId, show) {
            const errorEl = document.getElementById(errorId);
            const field = document.getElementById(fieldId);
            if (errorEl && field) { // Safety check
                if (show) {
                    errorEl.style.display = 'block';
                    field.classList.add('is-invalid');
                } else {
                    errorEl.style.display = 'none';
                    field.classList.remove('is-invalid');
                }
            }
        }

        document.getElementById('contactForm2').addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (name === '') {
                showError('name', 'nameError', true);
                isValid = false;
            } else {
                showError('name', 'nameError', false);
            }

            if (!validateEmail(email)) {
                showError('email', 'emailError', true);
                isValid = false;
            } else {
                showError('email', 'emailError', false);
            }

            if (!validatePhone(phone)) {
                showError('phone', 'phoneError', true);
                isValid = false;
            } else {
                showError('phone', 'phoneError', false);
            }

            if (isValid) {
                showModal('Success!', 'Thank you for contacting us! We will get back to you soon.');
                this.reset();
            }
        });