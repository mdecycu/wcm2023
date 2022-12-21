
/*jshint  -W002,browser:true, devel:true, indent:4, white:false, plusplus:false */
/*globals $, RUR */

require("./translator.js");
require("./constants.js");
require("./objects.js");
require("./output.js");
require("./recorder/record_frame.js");
require("./state.js");
require("./exceptions.js");
require("./world_get.js");
require("./world_set.js");
require("./utils/supplant.js");
require("./utils/key_exist.js");

RUR.control = {};

RUR.control.move = function (robot) {
    "use strict";
    var tile, tiles, name, objects, tile_beyond, solid_tile_beyond,
        solids_beyond, solid_object_beyond,
        pushable_object_here, pushable_object_beyond,
        wall_beyond, x_beyond, y_beyond;

    if (RUR.control.wall_in_front(robot)) {
        throw new RUR.WallCollisionError(RUR.translate("Ouch! I hit a wall!"));
    }

    robot._prev_x = robot.x;
    robot._prev_y = robot.y;

    x_beyond = robot.x;  // if robot is moving vertically, it x coordinate does not change
    y_beyond = robot.y;

    switch (robot._orientation){
    case RUR.EAST:
        robot.x += 1;
        x_beyond = robot.x + 1;
        break;
    case RUR.NORTH:
        robot.y += 1;
        y_beyond = robot.y + 1;
        break;
    case RUR.WEST:
        robot.x -= 1;
        x_beyond = robot.x - 1;
        break;
    case RUR.SOUTH:
        robot.y -= 1;
        y_beyond = robot.y - 1;
        break;
    default:
        throw new Error("Should not happen: unhandled case in RUR.control.move().");
    }

    pushable_object_here = RUR.world_get.pushable_object_at_position(robot.x, robot.y);

    if (pushable_object_here) {
        // we had assume that we have made a successful move as nothing was
        // blocking the robot which is now at its next position.
        // However, something may have prevented the pushable object from
        // actually being pushed
        wall_beyond = RUR.control.wall_in_front(robot);
        pushable_object_beyond = RUR.world_get.pushable_object_at_position(x_beyond, y_beyond);
        tile_beyond = RUR.world_get.tile_at_position(x_beyond, y_beyond);
        if (tile_beyond && tile_beyond.solid) {
            solid_tile_beyond = true;
            } else {
            solid_tile_beyond = false;
        }

        solids_beyond = RUR.world_get.obstacles_at_position(x_beyond, y_beyond);
        solid_object_beyond = false;
        if (solids_beyond) {
            for (name in solids_beyond) {
                if (RUR.OBSTACLES[name] !== undefined && RUR.OBSTACLES[name].solid) {
                    solid_object_beyond = true;
                    break;
                }
            }
        }

        if (pushable_object_beyond || wall_beyond || solid_tile_beyond || solid_object_beyond) {
            robot.x = robot._prev_x;
            robot.y = robot._prev_y;
            throw new RUR.ReeborgError(RUR.translate("Something is blocking the way!"));
        } else {
            RUR.control.move_object(pushable_object_here, robot.x, robot.y,
            x_beyond, y_beyond);
        }
    }

    RUR.state.sound_id = "#move-sound";
    RUR.record_frame("debug", "RUR.control.move");
    tile = RUR.world_get.tile_at_position(robot.x, robot.y);
    if (tile) {
        if (tile.fatal){
            if (!(tile == RUR.TILES.water && RUR.control.solid_object_here(robot, RUR.translate("bridge"))) ){
                throw new RUR.ReeborgError(RUR.translate(tile.message));
            }
        }
        if (tile.slippery){
            RUR.output.write(RUR.translate(tile.message) + "\n");
            RUR.control.move(robot);
        }
    }

    objects = RUR.world_get.obstacles_at_position(robot.x, robot.y);
    if (objects) {
        for (name in objects) {
            if (RUR.OBSTACLES[name] !== undefined && RUR.OBSTACLES[name].fatal) {
                robot.x = robot._prev_x;
                robot.y = robot._prev_y;
                throw new RUR.ReeborgError(RUR.OBSTACLES[name].message);
            }
        }
    }
    if (!robot._is_leaky) {  // update to avoid drawing from previous point.
        robot._prev_x = robot.x;
        robot._prev_y = robot.y;
    }

};

