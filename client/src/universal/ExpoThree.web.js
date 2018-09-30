import THREE from './THREE';

THREE.suppressExpoWarnings = () => {};
class Renderer extends THREE.WebGLRenderer {
  constructor({
    gl, canvas, pixelRatio, clearColor, width, height, ...props
  }) {
    super({
      canvas: canvas || {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: gl.drawingBufferHeight,
      },
      context: gl,
      ...props,
    });

    this.setPixelRatio(pixelRatio || 1);

    if (width && height) this.setSize(width, height);
    if (clearColor) this.setClearColor(clearColor, 1.0);
  }
}

export default {
  loadAsync: res => new THREE.TextureLoader().load(res),
  Renderer,
};
