/*
 * © 2026 SeXyxeon (VOIDSEC)
 *
 * ⚠️ COPYRIGHT NOTICE
 * This source code is protected under copyright law.
 * Any form of re-uploading, recoding, modification,
 * selling, or redistribution WITHOUT explicit permission
 * from the original author is strictly prohibited.
 *
 * ❌ NO CREDIT = NO PERMISSION
 * ❌ DO NOT CLAIM THIS CODE AS YOUR OWN
 *
 * ✔️ Usage or modification is allowed ONLY
 * with prior permission and proper credit.
 *
 * OFFICIAL LINKS (ONLY):
 * YouTube   : https://youtube.com/@voidsec7718
 * Instagram : sabir._7718
 * Telegram  : https://t.me/SABIR7718
 * GitHub    : https://github.com/SABIR7718
 * WhatsApp  : +91 73650 85213
 *
 * Violations may result in DMCA takedown
 * or termination of the Telegram bot.
 */


require("dotenv").config();
process.env.NTBA_FIX_350 = 1;
const SY = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default;
const {
    log
} = require("@sabir7718/log");
console.log(require('node-telegram-bot-api'));
const config = require("./config");
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const http = require('http');

const PORT = process.env.PORT || 3000;

const LoveDir = './Love';
if (!fs.existsSync(LoveDir)) {
    fs.mkdirSync(LoveDir);
}

const api = process.env.API;

let waitingForLogo = {};

process.on('uncaughtException', (err) => log('error', 'CRITICAL', err.message));
process.on('unhandledRejection', (reason) => log('error', 'CRITICAL', reason));

const activeBots = {};
const notauthorized = '<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.</b>';

const protectionMessage = `<b>❌ 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗁𝖺𝗇𝗇𝖾𝗅 𝖺𝗇𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖻𝗈𝗍.\n𝖠𝖿𝗍𝖾𝗋 𝗃𝗈𝗂𝗇𝗂𝗇𝗀, 𝖼𝗅𝗂𝖼𝗄 𝗍𝗁𝖾 𝗏𝖾𝗋𝗂𝖿𝗒 𝖻𝗎𝗍𝗍𝗈𝗇 𝖻𝖾𝗅𝗈𝗐.</b>`;

function getDB() {
    const dbPath = path.join(LoveDir, 'data.json');
    const defaultDB = {
        tokens: [],
        premium: [],
        resellers: [],
        videos: {},
        messages: {
            love: [],
            sad: [],
            god: []
        }
    };

    if (!fs.existsSync(dbPath)) return defaultDB;

    try {
        const content = fs.readFileSync(dbPath, 'utf8');
        let data = JSON.parse(content);
        if (!data.messages) data.messages = defaultDB.messages;
        return data;
    } catch (err) {
        return defaultDB;
    }
}

function saveDB(data) {
    try {
        fs.writeFileSync(path.join(LoveDir, 'data.json'), JSON.stringify(data, null, 2));
    } catch (err) {
        log('error', null, 'Database save error: ' + err.message);
    }
}

function isPremium(userId) {
    const db = getDB();
    return db.premium.some(id => id.toString() === userId.toString());
}

async function CheckSYlovesToo(userId, adminId) {
    if (userId.toString() === adminId.toString()) return true;

    try {
        const response = await fetch(
            `https://checksylovetoo.onrender.com/checksylovestoo?id=${userId}`
        );
        const data = await response.json();
        return data.isjoined === true;
    } catch (err) {
        console.error("Protection API Error:", err.message);
        return false;
    }
}