RUR.control.move_object = function(obj, x, y, to_x, to_y){
    "use strict";
    var bridge_already_there = false;
    if (RUR.world_get.obstacles_at_position(to_x, to_y).bridge !== undefined){
        bridge_already_there = true;
    }


    RUR.add_object_at_position(obj, x, y, 0);
    if (RUR.OBJECTS[obj].in_water &&
        RUR.world_get.tile_at_position(to_x, to_y) == RUR.TILES.water &&
        !bridge_already_there){
            // TODO: fix this
        RUR.world_set.add_solid_object(RUR.OBJECTS[obj].in_water, to_x, to_y, 1);
    } else {
        RUR.add_object_at_position(obj, to_x, to_y, 1);
    }
};


RUR.control.turn_left = function(robot){
    "use strict";
    robot._prev_orientation = robot._orientation;
    robot._prev_x = robot.x;
    robot._prev_y = robot.y;
    robot._orientation += 1;  // could have used "++" instead of "+= 1"
    robot._orientation %= 4;
    RUR.state.sound_id = "#turn-sound";
    if (!robot._is_leaky) {  // update to avoid drawing from previous point.
        robot._prev_orientation = robot._orientation;
    }    
    RUR.record_frame("debug", "RUR.control.turn_left");
};

RUR.control.__turn_right = function(robot){
    "use strict";
    robot._prev_orientation = (robot._orientation+2)%4; // fix so that oil trace looks right
    robot._prev_x = robot.x;
    robot._prev_y = robot.y;
    robot._orientation += 3;
    robot._orientation %= 4;
    if (!robot._is_leaky) {  // update to avoid drawing from previous point.
        robot._prev_orientation = robot._orientation;
    }
    RUR.record_frame("debug", "RUR.control.__turn_right");
};

RUR.control.pause = function (ms) {
    RUR.record_frame("pause", {pause_time:ms});
};

RUR.control.done = function () {
    throw new RUR.ReeborgError(RUR.translate("Done!"));
};

RUR.control.put = function(robot, arg){
    var translated_arg, objects_carried, obj_type, all_objects;
    RUR.state.sound_id = "#put-sound";

    if (arg !== undefined) {
        translated_arg = RUR.translate_to_english(arg);
        if (RUR.KNOWN_OBJECTS.indexOf(translated_arg) == -1){
            throw new RUR.ReeborgError(RUR.translate("Unknown object").supplant({obj: arg}));
        }
    }

    objects_carried = robot.objects;
    all_objects = [];
    for (obj_type in objects_carried) {
        if (objects_carried.hasOwnProperty(obj_type)) {
            all_objects.push(obj_type);
        }
    }
    if (all_objects.length === 0){
        throw new RUR.ReeborgError(RUR.translate("I don't have any object to put down!").supplant({obj: RUR.translate("object")}));
    }
    if (arg !== undefined) {
        if (robot.objects[translated_arg] === undefined) {
            throw new RUR.ReeborgError(RUR.translate("I don't have any object to put down!").supplant({obj:arg}));
        }  else {
            RUR.control._robot_put_down_object(robot, translated_arg);
        }
    }  else {
        if (objects_carried.length === 0){
            throw new RUR.ReeborgError(RUR.translate("I don't have any object to put down!").supplant({obj: RUR.translate("object")}));
        } else if (all_objects.length > 1){
             throw new RUR.ReeborgError(RUR.translate("I carry too many different objects. I don't know which one to put down!"));
        } else {
            RUR.control._robot_put_down_object(robot, translated_arg);
        }
    }
};

