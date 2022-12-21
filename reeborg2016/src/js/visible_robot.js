
require("./constants.js");
require("./state.js");
// TODO: RUR._BASE_URL -> need to change it to state...

RUR.vis_robot = {};
RUR.vis_robot.images = [{}, {}, {}, {}];

// we will keep track if we have loaded all images
RUR.vis_robot.loaded_images = 0;
RUR.vis_robot.nb_images = 0;

RUR._BASE_URL = RUR._BASE_URL || '';  // enable changing defaults for unit tests

RUR.reset_default_robot_images = function () {

    // classic
    RUR.vis_robot.images[0].robot_e_img = new Image();
    RUR.vis_robot.images[0].robot_e_img.src = RUR._BASE_URL + '/src/images/robot_e.png';
    RUR.vis_robot.images[0].robot_n_img = new Image();
    RUR.vis_robot.images[0].robot_n_img.src = RUR._BASE_URL + '/src/images/robot_n.png';
    RUR.vis_robot.images[0].robot_w_img = new Image();
    RUR.vis_robot.images[0].robot_w_img.src = RUR._BASE_URL + '/src/images/robot_w.png';
    RUR.vis_robot.images[0].robot_s_img = new Image();
    RUR.vis_robot.images[0].robot_s_img.src = RUR._BASE_URL + '/src/images/robot_s.png';
    RUR.vis_robot.images[0].robot_random_img = new Image();
    RUR.vis_robot.images[0].robot_random_img.src = RUR._BASE_URL + '/src/images/robot_random.png';
    // rover type
    RUR.vis_robot.images[1].robot_e_img = new Image();
    RUR.vis_robot.images[1].robot_e_img.src = RUR._BASE_URL + '/src/images/rover_e.png';
    RUR.vis_robot.images[1].robot_n_img = new Image();
    RUR.vis_robot.images[1].robot_n_img.src = RUR._BASE_URL + '/src/images/rover_n.png';
    RUR.vis_robot.images[1].robot_w_img = new Image();
    RUR.vis_robot.images[1].robot_w_img.src = RUR._BASE_URL + '/src/images/rover_w.png';
    RUR.vis_robot.images[1].robot_s_img = new Image();
    RUR.vis_robot.images[1].robot_s_img.src = RUR._BASE_URL + '/src/images/rover_s.png';
    RUR.vis_robot.images[1].robot_random_img = new Image();
    RUR.vis_robot.images[1].robot_random_img.src = RUR._BASE_URL + '/src/images/rover_random.png';

    // 3d red type
    RUR.vis_robot.images[2].robot_e_img = new Image();
    RUR.vis_robot.images[2].robot_e_img.src = RUR._BASE_URL + '/src/images/plain_e.png';
    RUR.vis_robot.images[2].robot_n_img = new Image();
    RUR.vis_robot.images[2].robot_n_img.src = RUR._BASE_URL + '/src/images/plain_n.png';
    RUR.vis_robot.images[2].robot_w_img = new Image();
    RUR.vis_robot.images[2].robot_w_img.src = RUR._BASE_URL + '/src/images/plain_w.png';
    RUR.vis_robot.images[2].robot_s_img = new Image();
    RUR.vis_robot.images[2].robot_s_img.src = RUR._BASE_URL + '/src/images/plain_s.png';
    RUR.vis_robot.images[2].robot_random_img = new Image();
    RUR.vis_robot.images[2].robot_random_img.src = RUR._BASE_URL + '/src/images/robot_random.png';

    // solar panel type
    RUR.vis_robot.images[3].robot_e_img = new Image();
    RUR.vis_robot.images[3].robot_e_img.src = RUR._BASE_URL + '/src/images/sp_e.png';
    RUR.vis_robot.images[3].robot_n_img = new Image();
    RUR.vis_robot.images[3].robot_n_img.src = RUR._BASE_URL + '/src/images/sp_n.png';
    RUR.vis_robot.images[3].robot_w_img = new Image();
    RUR.vis_robot.images[3].robot_w_img.src = RUR._BASE_URL + '/src/images/sp_w.png';
    RUR.vis_robot.images[3].robot_s_img = new Image();
    RUR.vis_robot.images[3].robot_s_img.src = RUR._BASE_URL + '/src/images/sp_s.png';
    RUR.vis_robot.images[3].robot_random_img = new Image();
    RUR.vis_robot.images[3].robot_random_img.src = RUR._BASE_URL + '/src/images/robot_random.png';

    $("#robot0 img").attr("src", RUR.vis_robot.images[0].robot_e_img.src);
    $("#robot1 img").attr("src", RUR.vis_robot.images[1].robot_e_img.src);
    $("#robot2 img").attr("src", RUR.vis_robot.images[2].robot_e_img.src);
    $("#robot3 img").attr("src", RUR.vis_robot.images[3].robot_e_img.src);
    RUR.select_default_robot_model(localStorage.getItem("robot_default_model"));
};

