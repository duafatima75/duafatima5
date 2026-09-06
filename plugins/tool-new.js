// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { sleep } from '../lib/functions.js';
import { cmd, commands } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "rcolor",
    desc: "Generate a random color with name and code with FATIMA-MD style.",
    category: "utility",
    react: "🎨",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const colorNames = [
            "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
            "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
        ];
        
        const randomColorHex = "#" + Math.floor(Math.random()*16777215).toString(16);
        const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

        const colorBox = `
╔════════════════════════╗
║   🎨 FATIMA-MD COLOR   🎨   
╚════════════════════════╝
 🎨 *Name:* \`${randomColorName}\`
 📌 *Code:* \`${randomColorHex}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━
> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(colorBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .randomcolor command:", e);
        reply("❌ *An error occurred while generating the random color.*");
    }
});

cmd({
    pattern: "binary",
    desc: "Convert text into binary format with FATIMA-MD style.",
    category: "utility",
    react: "🔑",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔑 FATIMA-MD BINARY  🔑   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya convert karne ke liye text dein!*\n\n` +
            `> 📌 *Example:* \`.binary Hello\`\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const textToConvert = args.join(" ");
        const binaryText = textToConvert.split('').map(char => {
            return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
        }).join(' ');

        const binaryBox = `
╔════════════════════════╗
║   🔑 FATIMA-MD BINARY  🔑   \n` +
        `╚════════════════════════╝\n` +
        ` ${binaryText}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(binaryBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .binary command:", e);
        reply("❌ *An error occurred while converting to binary.*");
    }
});