RUR.control._robot_put_down_object = function (robot, obj) {
    "use strict";
    var objects_carried, coords, obj_type;
    if (obj === undefined){
        objects_carried = robot.objects;
        for (obj_type in objects_carried) {
            if (objects_carried.hasOwnProperty(obj_type)) {
                obj = obj_type;
            }
        }
    }
    robot.objects[obj] -= 1;
    if (robot.objects[obj] === 0) {
        delete robot.objects[obj];
    }

    RUR._ensure_key_exists(RUR.CURRENT_WORLD, "objects");
    coords = robot.x + "," + robot.y;
    RUR._ensure_key_exists(RUR.CURRENT_WORLD.objects, coords);
    if (RUR.CURRENT_WORLD.objects[coords][obj] === undefined) {
        RUR.CURRENT_WORLD.objects[coords][obj] = 1;
    } else {
        RUR.CURRENT_WORLD.objects[coords][obj] += 1;
    }
    RUR.record_frame("debug", "RUR.control._put_object");
};


RUR.control.take = function(robot, arg){
    var translated_arg, objects_here;
    RUR.state.sound_id = "#take-sound";
    if (arg !== undefined) {
        translated_arg = RUR.translate_to_english(arg);
        if (RUR.KNOWN_OBJECTS.indexOf(translated_arg) == -1){
            throw new RUR.ReeborgError(RUR.translate("Unknown object").supplant({obj: arg}));
        }
    }

    objects_here = RUR.world_get.object_at_robot_position(robot, arg);
    if (arg !== undefined) {
        // WARNING: do not change this silly comparison to false
        // to anything else ... []==false is true  but []==[] is false
        // and ![] is false
        if (objects_here.length === 0 || objects_here == false) { // jshint ignore:line
            throw new RUR.ReeborgError(RUR.translate("No object found here").supplant({obj: arg}));
        }  else {
            RUR.control._take_object_and_give_to_robot(robot, arg);
        }
        // WARNING: do not change this silly comparison to false
        // to anything else ... []==false is true  but []==[] is false
        // and ![] is false
    }  else if (objects_here.length === 0 || objects_here == false){ // jshint ignore:line
        throw new RUR.ReeborgError(RUR.translate("No object found here").supplant({obj: RUR.translate("object")}));
    }  else if (objects_here.length > 1){
        throw new RUR.ReeborgError(RUR.translate("Many objects are here; I do not know which one to take!"));
    } else {
        RUR.control._take_object_and_give_to_robot(robot, objects_here[0]);
    }
};

RUR.control._take_object_and_give_to_robot = function (robot, obj) {
    var objects_here, coords;
    obj = RUR.translate_to_english(obj);
    coords = robot.x + "," + robot.y;
    RUR.CURRENT_WORLD.objects[coords][obj] -= 1;

    if (RUR.CURRENT_WORLD.objects[coords][obj] === 0){
        delete RUR.CURRENT_WORLD.objects[coords][obj];
        // WARNING: do not change this silly comparison to false
        // to anything else ... []==false is true  but []==[] is false
        // and ![] is false
        if (RUR.world_get.object_at_robot_position(robot) == false){ // jshint ignore:line
            delete RUR.CURRENT_WORLD.objects[coords];
        }
    }
    RUR._ensure_key_exists(robot, "objects");
    if (robot.objects[obj] === undefined){
        robot.objects[obj] = 1;
    } else {
        robot.objects[obj]++;
    }
    RUR.record_frame("debug", "RUR.control._take_object");
};


