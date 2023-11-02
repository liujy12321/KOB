const GAME_OBJECTS = [];

export class GameObject {
    constructor() {

        GAME_OBJECTS.push(this); // 每创建一个，就push一个；后创建的会覆盖前面创建的
        this.has_called_start= false;
        this.timedelta = 0;
    }

    start() {

    }

    update() {

    }

    on_destroy() {

    }

    destroy() {

        this.on_destroy();

        for(let i in GAME_OBJECTS)
        {
            const object = GAME_OBJECTS[i];

            if(object === this) {

                GAME_OBJECTS.splice(i);

                break;
            }
        }
    }
}

let last_timeStamp; // last execution time
const step = timeStamp => {
    for(let obj of GAME_OBJECTS) {
        if(!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timeStamp - last_timeStamp; // 当前这帧距离上一帧的时间间隔，单位是毫秒
            obj.update();
        }
    }

    last_timeStamp = timeStamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
