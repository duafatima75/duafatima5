import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Helper function to extract number from JID
function extractNumber(jid) {
    if (!jid) return '';
    return jid.split('@')[0];
}


cmd({
    pattern: "statuslike",
    alias: ["statusreact"],
    desc: "Toggle auto view status",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aᴜᴛᴏ Lɪᴋᴇ Sᴛᴀᴛᴜs* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.statuslike on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.AUTO_LIKE_STATUS}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_LIKE_STATUS = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ Like Sᴛᴀᴛᴜs sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// BOT DP COMMAND - Using ImgBB
// ===============================
cmd({
    pattern: "botdp",
    alias: ["botimage", "botpic", "botphoto"],
    desc: "Set bot display picture",
    category: "settings",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber, quoted }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    try {
        let imageUrl = args[0];

        // ImgBB API Keys list
        const IMGBB_API_KEYS = [
            'ebb2d6cad946fa45d7d9c4cc7dfa87e3',
            'b9b79efc2a2cf5380b57974bba4ce6d4',
            '9f47b49c2c1ea0bdb3f4acc4ebde2119',
            'a7c9712190de7a0d3c27e12ac5e4c3da',
            '55ec55ce1c92a23b47d958a1db63c486'
        ];

        // Function to get random API key
        function getRandomApiKey() {
            const randomIndex = Math.floor(Math.random() * IMGBB_API_KEYS.length);
            return IMGBB_API_KEYS[randomIndex];
        }

        // If no URL provided but replied to an image
        if (!imageUrl && m.quoted) {
            const quotedMsg = m.quoted;
            const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
            
            if (!mimeType || !mimeType.includes('image')) {
                return reply("❌ Please reply to an image");
            }

            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

            const mediaBuffer = await quotedMsg.download();

            // Get random API key
            const apiKey = getRandomApiKey();

            // Upload to ImgBB
            const form = new FormData();
            form.append('key', apiKey);
            form.append('image', mediaBuffer.toString('base64'));
            form.append('name', 'botdp');

            const response = await axios.post("https://api.imgbb.com/1/upload", form, {
                headers: form.getHeaders(),
                timeout: 60000
            });

            imageUrl = response.data?.data?.url;

            if (!imageUrl) throw new Error("Upload failed - no URL returned");

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        }

        // If URL provided directly
        if (!imageUrl || !imageUrl.startsWith("http")) {
            return reply("❌ Please provide a valid image URL or reply to an image.");
        }

        // Update user config with new bot image
        userConfig.BOT_IMAGE = imageUrl;
        await updateUserConfig(sanitizedNumber, userConfig);

        // Send success message with the image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `┏━━━❖ *ʙᴏᴛ ᴅᴘ ᴜᴘᴅᴀᴛᴇᴅ* ❖━━━┓\n┃\n┃ 🖼️ *Success! Display Picture changed.*\n┃ 🔗 \`${imageUrl}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``
        }, { quoted: mek });

    } catch (error) {
        console.error('BotDP Error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await reply(`❌ Error: ${error.message || error}`);
    }
});

// ===============================
// WELCOME COMMAND
// ===============================
cmd({
    pattern: "welcome",
    alias: ["welcome"],
    desc: "Toggle welcome messages",
    category: "settings",
    react: "🎉",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Wᴇʟᴄᴏᴍᴇ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.welcome on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.WELCOME}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.WELCOME = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Wᴇʟᴄᴏᴍᴇ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// GOODBYE COMMAND
// ===============================
cmd({
    pattern: "goodbye",
    alias: ["goodbye"],
    desc: "Toggle goodbye messages",
    category: "settings",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Gᴏᴏᴅʙʏᴇ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.goodbye on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.GOODBYE}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.GOODBYE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Goodbye sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// SET WELCOME COMMAND
// ===============================
cmd({
    pattern: "setwelcome",
    alias: ["setwelcome"],
    desc: "Set custom welcome message",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Cᴜsᴛᴏᴍ Wᴇʟᴄᴏᴍᴇ* ❖━━━┓\n┃\n┃ 📌 *Cᴜʀʀᴇɴᴛ:*\n${userConfig.WELCOME_MESSAGE || 'Not set'}\n┃\n┃ 📝 *Usᴀɢᴇ:* \`.setwelcome <msg>\`\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const welcomeMessage = args.join(' ');
    userConfig.WELCOME_MESSAGE = welcomeMessage;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Wᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇ sᴇᴛ ᴛᴏ:*\n\n${welcomeMessage}`);
});

// ===============================
// SET GOODBYE COMMAND
// ===============================
cmd({
    pattern: "setgoodbye",
    alias: ["setgoodbye"],
    desc: "Set custom goodbye message",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Cᴜsᴛᴏᴍ Gᴏᴏᴅʙʏᴇ* ❖━━━┓\n┃\n┃ 📌 *Cᴜʀʀᴇɴᴛ:*\n${userConfig.GOODBYE_MESSAGE || 'Not set'}\n┃\n┃ 📝 *Usᴀɢᴇ:* \`.setgoodbye <msg>\`\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const goodbyeMessage = args.join(' ');
    userConfig.GOODBYE_MESSAGE = goodbyeMessage;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Goodbye ᴍᴇssᴀɢᴇ sᴇᴛ ᴛᴏ:*\n\n${goodbyeMessage}`);
});

