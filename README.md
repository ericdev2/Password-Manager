# Password Manager

A simple Chrome extension that helps you store, generate, and manage your passwords securely.

## Description

This Password Manager prompts you to set a **master password** the first time you use it. From then on, you only need the master password to access or manage all of your saved credentials. 

It features:

- Secure storage of passwords
- Auto-generation of strong passwords
- Password strength meter
- Editing and deleting saved passwords

## File Overview

1. **manifest.json**  
   - Defines the extension name, version, and description.  
   - Specifies required permissions and the default popup (`popup.html`).

2. **popup.html**  
   - Provides the user interface with input fields, buttons, and display areas.

3. **popup.js**  
   - The “backend” logic that powers the extension (handles data storage, password generation, etc.).

## How to Install & Run

1. **Download or clone** this repository to your local machine.
2. Open **Google Chrome** and navigate to `chrome://extensions`.
3. Toggle on **Developer mode** (usually located at the top-right of the Extensions page).
4. Click the **Load unpacked** button.
5. Select the folder containing `manifest.json`, `popup.html`, and `popup.js`.
6. Once loaded, you can **pin** the extension to your toolbar for easier access.
7. Open the extension and **set your master password** the first time you use it.

## Why Use a Password Manager?

- Reduces the need to remember multiple passwords.
- Encourages secure, complex, and unique passwords for each account.
- Protects against common password-related attacks (guessing, cracking, reuse).
- Centralizes password storage with a single, secure master key.

Enjoy simplified and more secure password management!
