
# DraggDeez

A simple, modular JavaScript class to make any HTML element draggable and resizable. This utility was abstracted from a personal project implementation and is currently under **development** so not properly **tested** and currently, will probably **break stuff**.

## Introduction

`DraggDeez` is a lightweight JavaScript class that allows you to easily add drag-and-resize functionality to any DOM element. It provides an easy-to-use API and customizable options, making it a plug-and-play solution for your web projects.

## Features

- **Drag and Drop**: Click and drag to move elements around the page.
- **Resize Handles**: Adjust the size of elements using resize handles at the corners.
- **Callback Functions**: Hooks for drag and resize events (`onDragStart`, `onDrag`, `onDragEnd`, `onResizeStart`, `onResize`, `onResizeEnd`).
- **Customizable**: Style the overlay and handles to match your application's design.

## Installation

Since this is still in development, you can include the `DraggableResizable.js` file directly into your project:

1. Place `DraggableResizable.js` in your project directory (e.g., `./src/DraggableResizable.js`).
2. Import the class into your JavaScript file:

   \`\`\`javascript
   import DraggDeez from './src/dragg_deez.js';
   \`\`\`

## Basic Usage

Refer to the index.html on this repository for a self contained example.

## Options

You can pass an options object when instantiating `DraggableResizable` to hook into various events:

- `onDragStart`: Called when dragging starts.
- `onDrag`: Called during dragging with the current position `{ left, top }`.
- `onDragEnd`: Called when dragging ends.
- `onResizeStart`: Called when resizing starts.
- `onResize`: Called during resizing with the current size `{ width, height, left, top }`.
- `onResizeEnd`: Called when resizing ends.

## How It Works

The class adds an overlay on top of the target element with resize handles at the corners. It listens for mouse events to handle dragging and resizing:

- **Dragging**: Clicking and dragging the overlay moves the element across the screen.
- **Resizing**: Clicking and dragging the resize handles adjusts the size of the element.

The class updates the element's `style` properties (`left`, `top`, `width`, `height`) to reflect its new position and size.

## Styling

You can customize the appearance of the resize handles and overlay by modifying the styles in `DraggableResizable.js` or by adding CSS rules targeting the following classes:

- `.resize-handle`: Styles the resize handles.
- `.nw-handle`, `.ne-handle`, `.sw-handle`, `.se-handle`: Target specific handles.

## Development Status

**Note**: This utility is currently under development. Features may change, and improvements are ongoing. Contributions and feedback are welcome!

## License

[MIT License](LICENSE)

## Acknowledgements

This class was abstracted from a personal project aiming to simplify element manipulation on web pages... on other personal projects.
