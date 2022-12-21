require("./../translator.js");
require("./../constants.js");
require("./../robot.js");
require("./../visible_world.js");
require("./../state.js");
require("./../exceptions.js");
require("./../create_editors.js");
var images_init = require("./../extend/images.js").images_init;
var edit_robot_menu = require("./../ui/edit_robot_menu.js");
var clone_world = require("./clone_world.js").clone_world;

RUR.world.import_world = function (json_string) {
    "use strict";
    var body, editor_content, library_content;
    if (json_string === undefined){
        console.log("Problem: no argument passed to RUR.world.import_world");
        return {};
    }
    images_init();

    if (typeof json_string == "string"){
        try {
            RUR.CURRENT_WORLD = JSON.parse(json_string) || RUR.world.create_empty_world();
        } catch (e) {
            console.log("Exception caught in import_world.");
            console.log("json_string = ", json_string);
            console.log("error = ", e);
            RUR.world.create_empty_world();
            return;
        }
    } else {  // already parsed
        RUR.CURRENT_WORLD = json_string;
    }

    if (RUR.CURRENT_WORLD.robots !== undefined) {
        if (RUR.CURRENT_WORLD.robots[0] !== undefined) {
            RUR.robot.cleanup_objects(RUR.CURRENT_WORLD.robots[0]);
            body = RUR.CURRENT_WORLD.robots[0];
            body._prev_x = body.x;
            body._prev_y = body.y;
            body._prev_orientation = body._orientation;
        }
    }

    // Backward compatibility following change done on Jan 5, 2016
    // top_tiles has been renamed solid_objects; to ensure compatibility of
    // worlds created prior to using solid_objects, we change the old name
    // following http://stackoverflow.com/a/14592469/558799
    // thus ensuring that if a new world is created from an old one,
    // it will have the new syntax.
    if (RUR.CURRENT_WORLD.top_tiles !== undefined) {
        Object.defineProperty(RUR.CURRENT_WORLD, "solid_objects",
            Object.getOwnPropertyDescriptor(RUR.CURRENT_WORLD, "top_tiles"));
        delete RUR.CURRENT_WORLD.top_tiles;
    }

    // Backward compatibility change done on March 28, 2016, where
    // "pre_code" and "post_code" were simplified to "pre" and "post"
    // for consistency with other editor contents.
    if (RUR.CURRENT_WORLD.pre_code !== undefined) {
        RUR.CURRENT_WORLD.pre = RUR.CURRENT_WORLD.pre_code;
        delete RUR.CURRENT_WORLD.pre_code;
    }
    if (RUR.CURRENT_WORLD.post_code !== undefined) {
        RUR.CURRENT_WORLD.post = RUR.CURRENT_WORLD.post_code;
        delete RUR.CURRENT_WORLD.post_code;
    }

    if (RUR.CURRENT_WORLD.background_image !== undefined) {
        RUR.BACKGROUND_IMAGE.src = RUR.CURRENT_WORLD.background_image;
        RUR.BACKGROUND_IMAGE.onload = function () {
            RUR.vis_world.draw_all();
        };
    } else {
        RUR.BACKGROUND_IMAGE.src = '';
    }

    RUR.CURRENT_WORLD.small_tiles = RUR.CURRENT_WORLD.small_tiles || false;
    RUR.CURRENT_WORLD.rows = RUR.CURRENT_WORLD.rows || RUR.MAX_Y;
    RUR.CURRENT_WORLD.cols = RUR.CURRENT_WORLD.cols || RUR.MAX_X;
    RUR.vis_world.compute_world_geometry(RUR.CURRENT_WORLD.cols, RUR.CURRENT_WORLD.rows);

    RUR.world.update_editors(RUR.CURRENT_WORLD);

    if (RUR.state.editing_world) {
        edit_robot_menu.toggle();
    }

    if (RUR.CURRENT_WORLD.onload !== undefined) {
        eval_onload();
    }
    RUR._SAVED_WORLD = clone_world();

};

eval_onload = function () {
    RUR.state.evaluating_onload = true;
    try {
        eval(RUR.CURRENT_WORLD.onload);  // jshint ignore:line
    } catch (e) {
        RUR.show_feedback("#Reeborg-shouts",
            RUR.translate("Problem with onload code.") + "<br><pre>" +
            RUR.CURRENT_WORLD.onload + "</pre>");
        console.log("error in onload:", e);
    }
    RUR.state.evaluating_onload = false;
    RUR.vis_world.draw_all();
};
