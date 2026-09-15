/**
 * PROFESSIONAL POPUP & DIALOG SYSTEM
 * Custom alert, confirm, and toast notification functions
 */

// Initialize popup system
(function () {
    'use strict';

    // Create dialog overlay if it doesn't exist
    function ensureDialogOverlay() {
        let overlay = document.getElementById('custom-dialog-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'custom-dialog-overlay';
            overlay.className = 'custom-dialog-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    // Create toast container if it doesn't exist
    function ensureToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // Get icon for dialog type
    function getDialogIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            confirm: '?'
        };
        return icons[type] || 'ℹ';
    }

    // Get title for dialog type
    function getDialogTitle(type, customTitle) {
        if (customTitle) return customTitle;

        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information',
            confirm: 'Confirm Action'
        };
        return titles[type] || 'Message';
    }

    /**
     * Custom Alert Dialog
     * @param {string} message - The message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info' (default: 'info')
     * @param {string} title - Custom title (optional)
     * @returns {Promise} Resolves when user closes the dialog
     */
    window.showAlert = function (message, type = 'info', title = null) {
        return new Promise((resolve) => {
            const overlay = ensureDialogOverlay();
            const icon = getDialogIcon(type);
            const dialogTitle = getDialogTitle(type, title);

            const buttonClasses = {
                success: 'dialog-btn-success',
                error: 'dialog-btn-danger',
                warning: 'dialog-btn-primary',
                info: 'dialog-btn-primary'
            };
            const btnClass = buttonClasses[type] || 'dialog-btn-primary';

            overlay.innerHTML = `
                <div class="custom-dialog">
                    <div class="dialog-icon-section">
                        <div class="dialog-icon ${type}">
                            ${icon}
                        </div>
                    </div>
                    <div class="dialog-content">
                        <h2 class="dialog-title">${dialogTitle}</h2>
                        <p class="dialog-message">${message}</p>
                    </div>
                    <div class="dialog-actions">
                        <button class="dialog-btn ${btnClass}" id="dialog-ok-btn">
                            OK
                        </button>
                    </div>
                </div>
            `;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const closeDialog = () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    overlay.innerHTML = '';
                }, 300);
                resolve();
            };

            // OK button
            document.getElementById('dialog-ok-btn').addEventListener('click', closeDialog);

            // Click outside to close
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeDialog();
                }
            });

            // ESC key to close
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeDialog();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Focus OK button
            setTimeout(() => {
                document.getElementById('dialog-ok-btn')?.focus();
            }, 100);
        });
    };

    /**
     * Custom Confirm Dialog
     * @param {string} message - The message to display
     * @param {string} title - Custom title (optional)
     * @param {object} options - { confirmText, cancelText, type, inputField: { placeholder, requiredText } }
     * @returns {Promise<boolean>} Resolves with true if confirmed, false if cancelled
     */
    window.showConfirm = function (message, title = null, options = {}) {
        return new Promise((resolve) => {
            const overlay = ensureDialogOverlay();
            const dialogTitle = title || 'Confirm Action';
            const confirmText = options.confirmText || 'Confirm';
            const cancelText = options.cancelText || 'Cancel';
            const type = options.type || 'confirm';
            const icon = getDialogIcon(type);
            const inputField = options.inputField || null;

            const confirmBtnClasses = {
                confirm: 'dialog-btn-primary',
                danger: 'dialog-btn-danger',
                success: 'dialog-btn-success'
            };
            const btnClass = confirmBtnClasses[type] || 'dialog-btn-primary';

            // Build input field HTML if needed
            const inputHTML = inputField ? `
                <input type="text" class="dialog-input" id="dialog-confirm-input" 
                       placeholder="${inputField.placeholder || ''}" 
                       autocomplete="off" 
                       style="margin-top: 1rem; width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;" />
            ` : '';

            overlay.innerHTML = `
                <div class="custom-dialog">
                    <div class="dialog-icon-section">
                        <div class="dialog-icon ${type}">
                            ${icon}
                        </div>
                    </div>
                    <div class="dialog-content">
                        <h2 class="dialog-title">${dialogTitle}</h2>
                        <p class="dialog-message">${message}</p>
                        ${inputHTML}
                    </div>
                    <div class="dialog-actions">
                        <button class="dialog-btn dialog-btn-secondary" id="dialog-cancel-btn">
                            ${cancelText}
                        </button>
                        <button class="dialog-btn ${btnClass}" id="dialog-confirm-btn" ${inputField ? 'disabled' : ''}>
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const closeDialog = (result) => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    overlay.innerHTML = '';
                }, 300);
                resolve(result);
            };

            const confirmBtn = document.getElementById('dialog-confirm-btn');
            const cancelBtn = document.getElementById('dialog-cancel-btn');
            const input = inputField ? document.getElementById('dialog-confirm-input') : null;

            // Handle input field validation if present
            if (input && inputField.requiredText) {
                const validateInput = () => {
                    const inputValue = input.value.trim();
                    const requiredText = inputField.requiredText;
                    const isValid = inputValue === requiredText;
                    confirmBtn.disabled = !isValid;
                    
                    // Update button style based on disabled state
                    if (isValid) {
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.cursor = 'pointer';
                    } else {
                        confirmBtn.style.opacity = '0.5';
                        confirmBtn.style.cursor = 'not-allowed';
                    }
                };

                input.addEventListener('input', validateInput);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !confirmBtn.disabled) {
                        e.preventDefault();
                        closeDialog(true);
                    }
                });

                // Initial validation
                validateInput();

                // Focus input after dialog is fully rendered
                setTimeout(() => {
                    input?.focus();
                }, 200);
            }

            // Confirm button
            confirmBtn.addEventListener('click', () => {
                if (!confirmBtn.disabled) {
                    closeDialog(true);
                }
            });

            // Cancel button
            cancelBtn.addEventListener('click', () => {
                closeDialog(false);
            });

            // Click outside to cancel
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeDialog(false);
                }
            });

            // ESC key to cancel
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeDialog(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            // Focus confirm button (or input if present)
            if (!inputField) {
                setTimeout(() => {
                    confirmBtn?.focus();
                }, 100);
            }
        });
    };

    /**
     * Toast Notification
     * @param {string} message - The message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info' (default: 'info')
     * @param {string} title - Custom title (optional)
     * @param {number} duration - Duration in ms (default: 4000, use 0 for persistent)
     */
    window.showToast = function (message, type = 'info', title = null, duration = 4000) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        const icon = icons[type] || 'ℹ';

        const titles = {
            success: title || 'Success',
            error: title || 'Error',
            warning: title || 'Warning',
            info: title || 'Info'
        };
        const toastTitle = titles[type];

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${toastTitle}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
        `;

        container.appendChild(toast);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, duration);
        }

        return toast;
    };

    function removeToast(toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    /**
     * Loading Dialog
     * @param {string} message - The loading message
     * @returns {object} Object with close() method
     */
    window.showLoading = function (message = 'Loading...') {
        const overlay = ensureDialogOverlay();

        overlay.innerHTML = `
            <div class="custom-dialog">
                <div class="dialog-icon-section">
                    <div class="dialog-icon info">
                        <span class="dialog-loading" style="width: 48px; height: 48px; border-width: 5px;"></span>
                    </div>
                </div>
                <div class="dialog-content">
                    <h2 class="dialog-title">Please Wait</h2>
                    <p class="dialog-message">${message}</p>
                </div>
            </div>
        `;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        return {
            close: () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    overlay.innerHTML = '';
                }, 300);
            }
        };
    };

    /**
     * Custom Prompt Dialog
     * @param {string} message - The message to display
     * @param {string} defaultValue - Default input value (optional)
     * @param {string} title - Custom title (optional)
     * @param {object} options - { type: 'text'|'password', placeholder }
     * @returns {Promise<string|null>} Resolves with input value or null if cancelled
     */
    window.showPrompt = function (message, defaultValue = '', title = null, options = {}) {
        return new Promise((resolve) => {
            const overlay = ensureDialogOverlay();
            const dialogTitle = title || 'Input Required';
            const icon = getDialogIcon('info');
            const inputType = options.type || 'text';
            const placeholder = options.placeholder || '';

            // Clear any existing content and event listeners
            overlay.innerHTML = '';
            
            overlay.innerHTML = `
                <div class="custom-dialog">
                    <div class="dialog-icon-section">
                        <div class="dialog-icon info">
                            ${icon}
                        </div>
                    </div>
                    <div class="dialog-content">
                        <h2 class="dialog-title">${dialogTitle}</h2>
                        <p class="dialog-message">${message}</p>
                        <input type="${inputType}" class="dialog-input" id="dialog-prompt-input" value="${defaultValue}" placeholder="${placeholder}" autocomplete="off" />
                    </div>
                    <div class="dialog-actions">
                        <button class="dialog-btn dialog-btn-secondary" id="dialog-cancel-btn" type="button">
                            Cancel
                        </button>
                        <button class="dialog-btn dialog-btn-primary" id="dialog-ok-btn" type="button">
                            OK
                        </button>
                    </div>
                </div>
            `;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Wait for DOM to be ready
            const dialog = overlay.querySelector('.custom-dialog');
            const input = document.getElementById('dialog-prompt-input');
            const okBtn = document.getElementById('dialog-ok-btn');
            const cancelBtn = document.getElementById('dialog-cancel-btn');
            
            let isClosing = false;
            
            const closeDialog = (result) => {
                if (isClosing) return;
                isClosing = true;
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => {
                    overlay.innerHTML = '';
                    isClosing = false;
                }, 300);
                resolve(result);
            };

            // Stop all event propagation on dialog
            if (dialog) {
                dialog.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                dialog.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                dialog.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                });
            }

            // OK button
            if (okBtn) {
                okBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (input) {
                        closeDialog(input.value);
                    }
                });
            }

            // Cancel button
            if (cancelBtn) {
                cancelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeDialog(null);
                });
            }

            // Click outside to cancel - ONLY on overlay background
            const overlayClickHandler = (e) => {
                // Only close if clicking directly on overlay, not on any child
                if (e.target === overlay) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeDialog(null);
                }
            };
            
            // Add click handler after a brief delay to ensure DOM is ready
            setTimeout(() => {
                overlay.addEventListener('click', overlayClickHandler, true); // Use capture phase
            }, 50);

            // Input event handlers
            if (input) {
                // Prevent any events from bubbling
                input.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                input.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                input.addEventListener('focus', (e) => {
                    e.stopPropagation();
                });
                input.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                });
                input.addEventListener('input', (e) => {
                    e.stopPropagation();
                });

                // Enter key to submit
                input.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        closeDialog(input.value);
                    }
                });

                // Focus input after dialog is fully rendered
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        if (input && !isClosing) {
                            input.focus();
                            if (inputType === 'text' && input.value) {
                                input.select();
                            }
                        }
                    }, 200);
                });
            }

            // ESC key to cancel
            const escHandler = (e) => {
                if (e.key === 'Escape' && !isClosing) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeDialog(null);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    };

    // Backwards compatibility - override native functions (optional)
    // Auto-replace all alert(), confirm(), and prompt() calls
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    window.alert = function(message) {
        showAlert(String(message));
    };

    window.confirm = function(message) {
        return showConfirm(String(message));
    };

    window.prompt = function(message, defaultValue = '') {
        return showPrompt(String(message), String(defaultValue));
    };

})();
