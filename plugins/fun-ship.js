import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// Helper function to generate fun commands dynamically with stylish formatting
function createFunCommand(config) {
  cmd({
    pattern: config.pattern,
    alias: config.alias || [],
    desc: config.desc,
    react: config.react,
    category: "fun",
    filename: __filename
  }, async (conn, mek, m, { from, isGroup, reply, sender }) => {
    try {
      if (!isGroup) return reply("❌ This command can only be used in groups!");

      const groupMetadata = await conn.groupMetadata(from).catch(() => null);
      if (!groupMetadata || !groupMetadata.participants) {
        return reply("❌ Failed to fetch group participants!");
      }

      const participants = groupMetadata.participants;
      const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
      
      if (eligible.length < 1) return reply("❌ No eligible participants found!");

      const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
      const userName = randomUser.id.split('@')[0];
      
      const text = `
┏━━━❖ *${config.react} ${config.title}* ❖━━━┓
┃
┃ 🎯 *Selected:* @${userName}
┃ 💫 *Status:* \`${config.subtext}\`
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> ⚡ *Version:* \`12.00\`
> 👑 *Powered by ꜰᴀᴛɪᴍᴀ-ᴍᴅ*`;

      await conn.sendMessage(
        from,
        { 
          text: text.trim(), 
          mentions: [randomUser.id],
          contextInfo: {
            mentionedJid: [randomUser.id],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363412031212190@newsletter',
              newsletterName: "FATIMA-MD",
              serverMessageId: 428
            }
          }
        },
        { quoted: mek }
      );

    } catch (error) {
      console.error(`FATIMA-MD ${config.pattern} Error:`, error);
      reply(`❌ Error: ${error.message}`);
    }
  });
}