// ===============================
// BANLIST COMMAND
// ===============================
cmd({
    pattern: "banlist",
    alias: ["banlist", "banned"],
    desc: "Show list of banned users",
    category: "settings",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? userConfig.BANNED : [];

    if (bannedList.length === 0) {
        return reply("📋 *No banned users found in the matrix.*");
    }

    let listText = "┏━━━❖ *ʙᴀɴɴᴇᴅ ᴜꜱᴇʀꜱ ʟɪꜱᴛ* ❖━━━┓\n\n";
    for (let i = 0; i < bannedList.length; i++) {
        const user = bannedList[i];
        const userNumber = extractNumber(user);
        listText += `┃ ${i + 1}. \`${userNumber}\`\n`;
    }
    listText += "\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* `12.00`";

    await reply(listText);
});

// ===============================
// BAN COMMAND
// ===============================
cmd({
    pattern: "ban",
    alias: ["ban"],
    desc: "Ban a user from using the bot",
    category: "settings",
    react: "🔨",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    if (!target && args[0]) {
        if (args[0].includes('@')) {
            target = args[0];
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* `.ban @user`");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to ban!\n\n*Usage:* `.ban @user`");
    }

    if (target === conn.user.id) {
        return reply("🤖 I can't ban myself!");
    }

    const ownerJid = userConfig.OWNER_NUMBER || config.OWNER_NUMBER;
    const ownerWithSuffix = ownerJid.includes('@') ? ownerJid : ownerJid + '@s.whatsapp.net';
    if (target === ownerWithSuffix) {
        return reply("👑 Cannot ban the owner!");
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? [...userConfig.BANNED] : [];

    if (bannedList.includes(target)) {
        return reply("❌ This user is already banned!");
    }

    bannedList.push(target);
    userConfig.BANNED = bannedList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User banned successfully!*\n\n> 🎯 User: \`${target}\``);
});

// ===============================
// UNBAN COMMAND
// ===============================
cmd({
    pattern: "unban",
    alias: ["unban"],
    desc: "Unban a user from using the bot",
    category: "settings",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    if (!target && args[0]) {
        if (args[0].includes('@')) {
            target = args[0];
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* `.unban @user`");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to unban!\n\n*Usage:* `.unban @user`");
    }

    let bannedList = Array.isArray(userConfig.BANNED) ? [...userConfig.BANNED] : [];

    if (!bannedList.includes(target)) {
        return reply("❌ This user is not banned!");
    }

    bannedList = bannedList.filter(jid => jid !== target);
    userConfig.BANNED = bannedList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User unbanned successfully!*\n\n> 🎯 User: \`${target}\``);
});

// ===============================
// SUDO COMMAND
// ===============================
cmd({
    pattern: "sudo",
    alias: ["sudo"],
    desc: "Add a user to sudo list",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    if (!target && args[0]) {
        if (args[0].includes('@')) {
            target = args[0];
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* `.sudo @user`");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to add to sudo!\n\n*Usage:* `.sudo @user`");
    }

    if (target === conn.user.id) {
        return reply("🤖 I can't sudo myself!");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? [...userConfig.SUDO] : [];

    if (sudoList.includes(target)) {
        return reply("❌ This user is already in sudo list!");
    }

    sudoList.push(target);
    userConfig.SUDO = sudoList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User added to sudo list successfully!*\n\n> 👑 User: \`${target}\``);
});

