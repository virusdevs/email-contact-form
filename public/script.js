document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading icon and disable the button
  const submitButton = document.getElementById('submitButton');
  const buttonText = document.getElementById('buttonText');
  const loadingIcon = document.getElementById('loadingIcon');
  submitButton.disabled = true;
  buttonText.textContent = 'Sending...';
  loadingIcon.style.display = 'inline-block';

  // Prepare form data
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('phone', document.getElementById('phone').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('message', document.getElementById('message').value);
  formData.append('attachment', document.getElementById('attachment').files[0]);

  try {
    // Send form data to the server
    const response = await fetch('/send-email.php', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Show SweetAlert popup based on the result
    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: result.message || 'Message sent successfully!',
      });
      document.getElementById('contactForm').reset(); // Reset the form
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'Failed to send message. Please try again.',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred. Please try again.',
    });
  } finally {
    // Reset button and hide loading icon
    submitButton.disabled = false;
    buttonText.textContent = 'Send Message';
    loadingIcon.style.display = 'none';
  }
});