// Define all fun commands using the generator
const funCommands = [
  { pattern: "ship", alias: ["match"], desc: "Randomly pairs the command user with another group member.", react: "❤️", title: "Match Found", subtext: "True love connection! 💖" },
  { pattern: "dad", alias: ["father", "papa", "baap"], desc: "Assigns a random dad.", react: "👨", title: "Dad Found", subtext: "Father figure alert! 🛡️" },
  { pattern: "mom", alias: ["mother", "maa", "mummy"], desc: "Assigns a random mom.", react: "👩", title: "Mom Found", subtext: "Motherly love & care! 🌸" },
  { pattern: "son", alias: ["beta"], desc: "Assigns a random son.", react: "👦", title: "Son Found", subtext: "Take care of your child! 🧒" },
  { pattern: "daughter", alias: ["beti"], desc: "Assigns a random daughter.", react: "👧", title: "Daughter Found", subtext: "Love your little girl! 🎀" },
  { pattern: "boyfriend", alias: ["bfriend", "boyfrnd"], desc: "Assigns a random boyfriend.", react: "👨‍❤️‍👨", title: "Boyfriend Found", subtext: "Time for a date! 💑" },
  { pattern: "girlfriend", alias: ["gfriend", "girlfrnd"], desc: "Assigns a random girlfriend.", react: "👩‍❤️‍👩", title: "Girlfriend Found", subtext: "Romantic match! 💕" },
  { pattern: "twin", alias: ["jodua"], desc: "Assigns a random twin.", react: "👯", title: "Twin Found", subtext: "You look exactly alike! 🎭" },
  { pattern: "partner", alias: ["jodi"], desc: "Assigns a random partner.", react: "🤝", title: "Partner Found", subtext: "Work together in sync! 🚀" },
  { pattern: "bodyguard", alias: ["rakshak", "guard"], desc: "Assigns a random bodyguard.", react: "💂", title: "Bodyguard Found", subtext: "Protected 24/7! 🛡️" },
  { pattern: "boss", alias: ["maalik", "owner"], desc: "Assigns a random boss.", react: "👔", title: "Boss Found", subtext: "Listen to your boss! 💼" },
  { pattern: "employee", alias: ["naukar", "worker"], desc: "Assigns a random employee.", react: "👷", title: "Employee Found", subtext: "Time to work hard! 🛠️" },
  { pattern: "pet", alias: ["janwar", "animal"], desc: "Assigns a random pet.", react: "🐶", title: "Pet Found", subtext: "Take good care of them! 🐾" },
  { pattern: "servant", alias: ["naukar", "chhakar"], desc: "Assigns a random servant.", react: "🧹", title: "Servant Found", subtext: "Make them clean up! 🧽" },
  { pattern: "idol", alias: ["hero", "star"], desc: "Assigns a random idol.", react: "🌟", title: "Idol Found", subtext: "An absolute superstar! ⭐" },
  { pattern: "fan", alias: ["deewana"], desc: "Assigns a random fan.", react: "🤩", title: "Fan Found", subtext: "Your biggest admirer! 🙏" },
  { pattern: "ghost", alias: ["bhoot", "pret"], desc: "Assigns a random ghost.", react: "👻", title: "Ghost Found", subtext: "Spooky encounter! 👀" },
  { pattern: "angel", desc: "Assigns a random angel.", react: "😇", title: "Angel Found", subtext: "Watching over you! ✨" },
  { pattern: "devil", alias: ["shaitan", "rakshas"], desc: "Assigns a random devil.", react: "😈", title: "Devil Found", subtext: "Pure mischief! 🔥" },
  { pattern: "king", alias: ["raja", "badshah"], desc: "Assigns a random king.", react: "👑", title: "King Found", subtext: "Bow before the king! 🏰" },
  { pattern: "queen", alias: ["rani", "malika"], desc: "Assigns a random queen.", react: "👸", title: "Queen Found", subtext: "Bow before her majesty! 👑" },
  { pattern: "slave", alias: ["gulam", "banda"], desc: "Assigns a random slave.", react: "⛓️", title: "Slave Found", subtext: "Bound to follow orders! 🔗" },
  { pattern: "master", alias: ["maalik", "swami"], desc: "Assigns a random master.", react: "🎩", title: "Master Found", subtext: "Supreme commander! 🎭" },
  { pattern: "genius", alias: ["budhimaan", "smart"], desc: "Assigns a random genius.", react: "🧠", title: "Genius Found", subtext: "Big brain energy! 💡" },
  { pattern: "fool", alias: ["bewakoof", "stupid"], desc: "Assigns a random fool.", react: "🤡", title: "Fool Found", subtext: "Clown moment! 🎪" },
  { pattern: "rich", alias: ["amir", "crorepati"], desc: "Assigns a random rich person.", react: "💰", title: "Rich Person Found", subtext: "Filthy rich! 💵" },
  { pattern: "poor", alias: ["garib", "bechara"], desc: "Assigns a random poor person.", react: "🪙", title: "Poor Person Found", subtext: "Needs financial support! 🙏" },
  { pattern: "bhai", alias: ["brother"], desc: "Assigns a random brother.", react: "👨‍🦰", title: "Brother Found", subtext: "Jigri dost / brother! 💪" },
  { pattern: "bahan", alias: ["sister", "behen"], desc: "Assigns a random sister.", react: "👩", title: "Sister Found", subtext: "Sweet sister bond! 💖" },
  { pattern: "wife", alias: ["biwi"], desc: "Assigns a random wife.", react: "👰", title: "Wife Found", subtext: "Happily married! 💕" },
  { pattern: "husband", alias: ["shohar"], desc: "Assigns a random husband.", react: "🤵", title: "Husband Found", subtext: "Supportive partner! 💍" },
  { pattern: "chacha", desc: "Assigns a random paternal uncle.", react: "👨‍🦳", title: "Chacha Found", subtext: "Wise elder uncle! 👴" },
  { pattern: "chachi", desc: "Assigns a random paternal aunt.", react: "👵", title: "Chachi Found", subtext: "Respected aunt! 🌸" },
  { pattern: "nana", desc: "Assigns a random maternal grandfather.", react: "👴", title: "Nana Found", subtext: "Family roots! 🌳" },
  { pattern: "nani", desc: "Assigns a random maternal grandmother.", react: "👵", title: "Nani Found", subtext: "Sweet stories ahead! 📖" },
  { pattern: "mama", desc: "Assigns a random maternal uncle.", react: "🧔", title: "Mama Found", subtext: "Favorite maternal uncle! 🎁" },
  { pattern: "mami", desc: "Assigns a random maternal aunt.", react: "👩‍🦰", title: "Mami Found", subtext: "Caring aunt! ✨" },
  { pattern: "bestfriend", alias: ["bf", "bestie"], desc: "Assigns a random best friend.", react: "🤝", title: "Best Friend Found", subtext: "Partners in crime! 👫" },
  { pattern: "enemy", alias: ["dushman"], desc: "Assigns a random enemy.", react: "😠", title: "Enemy Found", subtext: "Watch your back! ⚔️" },
  { pattern: "crush", alias: ["pyaar"], desc: "Assigns a random crush.", react: "😍", title: "Crush Found", subtext: "Secret admiration! 💘" },
  { pattern: "teacher", alias: ["sir", "guru"], desc: "Assigns a random teacher.", react: "👨‍🏫", title: "Teacher Found", subtext: "Wisdom shared! 📚" },
  { pattern: "student", alias: ["chela"], desc: "Assigns a random student.", react: "🧑‍🎓", title: "Student Found", subtext: "Eager to learn! 📖" },
  { pattern: "rival", alias: ["competitor"], desc: "Assigns a random rival.", react: "⚔️", title: "Rival Found", subtext: "Fierce competition! 🏆" }
];

// Register all commands
funCommands.forEach(config => createFunCommand(config));
