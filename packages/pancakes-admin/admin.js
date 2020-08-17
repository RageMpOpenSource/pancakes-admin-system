/*
    Admin Levels
    1 - Moderator
    2 - Trial Admin
    3 - Administrator
    100 - Owner

*/
let activeAdmins = [], reports = [];

mp.events.addCommand({
    //  Players
    'report': (player, _, target, ...reason) => {
        if(!target || isNaN(target) || reason.length === 0) return player.outputChatBox(`${mp.prefix.syntax} /report [id] [reason]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        let reasonMessage = reason.join(' ');

        for(let i = 0; i < reports.length; i++){    //  Check if there are any active reports from this player
            if (reports[i].id === player.id) {
                return player.outputChatBox(`${mp.prefix.error} You already have a pending report. Cancel your current report to create a new one (/cancelreport).`);
            }
        }

        reports.push({id: player.id, target: user.id, reason: reasonMessage});
        activeAdmins.forEach(adminId => {
            let admin = mp.players.at(adminId);
            admin.outputChatBox(`[RID: ${player.id}] !{E74C3C}${user.name}[${user.id}] !{FFF}has been reported by !{E74C3C}${player.name} !{FFF}. Reason: !{E74C3C}${reasonMessage}`);
        });
        player.outputChatBox(`${mp.prefix.server} You have successfully reported !{E74C3C}${user.name} !{FFF}to the administration team. Use !{E74C3C}/cancelreport !{FFF} if this was a mistake.`);
    },
    'cancelreport': (player) => {
        for(let i = 0; i < reports.length; i++){
            if (reports[i].id === player.id) {
                reports.splice(i, 1);
                return player.outputChatBox(`${mp.prefix.server} Your report has been cancelled.`);
            }
        }
        player.outputChatBox(`${mp.prefix.error} You have no pending reports to cancel.`);
    },
    //  Moderator (Level 1)
    'ahelp': (player) => {
        if(player.getVariable('admin:level') < 1) {
            player.outputChatBox(`${mp.prefix.permission}`);
        }
        if(player.getVariable('admin:level') >= 1){
            player.outputChatBox('[1] /a, /rlist, /ar, /tr, /mute, /unmute, /kick');
        }
        if(player.getVariable('admin:level') >= 2){
            player.outputChatBox('[2] /aduty, /ajail, /spectate /freeze, /unfreeze, /goto, /dimension, /tpto, /tphere');
        }
        if(player.getVariable('admin:level') >= 3){
            player.outputChatBox('[3] /pos, /lookup, /gotocoord, /weapon, /veh, /sethealth, /setarmour');
        }
    },
    'a': (player, message) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!message) return player.outputChatBox(`${mp.prefix.syntax} /a [message]`);
        activeAdmins.forEach(adminId => {
            let admin = mp.players.at(adminId);
            admin.outputChatBox(`!{FFF000}${player.name} [${player.getVariable('admin:level')}]: !{FFF}${message}`)
        });
    },
    'rlist': (player) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(reports.length === 0) return player.outputChatBox(`${mp.prefix.server} There are no pending reports to be reviewed.`);
        reports.forEach(report => {
            player.outputChatBox(`[RID: ${report.id}] Reported user: !{E74C3C}${mp.players.at(report.target).name} !{FFF}Reason: !{E74C3C}${report.reason}`)
        });
    },
    'ar': (player, rid) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!rid || isNaN(rid)) return player.outputChatBox(`${mp.prefix.syntax} /ar [report ID]`)

        for(let i = 0; i < reports.length; i++){
            if (reports[i].id === parseInt(rid)) {
                let user = mp.players.at(reports[i].id)
                reports.splice(i, 1);
                player.outputChatBox(`${mp.prefix.server} You have accepted the report from ${user.name}.`);
                return user.outputChatBox(`${mp.prefix.server} Your report has been accepted and is now being reviewed.`);
            }
        }
        player.outputChatBox(`${mp.prefix.error} There is no report with that ID currently pending.`);
    },
    'tr': (player, rid) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!rid || isNaN(rid)) return player.outputChatBox(`${mp.prefix.syntax} /tr [report ID]`)

        for(let i = 0; i < reports.length; i++){
            if (reports[i].id === parseInt(rid)) {
                let user = mp.players.at(reports[i].id)
                reports.splice(i, 1);
                player.outputChatBox(`${mp.prefix.server} You have trashed the report from ${user.name}.`);
                return user.outputChatBox(`${mp.prefix.server} Your report has been marked as invalid and won't be reviewed by the admin team.`);
            }
        }
        player.outputChatBox(`${mp.prefix.error} There is no report with that ID currently pending.`);
    },
    'mute': (player, target) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /mute [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.setVariable('admin:mute', true);
        user.outputChatBox(`${mp.prefix.server} You have been muted by an administrator.`);
    },
    'unmute': (player, target) => {
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /unmute [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.setVariable('admin:mute', false);
        user.outputChatBox(`${mp.prefix.server} You have been unmuted by an administrator.`);
    },
    'kick': (player, _, target, ...reason) => { //  Untested
        if(player.getVariable('admin:level') < 1) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target) || reason.length === 0) return player.outputChatBox(`${mp.prefix.syntax} /kick [id] [reason]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        if(user.adminLvl > 0) return player.outputChatBox(`${mp.prefix.error} You cannot kick another administrator.`);
        let reasonMessage = reason.join(' ');
        user.outputChatBox(`${mp.prefix.server} You have been kicked from the server. Reason: ${reasonMessage}`);
        user.kick('Kicked.');
    },
    //  Trial Admin (Level 2)
    'aduty': (player) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        player.setVariable('admin:aduty', !player.getVariable('admin:aduty'));
        let dutyStatus = player.getVariable('admin:aduty')
        player.outputChatBox(`${mp.prefix.server} You are now ${dutyStatus ? 'on' : 'off'}-duty and ${dutyStatus ? 'will' : 'wont'} receive reports.`);
        if(dutyStatus){
            activeAdmins.push(player.id)
        } else {
            for(let i = 0; i < activeAdmins.length; i++){
                if (activeAdmins[i] === player.id) { activeAdmins.splice(i, 1); }
            }
        }
    },
    'ajail': async (player, _, target, time, ...reason) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || !time || reason.length === 0) return player.outputChatBox(`${mp.prefix.syntax} /ajail [id] [time] [reason]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        let reasonMsg = reason.join(' ');
        //  To do

    },
    'spectate': (player, _, target) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        //  To do
    },
    'freeze': (player, target) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /freeze [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.call('freezePlayer');
        user.outputChatBox(`${mp.prefix.server} You have been frozen by an administrator.`);
    },
    'unfreeze': (player, target) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /unfreeze [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        player.call('unfreezePlayer');
        user.outputChatBox(`${mp.prefix.server} You have been unfrozen by an administrator.`);
    },
    'goto': (player, location) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!location) return player.outputChatBox(`${mp.prefix.syntax} /goto [location] - Use '/goto help' for locations`);
        switch(location.toLowerCase()){
        case 'help':
            player.outputChatBox(`${mp.prefix.info} Goto Locations: LSPD, FIB, Army, PaletoBay, GrapeSeed, SandyShores, Ajail`);
            break;
        case 'lspd':
            teleportToLocation(player, 426.10, -977.90, 31);
            break;
        case 'fib':
            teleportToLocation(player, 95.89, -743.12, 46);
            break;
        case 'army':
            teleportToLocation(player, -2230.69, 3316.90, 33.5);
            break;
        case 'paletobay':
            teleportToLocation(player, -405.08, 5988.11, 32);
            break;
        case 'grapeseed':
            teleportToLocation(player, 1683.45, 4777.93, 41.9);
            break;
        case 'sandyshores':
            teleportToLocation(player, 2050.84, 3722.94, 33);
            break;
        case 'ajail':
            teleportToLocation(player, 464.16, -998.80, 24.91);
            break;
        default:
            player.outputChatBox(`${mp.prefix.syntax} /goto [location] - Use '/goto help' for locations`);
            break;
        }
    },
    'dimension': (player, _, target, dimension) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || !dimension || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /dimension [id] [dimension]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.dimension = parseInt(dimension);
        user.outputChatBox(`${mp.prefix.server} Your dimension has been set to: ${dimension}`);
    },
    'tpto': (player, target) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /tpto [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        player.position = new mp.Vector3(user.position.x + 1, user.position.y + 1, user.position.z);
        player.outputChatBox(`${mp.prefix.server} You have teleported to that player.`);
    },
    'tphere': (player, target) => {
        if(player.getVariable('admin:level') < 2) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /tphere [id]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.position = new mp.Vector3(player.position.x + 1, player.position.y + 1, player.position.z);
        user.outputChatBox(`${mp.prefix.server} You have been teleported to an administrator.`);
    },
    //  Administrator (Level 3)
    'pos': (player) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        console.log(`Position: ${player.position.x.toFixed(2)} ${player.position.y.toFixed(2)} ${player.position.z.toFixed(2)}, ${player.heading.toFixed(2)}`);
        player.outputChatBox(`${mp.prefix.server} Position: ${player.position.x.toFixed(2)} ${player.position.y.toFixed(2)} ${player.position.z.toFixed(2)}, ${player.heading.toFixed(2)}`);
    },
    'veh': (player, veh_model) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!veh_model) return player.outputChatBox(`${mp.prefix.syntax} /veh [vehicle_model]`);
        if(player.data.adminVeh) player.data.adminVeh.destroy();
        player.data.adminVeh = mp.vehicles.new(mp.joaat(veh_model), player.position,
            {
                heading: player.heading,
                numberPlate: 'ADMIN',
                engine: true,
                dimension: player.dimension
            });
        player.putIntoVehicle(player.data.adminVeh, 0);
        player.outputChatBox(`${mp.prefix.server} You have created an admin vehicle.`);
    },
    'lookup': (player, target) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /lookup [id]`);
        let user = mp.players.at(target)
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        player.outputChatBox('===========[ Lookup Info ]===========');
        player.outputChatBox(`Username: [${user.name}], IP: [${user.ip}] Admin: [${user.adminLvl}]`);
        player.outputChatBox(`Health: [${user.health}], Armour: [${user.armour}]`);
        player.outputChatBox(`Social Club: [${user.socialClub}] RGSC ID: [${user.rgscId}]`);
        player.outputChatBox('===========[ Lookup Info ]===========');
    },
    'weapon': (player, weapon_model) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        player.giveWeapon(mp.joaat(weapon_model), 1000);
        player.outputChatBox(`${mp.prefix.server} You have received your weapon.`);
    },
    'gotocoord': (player, _, x, y, z) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!x || !y || !z) return player.outputChatBox(`${mp.prefix.syntax} /gotocoord [x] [y] [z]`);
        player.position = new mp.Vector3(parseInt(x), parseInt(y), parseInt(z));
        player.outputChatBox(`${mp.prefix.server} You've been teleported to ${x} ${y} ${z}`);
    },
    'sethealth': (player, _, target, health) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || !health) return player.outputChatBox(`${mp.prefix.syntax} /sethealth [id] [amount]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.health = parseInt(health);
        player.outputChatBox(`${mp.prefix.server} You've set ${user.name}'s health to ${health}`);
    },
    'setarmour': (player, _, target, armour) => {
        if(player.getVariable('admin:level') < 3) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || !armour || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /setarmour [id] [amount]`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);
        user.armour = parseInt(armour);
        player.outputChatBox(`${mp.prefix.server} You've set ${user.name}'s armour to ${armour}`);
    },
    //  Owner (Level 100)
    'setadmin': async (player, _, target, lvl) => {
        if(player.getVariable('admin:level') !== 100) return player.outputChatBox(`${mp.prefix.permission}`);
        if(player.getVariable('admin:aduty') === false) return player.outputChatBox(`${mp.prefix.error} You need to be on duty to use this command.`);
        if(!target || !lvl || isNaN(target)) return player.outputChatBox(`${mp.prefix.syntax} /setadmin [id] [level]`);
        if(lvl > 100) return player.outputChatBox(`${mp.prefix.error} Admin levels cannot be larger than or equal to 100.`);
        let user = mp.players.at(target);
        if(user == null) return player.outputChatBox(`${mp.prefix.error} Player not found.`);

        user.adminLvl = lvl;
        player.outputChatBox(`${mp.prefix.server} ${user.name}'s admin rank has been updated to ${lvl}`);
        user.outputChatBox(`${mp.prefix.server} You have had your admin rank updated to ${lvl} by ${player.name}.`);

    }
});

mp.events.add('playerQuit', (player) => {
    for(let i = 0; i < reports.length; i++){
        if (reports[i].id === player.id || reports[i].user === player.id) {
            reports.splice(i, 1);
        }
    }
});

function teleportToLocation(player, x, y, z){
    let pos = new mp.Vector3(x, y, z)
    if(player.vehicle) return player.vehicle.position = pos;
    player.position = pos;
}