// ===============================
// DELSUDO COMMAND
// ===============================
cmd({
    pattern: "delsudo",
    alias: ["delsudo", "removesudo"],
    desc: "Remove a user from sudo list",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null);

    if (!target && args[0]) {
        if (args[0].includes('@')) {
            target = args[0];
        } else {
            return reply("⚠️ Please mention the user or reply to their message.\n\n*Usage:* `.delsudo @user`");
        }
    }

    if (!target) {
        return reply("⚠️ Please provide a target to remove from sudo!\n\n*Usage:* `.delsudo @user`");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? [...userConfig.SUDO] : [];

    if (!sudoList.includes(target)) {
        return reply("❌ This user is not in sudo list!");
    }

    sudoList = sudoList.filter(jid => jid !== target);
    userConfig.SUDO = sudoList;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *User removed from sudo list successfully!*\n\n> 🎯 User: \`${target}\``);
});

// ===============================
// LISTSUDO COMMAND
// ===============================
cmd({
    pattern: "listsudo",
    alias: ["listsudo", "sudoers"],
    desc: "Show list of sudo users",
    category: "settings",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    let sudoList = Array.isArray(userConfig.SUDO) ? userConfig.SUDO : [];

    if (sudoList.length === 0) {
        return reply("📋 *No sudo users found.*");
    }

    let listText = "┏━━━❖ *ꜱᴜᴅᴏ ᴜꜱᴇʀꜱ ʟɪꜱᴛ* ❖━━━┓\n\n";
    for (let i = 0; i < sudoList.length; i++) {
        const user = sudoList[i];
        const userNumber = extractNumber(user);
        listText += `┃ ${i + 1}. \`${userNumber}\`\n`;
    }
    listText += "\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* `12.00`";

    await reply(listText);
});

// ===============================
// ANTIEDIT COMMAND
// ===============================
cmd({
    pattern: "antiedit",
    alias: ["antiedit"],
    desc: "Toggle anti-edit feature",
    category: "settings",
    react: "✏️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aɴᴛɪ-Eᴅɪᴛ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.antiedit on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ANTI_EDIT}\`\n┃ 📁 *Path:* \`${userConfig.ANTIEDIT_PATH || 'inbox'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_EDIT = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aɴᴛɪ-ᴇᴅɪᴛ sᴇᴛ ᴛᴏ:* \`${newValue}\`\n📁 *Edit path:* \`${userConfig.ANTIEDIT_PATH || 'inbox'}\``);
});

// ===============================
// EDITPATH COMMAND
// ===============================
cmd({
    pattern: "editpath",
    alias: ["editpath"],
    desc: "Set where to show edited messages",
    category: "settings",
    react: "📍",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Eᴅɪᴛ Pᴀᴛʜ Cᴏɴꜰɪɢ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.editpath inbox/same\`\n┃ ⚙️ *Current:* \`${userConfig.ANTIEDIT_PATH || 'inbox'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const value = args[0].toLowerCase();
    if (value !== 'inbox' && value !== 'same') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* inbox ᴏʀ same');
    }

    userConfig.ANTIEDIT_PATH = value;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Eᴅɪᴛ ᴘᴀᴛʜ sᴇᴛ ᴛᴏ:* \`${value}\``);
});

// ===============================
// AUTOREAD COMMAND
// ===============================
cmd({
    pattern: "autoread",
    alias: ["autoread", "readmsg", "autoreadmsg"],
    desc: "Toggle auto-read messages feature",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aᴜᴛᴏ-Rᴇᴀᴅ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.autoread on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.READ_MESSAGE || 'false'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.READ_MESSAGE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ-ʀᴇᴀᴅ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// ANTI LINK COMMAND - FIXED
// ===============================
cmd({
    pattern: "antilink",
    alias: ["linkblock"],
    desc: "Toggle anti-link protection",
    category: "settings",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aɴᴛɪ-Lɪɴᴋ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.antilink on/off/warn/delete\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ANTI_LINK}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off' && value !== 'warn' && value !== 'delete') {
        return reply("❌ Please use: on, off, warn, or delete");
    }

    let configValue;
    let responseMsg = "";
    
    if (value === "on") {
        configValue = "true";
        responseMsg = "✅ *Anti-link set to ON*\n\n> Users sending links will be warned and messages will be deleted.";
    } else if (value === "off") {
        configValue = "false";
        responseMsg = "✅ *Anti-link set to OFF*\n\n> No link protection active.";
    } else if (value === "warn") {
        configValue = "warn";
        responseMsg = "✅ *Anti-link set to WARN*\n\n> Users will receive warnings when sending links.";
    } else if (value === "delete") {
        configValue = "delete";
        responseMsg = "✅ *Anti-link set to DELETE*\n\n> Link messages will be deleted without warning.";
    }

    userConfig.ANTI_LINK = configValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(responseMsg);
});

