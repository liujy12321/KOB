// Snake：定义一个蛇的对象
// 每一帧都需要刷新渲染一次
import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {

    // 参数：传过来的信息以及地图
    constructor(info, gamemap) {
        
        super();

        // 每个蛇都有一个id，color，以及地图信息
        // 在GameMap.js里，新建Snake的时候就是传入（id，color，r，c）以及this（地图）
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)]; // 存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null; // 下一回合的目标位置

        this.speed = 5; // 蛇的速度：每秒走5个格子（注意每帧 != 每秒）
        this.direction = -1; // 回合制游戏，direction表示蛇的下一回合指令；-1表示无指令，0, 1，2，3表示上右下左
        this.status = "idle"; // 蛇的状态：idle表示静止，move表示正在移动，die表示死亡

        this.dr = [-1, 0, 1, 0]; // 表示横向的偏移量
        this.dc = [0, 1, 0, -1]; // 表示纵向的偏移量

        this.step = 0; // 回合数
        this.eps = 1e-2; // 允许的误差

        // 存蛇头的方向，用于画眼睛
        this.eye_direction = 0; // 0表示朝上
        if (this.id === 1) this.eye_direction = 2; // 左下角的蛇眼睛初始朝上，右下角的蛇眼睛初始朝下

        // 不同方向蛇眼睛相对圆心的偏移量
        // 分别对应左眼和右眼
        this.eye_dx = [
            [-1, 1], // 朝上
            [1, 1], // 朝右
            [1, -1], // 朝下
            [-1, -1], // 朝左
        ];

        this.eye_dy = [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];

    }

    Start() {

    }

    set_direction(d) {
        // 统一接口，用来设置方向（因为输入不一定是键盘，可能是其他的输入设备）
        this.direction = d;
    }

    // 检测当前回合，蛇的长度是否增加
    check_tail_increasing() {
        // 前十个回合每回合都会变长，所以step <= 10，会return true
        if (this.step <= 10) return true;
        // 每隔三回合，会增长一个
        if (this.step % 3 === 1) return true;
        // 其余都是false
        return false;
    }

    next_step() {
        // 将蛇的状态变为下一回合行动
        // 需要知道：下一回合往哪边走
        // 怎么让蛇移动：只移动蛇头和蛇尾，新建一个蛇头移动至下一格，然后蛇尾移动至倒数第二格，中间其他格子都不变即可
        const d = this.direction; // 取出下一回合指令
        this.next_cell = new Cell(this.cells[0].rows + this.dr[d], this.cells[0].columns + this.dc[d]); // 新建蛇头至下一个目标位置
        this.direction = -1; // 清空操作
        this.eye_direction = d; // 蛇的眼睛方向更新
        this.status = "move"; // 状态改为移动
        this.step ++;

        const k = this.cells.length; // 蛇的长度
        for (let i = k; i > 0; i --) {
            // 蛇的每个单位都向后移动一位
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1])); 
            // 防止新建的蛇单位不会和前面的一样
            // 深层复制：先转化成json，然后parse解析出来，就创建了一个新的对象，不会产生重复问题
            // 相当于[1]的位置多了一个自己的复制：
                
                /* [1,2,3,4] => [1,1,2,3,4] */
        }

        if (!this.gamemap.check_valid(this.next_cell)) { // 下一步操作不合法，状态变为die
            this.status = "die";
        }
    }

    update_move() {
        // 蛇的移动
        // 蛇头坐标 + 每一帧移动的距离（1帧 = 1秒/1000）
        // 横坐标移动的距离
        const dx = this.next_cell.x - this.cells[0].x;
        // 纵坐标移动的距离
        const dy = this.next_cell.y - this.cells[0].y;
        // 求距离
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.eps) {
            this.cells[0] = this.next_cell; // 添加新的蛇头
            this.next_cell = null; // 清空
            this.status = "idle"; // 走到了位置，停下来

            if (!this.check_tail_increasing()) { // 蛇不变长，则去掉蛇尾
                this.cells.pop();
            }

        } else {
            const move_distance = this.speed * this.timedelta / 1000;
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) { // 蛇尾不变长，则蛇尾需要移动到下一个目的地
                const k = this.cells.length; // 取蛇的长度
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2]; // 蛇尾是k - 1，下一个目标就是k - 2的位置
                const tail_dx = tail_target.x - tail.x; // 求目标位置和当前蛇尾的x距离
                const tail_dy = tail_target.y - tail.y; // 求目标位置和当前蛇尾的y距离
                tail.x += move_distance * tail_dx / distance; // 蛇尾新坐标横坐标，蛇头和蛇尾的move_distance是一样的
                tail.y += move_distance * tail_dy / distance; // 蛇尾新坐标纵坐标
            }
        }
        
    }

    update() {
        // 每一帧画一遍
        // 若状态为移动，则每帧移动一次
        if (this.status === 'move') {
            this.update_move();

        }
        this.render();
    }

    render() {

        // 取地图上每个单元格的长度L，以及画布canvas的ctx，用来画画
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        // 画圆：颜色以及形状
        ctx.fillStyle = this.color;

        // 若蛇的状态为die，则变为白色
        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) { // of：遍历蛇身体的数值
            ctx.beginPath(); // 开始画
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2); // 圆弧：分别是圆中点的横纵坐标，半径，起始角度和终止角度
            ctx.fill(); // 填充
        } 

        // 连接蛇，使得蛇是一整条，而不是分开的圆
        for (let i = 1; i < this.cells.length; i ++) {
            // 取蛇的两个圆
            const a = this.cells[i - 1], b = this.cells[i];
            // 若这两个圆重合，则不用连接，跳过
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
                continue;
            }
            // 两个圆的位置关系为纵向，即横坐标x重合：
            if (Math.abs(a.x - b.x) < this.eps) {
                // 画长方形：分别为起点的横、纵坐标，长，宽；* L表示绝对距离
                // 边长变为0.8倍，相应的a.x-0.5的时候需要加上一个偏移量0.1
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L); 
            } else {
                // 水平方向
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        // 画蛇的眼睛
        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L; // （蛇头的x坐标+眼睛对应的偏移量 * 相对移动距离）* L
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }

    }
}