class NavbarModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /*html*/ `
        <div class="navbar-container">
            <div class="navbar-title">
                Childbook.com
            </div>
            <div class="navbar-buttons">
                <button onclick="log()">
                    Login
                </button>
                <button>
                    Register
                </button>
            </div>
        </div>
        `
    }
}

customElements.define('navbar-modal', NavbarModal);