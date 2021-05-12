export function createModal(body) {
    const modal = `
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close-button icon-button icon-button--white">
                    <i class="fa fa-window-close"></i>
                </button>
            </div>
            <div class="modal-body">
                ${body}
            </div>
        </div>
    </div>
    `;

    return modal;
};