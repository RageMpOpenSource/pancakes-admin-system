mp.events.add('playerChat', (player, text) => {
    if(player.getVariable('admin:mute') === true) return player.outputChatBox(`${mp.prefix.error} You cannot talk while you are muted.`);
    mp.players.broadcast(`${player.name}: ${text}`);
})