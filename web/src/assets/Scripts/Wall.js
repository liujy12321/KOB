import { GameObject } from "./GameObject";

export class Wall extends GameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226"; // 定义墙的颜色
    }

    update() { 
        this.render();
    }

    render() { // 渲染墙
        const L = this.gamemap.L; // 一个单位格的边长
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color; // 画墙
        ctx.fillRect(this.c * L, this.r * L, L, L); // 填充的坐标以及画多长
    }
}