document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    // Mock login function (Replace with actual authentication logic)
    if (localStorage.getItem(username) === password) {
        alert('Login successful!');
        window.location.href = 'evaluator.html'; // Redirect to evaluator page
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;
    // Mock registration function (Replace with actual registration logic)
    if (!localStorage.getItem(username)) {
        localStorage.setItem(username, password);
        sendEmail(email);
        alert('Registration successful! Please log in.');
    } else {
        alert('Username already exists');
    }
});

function sendEmail(email) {
    // Mock email function (Replace with actual email sending logic)
    console.log(`Email sent to ${email}: Thank you for registering on Arithmetic Expression Evaluator.`);
}
