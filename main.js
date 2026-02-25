// Scroll utility
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {

    // Global Nav Highlights
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Shrink Nav on Scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Reveal Animations using IntersectionObserver
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    // Apply reveal class to major block elements before they stream in
    document.querySelectorAll('.product-card, .test-card, .lore-block, .philosophy-container, .sim-controls-panel, .sim-stage, .form-container, .about-text, .about-img')
        .forEach((el, index) => {
            el.classList.add('reveal');
            // Add a slight stagger for grid items
            if (el.classList.contains('product-card') || el.classList.contains('test-card')) {
                el.style.transitionDelay = `${(index % 3) * 0.15}s`;
            }
            revealObserver.observe(el);
        });


    // Simulator Royal Command Logic
    const blastBtn = document.getElementById('blast-btn');
    if (blastBtn) {
        const titL = document.getElementById('tit-l');
        const titR = document.getElementById('tit-r');
        const overlay = document.getElementById('blast-overlay');
        const blastRing = document.querySelector('.blast-ring');
        const blastText = document.querySelector('.blast-text');
        const yieldSelect = document.getElementById('yield-select');
        const cardiganSelect = document.getElementById('cardigan-select');
        const readoutText = document.getElementById('sim-readout');

        let isBlasting = false;

        blastBtn.addEventListener('click', () => {
            if (isBlasting) return;
            isBlasting = true;

            const yieldVal = yieldSelect ? yieldSelect.value : 'standard';
            const cardiVal = cardiganSelect ? cardiganSelect.value : 'cotton';

            // Shake severity based on yield
            let shakeClass = 'shake-violent';
            if (yieldVal === 'tactical') shakeClass = 'shake-tactical';
            if (yieldVal === 'thermobaric') shakeClass = 'shake-thermo';

            document.body.classList.add(shakeClass);
            blastBtn.innerHTML = '<span class="btn-front">CALIBRATING TARGET LOCUS...</span>';
            blastBtn.disabled = true;

            // Countdown text sequence
            if (readoutText) {
                let cnt = 3;
                readoutText.innerHTML = `> TELEMETRY LINKED. ARMING PAYLOAD. (${yieldVal.toUpperCase()})<br>> T-${cnt}`;
                const cdInterval = setInterval(() => {
                    cnt--;
                    if (cnt > 0) {
                        readoutText.innerHTML = `> TELEMETRY LINKED. ARMING PAYLOAD. (${yieldVal.toUpperCase()})<br>> T-${cnt}`;
                    } else {
                        clearInterval(cdInterval);
                    }
                }, 800);
            }

            // Fire Sequence
            setTimeout(() => {
                document.body.classList.remove(shakeClass);

                // Overlay Activate
                overlay.classList.add('blast-active');

                // Color tweaks based on yield
                if (yieldVal === 'thermobaric') {
                    blastRing.style.borderColor = '#ffaa00';
                    blastRing.style.borderWidth = '150px';
                    blastText.style.color = '#ff6600';
                } else if (yieldVal === 'tactical') {
                    blastRing.style.borderColor = '#00ffff';
                    blastText.style.color = '#0066cc';
                } else {
                    blastRing.style.borderColor = 'var(--accent)';
                    blastText.style.color = '#000';
                }

                blastRing.classList.add('blast-anim');
                blastText.classList.add('text-anim');

                // Bye bye
                titL.classList.add('blown-away-lf');
                titR.classList.add('blown-away-rt');

                if (readoutText) {
                    let cardiDamage = '0.00% FRAYING';
                    if (yieldVal === 'thermobaric' && cardiVal === 'acrylic') cardiDamage = '12% SCORCHING (ACCEPTABLE LOSS)';
                    else if (yieldVal === 'tactical' && cardiVal === 'cashmere') cardiDamage = '0.01% VAPORIZATION (HIGHLY COMMENDABLE)';

                    readoutText.innerHTML = `> <span style="color:#ff3333; font-weight:bold;">KINETIC EVENT COMPLETE</span>.<br>> CARDIGAN INTEGRITY: ${cardiDamage}<br>> DECOUPLING: ABSOLUTE.`;
                }

                // Reset Protocol
                setTimeout(() => {
                    overlay.classList.remove('blast-active');
                    blastRing.classList.remove('blast-anim');
                    blastText.classList.remove('text-anim');

                    // Reset styling inline
                    blastRing.style.borderColor = '';
                    blastText.style.color = '';

                    blastBtn.innerHTML = '<span class="btn-front">RESTOCKING TACTICAL ASSETS...</span>';

                    setTimeout(() => {
                        titL.classList.remove('blown-away-lf');
                        titR.classList.remove('blown-away-rt');

                        blastBtn.disabled = false;
                        blastBtn.innerHTML = '<span class="btn-front">INITIATE KINETIC YIELD</span>';
                        if (readoutText) readoutText.innerHTML = "> SYSTEMS NOMINAL. READY FOR NEXT SEPARATION.";
                        isBlasting = false;
                    }, 2500);

                }, 3000); // Overlay duration

            }, 2600); // Countdown duration
        });
    }

});