RUR.control.build_wall = function (robot){
    var coords, orientation, x, y, walls;
    if (RUR.control.wall_in_front(robot)){
        throw new RUR.WallCollisionError(RUR.translate("There is already a wall here!"));
    }

    switch (robot._orientation){
    case RUR.EAST:
        coords = robot.x + "," + robot.y;
        orientation = "east";
        x = robot.x;
        y = robot.y;
        break;
    case RUR.NORTH:
        coords = robot.x + "," + robot.y;
        orientation = "north";
        x = robot.x;
        y = robot.y;
        break;
    case RUR.WEST:
        orientation = "east";
        x = robot.x-1;
        y = robot.y;
        break;
    case RUR.SOUTH:
        orientation = "north";
        x = robot.x;
        y = robot.y-1;
        break;
    default:
        throw new RUR.ReeborgError("Should not happen: unhandled case in RUR.control.build_wall().");
    }

    coords = x + "," + y;
    walls = RUR.CURRENT_WORLD.walls;
    if (walls === undefined){
        walls = {};
        RUR.CURRENT_WORLD.walls = walls;
    }

    if (walls[coords] === undefined){
        walls[coords] = [orientation];
    } else {
        walls[coords].push(orientation);
    }
    RUR.state.sound_id = "#build-sound";
    RUR.record_frame("debug", "RUR.control.build_wall");
};


RUR.control.wall_in_front = function (robot) {
    var coords;
    switch (robot._orientation){
    case RUR.EAST:
        coords = robot.x + "," + robot.y;
        if (robot.x == RUR.COLS){
            return true;
        }
        if (RUR.world_get.is_wall_at(coords, "east")) {
            return true;
        }
        break;
    case RUR.NORTH:
        coords = robot.x + "," + robot.y;
        if (robot.y == RUR.ROWS){
            return true;
        }
        if (RUR.world_get.is_wall_at(coords, "north")) {
            return true;
        }
        break;
    case RUR.WEST:
        if (robot.x===1){
            return true;
        } else {
            coords = (robot.x-1) + "," + robot.y; // do math first before building strings
            if (RUR.world_get.is_wall_at(coords, "east")) {
                return true;
            }
        }
        break;
    case RUR.SOUTH:
        if (robot.y===1){
            return true;
        } else {
            coords = robot.x + "," + (robot.y-1);  // do math first before building strings
            if (RUR.world_get.is_wall_at(coords, "north")) {
                return true;
            }
        }
        break;
    default:
        throw new RUR.ReeborgError("Should not happen: unhandled case in RUR.control.wall_in_front().");
    }
    return false;
};

RUR.control.wall_on_right = function (robot) {
    var result;
    RUR._recording_(false);
    RUR.control.__turn_right(robot);
    result = RUR.control.wall_in_front(robot);
    RUR.control.turn_left(robot);
    RUR._recording_(true);
    return result;
};

RUR.control.tile_in_front = function (robot) {
    // returns single tile
    switch (robot._orientation){
    case RUR.EAST:
        return RUR.world_get.tile_at_position(robot.x+1, robot.y);
    case RUR.NORTH:
        return RUR.world_get.tile_at_position(robot.x, robot.y+1);
    case RUR.WEST:
        return RUR.world_get.tile_at_position(robot.x-1, robot.y);
    case RUR.SOUTH:
        return RUR.world_get.tile_at_position(robot.x, robot.y-1);
    default:
        throw new RUR.ReeborgError("Should not happen: unhandled case in RUR.control.tile_in_front().");
    }
};


RUR.control.obstacles_in_front = function (robot) {
    // returns list of tiles
    switch (robot._orientation){
    case RUR.EAST:
        return RUR.world_get.obstacles_at_position(robot.x+1, robot.y);
    case RUR.NORTH:
        return RUR.world_get.obstacles_at_position(robot.x, robot.y+1);
    case RUR.WEST:
        return RUR.world_get.obstacles_at_position(robot.x-1, robot.y);
    case RUR.SOUTH:
        return RUR.world_get.obstacles_at_position(robot.x, robot.y-1);
    default:
        throw new RUR.ReeborgError("Should not happen: unhandled case in RUR.control.obstacles_in_front().");
    }
};


