class DraggDeez {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.selectionOverlay = null;

    this.init();
  }

  init() {
    this.createOverlay();
    this.applyToElement(this.element);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'absolute',
      border: '1px solid #4285f4',
      pointerEvents: 'all',
      display: 'none',
      zIndex: '1000',
      boxSizing: 'border-box',
    });

    this.createHandles();
    document.body.appendChild(this.overlay);

    // Event bindings
    this.overlay.addEventListener('mousedown', this.onOverlayMouseDown.bind(this));
    window.addEventListener('scroll', this.updateOverlayPosition.bind(this));
    window.addEventListener('resize', this.updateOverlayPosition.bind(this));
  }

  createHandles() {
    this.handles = {};
    const positions = ['nw', 'ne', 'sw', 'se'];
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `resize-handle ${pos}-handle`;
      Object.assign(handle.style, {
        position: 'absolute',
        width: '8px',
        height: '8px',
        background: '#fff',
        border: '1px solid #4285f4',
        borderRadius: '50%',
        cursor: `${pos}-resize`,
        boxSizing: 'border-box',
      });

      // Position handles
      const positionStyles = {
        nw: { left: '-4px', top: '-4px' },
        ne: { right: '-4px', top: '-4px' },
        sw: { left: '-4px', bottom: '-4px' },
        se: { right: '-4px', bottom: '-4px' },
      };
      Object.assign(handle.style, positionStyles[pos]);

      handle.addEventListener('mousedown', this.onHandleMouseDown.bind(this));

      this.overlay.appendChild(handle);
      this.handles[pos] = handle;
    });
  }

  applyToElement(element) {
    this.element = element;
    this.showOverlay();
  }

  showOverlay() {
    const rect = this.element.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      left: `${rect.left + window.pageXOffset}px`,
      top: `${rect.top + window.pageYOffset}px`,
      display: 'block',
    });

    this.overlay.style.zIndex = '1000';
  }

  hideOverlay() {
    this.overlay.style.display = 'none';
  }

  // Event Handlers
  onOverlayMouseDown(event) {
    if (event.target !== this.overlay) return; // Ignore clicks on handles
    event.preventDefault();

    this.isDragging = true;
    this.startX = event.pageX;
    this.startY = event.pageY;

    const rect = this.element.getBoundingClientRect();
    this.originalRect = {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width,
      height: rect.height,
    };

    if (this.options.onDragStart) {
      this.options.onDragStart();
    }

    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onInteractionEnd.bind(this));
  }

  onHandleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.startX = event.pageX;
    this.startY = event.pageY;

    const rect = this.element.getBoundingClientRect();
    this.originalRect = {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width,
      height: rect.height,
    };

    this.handlePosition = event.target.classList[1].split('-')[0];

    if (this.options.onResizeStart) {
      this.options.onResizeStart();
    }

    document.addEventListener('mousemove', this.onResizeMove.bind(this));
    document.addEventListener('mouseup', this.onInteractionEnd.bind(this));
  }

  onDragMove(event) {
    if (!this.isDragging) return;

    const deltaX = event.pageX - this.startX;
    const deltaY = event.pageY - this.startY;

    let newLeft = this.originalRect.left + deltaX;
    let newTop = this.originalRect.top + deltaY;

    // Optional: Add boundary checks here

    this.element.style.position = 'absolute';
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;

    this.updateOverlayPosition();

    if (this.options.onDrag) {
      this.options.onDrag({ left: newLeft, top: newTop });
    }
  }

  onResizeMove(event) {
    if (!this.isResizing) return;

    const deltaX = event.pageX - this.startX;
    const deltaY = event.pageY - this.startY;

    const newCoords = {
      width: this.originalRect.width,
      height: this.originalRect.height,
      left: this.originalRect.left,
      top: this.originalRect.top,
    };

    this.updateCoords(newCoords, deltaX, deltaY, this.handlePosition);
    const minSize = 10;
    newCoords.width = Math.max(minSize, newCoords.width);
    newCoords.height = Math.max(minSize, newCoords.height);

    this.element.style.position = 'absolute';
    this.element.style.width = `${newCoords.width}px`;
    this.element.style.height = `${newCoords.height}px`;
    this.element.style.left = `${newCoords.left}px`;
    this.element.style.top = `${newCoords.top}px`;

    this.updateOverlayPosition();

    if (this.options.onResize) {
      this.options.onResize({
        width: newCoords.width,
        height: newCoords.height,
        left: newCoords.left,
        top: newCoords.top,
      });
    }
  }

  onInteractionEnd() {
    this.isDragging = false;
    this.isResizing = false;

    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mousemove', this.onResizeMove.bind(this));
    document.removeEventListener('mouseup', this.onInteractionEnd.bind(this));

    if (this.options.onDragEnd && !this.isResizing) {
      this.options.onDragEnd();
    }
    if (this.options.onResizeEnd && !this.isDragging) {
      this.options.onResizeEnd();
    }
  }

  updateCoords(coords, deltaX, deltaY, handlePosition) {
    switch (handlePosition) {
      case 'se':
        coords.width += deltaX;
        coords.height += deltaY;
        break;
      case 'sw':
        coords.width -= deltaX;
        coords.height += deltaY;
        coords.left += deltaX;
        break;
      case 'ne':
        coords.width += deltaX;
        coords.height -= deltaY;
        coords.top += deltaY;
        break;
      case 'nw':
        coords.width -= deltaX;
        coords.height -= deltaY;
        coords.left += deltaX;
        coords.top += deltaY;
        break;
      // Add cases for 'n', 'e', 's', 'w' if needed
    }
  }

  updateOverlayPosition() {
    const rect = this.element.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      left: `${rect.left + window.pageXOffset}px`,
      top: `${rect.top + window.pageYOffset}px`,
    });
  }

  destroy() {
    this.overlay.removeEventListener('mousedown', this.onOverlayMouseDown);
    Object.values(this.handles).forEach(handle => {
      handle.removeEventListener('mousedown', this.onHandleMouseDown);
    });
    window.removeEventListener('scroll', this.updateOverlayPosition);
    window.removeEventListener('resize', this.updateOverlayPosition);

    if (this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }

    this.overlay = null;
    this.element = null;
  }
}

export default DraggDeez;
