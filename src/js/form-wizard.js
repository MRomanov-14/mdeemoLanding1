import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

// Enhanced initialization with detailed error logging
try {
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully');
    } else {
        console.error('CRITICAL: Supabase credentials missing!');
        console.log('URL available:', !!supabaseUrl);
        console.log('Key available:', !!supabaseKey);
    }
} catch (error) {
    console.error('Error initializing Supabase:', error);
}

export function initFormWizard() {
    let currentStep = 1;
    const form = document.getElementById('recruitment-form');
    if (!form) return;

    // Prevent double init
    if (form.hasAttribute('data-wizard-initialized')) return;
    form.setAttribute('data-wizard-initialized', 'true');

    console.log('Form Wizard Initialized');

    // Helper: update progress bar
    function updateProgress(step) {
        const progressLine = document.getElementById('progress-line');
        const dots = document.querySelectorAll('.step-dot');

        const progress = ((step - 1) / 2) * 100;
        progressLine.style.width = `${progress}%`;

        dots.forEach(dot => {
            const s = parseInt(dot.getAttribute('data-step'));
            if (s <= step) {
                dot.classList.add('bg-brand-primary', 'text-black', 'border-transparent', 'shadow-[0_0_15px_rgba(234,179,8,0.5)]');
                dot.classList.remove('bg-brand-dark', 'border-white/20', 'text-white');
                if (s < step) dot.innerHTML = '<i class="fa-solid fa-check"></i>';
                else dot.innerHTML = s;
            } else {
                dot.classList.remove('bg-brand-primary', 'text-black', 'border-transparent', 'shadow-[0_0_15px_rgba(234,179,8,0.5)]');
                dot.classList.add('bg-brand-dark', 'border-white/20', 'text-white');
                dot.innerHTML = s;
            }
        });
    }

    // Helper: Show toast notification
    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full flex items-center gap-3 max-w-md`;
        
        if (type === 'error') {
            toast.classList.add('bg-red-500/90', 'backdrop-blur-md', 'text-white', 'border', 'border-red-400');
            toast.innerHTML = `
                <i class="fa-solid fa-circle-exclamation text-2xl"></i>
                <div>
                    <p class="font-bold">Error de validación</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
            `;
        } else if (type === 'info') {
            toast.classList.add('bg-blue-500/90', 'backdrop-blur-md', 'text-white', 'border', 'border-blue-400');
            toast.innerHTML = `
                <i class="fa-solid fa-info-circle text-2xl"></i>
                <div>
                    <p class="font-bold">Información</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
            `;
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Helper: Show error
    function showError(input, message = 'Campo requerido') {
        let target = input;
        
        // Handle custom dropdown hidden input error
        if (input.type === 'hidden' && input.id === 'candidate-area') {
            target = document.getElementById('dropdown-trigger');
        }
        // Handle file input container
        if (input.type === 'file') {
             target = input.closest('div');
        }

        target.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'bg-red-500/10');
        const container = target.closest('div') || target.parentElement;
        
        // Find or create error message element
        let msgEl = container.querySelector('.validation-msg');
        if (!msgEl) {
            msgEl = document.createElement('p');
            msgEl.className = 'validation-msg text-red-500 text-xs mt-1 font-bold animate-pulse';
            container.appendChild(msgEl);
        }
        msgEl.innerText = message;
        
        // Add shake animation class if not already present
        if(!container.classList.contains('animate-shake')) {
             container.classList.add('animate-shake');
        }

        // Remove error after 3s (gave user time to read)
        setTimeout(() => {
            target.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'bg-red-500/10');
            container.classList.remove('animate-shake');
            if (msgEl) msgEl.remove();
        }, 3000);
    }

    // Helper: Init Custom Dropdown logic
    function initCustomDropdown() {
        // ... existing code ...
        const trigger = document.getElementById('dropdown-trigger');
        const menu = document.getElementById('dropdown-menu');
        const hiddenInput = document.getElementById('candidate-area');
        const label = document.getElementById('dropdown-label');
        const arrow = document.getElementById('dropdown-arrow');
        const container = document.getElementById('dropdown-area');

        if (!trigger || !menu || !hiddenInput) return;

        // Toggle state
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isClosed = menu.classList.contains('hidden');
            
            if (isClosed) {
                // Open
                menu.classList.remove('hidden');
                // Small delay to allow display:block to apply before opacity transition
                requestAnimationFrame(() => {
                    menu.classList.remove('opacity-0', 'translate-y-2');
                });
                arrow.classList.add('rotate-180');
                trigger.setAttribute('aria-expanded', 'true');
            } else {
                // Close
                menu.classList.add('opacity-0', 'translate-y-2');
                arrow.classList.remove('rotate-180');
                trigger.setAttribute('aria-expanded', 'false');
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300);
            }
        });

        // Outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.add('opacity-0', 'translate-y-2');
                arrow.classList.remove('rotate-180');
                trigger.setAttribute('aria-expanded', 'false');
                setTimeout(() => {
                     menu.classList.add('hidden');
                }, 300);
            }
        });

        // Item selection
        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent bubbling causing double toggle
                e.stopPropagation();

                const value = item.getAttribute('data-value');
                const iconClass = item.querySelector('i').className;
                const text = item.querySelector('span.block').textContent;

                // Update input
                hiddenInput.value = value;

                // Update label (showing icon + text)
                label.innerHTML = `<i class="${iconClass} text-brand-primary"></i> ${text}`;
                
                // Update trigger style
                trigger.classList.remove('text-gray-400');
                trigger.classList.add('text-white');

                // Close menu
                menu.classList.add('opacity-0', 'translate-y-2');
                arrow.classList.remove('rotate-180');
                trigger.setAttribute('aria-expanded', 'false');
                setTimeout(() => {
                     menu.classList.add('hidden');
                }, 300);
            });
        });
    }

    // Initialize Custom Dropdown
    initCustomDropdown();

    // Initialize File Upload Logic (Drag & Drop + Click)
    function initFileUpload() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('candidate-cv');
        
        if (!dropZone || !fileInput) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);

        // Handle click selection via input change
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            dropZone.classList.add('border-brand-primary', 'bg-white/10');
            dropZone.classList.remove('border-white/20');
        }

        function unhighlight(e) {
            // Only remove if no file selected yet, or just styling revert logic
             const file = fileInput.files[0];
             if(!file) {
                dropZone.classList.remove('border-brand-primary', 'bg-white/10');
                dropZone.classList.add('border-white/20');
             }
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            // Assign to input
            fileInput.files = files;
            handleFiles(files);
        }

        function handleFiles(files) {
            const file = files[0];
            const mainText = document.getElementById('upload-main-text');
            const subText = document.getElementById('file-upload-text');
            const icon = document.getElementById('file-upload-icon');
            
            if (file) {
                // Validate PDF only here visually as well
                if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                    showModal('Solo se permiten archivos PDF', 'error');
                    fileInput.value = ''; // Reset
                    
                    // Reset UI
                    mainText.innerText = 'Haz clic para subir tu CV';
                    mainText.classList.remove('text-brand-primary');
                    mainText.classList.add('text-white');
                    
                    subText.innerText = 'Formato: PDF (Máx 5MB)';
                    subText.classList.remove('text-white', 'font-bold', 'bg-white/10', 'px-3', 'py-1', 'rounded-lg', 'inline-block');
                    subText.classList.add('text-gray-500');

                    icon.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>';
                    icon.classList.add('bg-white/5', 'text-gray-400');
                    icon.classList.remove('bg-brand-primary', 'text-black', 'scale-110', 'animate-pop');

                    dropZone.classList.remove('border-brand-primary', 'bg-brand-primary/5', 'border-solid');
                    dropZone.classList.add('border-dashed', 'border-white/20');
                    return;
                }

                // Update UI Success
                mainText.innerText = '¡Archivo Seleccionado!';
                mainText.classList.add('text-brand-primary');
                mainText.classList.remove('text-white');

                subText.innerText = file.name;
                subText.classList.add('text-white', 'font-bold', 'bg-white/10', 'px-3', 'py-1', 'rounded-lg', 'inline-block');
                subText.classList.remove('text-gray-500');
                
                // Icon Animation
                icon.innerHTML = '<i class="fa-solid fa-file-circle-check"></i>';
                icon.classList.remove('bg-white/5', 'text-gray-400');
                icon.classList.add('bg-brand-primary', 'text-black', 'scale-110', 'animate-pop');
                
                // Container
                dropZone.classList.add('border-brand-primary', 'bg-brand-primary/5', 'border-solid');
                dropZone.classList.remove('border-dashed', 'border-white/20');
            }
        }
    }
    
    // Call init
    initFileUpload();

    // Helper: Validate step
    function validateStep(stepId) {
        const stepEl = document.getElementById(`step-${stepId}`);
        if (!stepEl) return true;

        const inputs = stepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;
        let firstError = null;

        inputs.forEach(input => {
            const val = input.value.trim();
            
            // Check for empty values
            if (!val) {
                const fieldName = input.id === 'candidate-name' ? 'Nombre completo' :
                                 input.id === 'candidate-email' ? 'Correo electrónico' :
                                 input.id === 'candidate-phone' ? 'Teléfono/WhatsApp' :
                                 input.id === 'candidate-area' ? 'Área de interés' : 'Este campo';
                
                showError(input, `${fieldName} es obligatorio`);
                if (!firstError) firstError = `Por favor completa el campo: ${fieldName}`;
                isValid = false;
                return; // Stop checking other rules for this input
            }
            
            // Specific checks
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    showError(input, 'Formato de email inválido');
                    if (!firstError) firstError = 'El correo debe tener el formato: usuario@dominio.com';
                    isValid = false;
                }
            }

            // Name Validation (Letters and spaces only, at least 3 chars)
            if (input.id === 'candidate-name') {
                const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                if (!nameRegex.test(val)) {
                    showError(input, 'Solo se permiten letras y espacios');
                    if (!firstError) firstError = 'El nombre solo puede contener letras y espacios';
                    isValid = false;
                } else if (val.length < 3) {
                    showError(input, 'Debe tener al menos 3 caracteres');
                    if (!firstError) firstError = 'El nombre debe tener al menos 3 caracteres';
                    isValid = false;
                } else if (val.split(' ').filter(word => word.length > 0).length < 2) {
                    showError(input, 'Por favor ingresa tu nombre completo');
                    if (!firstError) firstError = 'Por favor ingresa tu nombre y apellido completos';
                    isValid = false;
                }
            }

            // Phone Validation (Exactly 10 digits, numeric only)
            if (input.id === 'candidate-phone') {
                const phoneRegex = /^\d{10}$/;
                
                if (!/^\d+$/.test(val)) {
                    showError(input, 'Solo se permiten números');
                    if (!firstError) firstError = 'El teléfono solo puede contener números (sin espacios ni guiones)';
                    isValid = false;
                } else if (val.length !== 10) {
                    showError(input, 'Debe tener exactamente 10 dígitos');
                    if (!firstError) firstError = `El teléfono debe tener 10 dígitos (ingresaste ${val.length})`;
                    isValid = false;
                } else if (!phoneRegex.test(val)) {
                    showError(input, 'Formato de teléfono inválido');
                    if (!firstError) firstError = 'El número de teléfono no es válido';
                    isValid = false;
                }
            }

            // Cedula Validation
            if (input.id === 'candidate-cedula') {
                const cedulaRegex = /^\d+$/;
                if (!cedulaRegex.test(val)) {
                     showError(input, 'Solo números permitidos');
                     if (!firstError) firstError = 'La cédula debe contener solo números';
                     isValid = false;
                } else if (val.length < 5) {
                     showError(input, 'Mínimo 5 dígitos');
                     if (!firstError) firstError = 'Cédula inválida (muy corta)';
                     isValid = false;
                }
            }

            if (input.type === 'radio') {
                const name = input.name;
                const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
                const container = input.closest('.flex'); 
                if (!checked) {
                    if(container) {
                         // reuse showError logic manually or simplify
                         container.classList.add('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-xl');
                         container.classList.add('animate-shake');
                         setTimeout(() => {
                            container.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2', 'rounded-xl');
                            container.classList.remove('animate-shake');
                         }, 3000);
                    }
                    if (!firstError) firstError = 'Por favor selecciona una opción';
                    isValid = false;
                }
            }
             // File validation
             if (input.type === 'file') {
                if (input.files.length === 0) {
                    showError(input, 'Debes adjuntar tu hoja de vida');
                    if (!firstError) firstError = 'Por favor adjunta tu hoja de vida en formato PDF, DOC o DOCX';
                    isValid = false;
                } else {
                    // Validate file type
                    const file = input.files[0];
                    const validTypes = ['application/pdf'];
                    const validExtensions = ['.pdf'];
                    const fileName = file.name.toLowerCase();
                    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
                    
                    if (!validTypes.includes(file.type) && !hasValidExtension) {
                        showError(input, 'Solo se permiten archivos PDF');
                        if (!firstError) firstError = 'El archivo debe ser PDF';
                        isValid = false;
                    }
                    
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showError(input, 'El archivo es muy grande (máx. 5MB)');
                        if (!firstError) firstError = 'El archivo no puede superar los 5MB';
                        isValid = false;
                    }
                }
            }
        });

        // Show toast notification with the first error
        if (!isValid && firstError) {
            showToast(firstError, 'error');
        }

        return isValid;
    }

    // Dynamic History Check
    const cedulaInput = document.getElementById('candidate-cedula');
    if (cedulaInput) {
        cedulaInput.addEventListener('blur', async () => {
             const val = cedulaInput.value.trim();
             if (val.length >= 5) {
                 try {
                     const splitBtn = document.getElementById('dropdown-trigger');
                     // Visual feedback loading
                     if(splitBtn) splitBtn.classList.add('opacity-50', 'cursor-wait');

                     const res = await fetch(`/api/candidates?cedula=${val}`);
                     if (res.ok) {
                         const { areas } = await res.json();
                         updateDropdownState(areas);
                     }
                 } catch (e) {
                     console.error('Error fetching history', e);
                 } finally {
                     const splitBtn = document.getElementById('dropdown-trigger');
                     if(splitBtn) splitBtn.classList.remove('opacity-50', 'cursor-wait');
                 }
             }
        });
    }

    function updateDropdownState(disabledAreas) {
        const menu = document.getElementById('dropdown-menu');
        if (!menu) return;

        const items = menu.querySelectorAll('.dropdown-item');
        const hiddenInput = document.getElementById('candidate-area');
        const triggerLabel = document.getElementById('dropdown-label');
        const trigger = document.getElementById('dropdown-trigger');

        let currentValDisabled = false;

        items.forEach(item => {
            const val = item.getAttribute('data-value');
            const span = item.querySelector('span.block');
            
            // Reset functionality
            item.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
            // Remove appended text if exists (simplistic check)
            if (span.innerText.includes('(Postulado)')) {
                span.innerText = span.innerText.replace(' (Postulado)', '');
            }

            if (disabledAreas.includes(val)) {
                item.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
                span.innerText += ' (Postulado)';
                
                // If currently selected is disabled
                if (hiddenInput.value === val) {
                    currentValDisabled = true;
                }
            }
        });

        if (currentValDisabled) {
             showToast('Ya te has postulado al cargo seleccionado anteriormente.', 'info');
             // Reset selection
             hiddenInput.value = '';
             triggerLabel.innerText = 'Selecciona un cargo';
             trigger.classList.add('text-gray-400');
             trigger.classList.remove('text-white');
        }
    }

    // Upload CV Function
    async function uploadCV(file) {
        if (!supabase) {
            throw new Error('Supabase no está inicializado. Verifica las credenciales (PUBLIC_SUPABASE_URL).');
        }

        // Sanitize filename: timestamps + safe chars 
        const timestamp = new Date().getTime();
        // Remove accents/spaces
        const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `${timestamp}_${safeName}`;
        const filePath = `Hojas de vida candidatos/${fileName}`;

        console.log('Uploading file to:', filePath);

        const { data, error } = await supabase.storage
            .from('mdeemolanding')
            .upload(filePath, file);

        if (error) {
            console.error('Supabase Storage Error:', error);
            // Enhance error message for the modal
            const msg = error.error_description || error.message || JSON.stringify(error);
            throw new Error(`Error Supabase: ${msg}`);
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('mdeemolanding')
            .getPublicUrl(filePath);

        return publicUrl;
    }


    // Transition animation
    function transitionStep(currentId, nextId, direction) {
        const currentEl = document.getElementById(currentId);
        const nextEl = document.getElementById(nextId);

        if (!currentEl || !nextEl) return;

        currentEl.style.opacity = '0';
        currentEl.style.transform = direction === 'next' ? 'translateX(-20px)' : 'translateX(20px)';

        setTimeout(() => {
            currentEl.classList.add('hidden');
            nextEl.classList.remove('hidden');

            // Prepare enter state
            nextEl.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
            nextEl.style.opacity = '0'; // Ensure it starts hidden

            requestAnimationFrame(() => {
                setTimeout(() => {
                    nextEl.style.opacity = '1';
                    nextEl.style.transform = 'translateX(0)';
                }, 50);
            });
        }, 300);
    }

    // Helper: Show Modal (Custom Alert)
    function showModal(message, type = 'error') {
        const modalId = 'custom-alert-modal';
        // Remove existing if any
        const existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = modalId;
        modalOverlay.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0 transition-opacity duration-300';
        
        const icon = type === 'success' ? '<i class="fa-solid fa-check-circle text-brand-primary text-4xl mb-4"></i>' : 
                     '<i class="fa-solid fa-circle-exclamation text-red-500 text-4xl mb-4"></i>';
        
        const btnClass = type === 'success' ? 'bg-brand-primary text-black hover:bg-yellow-400' : 'bg-brand-primary text-black hover:bg-yellow-400';

        modalOverlay.innerHTML = `
            <div class="bg-brand-dark border border-white/10 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-95 transition-all duration-300" id="${modalId}-content">
                ${icon}
                <p class="text-white text-lg font-medium mb-6">${message}</p>
                <button id="${modalId}-btn" class="px-6 py-2 rounded-full font-bold ${btnClass} transition-colors shadow-lg">
                    Aceptar
                </button>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Animate in
        requestAnimationFrame(() => {
            modalOverlay.classList.remove('opacity-0');
            const content = modalOverlay.querySelector(`#${modalId}-content`);
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        });

        // Close logic
        const close = () => {
            modalOverlay.classList.add('opacity-0');
            const content = modalOverlay.querySelector(`#${modalId}-content`);
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => modalOverlay.remove(), 300);
        };

        const btn = modalOverlay.querySelector(`#${modalId}-btn`);
        btn.addEventListener('click', close);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) close();
        });
        
        // Focus button for accessibility
        btn.focus();
    }

    // Bind Next/Prev buttons
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => {
             // Validate before moving
             if (!validateStep(currentStep)) return;

            const next = parseInt(btn.getAttribute('data-target'));
            transitionStep(`step-${currentStep}`, `step-${next}`, 'next');
            currentStep = next;
            updateProgress(currentStep);
        });
    });

    document.querySelectorAll('[data-action="prev"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const prev = parseInt(btn.getAttribute('data-target'));
            transitionStep(`step-${currentStep}`, `step-${prev}`, 'prev');
            currentStep = prev;
            updateProgress(currentStep);
        });
    });

    document.querySelectorAll('[data-action="finish"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const terms = document.getElementById('terms-recruitment');
            const label = document.querySelector('label[for="terms-recruitment"]');
            
            // Validate Terms
            if (terms && !terms.checked) {
                // Visual feedback
                terms.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
                label.classList.add('text-red-500');

                // Shake effect
                const container = terms.parentElement;
                container.classList.add('animate-shake');
                setTimeout(() => {
                    container.classList.remove('animate-shake');
                    terms.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2');
                    label.classList.remove('text-red-500');
                }, 1000);
                
                showModal('Por favor, acepta los términos y condiciones para continuar.');
                return;
            }

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;

            const expInput = document.querySelector('input[name="exp"]:checked');
            const fileInput = document.getElementById('candidate-cv');
            // Since we moved the input, ensure we get the file correctly
            const file = fileInput ? fileInput.files[0] : null;

            if(!file) {
                 showModal('Por favor, adjunta tu hoja de vida.'); // Custom Modal replaced alert
                 btn.innerHTML = originalText;
                 btn.disabled = false;
                 return;
            }

            try {
                // 1. Upload CV
                let cvUrl = '';
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-fade"></i> Subiendo CV...';
                
                try {
                    cvUrl = await uploadCV(file);
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                     showModal('Error al subir el CV. Intenta de nuevo o verifica tu conexión.');
                     btn.innerHTML = originalText;
                     btn.disabled = false;
                     return;
                }

                // 2. Submit Data
                btn.innerHTML = '<i class="fa-solid fa-paper-plane fa-fade"></i> Finalizando...';
                
                const data = {
                    fullName: document.getElementById('candidate-name').value,
                    cedula: document.getElementById('candidate-cedula').value,
                    email: document.getElementById('candidate-email').value,
                    phone: document.getElementById('candidate-phone').value,
                    areaInterest: document.getElementById('candidate-area').value,
                    experienceYears: expInput ? expInput.value : '',
                    cvUrl: cvUrl
                };

                const response = await fetch('/api/candidates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    transitionStep('step-3', 'step-success', 'next');
                    document.getElementById('progress-line').style.width = '100%';
                } else if (response.status === 409) {
                    const res = await response.json();
                     showModal('⚠️ ' + (res.message || 'Ya te has postulado a este cargo con esta cédula.'), 'warning');
                     btn.innerHTML = originalText;
                     btn.disabled = false;
                } else {
                    const res = await response.json();
                    showModal('Error al enviar: ' + (res.error || 'Intenta nuevamente.'));
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                showModal('Error de conexión.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    });

    // Initial state
    updateProgress(1);
}