RUR.vis_robot.style = 0;

RUR.select_default_robot_model = function (arg) {
    var style;
    style = parseInt(arg, 10);
    if ( !(style ===0 || style==1 || style==2 || style==3)){
        style = 0;
    }
    RUR.vis_robot.style = style;
    RUR.vis_robot.e_img = RUR.vis_robot.images[style].robot_e_img;
    RUR.vis_robot.n_img = RUR.vis_robot.images[style].robot_n_img;
    RUR.vis_robot.w_img = RUR.vis_robot.images[style].robot_w_img;
    RUR.vis_robot.s_img = RUR.vis_robot.images[style].robot_s_img;
    RUR.vis_robot.random_img = RUR.vis_robot.images[style].robot_random_img;
    if (RUR.vis_world !== undefined) {
        RUR.vis_world.refresh();
    }

    localStorage.setItem("robot_default_model", style);
};
RUR.reset_default_robot_images();
// the following is to try to ensure that the images are loaded before the "final"
// original drawing is made

RUR.vis_robot.e_img.onload = function () {
    RUR.vis_robot.loaded_images += 1;
};
RUR.vis_robot.nb_images += 1;
RUR.vis_robot.w_img.onload = function () {
    RUR.vis_robot.loaded_images += 1;
};
RUR.vis_robot.nb_images += 1;
RUR.vis_robot.n_img.onload = function () {
    RUR.vis_robot.loaded_images += 1;
};
RUR.vis_robot.nb_images += 1;
RUR.vis_robot.s_img.onload = function () {
    RUR.vis_robot.loaded_images += 1;
};
RUR.vis_robot.nb_images += 1;
RUR.vis_robot.random_img.onload = function () {
    RUR.vis_robot.loaded_images += 1;
};
RUR.vis_robot.nb_images += 1;



RUR.vis_robot.draw = function (robot) {
    "use strict";
    var x, y, width, height, image;
    // handling legacy Code
    if (robot.orientation !== undefined) {
        robot._orientation = robot.orientation;
        robot.orientation = null;
    }
    if (!robot) {
        return;
    }
    if (robot.x > RUR.COLS || robot.y > RUR.ROWS) {
        return;
    }

    // all images are taken to be centered on a tile 40x40, which are scaled
    //  appropriately
    width = RUR.TILE_SIZE * RUR.SCALE;
    height = RUR.TILE_SIZE * RUR.SCALE;

    x = robot.x*RUR.WALL_LENGTH + RUR.WALL_THICKNESS/2;
    y = RUR.HEIGHT - (robot.y+1)*RUR.WALL_LENGTH + RUR.WALL_THICKNESS/2;

    switch(robot._orientation){
        case RUR.EAST:
            if (robot.model !== undefined){
                image = RUR.vis_robot.images[robot.model].robot_e_img;
            } else {
                image = RUR.vis_robot.e_img;
            }
            break;
        case RUR.NORTH:
            if (robot.model !== undefined){
                image = RUR.vis_robot.images[robot.model].robot_n_img;
            } else {
                image = RUR.vis_robot.n_img;
            }
            break;
        case RUR.WEST:
            if (robot.model !== undefined){
                image = RUR.vis_robot.images[robot.model].robot_w_img;
            } else {
                image = RUR.vis_robot.w_img;
            }
            break;
        case RUR.SOUTH:
            if (robot.model !== undefined){
                image = RUR.vis_robot.images[robot.model].robot_s_img;
            } else {
                image = RUR.vis_robot.s_img;
            }
            break;
        case -1:
            if (robot.model !== undefined){
                image = RUR.vis_robot.images[robot.model].robot_random_img;
            } else {
                image = RUR.vis_robot.random_img;
            }
            break;
        default:
            image = RUR.vis_robot.e_img;
        }
    RUR.ROBOT_CTX.drawImage(image, x, y, width, height);
    if (RUR.state.editing_world){
        return;
    }
    RUR.vis_robot.draw_trace(robot);
};


