var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
/*var workspace = Blockly.inject(blocklyDiv, options);
var toolbox = document.getElementById("toolbox");*/

var workspace = Blockly.inject(blocklyDiv,
    {media: 'media/',
        toolbox: document.getElementById('toolbox'),
        zoom:
            {controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2},
        grid:
            {spacing: 20,
                length: 2,
                colour: '#6a74cc',
                snap: true},
        horizontalLayout : true,
        trashcan: true});
/*collapse : true,
    comments : true,
    disable : true,
    maxBlocks : Infinity,*/

var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};

window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

function showCode() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    alert(code);
}

function runCode() {
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        eval(code);
    } catch (e) {
        alert(e);
    }
}

Blockly.Blocks['direction_block_top'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["up","up"], ["down","down"]]), "direction")
            .appendField("방향으로")
            .appendField(new Blockly.FieldNumber(0, 0, 6), "distance")
            .appendField("이동");
        this.appendValueInput("easing_function")
            .setCheck("effect")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("효과");
        this.setPreviousStatement(true, "direction_block_left");
        this.setNextStatement(true, "direction_block_left");
        this.setColour(195);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['direction_block_top'] = function(block) {
    var direction = block.getFieldValue('direction');
    var number_distance = block.getFieldValue('distance');
    var easing_function = Blockly.JavaScript.valueToCode(block, 'easing_function', Blockly.JavaScript.ORDER_NONE);

    distance = number_distance * block_height_size;

    var code ='';
    var callback_fun = 'function(){check_running_object_position($'+block.getSurroundParent().getFieldValue("running_object_pic")+')})';

    if(easing_function === undefined || easing_function =='') {
        if(direction === 'up') {
            code = '.animate({top:"-='+distance+'"}, 1000, ';
        }else if(direction === 'down') {
            code = '.animate({top:"+='+distance+'"}, 1000, ';
        }
    }else {
        if(direction === 'up') {
            code = '.animate({top:"-='+distance+'"}, 1000,"'+easing_function+'", ';
        }else if(direction === 'down') {
            code = '.animate({top:"+='+distance+'"}, 1000,"'+easing_function+'", ';
        }
    }
    return code + callback_fun+"\n";
};

Blockly.Blocks['direction_block_left'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["right","right"], ["left","left"]]), "direction")
            .appendField("방향으로")
            .appendField(new Blockly.FieldNumber(0, 0, 12), "distance")
            .appendField("이동");
        this.appendValueInput("easing_function")
            .setCheck("effect")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("효과");
        this.setInputsInline(false);
        this.setPreviousStatement(true, ["direction_block_left", "direction_block_top"]);
        this.setNextStatement(true, ["direction_block_left", "direction_block_top"]);
        this.setColour(180);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['direction_block_left'] = function(block) {
    var direction = block.getFieldValue('direction');
    var number_distance = block.getFieldValue('distance');
    var easing_function = Blockly.JavaScript.valueToCode(block, 'easing_function', Blockly.JavaScript.ORDER_NONE);

    distance = number_distance * block_width_size;

    var code ='';
    var callback_fun = 'function(){check_running_object_position($'+block.getSurroundParent().getFieldValue("running_object_pic")+')})';

    if(easing_function === undefined || easing_function =='') {
        if(direction === 'left') {
            code = '.animate({left:"-='+distance+'"}, 1000, ';
        }else if(direction === 'right') {
            code = '.animate({left:"+='+distance+'"}, 1000, ';
        }
    }else {
        if(direction === 'left') {
            code = '.animate({left:"-='+distance+'"}, 1000,"'+easing_function+'", ';
        }else if(direction === 'right') {
            code = '.animate({left:"+='+distance+'"}, 1000,"'+easing_function+'", ';
        }
    }

    return code + callback_fun+"\n";
};


Blockly.Blocks['running_object'] = {
    init: function() {
        this.appendStatementInput("running_blocks")
            .setCheck(["direction_block_left", "direction_block_top"])
            .appendField(new Blockly.FieldDropdown([[{"src":"/mico/img/girl.png","width":50,"height":50,"alt":"girl"},"girl"],[{"src":"/mico/img/cloud.png","width":50,"height":50,"alt":"cloud"},"cloud"]]), "running_object_pic");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        /*this.setNextStatement(true, null);*/
        this.setColour(270);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['running_object'] = function(block) {
    var dropdown_running_object_pic = block.getFieldValue('running_object_pic');
    var move_statements = Blockly.JavaScript.statementToCode(block, 'running_blocks');

    var code = '$'+ dropdown_running_object_pic + move_statements;

    return code;
};

Blockly.Blocks['effects'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["답답이","easeInBounce"], ["팅팅볼","easeInOutBack"], ["머뭇머뭇","easeInOutBounce"]]), "easing");
        this.setOutput(true, null);
        this.setColour(330);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['effects'] = function(block) {
    var dropdown_easing = block.getFieldValue('easing');

    return [dropdown_easing, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['angle_move'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldAngle(90), "move_angle")
            .appendField("방향으로")
            .appendField(new Blockly.FieldNumber(0, 0, 20), "move_angle_distance")
            .appendField("이동");
        this.appendValueInput("easing_function")
            .setCheck("effect")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("효과");
        this.setInputsInline(false);
        this.setPreviousStatement(true, ["direction_block_left", "direction_block_top"]);
        this.setNextStatement(true, ["direction_block_left", "direction_block_top"]);
        this.setColour(165);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.JavaScript['angle_move'] = function(block) {
    var angle_move_angle = block.getFieldValue('move_angle');
    var number_move_angle_distance = block.getFieldValue('move_angle_distance');
    var easing_function = Blockly.JavaScript.valueToCode(block, 'easing_function', Blockly.JavaScript.ORDER_NONE);

    distance = number_move_angle_distance * block_width_size;

    var code ='';
    var callback_fun = 'function(){check_running_object_position($'+block.getSurroundParent().getFieldValue("running_object_pic")+')})';

    var distance_x = distance * Math.cos(toRadians(angle_move_angle));
    var distance_y = distance * Math.sin(toRadians(angle_move_angle));

    if(easing_function === undefined || easing_function =='') {
        code = '.animate({left:"+='+distance_x+'", top:"-='+distance_y+'"}, 1000, ';
    }else {
        code = '.animate({left:"+='+distance_x+'", top:"-='+distance_y+'"}, 1000, "'+easing_function+'", ';
    }

    return code + callback_fun+"\n";
};