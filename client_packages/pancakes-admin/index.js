let isFrozen = false;

mp.events.add({
    'render': () => {
        if(isFrozen) mp.game.controls.disableAllControlActions(0);
    },
    'freezePlayer': () => {
        mp.players.local.freezePosition(true);
        isFrozen = true;
    },
    'unfreezePlayer': () => {
        mp.players.local.freezePosition(false);
        isFrozen = false;
    }
});

//  Disables admin taking damage while on duty
mp._events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity) => {
    if(targetEntity.getVariable('admin:aduty') === true) return true;
});