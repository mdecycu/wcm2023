require("./rur.js");
RUR.EAST = 0;
RUR.NORTH = 1;
RUR.WEST = 2;
RUR.SOUTH = 3;

// all images are of this size.
RUR.TILE_SIZE = 40;

// current default canvas size.
RUR.DEFAULT_HEIGHT = 550;
RUR.DEFAULT_WIDTH = 625;

// TODO: set up all canvas in separate isolated function so that
// unit testing can be done more easily - with contants defined but without
// having to mock document.

RUR.BACKGROUND_CANVAS = document.getElementById("background-canvas");
RUR.HEIGHT = RUR.BACKGROUND_CANVAS.height;
RUR.WIDTH = RUR.BACKGROUND_CANVAS.width;

RUR.BACKGROUND_CTX = document.getElementById("background-canvas").getContext("2d");
RUR.TILES_CTX = document.getElementById("tiles-canvas").getContext("2d");
RUR.OBSTACLES_CTX = document.getElementById("obstacles-canvas").getContext("2d");
RUR.GOAL_CTX = document.getElementById("goal-canvas").getContext("2d");
RUR.OBJECTS_CTX = document.getElementById("objects-canvas").getContext("2d");
RUR.TRACE_CTX = document.getElementById("trace-canvas").getContext("2d");
RUR.ROBOT_CTX = document.getElementById("robot-canvas").getContext("2d");

RUR.BACKGROUND_CTX.font = "bold 12px sans-serif";

RUR.WALL_LENGTH = 40;   // These can be adjusted
RUR.WALL_THICKNESS = 4;  // elsewhere if RUR.CURRENT_WORLD.small_tiles become true.

RUR.ROWS = Math.floor(RUR.HEIGHT / RUR.WALL_LENGTH) - 1;
RUR.COLS = Math.floor(RUR.WIDTH / RUR.WALL_LENGTH) - 1;
// the current default values of RUR.COLS and RUR.ROWS on the fixed-size
// canvas work out to be 14 and 12 respectively: these seem to be appropriate
// values for the lower entry screen resolution.  The following are meant
// to be essentially synonymous - but are also meant to be used only if/when
// specific values are not used in the "new" dialog that allows them to be specified
// worlds created.  Everywhere else, RUR.COLS and RUR.ROWS should be used.
RUR.MAX_X = 14;
RUR.MAX_Y = 12;
RUR.USE_SMALL_TILES = false;  // keep as unchanged default

RUR.WALL_COLOR = "brown";   // changed (toggled) in world_editor.js
RUR.SHADOW_WALL_COLOR= "#f0f0f0";    // changed (toggled) in world_editor.js
RUR.GOAL_WALL_COLOR = "black";
RUR.COORDINATES_COLOR = "black";
RUR.AXIS_LABEL_COLOR = "brown";

RUR.MAX_STEPS = 1000;
RUR.MIN_TIME_SOUND = 250;

RUR.DEFAULT_TRACE_COLOR = "seagreen";

RUR.KNOWN_OBJECTS = [];
RUR.KNOWN_TILES = [];
RUR.KNOWN_OBSTACLES = [];
RUR.ANIMATION_TIME = 120;

RUR._CALLBACK_FN = function () {
    alert("FATAL internal error: RUR._CALLBACK_FN was not initialized.");
};
