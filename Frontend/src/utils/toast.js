// Toast notifications utility
class Toast {
  static show(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    
    // Set colors based on type
    let bgColor = '#3B82F6'; // blue (info)
    let borderColor = '#1E40AF';
    
    switch(type) {
      case 'success':
        bgColor = '#10B981';
        borderColor = '#047857';
        break;
      case 'error':
        bgColor = '#EF4444';
        borderColor = '#DC2626';
        break;
      case 'warning':
        bgColor = '#F59E0B';
        borderColor = '#D97706';
        break;
      default:
        break;
    }

    toast.style.cssText = `
      background-color: ${bgColor};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid ${borderColor};
      animation: slideIn 0.3s ease-in-out;
      word-break: break-word;
      max-width: 350px;
      font-size: 14px;
      font-weight: 500;
    `;
    
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Add animation styles if not already added
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in-out';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  static success(message) {
    this.show(message, 'success');
  }

  static error(message) {
    this.show(message, 'error');
  }

  static warning(message) {
    this.show(message, 'warning');
  }

  static info(message) {
    this.show(message, 'info');
  }
}

export default Toast;