RUR.vis_robot.draw_trace = function (robot) {
    "use strict";
    if (robot === undefined || robot._is_leaky === false || robot._orientation === -1) {
        return;
    }
    if (robot.x > RUR.COLS || robot.y > RUR.ROWS) {
        return;
    }
    var ctx = RUR.TRACE_CTX;
    if (robot.trace_color !== undefined){
        ctx.strokeStyle = robot.trace_color;
    } else {
        ctx.strokeStyle = RUR.vis_robot.trace_color;
    }

    // overrides user choice for large world (small grid size)
    if(RUR.CURRENT_WORLD.small_tiles) {
        RUR.vis_robot.trace_offset = [[12, 12], [12, 12], [12, 12], [12, 12]];
        RUR.vis_robot.trace_thickness = 2;
    } else {
        RUR.vis_robot.set_trace_style(RUR.TRACE_STYLE, robot);
    }

    ctx.lineWidth = RUR.vis_robot.trace_thickness;
    ctx.lineCap = "round";

    ctx.beginPath();
    // ensure that _prev_orientation and orientation are within bounds as these could be messed
    // up by a user program and crash the robot program with a message sent to the console and nothing else.
    ctx.moveTo(robot._prev_x* RUR.WALL_LENGTH + RUR.vis_robot.trace_offset[robot._prev_orientation%4][0],
                    RUR.HEIGHT - (robot._prev_y +1) * RUR.WALL_LENGTH + RUR.vis_robot.trace_offset[robot._prev_orientation%4][1]);
    ctx.lineTo(robot.x* RUR.WALL_LENGTH + RUR.vis_robot.trace_offset[robot._orientation%4][0],
                    RUR.HEIGHT - (robot.y +1) * RUR.WALL_LENGTH + RUR.vis_robot.trace_offset[robot._orientation%4][1]);
    ctx.stroke();
};

RUR.vis_robot.set_trace_style = function (choice, robot){
    "use strict";
    if (choice === undefined) {
        return;
    }
    RUR.TRACE_STYLE = choice;
    if (robot !== undefined && robot.trace_style !== undefined){
        choice = robot.trace_style;
    }
    if (choice === "thick") {
        RUR.vis_robot.trace_offset = [[25, 25], [25, 25], [25, 25], [25, 25]];
        RUR.vis_robot.trace_color = RUR.DEFAULT_TRACE_COLOR;
        RUR.vis_robot.trace_thickness = 4;
    } else if (choice === "invisible") {
        RUR.vis_robot.trace_color = "rgba(0,0,0,0)";
    } else if (choice === "default") {
        RUR.vis_robot.trace_offset = [[30, 30], [30, 20], [20, 20], [20, 30]];
        RUR.vis_robot.trace_color = RUR.DEFAULT_TRACE_COLOR;
        RUR.vis_robot.trace_thickness = 1;
    }
};

RUR.vis_robot.set_trace_style("default");

RUR.vis_robot.new_robot_images = function (images) {
    var model;
    if (images.model !== undefined) {
        switch (images.model) {
            case 0:
            case 1:
            case 2:
            case 3:
                model = images.model;
                break;
            default:
                model = 0;
        }
    } else {
        model = 0;
    }

    if (images.east !== undefined) {
        RUR.vis_robot.images[model].robot_e_img.src = images.east;
    }
    if (images.west !== undefined) {
        RUR.vis_robot.images[model].robot_w_img.src = images.west;
    }
    if (images.north !== undefined) {
        RUR.vis_robot.images[model].robot_n_img.src = images.north;
    }
    if (images.south !== undefined) {
        RUR.vis_robot.images[model].robot_s_img.src = images.south;
    }
    if (images.random !== undefined) {
        RUR.vis_robot.images[model].robot_random_img.src = images.random;
    }

    // change the image displayed in the html file.
    switch (model) {
        case 0:
            $("#robot0 img").attr("src", images.east);
            break;
        case 1:
            $("#robot1 img").attr("src", images.east);
            break;
        case 2:
            $("#robot2 img").attr("src", images.east);
            break;
        case 3:
            $("#robot3 img").attr("src", images.east);
            break;
    }

    RUR.select_default_robot_model(model);
};