RUR.control.front_is_clear = function(robot){
    var tile, tiles, solid, name;
    if( RUR.control.wall_in_front(robot)) {
        return false;
    }
    tile = RUR.control.tile_in_front(robot);
    if (tile) {
        if (tile.detectable && tile.fatal){
                if (tile == RUR.TILES.water) {
                    if (!RUR.control._bridge_present(robot)){
                        return false;
                    }
                } else {
                    return false;
                }
        }
    }

    solid = RUR.control.obstacles_in_front(robot);
    if (solid) {
        for (name in solid) {
            if (RUR.OBSTACLES[name] !== undefined &&
                RUR.OBSTACLES[name].detectable &&
                RUR.OBSTACLES[name].fatal) {
                return false;
            }
        }
    }

    return true;
};


RUR.control._bridge_present = function(robot) {
    var solid, name;
        solid = RUR.control.obstacles_in_front(robot);
    if (solid) {
        for (name in solid) {
            if (name == "bridge") {
                return true;
            }
        }
    }
    return false;
};


RUR.control.right_is_clear = function(robot){
    var result;
    RUR._recording_(false);
    RUR.control.__turn_right(robot);
    result = RUR.control.front_is_clear(robot);
    RUR.control.turn_left(robot);
    RUR._recording_(true);
    return result;
};

RUR.control.is_facing_north = function (robot) {
    return robot._orientation === RUR.NORTH;
};

RUR.control.think = function (delay) {
    RUR.playback_delay = delay;
};

RUR.control.at_goal = function (robot) {
    var goal = RUR.CURRENT_WORLD.goal;
    if (goal !== undefined){
        if (goal.position !== undefined) {
            return (robot.x === goal.position.x && robot.y === goal.position.y);
        }
        throw new RUR.ReeborgError(RUR.translate("There is no position as a goal in this world!"));
    }
    throw new RUR.ReeborgError(RUR.translate("There is no goal in this world!"));
};


// TODO: review this as it seems redundant ... and may not work as expected.
RUR.control.solid_object_here = function (robot, tile) {
    var tile_here, tile_type, all_solid_objects;
    var coords = robot.x + "," + robot.y;

    if (RUR.CURRENT_WORLD.obstacles === undefined ||
        RUR.CURRENT_WORLD.obstacles[coords] === undefined) {
        return false;
    }

    tile_here =  RUR.CURRENT_WORLD.obstacles[coords];

    for (tile_type in tile_here) {
        if (tile_here.hasOwnProperty(tile_type)) {
            if (tile!== undefined && tile_type == RUR.translate_to_english(tile)) {
                return true;
            }
        }
    }
    return false;
};


RUR.control.carries_object = function (robot, obj) {
    var obj_type, all_objects, carried=false;

    if (robot === undefined || robot.objects === undefined) {
        return 0;
    }

    all_objects = {};

    if (obj === undefined) {
        for (obj_type in robot.objects) {
            if (robot.objects.hasOwnProperty(obj_type)) {
                all_objects[RUR.translate(obj_type)] = robot.objects[obj_type];
                carried = true;
            }
        }
        if (carried) {
            return all_objects;
        } else {
            return 0;
        }
    } else {
        obj = RUR.translate_to_english(obj);
        for (obj_type in robot.objects) {
            if (robot.objects.hasOwnProperty(obj_type) && obj_type == obj) {
                return robot.objects[obj_type];
            }
        }
        return 0;
    }
};


RUR.control.set_model = function(robot, model){
    robot.model = model;
    RUR.record_frame();
 };

RUR.control.set_trace_color = function(robot, color){
    robot.trace_color = color;
 };

RUR.control.set_trace_style = function(robot, style){
    robot.trace_style = style;
 };

if (RUR.state === undefined){
    RUR.state = {};
}

RUR.state.sound_on = false;
RUR.control.sound = function(on){
    if(!on){
        RUR.state.sound_on = false;
        return;
    }
    RUR.state.sound_on = true;
};

RUR.control.get_colour_at_position = function (x, y) {
    if (RUR.world_get.tile_at_position(x, y)===false) {
        return null;
    } else if (RUR.world_get.tile_at_position(x, y)===undefined){
        return RUR.CURRENT_WORLD.tiles[x + "," + y];
    } else {
        return null;
    }
};
