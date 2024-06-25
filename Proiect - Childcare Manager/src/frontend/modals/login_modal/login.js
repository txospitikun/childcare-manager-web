class LoginModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*html*/ `
        <div class="login-container">
            <div class="user-input-container">
                <p>Connect with an account to Childbook</p>
                <div class="login-input-container">
                    <label for="login-username">email or username</label>
                    <input type="text" id="login-username">
                </div>
                <div class="login-input-container">
                    <label for="login-password">password</label>
                    <input type="password" id="login-password">
                </div>
                <div class="forgot-password-text">
                    <a class="modal-help-text" href=".">forgot your password?</a>
                </div>
                <button id="confirm-login">login</button>
            </div>
        </div>
        `
    }
}

customElements.define('login-modal', LoginModal);