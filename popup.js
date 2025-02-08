const encryptionKey = 3;
let masterPassword = null;

function encrypt(text) {
  return text
    .split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) + encryptionKey))
    .join('');
}

function decrypt(encryptedText) {
  return encryptedText
    .split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) - encryptionKey))
    .join('');
}

function authenticate() {
  if (!masterPassword) {
    alert("Master password is not set. Please restart the extension.");
    return false;
  }

  const inputPassword = prompt('Enter your master password:');
  return inputPassword === masterPassword;
}

function displayPasswords(passwords) {
  const passwordList = document.getElementById('password-list');
  passwordList.innerHTML = '';
  if (passwords && passwords.length > 0) {
    passwords.forEach((password, index) => {
      const passwordItem = document.createElement('div');
      passwordItem.textContent = `${index + 1}. ${decrypt(password)}`;
      passwordList.appendChild(passwordItem);
    });
  } else {
    passwordList.innerHTML = 'No passwords stored.';
  }
}

function editPassword(passwords, passwordIndex) {
  const newPassword = prompt('Enter the updated password:');
  if (newPassword) {
    passwords[passwordIndex] = encrypt(newPassword);
    chrome.storage.local.set({ passwords }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage error: ', chrome.runtime.lastError);
        alert('An error occurred while updating the password. Please try again later.');
      } else {
        displayPasswords(passwords);
      }
    });
  }
}

function deletePassword(passwords, passwordIndex) {
  passwords.splice(passwordIndex, 1);
  chrome.storage.local.set({ passwords }, () => {
    if (chrome.runtime.lastError) {
      console.error('Storage error: ', chrome.runtime.lastError);
      alert('An error occurred while deleting the password. Please try again later.');
    } else {
      displayPasswords(passwords);
    }
  });
}

function updatePasswordStrength(password) {
  const passwordStrength = document.getElementById('password-strength');
  const strength = calculatePasswordStrength(password);
  passwordStrength.innerHTML = `Password Strength: ${strength}`;
}

function calculatePasswordStrength(password) {
  const strength = {
    0: "Worst",
    1: "Bad",
    2: "Weak",
    3: "Good",
    4: "Strong"
  };

  let score = 0;
  if (password.length > 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[\d]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  return strength[score] || "Unknown";
}

document.addEventListener('DOMContentLoaded', () => {
  const addPasswordButton = document.getElementById('addPassword');
  const generatePasswordButton = document.getElementById('generatePassword');
  const editPasswordButton = document.getElementById('editPassword');
  const deletePasswordButton = document.getElementById('deletePassword');

  addPasswordButton.addEventListener('click', () => {
    const passwordInput = document.getElementById('passwordInput');
    const newPassword = passwordInput.value;
    passwordInput.value = '';

    if (newPassword) {
      const encryptedPassword = encrypt(newPassword);
      chrome.storage.local.get('passwords', (data) => {
        const passwords = data.passwords || [];
        passwords.push(encryptedPassword);
        chrome.storage.local.set({ passwords }, () => {
          if (chrome.runtime.lastError) {
            console.error('Storage error: ', chrome.runtime.lastError);
            alert('An error occurred while saving the password. Please try again later.');
          } else {
            displayPasswords(passwords);
            updatePasswordStrength(''); // Clear previous strength display
          }
        });
      });
    }
  });

  generatePasswordButton.addEventListener('click', () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=[]{}|;:,.<>?";
    let generatedPassword = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.value = generatedPassword;
    updatePasswordStrength(generatedPassword);
  });

  editPasswordButton.addEventListener('click', () => {
    const passwordIndex = parseInt(prompt('Enter the index of the password to edit:'), 10);
    if (!isNaN(passwordIndex)) {
      chrome.storage.local.get('passwords', (data) => {
        const passwords = data.passwords || [];
        if (passwordIndex >= 1 && passwordIndex <= passwords.length) {
          editPassword(passwords, passwordIndex - 1);
        } else {
          alert('Invalid index. Please enter a valid index.');
        }
      });
    } else {
      alert('Invalid input. Please enter a valid index.');
    }
  });

  deletePasswordButton.addEventListener('click', () => {
    const passwordIndex = parseInt(prompt('Enter the index of the password to delete:'), 10);
    if (!isNaN(passwordIndex)) {
      chrome.storage.local.get('passwords', (data) => {
        const passwords = data.passwords || [];
        if (passwordIndex >= 1 && passwordIndex <= passwords.length) {
          deletePassword(passwords, passwordIndex - 1);
        } else {
          alert('Invalid index. Please enter a valid index.');
        }
      });
    } else {
      alert('Invalid input. Please enter a valid index.');
    }
  });

  chrome.storage.local.get('masterPassword', (data) => {
    masterPassword = data.masterPassword;

    if (!masterPassword) {
      const newPassword = prompt('Set your master password:');
      if (newPassword) {
        masterPassword = newPassword;
        chrome.storage.local.set({ masterPassword });
      } else {
        alert('Master password not set. Please set a master password to use the password manager.');
      }
    }

    const authenticated = authenticate();
    if (!authenticated) {
      alert('Authentication failed. Access denied.');
      document.body.innerHTML = '';
      return; // Stop further execution of the script.
    }

    chrome.storage.local.get('passwords', (data) => {
      const storedPasswords = data.passwords;
      if (storedPasswords && storedPasswords.length > 0) {
        displayPasswords(storedPasswords);
      } else {
        displayPasswords([]);
      }
    });

    const passwordInput = document.getElementById('passwordInput');

    passwordInput.addEventListener('input', (event) => {
      const newPassword = event.target.value;
      updatePasswordStrength(newPassword);
    });
  });
});


