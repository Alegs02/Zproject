//=============================================================================
// Compatibility for Yanfly and Hime
// EOM_TurnOrder_Reinforcements.js
//=============================================================================
var Imported = Imported || {};
Imported.EOM_TurnOrder_Reinforcements = true;

var Eomereolsson = Eomereolsson || {};
Eomereolsson.Combat = Eomereolsson.Combat || {};
//=============================================================================
 /*:
 * @plugindesc v1.00
 * Display Reinforcements from Hime's Plugin with Yanfly's Turn Order Plugin
 *
 * @author eomereolsson
 *
 * @param enable fix
 * @type boolean
 * @desc Apply correction for troop member IDs?
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Reinforcemnts added with Hime's Reinforcement Plugin
 * (https://himeworks.com/2015/11/enemy-reinforcements-mv/) do not show up in
 * Yanfly's Turn Order Display Plugin
 * (http://www.yanfly.moe/wiki/Turn_Order_Display_(YEP)).
 *
 * This compatibility plugin aims to fix this. Obviously you need both these
 * plugins for this plugin to do anything. Place it after them in your plugin
 * manager.
 *
 * ============================================================================
 * Index Fix
 * ============================================================================
 * While testing my plugin I discovered a bug native to Hime's plugin:
 * Suppose you have troop 1 set up with one enemy. You summon this enemy with
 * the plugin command 'add_enemy 1 from troop 1'.
 * $gameTroop.isEnemyReinforcementAdded(1, 1, true) will now return true and
 * $gameTroop.isEnemyReinforcementAdded(1, 0, true) will still return false.
 * This is the behavior expected from the documentation.
 *
 * However if you add the same enemy using 'add_enemy_troop 1' instead,
 * $gameTroop.isEnemyReinforcementAdded(1, 1, true) will still return false and
 * $gameTroop.isEnemyReinforcementAdded(1, 0, true) will now return true.
 *
 * This is because internally the members of a troop are numbered starting with
 * 0. The function to add a single member of a troop compensates for this, so
 * the plugin works as documented.
 * However the function to add a whole troop does not compensate for this,
 * leading to this disconnect.
 * This compatibility plugin can optionally try to circumvent this. If you
 * enable the fix in the parameters the members of a troop will have IDs
 * starting with 1, no matter with which function it got added.
 *
 * ============================================================================
 * Known Issues
 * ============================================================================
 * Removing the first member of a troop with 'remove_enemy 1 from troop x'
 * causes a crash. Removing other members or removing the whole troop entirely
 * with 'remove_enemy_troop x' seems to work fine.
 * Since I currently don't need this command I have no plans of investigating
 * this crash further.
 *
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.00:
 * - Finished Plugin!
 */
//=============================================================================

Eomereolsson.Parameters
  = PluginManager.parameters('EOM_TurnOrder_Reinforcements');
Eomereolsson.Param = Eomereolsson.Param || {};


Eomereolsson.Param.EnableHimeReinforcementIndexFix
  = Boolean(Eomereolsson.Parameters['enable fix']);



if (   Imported.YEP_X_TurnOrderDisplay
    && Yanfly.TOD.version
    && Yanfly.TOD.version >= 1.03) {
if (Imported.EnemyReinforcements) {

//=============================================================================
// Game_Troop
//=============================================================================

Eomereolsson.Combat.Game_Troop_addEnemyReinforcement
  = Game_Troop.prototype.addEnemyReinforcement;

Game_Troop.prototype.addEnemyReinforcement = function(troopId, memberId) {
    Eomereolsson.Combat.Game_Troop_addEnemyReinforcement.call(
      this, troopId, memberId);

    if (SceneManager._scene instanceof Scene_Battle) {
      var win
        = new Window_TurnOrderIcon($gameTroop, $gameTroop.members().length-1);
      SceneManager._scene._turnOrderDisplay.push(win);
      SceneManager._scene.setupTurnOrderDisplayWindow(win);
    }
  };

Eomereolsson.Combat.Game_Troop_addTroopReinforcements
  = Game_Troop.prototype.addTroopReinforcements;

Game_Troop.prototype.addTroopReinforcements = function(troopId) {
    Eomereolsson.Combat.Game_Troop_addTroopReinforcements.call(this, troopId);
    
    var troop = $dataTroops[troopId];
    for (var i = 0; i < troop.members.length; i++) {
      var indexAddedMember
        = $gameTroop.members().length-1-(troop.members.length-1)+i;
      var win = new Window_TurnOrderIcon($gameTroop, indexAddedMember);
      SceneManager._scene._turnOrderDisplay.push(win);
      SceneManager._scene.setupTurnOrderDisplayWindow(win);
      if(Eomereolsson.Param.EnableHimeReinforcementIndexFix) {
        var addedMember = $gameTroop.members()[indexAddedMember];
        addedMember.setTroopMemberId(addedMember._troopMemberId + 1);
      }
    }
};

//=============================================================================
// Compatibility Check
//=============================================================================
} else { //HIME_EnemyReinforcements

var text = '================================================================\n';
text += 'EOM_TurnOrder_Reinforcements requires HIME_EnemyReinforcements to be ';
text += 'installed to run properly.\n\nPlease go to www.himeworks.com and ';
text += 'update to the latest version for the HIME_EnemyReinforcements ';
text += 'plugin.\n';
text += '================================================================\n';
console.log(text);
require('nw.gui').Window.get().showDevTools();

} //HIME_EnemyReinforcements
} else { // Yanfly.TOD.version

var text = '================================================================\n';
text += 'EOM_TurnOrder_Reinforcements requires YEP_X_TurnOrderDisplay to be ';
text += 'at the latest version to run properly.\n\nPlease go to www.yanfly.moe ';
text += 'and update to the latest version for the YEP_X_TurnOrderDisplay ';
text += 'plugin.\n';
text += '================================================================\n';
console.log(text);
require('nw.gui').Window.get().showDevTools();

} // Yanfly.TOD.version
;
