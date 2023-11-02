// Cell：定义一条蛇里面的一个格子
// 一条蛇就是一连串格子的序列

export class Cell {
    
    // 定义一条蛇里的一个格子横纵坐标长度，同时将其圆心表示出来
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        // 将行数和列数转化为坐标
        this.x = columns + 0.5;
        this.y = rows + 0.5;
    }
}