// ===============================
// ANTI DELETE COMMAND
// ===============================
cmd({
    pattern: "antidelete",
    alias: ["antidel", "delblock"],
    desc: "Toggle anti-delete message protection",
    category: "settings",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aɴᴛɪ-Dᴇʟᴇᴛᴇ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.antidelete on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ANTI_DELETE || 'false'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_DELETE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aɴᴛɪ-Dᴇʟᴇᴛᴇ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// RECORDING COMMAND
// ===============================
cmd({
    pattern: "recording",
    alias: ["autorecording"],
    desc: "Toggle auto recording presence",
    category: "settings",
    react: "🎙️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Rᴇᴄᴏʀᴅɪɴɢ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.recording on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.AUTO_RECORDING}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_RECORDING = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ Rᴇᴄᴏʀᴅɪɴɢ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// STATUS VIEW COMMAND
// ===============================
cmd({
    pattern: "statusview",
    alias: ["autoview"],
    desc: "Toggle auto view status",
    category: "settings",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Sᴛᴀᴛᴜs Vɪᴇᴡ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.statusview on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.AUTO_VIEW_STATUS}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_VIEW_STATUS = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ Vɪᴇᴡ Sᴛᴀᴛᴜs sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// AUTO REACT COMMAND
// ===============================
cmd({
    pattern: "autoreact",
    alias: ["autoreaction", "reactauto"],
    desc: "Toggle auto react to messages",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aᴜᴛᴏ Rᴇᴀᴄᴛ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.autoreact on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.AUTO_REACT}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_REACT = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ Rᴇᴀᴄᴛ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// ANTI CALL COMMAND
// ===============================
cmd({
    pattern: "anticall",
    alias: ["antcall", "callblock"],
    desc: "Toggle anti-call protection",
    category: "settings",
    react: "📵",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aɴᴛɪ-Cᴀʟʟ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.anticall on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ANTI_CALL || 'false'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ANTI_CALL = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aɴᴛɪ-Cᴀʟʟ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// ANTI CALL MESSAGE COMMAND
// ===============================
cmd({
    pattern: "anticallmsg",
    alias: ["callmsg", "rejectmsg"],
    desc: "Set custom anti-call rejection message",
    category: "settings",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        const currentMsg = userConfig.REJECT_MSG || config.REJECT_MSG || "*📞 Call Rejected Automatically 📵*";
        return reply(`┏━━━❖ *Rᴇᴊᴇᴄᴛ Mᴇssᴀɢᴇ* ❖━━━┓\n┃\n📌 *Current:*\n${currentMsg}\n┃\n┃ 📝 *Usᴀɢᴇ:* \`.anticallmsg <msg>\`\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const newMsg = args.join(' ');
    userConfig.REJECT_MSG = newMsg;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aɴᴛɪ-Cᴀʟʟ Rᴇᴊᴇᴄᴛ Mᴇssᴀɢᴇ sᴇᴛ ᴛᴏ:*\n${newMsg}`);
});

// ===============================
// ADMIN ACTION COMMAND
// ===============================
cmd({
    pattern: "adminaction",
    alias: ["adminnotify"],
    desc: "Toggle admin action notifications",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aᴅᴍɪɴ Aᴄᴛɪᴏɴ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.adminaction on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ADMIN_ACTION}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ADMIN_ACTION = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴅᴍɪɴ Aᴄᴛɪᴏɴ Nᴏᴛɪғɪᴄᴀᴛɪᴏɴs sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// AUTO TYPING COMMAND
// ===============================
cmd({
    pattern: "autotyping",
    alias: ["typing"],
    desc: "Toggle auto typing in chats",
    category: "settings",
    react: "⌨️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aᴜᴛᴏ Tʏᴘɪɴɢ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.autotyping on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.AUTO_TYPING || 'false'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.AUTO_TYPING = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aᴜᴛᴏ Tʏᴘɪɴɢ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// ONLINE COMMAND
// ===============================
cmd({
    pattern: "online",
    alias: ["alwaysonline", "alwayson"],
    desc: "Toggle always online status",
    category: "settings",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Aʟᴡᴀʏs Oɴʟɪɴᴇ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.online on/off\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ALWAYS_ONLINE || 'false'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const value = args[0].toLowerCase();
    if (value !== 'on' && value !== 'off') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* on ᴏʀ off');
    }

    const newValue = value === 'on' ? 'true' : 'false';
    userConfig.ALWAYS_ONLINE = newValue;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aʟᴡᴀʏs Oɴʟɪɴᴇ sᴇᴛ ᴛᴏ:* \`${newValue}\``);
});

// ===============================
// MODE COMMAND
// ===============================
cmd({
    pattern: "mode",
    alias: ["mod"],
    desc: "Change bot mode (public/private/inbox)",
    category: "settings",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Bᴏᴛ Mᴏᴅᴇ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.mode public/private/inbox\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.MODE}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const mode = args[0].toLowerCase();
    if (!['public', 'private', 'inbox'].includes(mode)) {
        return reply('❌ *Aᴠᴀɪʟᴀʙʟᴇ ᴍᴏᴅᴇs:* public, private, inbox');
    }

    userConfig.MODE = mode;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Bot mode set to:* \`${mode}\``);
});

// ===============================
// PREFIX COMMAND
// ===============================
cmd({
    pattern: "prefix",
    desc: "Change command prefix",
    category: "settings",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Pʀᴇꜰɪx Cᴏɴꜰɪɢ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.prefix <symbol>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.PREFIX}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> ⚡ *Version:* \`12.00\``);
    }

    const newPrefix = args[0];
    if (newPrefix.length > 2) {
        return reply('❌ *Pʀᴇғɪx ᴍᴜsᴛ ʙᴇ 1-2 ᴄʜᴀʀᴀᴄᴛᴇʀs ᴍᴀx*');
    }

    userConfig.PREFIX = newPrefix;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Pʀᴇғɪx ᴄʜᴀɴɢᴇᴅ ᴛᴏ:* \`${newPrefix}\``);
});

// ===============================
// BOT NAME COMMAND
// ===============================
cmd({
    pattern: "botname",
    alias: ["name"],
    desc: "Change bot name",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Bᴏᴛ Nᴀᴍᴇ Cᴏɴꜰɪɢ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.botname <name>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.BOT_NAME || config.BOT_NAME}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const newName = args.join(' ');
    if (newName.length > 30) {
        return reply('❌ *Bᴏᴛ ɴᴀᴍᴇ ᴍᴜsᴛ ʙᴇ ᴜɴᴅᴇʀ 30 ᴄʜᴀʀᴀᴄᴛᴇʀs*');
    }

    userConfig.BOT_NAME = newName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Bᴏᴛ ɴᴀᴍᴇ sᴇᴛ ᴛᴏ:* \`${newName}\``);
});

// ===============================
// OWNER NAME COMMAND
// ===============================
cmd({
    pattern: "ownername",
    alias: ["owner"],
    desc: "Change owner name",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Oᴡɴᴇʀ Nᴀᴍᴇ Cᴏɴꜰɪɢ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.ownername <name>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.OWNER_NAME || config.OWNER_NAME}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const newName = args.join(' ');
    if (newName.length > 30) {
        return reply('❌ *Oᴡɴᴇʀ ɴᴀᴍᴇ ᴍᴜsᴛ ʙᴇ ᴜɴᴅᴇʀ 30 ᴄʜᴀʀᴀᴄᴛᴇʀs*');
    }

    userConfig.OWNER_NAME = newName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Oᴡɴᴇʀ ɴᴀᴍᴇ sᴇᴛ ᴛᴏ:* \`${newName}\``);
});

