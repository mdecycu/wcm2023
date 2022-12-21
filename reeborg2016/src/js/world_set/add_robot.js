require("./../recorder/record_frame.js");


RUR._add_robot = function (robot) {
    if (RUR.CURRENT_WORLD.robots === undefined){
        RUR.CURRENT_WORLD.robots = [];
    }
    RUR.CURRENT_WORLD.robots.push(robot);
    RUR.record_frame();
};
