document.addEventListener('DOMContentLoaded', function() {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'testimonial-modal';
    modalContainer.innerHTML = `
        <div class="testimonial-modal-content">
            <button class="testimonial-modal-close">&times;</button>
            <div class="testimonial-rating"></div>
            <p class="testimonial-text"></p>
            <div class="testimonial-author-info"></div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // Add click event listeners to testimonials
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('click', function() {
            // Get testimonial content
            const rating = this.querySelector('.testimonial-rating').innerHTML;
            const text = this.querySelector('p').innerHTML;
            const authorInfo = this.querySelector('.testimonial-author').innerHTML;

            // Update modal content
            const modal = document.querySelector('.testimonial-modal');
            modal.querySelector('.testimonial-rating').innerHTML = rating;
            modal.querySelector('.testimonial-text').innerHTML = text;
            modal.querySelector('.testimonial-author-info').innerHTML = authorInfo;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal on click outside or close button
    const modal = document.querySelector('.testimonial-modal');
    const closeBtn = modal.querySelector('.testimonial-modal-close');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});
