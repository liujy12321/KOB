import { GameObject } from "./GameObject"; // 地图里包含游戏对象
import { Snake } from "./Snake";
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

        //创建两条蛇
        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.columns - 2}, this),
        ]

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
                // 中心对称，到中心点的横纵坐标相等
                if (g[r][c] || g[this.rows - 1 - r][this.columns - 1 - c]) continue; 
                if (r == this.rows - 2 && c == 1 || c == this.columns - 2 && r == 1) continue; // 保证不会覆盖掉左上角和右下角，用来放蛇

                g[r][c] = g[this.rows - 1 - r][this.colums - 1 - c] = true;
                
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

    add_listening_events() {
        // 给canvas绑定一个获取用户输入信息的事件
        this.ctx.canvas.focus(); // 获取用户输入前需要聚焦canvas

        const [snake0, snake1] = this.snakes; // 取出两条蛇
        this.ctx.canvas.addEventListener("keydown", e => { 
            // API: addEventListener, 绑定一个keydown事件
            // 怎么判断当前输入的key：wasd控制其中一条，上下左右方向键控制另一条
            if (e.key === "w") snake0.set_direction(0);
            else if (e.key === "d") snake0.set_direction(1);
            else if (e.key === "s") snake0.set_direction(2);
            else if (e.key === "a") snake0.set_direction(3);
            else if (e.key === "ArrowUp") snake1.set_direction(0);
            else if (e.key === "ArrowRight") snake1.set_direction(1);
            else if (e.key === "ArrowDown") snake1.set_direction(2);
            else if (e.key === "ArrowLeft") snake1.set_direction(3);

        });


    }

    start() {
        // 初始时创建墙; 不是连通的就一直随机直到连通
        // 随机1000次
        for (let i = 0; i < 1000; i ++) {
            if (this.create_walls()) {
                break;
            }
        }

        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.columns, this.parent.clientHeight / this.rows));
        // 取整像素，因为L是浮点数，画的时候是整像素
        this.ctx.canvas.width = this.L * this.columns;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {
        // 判断是否准备好进入下一回合
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false; // 蛇还在移动，不能进入下一回合；判断不相等：！==
            if (snake.direction === -1) return false; // 蛇没有下一回合指令，不能进入下一回合；判断相等是三个等号
        }

        return true;
    }

    next_step() {
        // 让蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }

    }
    
    // 检测目标位置是否合法：没有撞到某条蛇的身体和墙
    check_valid(cell) {
        // 有没有撞到墙
        for (const wall of this.walls) {
            if (wall.r === cell.rows && wall.c === cell.columns) {
                return false;
            }
        }

        // 有没有撞到蛇
        for (const snake of this.snakes) {
            // 单独判断蛇尾是否会缩：如果缩了，可以走；没缩则不能走
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) { // 蛇尾需要前进的时候，则不需要判断
                k --;
            }
            for (let i = 0; i < k; i ++) {
                if (snake.cells[i].rows === cell.rows && snake.cells[i].columns === cell.columns) {
                    return false;
                }
            }
        }

        return true;

    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            // 若蛇都可以准备好进入下一回合了，则让两条蛇进入下一回合
            this.next_step();
        }
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