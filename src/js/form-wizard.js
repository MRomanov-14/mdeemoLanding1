export function initFormWizard() {
    let currentStep = 1;
    const form = document.getElementById('recruitment-form');
    if (!form) return;

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

    // Helper: Transition animation
    function transitionStep(currentId, nextId, direction) {
        const currentEl = document.getElementById(currentId);
        const nextEl = document.getElementById(nextId);

        if (!currentEl || !nextEl) return;

        // GSAP-like manual transition for now, or could import GSAP here if we want complex animations
        // Stick to simple CSS manip for consistency with previous logic but cleaner

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

    // Expose functions to window ONLY if necessary or bind events directly
    // Ideally we bind events here instead of using onclick in HTML

    // Bind Next/Prev buttons
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => {
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
        btn.addEventListener('click', () => {
            const terms = document.getElementById('terms-recruitment');
            const label = document.querySelector('label[for="terms-recruitment"]');

            if (terms && !terms.checked) {
                // Visual feedback instead of alert
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

                return;
            }
            transitionStep('step-3', 'step-success', 'next');
            document.getElementById('progress-line').style.width = '100%';
        });
    });

    // Initial state
    updateProgress(1);
}