// ===============================
// OWNER NUMBER COMMAND
// ===============================
cmd({
    pattern: "ownernumber",
    alias: ["ownernum", "ownerphone"],
    desc: "Change owner number",
    category: "settings",
    react: "📞",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Oᴡɴᴇʀ Nᴜᴍʙᴇʀ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.ownernumber <num>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.OWNER_NUMBER || config.OWNER_NUMBER}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const newNumber = args[0];
    if (!newNumber.match(/^\d{10,15}$/)) {
        return reply('❌ *Pʟᴇᴀsᴇ ᴇɴᴛᴇʀ ᴀ ᴠᴀʟɪᴅ ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ (10-15 ᴅɪɢɪᴛs)*');
    }

    userConfig.OWNER_NUMBER = newNumber;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Oᴡɴᴇʀ ɴᴜᴍʙᴇʀ sᴇᴛ ᴛᴏ:* \`${newNumber}\``);
});

// ===============================
// DESCRIPTION COMMAND
// ===============================
cmd({
    pattern: "description",
    alias: ["desc", "about"],
    desc: "Change bot description",
    category: "settings",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Bᴏᴛ Dᴇsᴄʀɪᴘᴛɪᴏɴ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.description <text>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.DESCRIPTION || config.DESCRIPTION}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const newDesc = args.join(' ');
    if (newDesc.length > 200) {
        return reply('❌ *Dᴇsᴄʀɪᴘᴛɪᴏɴ ᴍᴜsᴛ ʙᴇ ᴜɴᴅᴇʀ 200 ᴄʜᴀʀᴀᴄᴛᴇʀs*');
    }

    userConfig.DESCRIPTION = newDesc;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Bᴏᴛ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ sᴇᴛ ᴛᴏ:* \`${newDesc}\``);
});

