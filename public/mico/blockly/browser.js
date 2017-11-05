var createBlockly = require("create-blockly");
var Blockly = createBlockly({

    // This is where the iframed resizable Blockly will be embedded.
    container: document.getElementById("my-editor"),

    // Make the default set of blocks available, with English translations.
    // (you can choose other translations like "create-blockly/Msg/zh_tw")
    extensions: [
        require("create-blockly/Blocks"), // Blockly.Blocks
        require("create-blockly/Msg/en"), // English translations
        require("create-blockly/Javascript"), // Blockly.Javascript exporting
    ],

    // This is the toolbox that defines which blocks are visible.
    // http://code.google.com/p/blockly/wiki/Toolbox
    toolbox: document.getElementById("my-toolbox")

});

// Whenever this Blockly editor changes, log the generated Javscript code.
// More Blockly documentation at http://code.google.com/p/blockly/w/list
Blockly.addChangeListener(function() {
    var code = Blockly.Javascript.workspaceToCode();
    console.log(code);
});