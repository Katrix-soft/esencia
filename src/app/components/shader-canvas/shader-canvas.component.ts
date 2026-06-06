import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-shader-canvas',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: -20;
      pointer-events: none;
      width: 100%;
      height: 100%;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ShaderCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animFrameId: number | null = null;
  private timeLocation: WebGLUniformLocation | null = null;
  private resolutionLocation: WebGLUniformLocation | null = null;
  private isReducedMotion = false;

  private readonly VS = `
    attribute vec4 a_position;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = a_position;
      v_texCoord = a_position.xy * 0.5 + 0.5;
    }
  `;

  private readonly FS = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
               + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = v_texCoord;
      vec3 color1 = vec3(0.96, 0.96, 0.94);
      vec3 color2 = vec3(0.92, 0.94, 0.91);
      vec3 color3 = vec3(0.85, 0.89, 0.84);
      float n1 = snoise(uv * 2.0 + u_time * 0.1);
      float n2 = snoise(uv * 3.0 - u_time * 0.15);
      vec3 color = mix(color1, color2, n1 * 0.5 + 0.5);
      color = mix(color, color3, n2 * 0.3);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  ngAfterViewInit(): void {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initWebGL();
    if (!this.isReducedMotion) {
      this.animFrameId = requestAnimationFrame(t => this.render(t));
    } else {
      this.render(1000);
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
  }

  private initWebGL(): void {
    const canvas = this.canvasRef.nativeElement;
    this.gl = canvas.getContext('webgl');
    if (!this.gl) return;

    const compile = (type: number, src: string) => {
      const s = this.gl!.createShader(type)!;
      this.gl!.shaderSource(s, src);
      this.gl!.compileShader(s);
      return s;
    };

    this.program = this.gl.createProgram()!;
    this.gl.attachShader(this.program, compile(this.gl.VERTEX_SHADER, this.VS));
    this.gl.attachShader(this.program, compile(this.gl.FRAGMENT_SHADER, this.FS));
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);

    const buf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1, -1,  1,
      -1,  1,  1, -1,  1,  1,
    ]), this.gl.STATIC_DRAW);

    const pos = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);

    this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
  }

  private render(time: number): void {
    const gl = this.gl;
    const canvas = this.canvasRef?.nativeElement;
    if (!gl || !canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(this.resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(this.timeLocation, (this.isReducedMotion ? 1000 : time) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!this.isReducedMotion) {
      this.animFrameId = requestAnimationFrame(t => this.render(t));
    }
  }
}
