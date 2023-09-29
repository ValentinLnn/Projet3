document.addEventListener('DOMContentLoaded', () => {
  
  const loginlink = document.getElementById('login-link');
  const logout = document.getElementById('logout');
  loginlink.classList.add('active');

  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'home.html';
  } else {
    displayLoginScreen();
  }

  const homelink = document.getElementById('home-link');
  homelink.addEventListener('click', () => {
    window.location.href = 'home.html';
  });
  });
function displayLoginScreen() {
  const mainSection = document.querySelector('main');

  const loginFormDiv = document.createElement('div');
  loginFormDiv.classList.add('login-form');

  const loginTitle = document.createElement('h2');
  loginTitle.textContent = 'Log In';

  const formGroupDiv = document.createElement('div');
  formGroupDiv.classList.add('form-group');

  const loginForm = document.createElement('form');
  loginForm.innerHTML = `
    <label for="email">E-mail</label>
    <input type="email" id="email" name="email" required>
    <label for="password">Mot de passe</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Se connecter</button>
  `;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'home.html';
      } else {
        const errorMsg = 'Erreur dans l’identifiant ou le mot de passe';
        console.error(errorMsg);
        displayErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  });
  
  function displayErrorMessage(message) {
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
      existingErrorMessage.remove();
    }
    const loginFormDiv = document.querySelector('.login-form');
    const errorMessageElement = document.createElement('div');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message');
    
    const passwordInput = document.getElementById('password');
    loginForm.insertBefore(errorMessageElement, passwordInput.nextSibling);
  }

  const forgotpwd = document.createElement('a');
  forgotpwd.textContent = 'Mot de passe oublié';
  forgotpwd.style.color = '#3D3D3D'
  forgotpwd.href = '#';

  loginFormDiv.appendChild(loginTitle);
  formGroupDiv.appendChild(loginForm);
  formGroupDiv.appendChild(forgotpwd);
  loginFormDiv.appendChild(formGroupDiv);
  mainSection.appendChild(loginFormDiv);
}
