/*:
* @plugindesc Remaps the arrow keys to the WASD keys.
* @author Zevia
*
* @help This plugin simply remaps the arrow keys to the WASD keys. It is not
* configurable and was written to handle a specific user's request on the
* RPGMakerWeb forums.
*
* Note that W is, by default, the pagedown key, but will become unusable with this
* code.
*/

(function(module) {
    'use strict';

    module.Zevia = module.Zevia || {};

    module.Zevia.originalKeyMapper = Object.keys(Input.keyMapper).reduce(function(keyMap, key) {
        keyMap[key] = Input.keyMapper[key];
        return keyMap;
    }, {});
    ['37', '38', '39', '40'].forEach(function(keyCode) {
        delete Input.keyMapper[keyCode];
    });
    [
        { keyCode: 87, command: 'up' }, // W
        { keyCode: 65, command: 'left' }, // A
        { keyCode: 83, command: 'down' }, // S
        { keyCode: 68, command: 'right' } // D
    ].forEach(function(button) {
        Input.keyMapper[button.keyCode] = button.command;
    });
})(window);