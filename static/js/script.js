document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const lyricForm = document.getElementById('lyric-form');
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generate-btn');
    const loadingContainer = document.querySelector('.loading-container');
    const resultsContainer = document.getElementById('results-container');
    const lyricsDisplay = document.getElementById('lyrics-display');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');

    // Handle form submission
    lyricForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get the prompt value
        const prompt = promptInput.value.trim();
        
        // Validate prompt
        if (!prompt) {
            showError('Please enter a prompt to generate lyrics.');
            return;
        }
        
        // Reset UI
        errorMessage.style.display = 'none';
        resultsContainer.style.display = 'none';
        
        // Show loading animation
        loadingContainer.style.display = 'block';
        generateBtn.disabled = true;
        
        try {
            // Send request to the backend
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'prompt': prompt
                })
            });
            
            const data = await response.json();
            
            // Hide loading animation
            loadingContainer.style.display = 'none';
            
            if (data.success) {
                // Display the generated lyrics
                lyricsDisplay.textContent = data.lyrics;
                resultsContainer.style.display = 'block';
                
                // Scroll to results
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Show error message
                showError(data.error || 'An error occurred while generating lyrics. Please try again.');
            }
        } catch (error) {
            // Hide loading animation
            loadingContainer.style.display = 'none';
            
            // Show error message
            showError('An error occurred. Please check your connection and try again.');
            console.error('Error:', error);
        } finally {
            // Re-enable button
            generateBtn.disabled = false;
        }
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const lyrics = lyricsDisplay.textContent;
        navigator.clipboard.writeText(lyrics)
            .then(() => {
                // Visual feedback
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // Visual feedback for error
                copyBtn.innerHTML = '<i class="fas fa-times"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
    });
    
    // Function to show error messages
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Add a placeholder image to the results container
    function addPlaceholderImage() {
        const placeholderImage = document.createElement('div');
        placeholderImage.classList.add('placeholder-image');
        placeholderImage.innerHTML = '<i class="fas fa-music"></i>';
        lyricsDisplay.appendChild(placeholderImage);
    }
    
    // Example prompts
    const examplePrompts = [
        "Generate a song in the style of Ed Sheeran about lost love",
        "Generate a song in the style of Taylor Swift about new beginnings",
        "Generate a song in the style of Bruno Mars about dancing",
        "Generate a song in the style of Adele about heartbreak",
        "Generate a song in the style of Billie Eilish about mental health"
    ];
    
    // Set a random example as placeholder
    promptInput.placeholder = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    
    // Add typing animation to the placeholder
    let currentPlaceholderIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70; // milliseconds
    let placeholder = "";
    
    function typeEffect() {
        const currentPrompt = examplePrompts[currentPlaceholderIndex];
        
        if (isDeleting) {
            placeholder = currentPrompt.substring(0, placeholder.length - 1);
        } else {
            placeholder = currentPrompt.substring(0, placeholder.length + 1);
        }
        
        promptInput.setAttribute('placeholder', placeholder);
        
        // Speed adjustments
        let speedFactor = typingSpeed;
        if (isDeleting) {
            speedFactor /= 2; // Faster when deleting
        }
        
        // Check if word is complete
        if (!isDeleting && placeholder === currentPrompt) {
            // Pause at the end of typing
            speedFactor = 2000;
            isDeleting = true;
        } else if (isDeleting && placeholder === '') {
            isDeleting = false;
            currentPlaceholderIndex = (currentPlaceholderIndex + 1) % examplePrompts.length;
            speedFactor = 500; // Pause before typing next example
        }
        
        setTimeout(typeEffect, speedFactor);
    }
    
    // Start the typing effect
    setTimeout(typeEffect, 1000);
    
    // Parallax effect for the background
    document.addEventListener('mousemove', function(e) {
        const waves = document.querySelectorAll('.wave');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        waves.forEach((wave, index) => {
            const speed = (index + 1) * 5;
            const offsetX = (0.5 - x) * speed;
            const offsetY = (0.5 - y) * speed;
            
            wave.style.transform = `rotate(${offsetX}deg) translateX(${offsetX}px) translateY(${offsetY}px)`;
        });
    });
}); 