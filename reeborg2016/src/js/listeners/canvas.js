require("./../rur.js");

$("#robot-canvas").mousemove(function (evt) {
    RUR.mouse_x = evt.pageX;
    RUR.mouse_y = evt.pageY;
    handleMouseMove(evt);
});
$("#robot-canvas").on("click", function (evt) {
    RUR.mouse_x = evt.pageX;
    RUR.mouse_y = evt.pageY;
}); // mouse clicks also requested in world_editor.js (at bottom)

/* tooltip intended to provide information about objects carried by robot */
var tooltip = {};
tooltip.canvas = document.getElementById("tooltip");
tooltip.ctx = tooltip.canvas.getContext("2d");

function handleMouseMove(evt) {
    var x, y, hit, position, world, robot, mouse_above_robot, image, nb_obj;
    var size = 40, objects_carried;

    world = RUR.CURRENT_WORLD;
    x = evt.pageX - $("#robot-canvas").offset().left;
    y = evt.pageY - $("#robot-canvas").offset().top;
    position = RUR.calculate_grid_position();
    tooltip.canvas.style.left = "-200px";
    if (!tooltip.mouse_contained) {
        return;
    }

    //mouse_above_robot = false;
    if (world.robots !== undefined) {
        for (i=0; i < world.robots.length; i++) {
            robot = world.robots[i];
            if (robot.start_positions === undefined) {
                robot.start_positions = [[robot.x, robot.y]];
            }
            for (j=0; j < robot.start_positions.length; j++){
                pos = robot.start_positions[j];
                if(pos[0]==position[0] && pos[1]==position[1]){
                    mouse_above_robot = true;
                    if (robot.objects !== undefined){
                        objects_carried = Object.keys(robot.objects);
                        break;
                    }
                }
            }
            if (mouse_above_robot) {
                break;
            }
        }
    }

    tooltip.canvas.height = size;
    if (objects_carried !== undefined) {
        tooltip.canvas.width = size*Math.max(objects_carried.length, 1);
    } else {
        tooltip.canvas.width = size;
        objects_carried = [];
    }
    if (mouse_above_robot){
        tooltip.canvas.style.left = x+20 + "px";
        tooltip.canvas.style.top = y + "px";
        tooltip.ctx.clearRect(0, 0, tooltip.canvas.width, tooltip.canvas.height);
        for (i=0; i < objects_carried.length; i++){
            image = RUR.OBJECTS[objects_carried[i]].image;
            nb_obj = robot.objects[objects_carried[i]];
            if (nb_obj == "infinite" || nb_obj == Infinity) {
                nb_obj = "∞";
            }
            tooltip.ctx.drawImage(image, i*size, 0, image.width, image.height);
            tooltip.ctx.fillText(nb_obj, i*size+1, size-1);
        }
    }
}

RUR.calculate_grid_position = function () {
    var ctx, x, y;
    x = RUR.mouse_x - $("#robot-canvas").offset().left;
    y = RUR.mouse_y - $("#robot-canvas").offset().top;

    x /= RUR.WALL_LENGTH;
    x = Math.floor(x);

    y = RUR.HEIGHT - y + RUR.WALL_THICKNESS;
    y /= RUR.WALL_LENGTH;
    y = Math.floor(y);

    tooltip.mouse_contained = true;
    if (x < 1 ) {
        x = 1;
        tooltip.mouse_contained = false;
    } else if (x > RUR.COLS) {
        x = RUR.COLS;
        tooltip.mouse_contained = false;
    }
    if (y < 1 ) {
        y = 1;
        tooltip.mouse_contained = false;
    } else if (y > RUR.ROWS) {
        y = RUR.ROWS;
        tooltip.mouse_contained = false;
    }
    return [x, y];
};