cmd({
    pattern: "dbinary",
    desc: "Decode binary string into text with FATIMA-MD style.",
    category: "utility",
    react: "🔓",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔓 FATIMA-MD DBINARY 🔓   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya decode karne ke liye binary string dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const binaryString = args.join(" ");
        const textDecoded = binaryString.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');

        const decodeBox = `
╔════════════════════════╗
║   🔓 FATIMA-MD DBINARY 🔓   \n` +
        `╚════════════════════════╝\n` +
        ` \`${textDecoded}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(decodeBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .binarydecode command:", e);
        reply("❌ *An error occurred while decoding the binary string.*");
    }
});


cmd({
    pattern: "base64",
    desc: "Encode text into Base64 format with FATIMA-MD style.",
    category: "utility",
    react: "🔑",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔑 FATIMA-MD BASE64  🔑   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya encode karne ke liye text dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const textToEncode = args.join(" ");
        const encodedText = Buffer.from(textToEncode).toString('base64');
        
        const base64Box = `
╔════════════════════════╗\n` +
        `║   🔑 FATIMA-MD BASE64  🔑   \n` +
        `╚════════════════════════╝\n` +
        ` \`${encodedText}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(base64Box, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .base64 command:", e);
        reply("❌ *An error occurred while encoding the text into Base64.*");
    }
});

cmd({
    pattern: "unbase64",
    desc: "Decode Base64 encoded text with FATIMA-MD style.",
    category: "utility",
    react: "🔓",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔓 FATIMA-MD UNBASE64🔓   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya decode karne ke liye Base64 text dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const base64Text = args.join(" ");
        const decodedText = Buffer.from(base64Text, 'base64').toString('utf-8');
        
        const unbase64Box = `
╔════════════════════════╗\n` +
        `║   🔓 FATIMA-MD UNBASE64🔓   \n` +
        `╚════════════════════════╝\n` +
        ` \`${decodedText}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(unbase64Box, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .unbase64 command:", e);
        reply("❌ *An error occurred while decoding the Base64 text.*");
    }
});

cmd({
    pattern: "urlencode",
    desc: "Encode text into URL encoding with FATIMA-MD style.",
    category: "utility",
    react: "🔑",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔑 FATIMA-MD URLENC  🔑   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya text dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const textToEncode = args.join(" ");
        const encodedText = encodeURIComponent(textToEncode);

        const urlEncBox = `
╔════════════════════════╗\n` +
        `║   🔑 FATIMA-MD URLENC  🔑   \n` +
        `╚════════════════════════╝\n` +
        ` \`${encodedText}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(urlEncBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .urlencode command:", e);
        reply("❌ *An error occurred while encoding the text.*");
    }
});

cmd({
    pattern: "urldecode",
    desc: "Decode URL encoded text with FATIMA-MD style.",
    category: "utility",
    react: "🔓",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔓 FATIMA-MD URLDEC  🔓   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya URL encoded text dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const encodedText = args.join(" ");
        const decodedText = decodeURIComponent(encodedText);

        const urlDecBox = `
╔════════════════════════╗\n` +
        `║   🔓 FATIMA-MD URLDEC  🔓   \n` +
        `╚════════════════════════╝\n` +
        ` \`${decodedText}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(urlDecBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .urldecode command:", e);
        reply("❌ *An error occurred while decoding the URL encoded text.*");
    }
});

cmd({
    pattern: "roll",
    desc: "Roll a dice (1-6) with FATIMA-MD style.",
    category: "fun",
    react: "🎲",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const result = Math.floor(Math.random() * 6) + 1;
        
        const rollBox = `
╔════════════════════════╗\n` +
        `║   🎲 FATIMA-MD DICE    🎲   \n` +
        `╚════════════════════════╝\n` +
        ` 🎲 *Result:* \`${result}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(rollBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .roll command:", e);
        reply("❌ *An error occurred while rolling the dice.*");
    }
}); 

cmd({
    pattern: "coinflip",
    desc: "Flip a coin and get Heads or Tails with FATIMA-MD style.",
    category: "fun",
    react: "🪙",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        
        const coinBox = `
╔════════════════════════╗\n` +
        `║   🪙 FATIMA-MD COIN    🪙   \n` +
        `╚════════════════════════╝\n` +
        ` 🪙 *Result:* \`${result}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(coinBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .coinflip command:", e);
        reply("❌ *An error occurred while flipping the coin.*");
    }
});

cmd({
    pattern: "flip",
    desc: "Flip the text you provide with FATIMA-MD style.",
    category: "fun",
    react: "🔄",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply(
            `╔════════════════════════╗\n` +
            `║   🔄 FATIMA-MD FLIP    🔄   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya flip karne ke liye text dein!*\n\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const flippedText = args.join(" ").split('').reverse().join('');
        
        const flipBox = `
╔════════════════════════╗\n` +
        `║   🔄 FATIMA-MD FLIP    🔄   \n` +
        `╚════════════════════════╝\n` +
        ` 🔄 *Flipped Text:* \`${flippedText}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(flipBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .flip command:", e);
        reply("❌ *An error occurred while flipping the text.*");
    }
});

cmd({
    pattern: "pick",
    desc: "Pick between two choices with FATIMA-MD style.",
    category: "fun",
    react: "🎉",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length < 2) return reply(
            `╔════════════════════════╗\n` +
            `║   🎉 FATIMA-MD PICK    🎉   \n` +
            `╚════════════════════════╝\n\n` +
            `❌ *Kripya do choices dein comma se separate karke!*\n\n` +
            `> 📌 *Example:* \`.pick Ice Cream, Pizza\`\n` +
            `> ⚡ *Version:* \`12.00\``
        );

        const option = args.join(" ").split(',')[Math.floor(Math.random() * 2)].trim();
        
        const pickBox = `
╔════════════════════════╗\n` +
        `║   🎉 FATIMA-MD PICK    🎉   \n` +
        `╚════════════════════════╝\n` +
        ` 🎉 *Bot Picks:* \`${option}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(pickBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .pick command:", e);
        reply("❌ *An error occurred while processing your request.*");
    }
});

cmd({
    pattern: "timenow",
    desc: "Check the current local time with FATIMA-MD style.",
    category: "utility",
    react: "🕒",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const now = new Date();
        const localTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit", 
            hour12: true,
            timeZone: "Asia/Karachi"
        });
        
        const timeBox = `
╔════════════════════════╗\n` +
        `║   🕒 FATIMA-MD TIME    🕒   \n` +
        `╚════════════════════════╝\n` +
        ` 🕒 *Time (Pakistan):* \`${localTime}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(timeBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .timenow command:", e);
        reply("❌ *An error occurred. Please try again later.*");
    }
});

cmd({
    pattern: "date",
    desc: "Check the current date with FATIMA-MD style.",
    category: "utility",
    react: "📅",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const now = new Date();
        const currentDate = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        
        const dateBox = `
╔════════════════════════╗\n` +
        `║   📅 FATIMA-MD DATE    📅   \n` +
        `╚════════════════════════╝\n` +
        ` 📅 *Current Date:* \`${currentDate}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(dateBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error("Error in .date command:", e);
        reply("❌ *An error occurred. Please try again later.*");
    }
});

cmd({
    pattern: "shapar",
    desc: "Send shapar ASCII art with mentions.",
    category: "fun",
    react: "😂",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) {
            return reply("❌ *This command can only be used in groups!*");
        }

        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("❌ *Please mention a user to send the ASCII art to.*");
        }

        const asciiArt = `
          _______
       .-'       '-.
      /           /|
     /           / |
    /___________/  |
    |   _______ |  |
    |  |  \\ \\  ||  |
    |  |   \\ \\ ||  |
    |  |____\\ \\||  |
    |  '._  _.'||  |
    |    .' '.  ||  |
    |   '.___.' ||  |
    |___________||  |
    '------------'  |
     \\_____________\\|
`;

        const message = `😂 @${mentionedUser.split("@")[0]}!\n😂 That's for you:\n\n${asciiArt}`;

        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        }, { quoted: m });

    } catch (e) {
        console.error("Error in .shapar command:", e);
        reply("❌ *An error occurred while processing the command.*");
    }
});