function SABIR7718() {
    const diff = Date.now() - startTime;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${d}𝖽 ${h}𝗁 ${m}𝗆`;
}

const startTime = Date.now();

function mainCaption(name, runtime) {
    return `<b>─【 𝐒𝐎𝐂𝐈𝐀𝐋 𝐌𝐄𝐃𝐈𝐀 - 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 】─

 𝖴𝗌𝖾𝗋 : ${name}
 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${runtime}
 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 : ${config.S7}

For Song Use</b> <code>/music</code> <b>( song name )</b>`;
}

const joinKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: '𝖩𝗈𝗂𝗇 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                icon_custom_emoji_id: '6255511268375923733',
                style: 'primary',
                url: config.channel
            }, {
                text: '𝖩𝗈𝗂𝗇 𝖦𝗋𝗈𝗎𝗉',
                icon_custom_emoji_id: '6255585425281256477',
                style: 'danger',
                url: config.group
            }],
            [{
                text: '𝖵𝖾𝗋𝗂𝖿𝗒 𝖬𝖾𝗆𝖻𝖾𝗋𝗌𝗁𝗂𝗉',
                icon_custom_emoji_id: '6255576689317775914',
                style: 'success',
                callback_data: 'check_membership'
            }]
        ]
    }
};

function startBot(token, isMain = false) {
    try {
        const S7 = new SY(token, {
            polling: true
            /*,
                        baseApiUrl: "https://telegram2.syxs7.us.cc"*/
        });
        let botConfig = {
            ...config
        };
        let tokenData = getDB().tokens.find(t => t.token === token);

        if (tokenData && tokenData.config) {
            botConfig = {
                ...botConfig,
                ...tokenData.config
            };
        }

        const botOwnerId = tokenData ? tokenData.owner : config.adminId;

        S7.getMe().then(me => {
            activeBots[token] = S7;
            log('success', 'BOT', `Started @${me.username}`);
        }).catch(err => {
            log('error', 'BOT', `Failed token ${token.slice(0,10)}`);
        });

        function SYLoVe(commands, callback) {
            if (!Array.isArray(commands)) commands = [commands];

            S7.on('message', async (msg) => {
                try {
                    if (!msg.text) return;

                    const cmd = msg.text.trim().split(' ')[0].slice(1).toLowerCase();

                    if (commands.includes(cmd)) {
                        const chatId = msg.chat.id;
                        const userId = msg.from.id;

                        if (botConfig.channelId || botConfig.groupId) {
                            if (cmd !== 'checkmembership') {
                                const isMember = await CheckSYlovesToo(userId, botOwnerId);

                                if (!isMember) {
                                    return S7.sendMessage(
                                        chatId,
                                        `<b><tg-emoji emoji-id="4956337889593000947"></tg-emoji> 𝖠𝖼𝖼𝖾𝗌𝗌 𝖣𝖾𝗇𝗂𝖾𝖽!</b>\n\n𝖯𝗅𝖾𝖺𝗌𝖾 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗈𝗆𝗆𝗎𝗇𝗂𝗍𝗒 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.`, {
                                            parse_mode: 'HTML',
                                            ...joinKeyboard
                                        }
                                    );
                                }
                            }
                        }

                        callback(msg, S7, chatId, userId);
                    }
                } catch (err) {
                    console.error("Downloader Error:", err);
                    S7.sendMessage(msg.chat.id,
                        `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Download Error:</b> <code>${err.message}</code>`, {
                            parse_mode: "HTML"
                        }
                    );
                }
            });
        }

        const {
            Jimp
        } = require('jimp');

        S7.on('photo', async (msg) => {
            const userId = msg.from.id;
            if (!waitingForLogo[userId]) return;

            const chatId = msg.chat.id;
            const fileId = msg.photo[msg.photo.length - 1].file_id;
            const logoPath = path.join(LoveDir, `logo_${userId}.png`);

            try {
                const fileLink = await S7.getFileLink(fileId);
                const response = await fetch(fileLink);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const image = await Jimp.read(buffer);

                if (image.width !== image.height) {
                    return S7.sendMessage(chatId, "<b>❌ Photo must be square (4x4)!</b>", {
                        parse_mode: "HTML"
                    });
                }

                image.resize({
                    w: 500,
                    h: 500
                });
                await image.write(logoPath);

                delete waitingForLogo[userId];
                S7.sendMessage(chatId, "<b>✅ Logo saved successfully!</b>", {
                    parse_mode: "HTML"
                });

            } catch (err) {
                console.error("Jimp Error Details:", err);
                S7.sendMessage(chatId, `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Error saving logo. Please try a different photo.</b>`, {
                    parse_mode: "HTML"
                });
            }
        });

        SYLoVe('addlogo', (msg, S7, chatId, userId) => {
            waitingForLogo[userId] = true;
            S7.sendMessage(chatId, "<b>📸 Send me your logo (4x4/Square photo).</b>", {
                parse_mode: "HTML"
            });
        });

        SYLoVe('dellogo', (msg, S7, chatId, userId) => {
            const logoPath = path.join(LoveDir, `logo_${userId}.png`);
            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
                S7.sendMessage(chatId, "<b>🗑️ Your logo has been deleted.</b>", {
                    parse_mode: "HTML"
                });
            } else {
                S7.sendMessage(chatId, "<b>❌ You don't have any logo set.</b>", {
                    parse_mode: "HTML"
                });
            }
        });

        SYLoVe('add', (msg, S7, chatId, userId) => {
            const args = msg.text.split(' ');
            if (args.length < 3) {
                return S7.sendMessage(chatId,
                    `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Usage: /add category your message\nCategories: love, sad, god</b>`, {
                        parse_mode: "HTML"
                    }
                );
            }

            const category = args[1].toLowerCase();
            const content = args.slice(2).join(' ');

            let db = getDB();

            if (!db.messages[category]) {
                return S7.sendMessage(chatId, "<b>❌ Invalid category!</b> Use love, sad, or god.", {
                    parse_mode: "HTML"
                });
            }

            db.messages[category].push(content);
            saveDB(db);

            S7.sendMessage(chatId, `<b>✅ Added to ${category}:</b>\n_"${content}"_`, {
                parse_mode: "HTML"
            });
        });

        SYLoVe('cap', (msg, S7, chatId) => {
            const args = msg.text.split(' ');
            const category = args[1] ? args[1].toLowerCase() : null;

            if (!category) {
                return S7.sendMessage(chatId,
                    `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Usage: /cap category \nExample: /cap love</b>`, {
                        parse_mode: "HTML"
                    }
                );
            }

            const db = getDB();
            const list = db.messages[category];

            if (!list || list.length === 0) {
                return S7.sendMessage(chatId, `<b>❌ No messages found in ${category}.</b>`, {
                    parse_mode: "HTML"
                });
            }

            const response = `<b>${category.toUpperCase()} Captions..!!</b>\n\n` +
                list.map((m, i) => `<b>${i + 1}</b>. ${m}`).join('\n\n');

            S7.sendMessage(chatId, response, {
                parse_mode: "HTML"
            });
        });

        SYLoVe(['start', 'menu'], (msg, S7, chatId) => {
            const name = msg.from.first_name || "𝖴𝗌𝖾𝗋";
            S7.sendPhoto(chatId, config.logo, {
                caption: mainCaption(name, SABIR7718()),
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '𝖮𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                            icon_custom_emoji_id: '6255511268375923733',
                            style: 'primary',
                            url: config.channel
                        }],
                        [{
                            text: '𝖲𝗎𝗉𝗉𝗈𝗋𝗍 𝖦𝗋𝗈𝗎𝗉',
                            icon_custom_emoji_id: '6255585425281256477',
                            style: 'success',
                            url: config.group
                        }]
                    ]
                }
            });
        });

        SYLoVe('checkmembership', async (msg, S7, chatId, userId) => {
            const isMember = await CheckSYlovesToo(userId, botOwnerId);
            if (isMember) {
                S7.sendMessage(chatId, "<b>✅ 𝖵𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅! 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖻𝗈𝗍.</b>", {
                    parse_mode: "HTML"
                });
            } else {
                S7.sendMessage(chatId, protectionMessage, {
                    parse_mode: 'HTML',
                    ...joinKeyboard
                });
            }
        });

        SYLoVe('addtoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId)
                return S7.sendMessage(chatId, notauthorized, {
                    parse_mode: "HTML"
                });

            const token = msg.text.split(' ')[1];
            if (!token)
                return S7.sendMessage(chatId, "<b>𝖴𝗌𝖺𝗀𝖾: /𝖺𝖽𝖽𝗍𝗈𝗄𝖾𝗇 &lt;𝗍𝗈𝗄𝖾𝗇&gt;</b>", {
                    parse_mode: "HTML"
                });

            let db = getDB();
            if (db.tokens.some(t => t.token === token))
                return S7.sendMessage(chatId, "<b>𝖳𝗈𝗄𝖾𝗇 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌.</b>", {
                    parse_mode: "HTML"
                });

            db.tokens.push({
                token,
                owner: userId.toString()
            });
            saveDB(db);
            startBot(token);
            S7.sendMessage(chatId, "<b>✅ 𝖭𝖾𝗐 𝖻𝗈𝗍 𝗂𝗇𝗌𝗍𝖺𝗇𝖼𝖾 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽.</b>", {
                parse_mode: "HTML"
            });
        });

        SYLoVe('deltoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId)
                return S7.sendMessage(chatId, notauthorized, {
                    parse_mode: "HTML"
                });

            const token = msg.text.split(' ')[1];
            if (!token)
                return S7.sendMessage(chatId, "<b>𝖴𝗌𝖺𝗀𝖾: /𝖽𝖾𝗅𝗍𝗈𝗄𝖾𝗇 &lt;𝗍𝗈𝗄𝖾𝗇&gt;</b>", {
                    parse_mode: "HTML"
                });

            let db = getDB();
            const idx = db.tokens.findIndex(t => t.token === token);
            if (idx === -1)
                return S7.sendMessage(chatId, "<b>𝖳𝗈𝗄𝖾𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.</b>", {
                    parse_mode: "HTML"
                });

            db.tokens.splice(idx, 1);
            saveDB(db);
            if (activeBots[token]) {
                activeBots[token].stopPolling().catch(() => {});
                delete activeBots[token];
            }
            S7.sendMessage(chatId, "<b>🗑️ 𝖳𝗈𝗄𝖾𝗇 𝗋𝖾𝗆𝗈𝗏𝖾𝖽.</b>", {
                parse_mode: "HTML"
            });
        });

        SYLoVe(['music', 'play', 'song'], async (msg, S7, chatId, userId) => {
            const query = msg.text.split(' ').slice(1).join(' ');

            if (!query) {
                return S7.sendMessage(
                    chatId,
                    '<b><tg-emoji emoji-id="5210956306952758910">🎵</tg-emoji> Please provide a song name! <tg-emoji emoji-id="6256017009364962043">🎧</tg-emoji></b>', {
                        parse_mode: "HTML"
                    }
                );
            }

            const loadingMsg = await S7.sendMessage(
                chatId,
                '<b><tg-emoji emoji-id="5231012545799666522">🔍</tg-emoji> Searching...</b>', {
                    parse_mode: "HTML"
                }
            );

            try {
                const searchResults = await yts(query);
                const video = searchResults.videos[0];

                if (!video) {
                    return S7.editMessageText(
                        "<b>❌ No song found!</b>", {
                            chat_id: chatId,
                            message_id: loadingMsg.message_id,
                            parse_mode: "HTML"
                        }
                    );
                }

                const apiUrl =
                    `${api}/audiosyhate?url=${encodeURIComponent(video.url)}`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const json = await response.json();
                
                if (!json.audio_url) {
                    throw new Error("Audio URL not found in API response");
                }

                const audioResponse = await fetch(json.audio_url);
                
                await S7.sendAudio(
                    chatId,
                    json.audio_url, {
                        caption: '<b><tg-emoji emoji-id="6253483549890973859">✅</tg-emoji> Downloaded Successfully!</b>',
                        parse_mode: "HTML",
                        title: video.title,
                        performer: video.author?.name || "Unknown",
                        reply_to_message_id: msg.message_id
                    }
                );

                await S7.deleteMessage(
                    chatId,
                    loadingMsg.message_id
                ).catch(() => {});

            } catch (err) {
                console.error("Music Error:", err);

                S7.editMessageText(
                    `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Error:</b>\n<code>${err.message}</code>`, {
                        chat_id: chatId,
                        message_id: loadingMsg.message_id,
                        parse_mode: "HTML"
                    }
                ).catch(() => {});
            }
        });

        S7.on('message', async (msg) => {
            const text = msg.text || '';
            const chatId = msg.chat.id;
            const userId = msg.from.id;

            const urlMatch = text.match(/https?:\/\/[^\s]+/);
            if (!urlMatch || text.startsWith('/')) return;

            const url = urlMatch[0];
            let apiUrl = '';
            let platform = '';

            if (url.includes('instagram.com')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'ig';

            } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'fb';

            } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'yt';

            } else if (url.includes('pin.it') || url.includes('pinterest.com')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'pin';

            } else if (url.includes('tiktok.com')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'tt';

            } else if (url.includes('xnxx.com')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'xnxx';

            } else if (url.includes('xnxx.health')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'xnxx';

            } else if (url.includes('xhamster.com')) {
                apiUrl = `${api}/sylove?url=${encodeURIComponent(url)}`;
                platform = 'xham';

            } else {
                return;
            }

            const loadingMsg = await S7.sendMessage(
                chatId,
                '<b>Lɪɴᴋ Dᴇᴛᴇᴄᴛᴇᴅ Dᴏᴡɴʟᴏᴀᴅɪɴɢ... <tg-emoji emoji-id="6256016519738691544">❤️</tg-emoji></b>', {
                    parse_mode: "HTML"
                }
            );

            try {
                const response = await fetch(apiUrl);
                const json = await response.json();
                log('info', 'API', `Response ` + JSON.stringify(json, null, 2));

                let downloadUrl = null;

                if (json.video_url) {
                    downloadUrl = json.video_url;
                } else if (platform === 'pin' && json.media_url) {
                    downloadUrl = json.media_url;
                }

                if (downloadUrl) {

                    let db = getDB();

                    db.videos[userId] = {
                        url: url,
                        downloadUrl: downloadUrl,
                        timestamp: Date.now()
                    };

                    saveDB(db);

                    const headResponse = await fetch(downloadUrl, {
                        method: 'HEAD'
                    });

                    const videoResponse = await fetch(downloadUrl);
                    const arrayBuffer = await videoResponse.arrayBuffer();
                    const videoBuffer = Buffer.from(arrayBuffer);

                    const contentLength = headResponse.headers.get('content-length');
                    const sizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;

                    let finalBuffer;

                    if (sizeMB > 40) {

                        await S7.editMessageText(
                            `<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Video is ${sizeMB.toFixed(2)} MB.\nCompressing to under 40MB...</b>`, {
                                chat_id: chatId,
                                message_id: loadingMsg.message_id,
                                parse_mode: "HTML"
                            }
                        );

                        const tempInput = path.resolve(LoveDir, `big_${userId}_${Date.now()}.mp4`);
                        const tempOutput = path.resolve(LoveDir, `compressed_${userId}_${Date.now()}.mp4`);

                        fs.writeFileSync(tempInput, videoBuffer);

                        await new Promise((resolve, reject) => {

                            ffmpeg(tempInput)
                                .videoCodec('libx264')
                                .audioCodec('aac')
                                .outputOptions([
                                    '-preset veryfast',
                                    '-crf 32',
                                    '-b:a 96k',
                                    '-movflags +faststart'
                                ])
                                .size('?x720')
                                .on('end', resolve)
                                .on('error', reject)
                                .save(tempOutput);

                        });

                        const compressedStats = fs.statSync(tempOutput);
                        const compressedMB = compressedStats.size / (1024 * 1024);

                        if (compressedMB > 30) {

                            const secondOutput = path.resolve(LoveDir, `compressed2_${userId}_${Date.now()}.mp4`);

                            await new Promise((resolve, reject) => {

                                ffmpeg(tempOutput)
                                    .videoCodec('libx264')
                                    .audioCodec('aac')
                                    .outputOptions([
                                        '-preset veryfast',
                                        '-crf 38',
                                        '-b:a 64k',
                                        '-movflags +faststart'
                                    ])
                                    .size('?x480')
                                    .on('end', resolve)
                                    .on('error', reject)
                                    .save(secondOutput);

                            });

                            finalBuffer = fs.readFileSync(secondOutput);

                            if (fs.existsSync(secondOutput)) fs.unlinkSync(secondOutput);

                        } else {

                            finalBuffer = fs.readFileSync(tempOutput);

                        }

                        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
                        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);

                    } else {

                        finalBuffer = videoBuffer;

                    }

                    const logoPath = path.resolve(LoveDir, `logo_${userId}.png`);
                    const inputPath = path.resolve(LoveDir, `in_${userId}_${Date.now()}.mp4`);
                    const outputPath = path.resolve(LoveDir, `out_${userId}_${Date.now()}.mp4`);

                    fs.writeFileSync(inputPath, finalBuffer);

                    if (fs.existsSync(logoPath)) {
                        await S7.editMessageText("<b>✅ Download successful! Adding your logo... ⏳</b>", {
                            chat_id: chatId,
                            message_id: loadingMsg.message_id,
                            parse_mode: "HTML"
                        });

                        await new Promise((resolve, reject) => {
                            ffmpeg(inputPath)
                                .input(logoPath)
                                .complexFilter([{
                                        filter: 'scale',
                                        options: {
                                            w: 'iw/6',
                                            h: '-1'
                                        },
                                        inputs: '[1:v]',
                                        outputs: 'scaled_logo'
                                    },
                                    {
                                        filter: 'overlay',
                                        options: {
                                            x: '15',
                                            y: '15'
                                        },
                                        inputs: ['[0:v]', 'scaled_logo'],
                                        outputs: 'final'
                                    }
                                ], 'final')
                                .outputOptions([
                                    '-preset superfast',
                                    '-c:v libx264',
                                    '-pix_fmt yuv420p',
                                    '-c:a aac',
                                    '-b:a 128k',
                                    '-map 0:a?',
                                    '-shortest'
                                ])
                                .output(outputPath)
                                .on('end', () => resolve())
                                .on('error', (err) => reject(err))
                                .run();
                        });

                        await S7.sendVideo(chatId, fs.readFileSync(outputPath), {
                            caption: '<b><tg-emoji emoji-id="6253483549890973859">✅</tg-emoji> Dᴏᴡɴʟᴏᴀᴅᴇᴅ Sᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ! <tg-emoji emoji-id="6296577138615125756">🎉</tg-emoji></b>',
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: "Want The Sound?",
                                        icon_custom_emoji_id: '5341715473882955310',
                                        callback_data: `getsound_${userId}`
                                    }]
                                ]
                            }
                        });

                        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                    } else {
                        await S7.sendVideo(chatId, finalBuffer, {
                            caption: '<b><tg-emoji emoji-id="6253483549890973859">✅</tg-emoji> Dᴏᴡɴʟᴏᴀᴅᴇᴅ Sᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ! <tg-emoji emoji-id="6296577138615125756">🎉</tg-emoji></b>',
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: 'Want The Sound?',
                                        icon_custom_emoji_id: '5341715473882955310',
                                        callback_data: `getsound_${userId}`
                                    }]
                                ]
                            }
                        });
                        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                    }

                    S7.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
                } else {
                    S7.editMessageText(`<b>❌ Error!</b>\nAPI Response: <code>${JSON.stringify(json)}</code>`, {
                        chat_id: chatId,
                        message_id: loadingMsg.message_id,
                        parse_mode: "HTML"
                    });
                }
            } catch (err) {
                console.error("Global Process Error:", err);
                S7.editMessageText(`<b><tg-emoji emoji-id="4972341539033318152">⚠️</tg-emoji> Error:</b> <code>${err.message}</code>`, {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id,
                    parse_mode: "HTML"
                });
            }
        });


        S7.on('callback_query', async (query) => {
            if (query.data === 'check_membership') {
                const isMember = await CheckSYlovesToo(query.from.id, botOwnerId);
                if (isMember) {
                    S7.deleteMessage(query.message.chat.id, query.message.message_id).catch(() => {});
                    S7.sendMessage(query.message.chat.id, "<b>✅ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖦𝗋𝖺𝗇𝗍𝖾𝖽!</b>", {
                        parse_mode: "HTML"
                    });
                } else {
                    S7.answerCallbackQuery(query.id, {
                        text: "❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾𝗇'𝗍 𝗃𝗈𝗂𝗇𝖾𝖽 𝗒𝖾𝗍!",
                        show_alert: true
                    });
                }
            }
            if (query.data.startsWith("getsound_")) {

                const targetUser = query.data.split("_")[1];

                let db = getDB();
                const videoData = db.videos?.[targetUser];

                if (!videoData) {
                    return S7.answerCallbackQuery(query.id, {
                        text: "❌ Video data expired.",
                        show_alert: true
                    });
                }

                await S7.answerCallbackQuery(query.id, {
                    text: "🎵 Downloading Audio..."
                });

                await S7.sendChatAction(
                    query.message.chat.id,
                    "record_audio"
                );

                try {

                    const apiUrl = `${api}/audiosyhate?url=${encodeURIComponent(videoData.url)}`;

                    const response = await fetch(apiUrl);
                    const json = await response.json();

                    if (!json.audio_url) {
                        return S7.sendMessage(
                            query.message.chat.id,
                            "<b>❌ Audio not found.</b>", {
                                parse_mode: "HTML"
                            }
                        );
                    }

                    const audioRes = await fetch(json.audio_url);
                    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

                    await S7.sendAudio(
                        query.message.chat.id,
                        audioBuffer, {
                            caption: '<b><tg-emoji emoji-id="5375125990118793401">🤔</tg-emoji> Tᴀᴋᴇ Yᴏᴜʀ Aᴜᴅɪᴏ. <tg-emoji emoji-id="5397782960512444700">🥰</tg-emoji></b>',
                            parse_mode: "HTML",
                            title: "𝐃 𝐇 — ا 𝐘",
                            performer: " ",
                            reply_to_message_id: query.message.message_id
                        }
                    );

                    await S7.sendChatAction(
                        query.message.chat.id,
                        "upload_audio"
                    );

                    await S7.editMessageReplyMarkup({
                        inline_keyboard: [
                            [{
                                text: "Want The Sound?",
                                icon_custom_emoji_id: '5341715473882955310',
                                url: "https://t.me/+lqB2SW5ck9k5YmU1"
                            }]
                        ]
                    }, {
                        chat_id: query.message.chat.id,
                        message_id: query.message.message_id
                    });

                    delete db.videos[targetUser];
                    saveDB(db);

                } catch (err) {
                    console.error(err);
                }

                return;
            }
        });

    } catch (err) {
        log('error', 'SYSTEM', err.message);
    }
}

startBot(config.mainToken, true);
const db = getDB();
//db.tokens.forEach(item => startBot(item.token));

log('info', 'SYSTEM', `Premium System Online.`);

const RENDER_URL = "https://checksylovetoo.onrender.com/checksylovestoo?id=1823013721";
const LOVESY = api;

async function keepSYloveAlive() {
    const urls = [RENDER_URL, LOVESY];

    try {
        const requests = urls.map(url => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            return fetch(url, {
                    signal: controller.signal
                })
                .then(res => {
                    clearTimeout(timeout);
                    if (!res.ok) return null;
                    return res.json().catch(() => null);
                })
                .catch(() => null);
        });

        const results = await Promise.all(requests);

        if (results[0]?.isjoined !== undefined) {
            console.log("🟢 Render Awake");
        }

        if (results[1] !== null) {
            console.log("🟢 LOVESY Awake");
        }

    } catch (err) {}
}

keepSYloveAlive();
setInterval(keepSYloveAlive, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
    const uptime = SABIR7718();

    const responseData = {
        status: "online",
        message: "Bot is Running Successfully",
        uptime: uptime,
        developer: "SABIR7718",
        timestamp: new Date().toISOString()
    };

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(JSON.stringify(responseData, null, 2));
});

server.listen(PORT, () => {
    log('success', 'HTTP', `Uptime server started on port ${PORT}`);
});

if (process.env.URL) {

    (async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    })();

    setInterval(async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    }, 5 * 60 * 1000);
}