document.addEventListener('DOMContentLoaded', () => {
    // Navigation highlighting based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = 'var(--accent)';
            link.style.borderBottom = '1px solid var(--accent)';
            link.style.paddingBottom = '3px';
        }
    });

    // Simulator Logic
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
            blastBtn.textContent = 'CALIBRATING YIELD...';
            if (readoutText) readoutText.textContent = "Telemetry: Arming shaped charge... Target acquiring...";

            setTimeout(() => {
                // THE BLAST
                document.body.classList.remove(shakeClass);

                // Activate the overlay
                overlay.classList.add('blast-active');

                // Adjust blast color based on yield
                if (yieldVal === 'thermobaric') {
                    blastRing.style.borderColor = '#ff5500';
                    blastText.style.color = '#ffaa00';
                } else {
                    blastRing.style.borderColor = 'var(--accent)';
                    blastText.style.color = '#000';
                }

                blastRing.classList.add('blast-anim');
                blastText.classList.add('text-anim');

                // Blow off the tits
                titL.classList.add('blown-away-lf');
                titR.classList.add('blown-away-rt');

                if (readoutText) {
                    let cardiDamage = '0%';
                    if (yieldVal === 'thermobaric' && cardiVal === 'acrylic') cardiDamage = '12% Fraying (Acceptable Losses)';
                    else if (yieldVal === 'tactical' && cardiVal === 'cashmere') cardiDamage = '0.01% Singe (Highly Commendable)';
                    readoutText.innerHTML = `Telemetry: <span style="color:red">BLAST COMPLETE</span>. Cardigan Integrity Damage: ${cardiDamage}. Decoupling absolute.`;
                }

                // Reset after the elegance of the aftermath is absorbed
                setTimeout(() => {
                    overlay.classList.remove('blast-active');
                    blastRing.classList.remove('blast-anim');
                    blastText.classList.remove('text-anim');

                    blastBtn.textContent = 'RESTOCKING TACTICAL ASSETS...';

                    setTimeout(() => {
                        titL.classList.remove('blown-away-lf');
                        titR.classList.remove('blown-away-rt');

                        // reset color
                        blastRing.style.borderColor = 'var(--accent)';
                        blastText.style.color = '#000';

                        blastBtn.innerHTML = '<span class="btn-front">INITIATE CLEAN BLAST</span>';
                        if (readoutText) readoutText.textContent = "Telemetry: Systems nominal. Ready for next kinetic separation.";
                        isBlasting = false;
                    }, 2000);

                }, 2500);

            }, 1800);
        });
    }

    // Intersection observer for fading elements in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .test-card, .philosophy-block, .feature-row').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
});
