// ꜰᴀᴛɪᴍᴀ-ᴍᴅ

import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { getBuffer, fetchJson } from '../lib/functions.js';

const __filename = fileURLToPath(import.meta.url);

const logoCommands = [
    { pattern: "3dcomic", name: "3D Comic", url: "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html" },
    { pattern: "dragonball", name: "Dragon Ball", url: "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html" },
    { pattern: "deadpool", name: "Deadpool", url: "https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html" },
    { pattern: "blackpink", name: "Blackpink", url: "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html" },
    { pattern: "neonlight", name: "Neon Light", url: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html" },
    { pattern: "cat", name: "Foggy Glass", url: "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html" },
    { pattern: "sadgirl", name: "Wet Glass", url: "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html" },
    { pattern: "pornhub", name: "Pornhub", url: "https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html" },
    { pattern: "naruto", name: "Naruto", url: "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html" },
    { pattern: "thor", name: "Thor", url: "https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html" },
    { pattern: "america", name: "American Flag", url: "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html" },
    { pattern: "eraser", name: "Eraser", url: "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html" },
    { pattern: "3dpaper", name: "3D Paper Cut", url: "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html" },
    { pattern: "futuristic", name: "Futuristic", url: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html" },
    { pattern: "clouds", name: "Sky Clouds", url: "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html" },
    { pattern: "sans", name: "Summer Beach", url: "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html" },
    { pattern: "galaxy", name: "Galaxy", url: "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html" },
    { pattern: "leaf", name: "Green Brush", url: "https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html" },
    { pattern: "sunset", name: "Sunset Light", url: "https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html" },
    { pattern: "nigeria", name: "Nigeria Flag", url: "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html" },
    { pattern: "devilwings", name: "Neon Devil Wings", url: "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html" },
    { pattern: "hacker", name: "Hacker Cyan", url: "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html" },
    { pattern: "boom", name: "Boom Comic", url: "https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html" },
    { pattern: "luxury", name: "Floral Luxury", url: "https://en.ephoto360.com/floral-luxury-logo-collection-for-branding-616.html" },
    { pattern: "zodiac", name: "Star Zodiac", url: "https://en.ephoto360.com/create-star-zodiac-wallpaper-mobile-604.html" },
    { pattern: "angelwings", name: "Angel Wings", url: "https://en.ephoto360.com/angel-wing-effect-329.html" },
    { pattern: "bulb", name: "Incandescent Bulb", url: "https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html" },
    { pattern: "tatoo", name: "Tattoo Maker", url: "https://en.ephoto360.com/make-tattoos-online-by-empire-tech-309.html" },
    { pattern: "castle", name: "3D Castle", url: "https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html" },
    { pattern: "frozen", name: "Frozen Christmas", url: "https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html" },
    { pattern: "paint", name: "3D Paint", url: "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html" },
    { pattern: "birthday", name: "Foil Balloon", url: "https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html" },
    { pattern: "typography", name: "Leaves Typography", url: "https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html" },
    { pattern: "bear", name: "Bear Logo", url: "https://en.ephoto360.com/free-bear-logo-maker-online-673.html" }
];

for (const cmdData of logoCommands) {
    cmd({
        pattern: cmdData.pattern,
        desc: `Create a ${cmdData.name} text effect logo`,
        category: "logo",
        react: "🎨",
        filename: __filename
    }, async (conn, mek, m, { from, args, reply, prefix }) => {
        try {
            if (!args.length) {
                return reply(
                    `╔════════════════════════╗\n` +
                    `║   🎨 FATIMA-MD LOGO    🎨   \n` +
                    `╚════════════════════════╝\n\n` +
                    `❌ *Kripya text ya naam dein!*\n\n` +
                    `> 📌 *Example:* \`${prefix}${cmdData.pattern} Fatima\`\n` +
                    `> ⚡ *Version:* \`12.00\``
                );
            }
            
            const name = args.join(" ");
            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

            const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=${encodeURIComponent(cmdData.url)}&name=${encodeURIComponent(name)}`;
            const result = await fetchJson(apiUrl);

            if (!result?.result?.download_url) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
                return reply("❌ *Logo generate karne mein nakami hui! Dobara koshish karein.*");
            }

            const captionBox = `
╔════════════════════════╗
║   🎨 FATIMA-MD LOGO    🎨   \n` +
            `╚════════════════════════╝\n` +
            ` 🖋️ *Style:* \`${cmdData.name}\`\n` +
            ` 🔤 *Text:* \`${name}\`\n` +
            ` 🚀 *Status:* \`Successfully Created\`\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `> ⚡ *Version:* \`12.00\`\n` +
            `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

            await conn.sendMessage(from, {
                image: { url: result.result.download_url },
                caption: captionBox
            }, { quoted: mek });

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

        } catch (e) {
            console.error(`${cmdData.pattern} Error:`, e);
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply(`❌ *Error:* ${e.message}`);
        }
    });
}

cmd({
    pattern: "valorant",
    desc: "Create a Valorant YouTube banner with three text inputs",
    category: "logo",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, prefix, args, reply }) => {
    try {
        if (args.length < 3) {
            return reply(
                `╔════════════════════════╗\n` +
                `║   🎮 VALORANT BANNER   🎮   \n` +
                `╚════════════════════════╝\n\n` +
                `❌ *Kripya 3 text inputs dein!*\n\n` +
                `> 📌 *Example:* \`${prefix}valorant Fatima MD Pro\`\n` +
                `> ⚡ *Version:* \`12.00\``
            );
        }

        const text1 = args[0];
        const text2 = args[1];
        const text3 = args.slice(2).join(" ");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const apiUrl = `https://api.nexoracle.com/ephoto360/valorant-youtube-banner?apikey=MepwBcqIM0jYN0okD&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&text3=${encodeURIComponent(text3)}`;
        const buffer = await getBuffer(apiUrl);

        const bannerCaption = `
╔════════════════════════╗
║   🎮 VALORANT BANNER   🎮   \n` +
        `╚════════════════════════╝\n` +
        ` 🔤 *T1:* \`${text1}\`\n` +
        ` 🔤 *T2:* \`${text2}\`\n` +
        ` 🔤 *T3:* \`${text3}\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `> ⚡ *Version:* \`12.00\`\n` +
        `> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`.trim();

        await conn.sendMessage(from, {
            image: buffer, 
            caption: bannerCaption
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error("Valorant Banner Error:", e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply(`❌ *Error:* ${e.message}`);
    }
});
