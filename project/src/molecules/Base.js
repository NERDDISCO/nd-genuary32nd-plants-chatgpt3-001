export class Base {
  constructor({}) {
    /**
     * Base
     */
    this.canvas = document.querySelector("canvas#nd-output");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });

    this.resizeCanvasToSquare();

    window.addEventListener("resize", () => {
      this.resizeCanvasToSquare();
    });

    // Only provide a download function if downloads are enabled
    window._downloadSource = this.canvas;
    /**
     * Download the piece by pressing s on the keyboard
     */
    document.addEventListener("keydown", (e) => {
      if (e.isComposing || e.code === "KeyS") {
        window.downloadPreview();
        return;
      }
    });

    // Or by using this function via the console
    window.downloadPreview = () => {
      let link = document.createElement("a");
      link.download = fxhash;
      link.href = window._downloadSource.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  resizeCanvasToSquare() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width = size;
    this.canvas.height = size;
  }
}
