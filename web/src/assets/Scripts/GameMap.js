import { GameObject } from "./GameObject"; // 地图里包含游戏对象
import { Wall } from "./Wall"; // 地图里包含墙

export class GameMap extends GameObject {

    constructor(ctx, parent) {
        super(); // 先执行的Object构造函数，会被优先加入

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0; // 每个格子的单位长度

        this.rows = 13;
        this.columns = 13;

        this.inner_walls_count = 20; // 内部墙的个数
        this.walls = []; // 墙；在后面加入，所以会覆盖掉地图
    }

    // 查看地图的连通性: flood fill算法
    // sx, sy：起点横纵坐标
    // tx, ty：终点横纵坐标
    check_connectivity(g, sx, sy, tx, ty ) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++) {
            let x = sx + dx[i], y = sy + dy[i];
            if(!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) return true;
        }

        return false;
    }

    create_walls() {
        // 创建墙
        // g是bool数组，用于判断是否应该有墙
        // 初始化为false
        const g = [];
        for (let r = 0; r < this.rows; r ++) {
            g[r] = [];
            for (let c = 0; c < this.columns; c ++) {
                g[r][c] = false;
            }
        }

        // 给左右两边建墙：先让两边的格子应该有墙
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.columns - 1] = true;
        }

        // 给上下两行加上墙：先让上下两边的格子应该有墙
        for (let c = 0; c < this.columns; c ++) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机墙；出现重复，再随机即可
        for (let i = 0; i < this.inner_walls_count; i ++) {
            for (let j = 0; j < 1000; j ++) {
                let r = parseInt(Math.random() * this.rows); // random函数随机取[0,1）之间的浮点数，乘上rows就是0 ~ rows - 1的值
                let c = parseInt(Math.random() * this.columns);
                if (g[r][c] || g[c][r]) continue; // 中心对称
                if (r == this.rows - 2 && c == 1 || c == this.columns - 2 && r == 1) continue; // 保证不会覆盖掉左上角和右下角，用来放蛇

                g[r][c] = g[c][r] = true;
                
                break;
            }
        }

        // 将g数组复制一遍，防止算法更改了原先结果
        const copy_g = JSON.parse(JSON.stringify(g));

        // 查看地图是否连通
        // 起点和终点都排除了放蛇的地方
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.columns - 2)) return false;

        // 凡是应该有墙的地方，都加上墙
        for (let r = 0; r < this.rows; r ++) {
            for (let c = 0; c < this.columns; c ++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }


        return true; // 如果连通的话返回true
}

    start() {
        // 初始时创建墙; 不是连通的就一直随机直到连通
        // 随机1000次
        for (let i = 0; i < 1000; i ++) {
            if (this.create_walls()) {
                break;
            }
        }
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.columns, this.parent.clientHeight / this.rows));
        // 取整像素，因为L是浮点数，画的时候是整像素
        this.ctx.canvas.width = this.L * this.columns;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
        this.render();
    }

    render() { // 渲染地图，奇偶数渲染不同颜色
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++) {
            for (let c = 0; c < this.columns; c ++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}