cmd({
    pattern: "rate",
    desc: "Rate someone out of 10.",
    category: "fun",
    react: "⭐",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");

        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) return reply("❌ *Please mention someone to rate.*");

        const randomRating = Math.floor(Math.random() * 10) + 1;
        const message = `⭐ @${mentionedUser.split("@")[0]} is rated \`${randomRating}/10\`!`;

        await conn.sendMessage(from, { 
            text: message, 
            mentions: [mentionedUser],
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            } 
        }, { quoted: m });
    } catch (e) {
        console.error("Error in .rate command:", e);
        reply("❌ *An error occurred. Please try again.*");
    }
});

cmd({
    pattern: "countx",
    desc: "Start a reverse countdown from the specified number to 1.",
    category: "owner",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { args, reply, senderNumber }) => {
    try {
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("❌ *Only the bot owner can use this command.*");
        }

        if (!args[0]) {
            return reply("❌ *Example:* \`.countx 10\`");
        }

        const count = parseInt(args[0].trim());

        if (isNaN(count) || count <= 0 || count > 50) {
            return reply("❌ *Please specify a valid number between 1 and 50.*");
        }

        reply(`⏳ *Starting reverse countdown from ${count}...*`);

        for (let i = count; i >= 1; i--) {
            await conn.sendMessage(m.chat, { text: `${i}` }, { quoted: mek });
            await sleep(1000);
        }

        reply(`✅ *Countdown completed.*`);
    } catch (e) {
        console.error(e);
        reply("❌ *An error occurred while processing your request.*");
    }
});

cmd({
    pattern: "count",
    desc: "Start a countdown from 1 to the specified number.",
    category: "owner",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { args, reply, senderNumber }) => {
    try {
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("❌ *Only the bot owner can use this command.*");
        }

        if (!args[0]) {
            return reply("❌ *Example:* \`.count 10\`");
        }

        const count = parseInt(args[0].trim());

        if (isNaN(count) || count <= 0 || count > 50) {
            return reply("❌ *Please specify a valid number between 1 and 50.*");
        }

        reply(`⏳ *Starting countdown to ${count}...*`);

        for (let i = 1; i <= count; i++) {
            await conn.sendMessage(m.chat, { text: `${i}` }, { quoted: mek });
            await sleep(1000);
        }

        reply(`✅ *Countdown completed.*`);
    } catch (e) {
        console.error(e);
        reply("❌ *An error occurred while processing your request.*");
    }
});

cmd({
    pattern: "calculate",
    alias: ["calc"],
    desc: "Evaluate a mathematical expression with FATIMA-MD style.",
    category: "utility",
    react: "🧮",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply("❌ *Example:* \`.calculate 5+3*2\`");
        }

        const expression = args.join(" ").trim();

        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return reply("❌ *Invalid expression! Only numbers and +, -, *, /, ( ) are allowed.*");
        }

        let result;
        try {
            result = eval(expression);
        } catch (e) {
            return reply("❌ *Error in calculation. Please check your expression.*");
        }

        const calcBox = `
╔════════════════════════╗\n` +
        `║   🧮 FATIMA-MD CALC    🧮   \n` +
        `╚════════════════════════╝\n` +
        ` 📝 *Expression:* \`${expression}\`\n` +
        ` ✅ *Result:* \`${result}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await reply(calcBox, {
            contextInfo: { 
                forwardingScore: 999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: { 
                    newsletterJid: '120363412031212190@newsletter', 
                    newsletterName: 'ꜰᴀᴛɪᴍᴀ-ᴍᴅ ᴏғғɪᴄɪᴀʟ', 
                    serverMessageId: 143 
                } 
            }
        });
    } catch (e) {
        console.error(e);
        reply("❌ *An error occurred while processing your request.*");
    }
});