// ===============================
// STICKER NAME COMMAND
// ===============================
cmd({
    pattern: "stickername",
    alias: ["stickertext", "stname"],
    desc: "Set sticker pack name",
    category: "settings",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        const currentName = userConfig.STICKER_NAME || 'Sticker Pack';
        return reply(`┏━━━❖ *Sᴛɪᴄᴋᴇʀ Nᴀᴍᴇ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.stickername <name>\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${currentName}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const stickerName = args.join(' ');
    userConfig.STICKER_NAME = stickerName;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ ɴᴀᴍᴇ sᴇᴛ ᴛᴏ:* \`${stickerName}\``);
});

// ===============================
// DELPATH COMMAND
// ===============================
cmd({
    pattern: "delpath",
    alias: ["deletepath", "antideletepath"],
    desc: "Set anti-delete path (same/inbox)",
    category: "settings",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        return reply(`┏━━━❖ *Dᴇʟᴇᴛᴇ Pᴀᴛʜ Sʏsᴛᴇᴍ* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.delpath same/inbox\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* \`${userConfig.ANTI_DELETE_PATH || 'inbox'}\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const value = args[0].toLowerCase();
    if (value !== 'same' && value !== 'inbox') {
        return reply('❌ *Pʟᴇᴀsᴇ ᴜsᴇ:* same ᴏʀ inbox');
    }

    userConfig.ANTI_DELETE_PATH = value;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Aɴᴛɪ-ᴅᴇʟᴇᴛᴇ ᴘᴀᴛʜ sᴇᴛ ᴛᴏ:* \`${value}\``);
});

// ===============================
// REACT EMOJIS COMMAND
// ===============================
cmd({
    pattern: "reactemojis",
    alias: ["reacts", "reactset"],
    desc: "Set auto react emojis",
    category: "settings",
    react: "😍",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        const currentEmojis = userConfig.REACT_EMOJIS || ['😍', '❤️', '🔥', '👏', '😮', '😢', '🤣', '👍', '🎉', '🤔', '🙏', '😊', '🥰', '💕', '🤩', '✨', '😎', '🥳', '🙌'];
        return reply(`┏━━━❖ *Rᴇᴀᴄᴛ Eᴍᴏᴊɪs* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.reactemojis 😍,❤️,🔥\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* ${currentEmojis.join(', ')}\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const input = args.join(' ');
    const emojis = input.split(',').map(e => e.trim()).filter(e => e);
    
    if (emojis.length === 0) {
        return reply('❌ *Please provide valid emojis separated by commas*');
    }

    userConfig.REACT_EMOJIS = emojis;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Auto react emojis set:*\n${emojis.join(', ')}`);
});

