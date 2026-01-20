// Run this in the browser's console (Ctrl + Shift +I).
// Make sure to run "allow paste" before running this script.
// This script is *not* made by me, but I've edited it a bit. The original one is here: https://github.com/aiko-chan-ai/discord.js-selfbot-v13

window.webpackChunkdiscord_app.push([
    [Symbol()],
    {},
    req => {
        if (!req.c) return;
        for (let m of Object.values(req.c)) {
            try {
                if (!m.exports || m.exports === window) continue;
                if (m.exports?.getToken) return copy(m.exports.getToken());
                for (let ex in m.exports) {
                    if (m.exports?.[ex]?.getToken && m.exports[ex][Symbol.toStringTag] !== 'IntlMessagesProxy') return copy(m.exports[ex].getToken());
                }
            } catch { }
        }
    },
]);

window.webpackChunkdiscord_app.pop();
console.log('%cDone.', 'font-size: 50px');
console.log(`%cYou now have your Token in the device's clipboard. Paste it in the .env file.`, 'font-size: 16px');