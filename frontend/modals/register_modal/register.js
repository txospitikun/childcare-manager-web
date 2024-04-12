class RegisterModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*html*/ `
        <div class="register-container">
            <div class="user-input-container">
                <p>Register with an account to Childbook</p>
                <div class="login-input-container">
                    <label for="register-username">username</label>
                    <input type="text" id="register-username">
                </div>
                <div class="login-input-container">
                    <label for="register-password">password</label>
                    <input type="password" id="register-password">
                </div>
                <div class="login-input-container">
                    <label for="confirm-register-password">confirm password</label>
                    <input type="password" id="confirm-register-password">
                </div>
                <div class="login-input-container">
                    <label for="phone-number">phone number</label>
                    <input type="text" id="phone-number">
                </div>
                <div class="forgot-password-text">
                    <a href=".123">already registered?</a>
                </div>
            </div>
            <button id="confirm-register">register</button>
        </div>
        `
    }
}

customElements.define('register-modal', RegisterModal);