// ===============================
// OWNER EMOJIS COMMAND
// ===============================
cmd({
    pattern: "owneremojis",
    alias: ["owneremojiset", "ownerreacts"],
    desc: "Set owner emojis for reactions",
    category: "settings",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, prefix, updateUserConfig, userConfig, sanitizedNumber }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    if (!args[0]) {
        const currentEmojis = userConfig.OWNER_EMOJIS || ['👑', '⭐', '💎', '🌟', '✨', '⚡', '🔥', '❤️', '💕', '🎯'];
        return reply(`┏━━━❖ *Oᴡɴᴇʀ Eᴍᴏᴊɪs* ❖━━━┓\n┃\n┃ 📌 *Usᴀɢᴇ:* \`.owneremojis 👑,⭐,💎\`\n┃ ⚙️ *Cᴜʀʀᴇɴᴛ:* ${currentEmojis.join(', ')}\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }

    const input = args.join(' ');
    const emojis = input.split(',').map(e => e.trim()).filter(e => e);
    
    if (emojis.length === 0) {
        return reply('❌ *Please provide valid emojis separated by commas*');
    }

    userConfig.OWNER_EMOJIS = emojis;
    await updateUserConfig(sanitizedNumber, userConfig);
    
    await reply(`✅ *Owner emojis set:*\n${emojis.join(', ')}`);
});

// ===============================
// SETTINGS COMMAND
// ===============================
cmd({
    pattern: "settings",
    alias: ["setting", "env", "config"],
    desc: "Bot settings management - View all available setting commands",
    category: "settings",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, prefix, userConfig }) => {
    if (!isCreator) {
        return reply("╔════════════════════════╗\n║ 📛 *Sᴇᴄᴜʀɪᴛʏ ᴀʟᴇʀᴛ* 📛\n╚════════════════════════╝\n\n> ❌ *ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }
    
    const settingsText = `┏━━━❖ *${userConfig.BOT_NAME || config.BOT_NAME} SETTINGS* ❖━━━┓
┃
┃ 📁 *General Settings*
┃ • \`welcome\` on/off
┃ • \`goodbye\` on/off
┃ • \`setwelcome\` <msg>
┃ • \`setgoodbye\` <msg>
┃
┃ 📁 *Anti Security*
┃ • \`antiedit\` on/off
┃ • \`editpath\` inbox/same
┃ • \`antilink\` on/off/warn/delete
┃ • \`antidelete\` on/off
┃ • \`anticall\` on/off
┃ • \`anticallmsg\` <msg>
┃
┃ 📁 *Automation*
┃ • \`autoread\` on/off
┃ • \`recording\` on/off
┃ • \`statusview\` on/off
┃ • \`autoreact\` on/off
┃ • \`autotyping\` on/off
┃ • \`online\` on/off
┃
┃ 📁 *Access Control*
┃ • \`ban\` / \`unban\` @user
┃ • \`banlist\`
┃ • \`sudo\` / \`delsudo\` @user
┃ • \`listsudo\`
┃
┃ 📁 *Bot Core Identity*
┃ • \`mode\` public/private/inbox
┃ • \`prefix\` <symbol>
┃ • \`botname\` <name>
┃ • \`ownername\` <name>
┃ • \`ownernumber\` <number>
┃ • \`description\` <text>
┃ • \`botdp\` <url>/reply image
┃ • \`stickername\` <name>
┃ • \`delpath\` same/inbox
┃ • \`reactemojis\` 😍,❤️,🔥
┃ • \`owneremojis\` 👑,⭐,💎
┃
┃ 📊 *Active System Status*
┃ • Welcome: \`${userConfig.WELCOME || 'false'}\`
┃ • Goodbye: \`${userConfig.GOODBYE || 'false'}\`
┃ • Anti-Edit: \`${userConfig.ANTI_EDIT || 'false'}\`
┃ • Anti-Link: \`${userConfig.ANTI_LINK || 'off'}\`
┃ • Anti-Delete: \`${userConfig.ANTI_DELETE || 'false'}\`
┃ • Anti-Call: \`${userConfig.ANTI_CALL || 'false'}\`
┃ • Auto-Read: \`${userConfig.READ_MESSAGE || 'false'}\`
┃ • Auto-React: \`${userConfig.AUTO_REACT || 'false'}\`
┃ • Auto-Typing: \`${userConfig.AUTO_TYPING || 'false'}\`
┃ • Always Online: \`${userConfig.ALWAYS_ONLINE || 'false'}\`
┃ • Mode: \`${userConfig.MODE || 'public'}\`
┃ • Prefix: \`${userConfig.PREFIX || prefix}\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by FATIMA-MD*`;
    
    await reply(settingsText);
});
