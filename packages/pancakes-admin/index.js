/**
 * Variables used:
 * - admin:aduty - True/false if they're on duty
 * - admin:level - The admin level, default should be 0
 * - admin:mute - True/false if the player is muted
 * - player.data.adminVeh - Holds a vehicle object if spawned
 */

require('./admin.js');
require('./chat.js');

mp.prefix = {};

mp.prefix.error = '!{eb4d4b}[ERROR] !{fff}';
mp.prefix.info = '!{686de0}[INFO] !{fff}';
mp.prefix.permission = '!{eb4d4b}You do not have permission to use that command.';
mp.prefix.syntax = '!{6ab04c}[USAGE] !{fff}';
mp.prefix.server = '!{42f49b}[SERVER] !{fff}';

mp.events.add('playerJoin', (player) => {
    player.setVariable('admin:level', 100);
});