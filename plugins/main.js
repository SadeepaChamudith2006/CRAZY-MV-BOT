const config = require('../config')
const fs = require('fs')
const { cmd, commands } = require('../command')

cmd({
        pattern: "restart",
        desc: "To restart bot",
        category: "main",
        filename: __filename
    },
  async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

    try{    const { exec } = require("child_process")
            reply('Restarting')
            exec('pm2 restart all')
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
            pattern: "join",
            desc: "joins group by link",
            category: "main",
            use: '<group link.>',
        },
       async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

    try{  if (!q) return reply(`Please give me Query`);
            if (!q.split(" ")[0] && !q.split(" ")[0].includes("whatsapp.com"))
               reply("Link Invalid, Please Send a valid whatsapp Group Link!");
            let result = q.split(" ")[0].split("https://chat.whatsapp.com/")[1];
            await conn.groupAcceptInvite(result)
                .then((res) => reply("🟩Joined Group"))
                .catch((err) => reply("Error in Joining Group"));
} catch (e) {
reply('*Error !!*')
l(e)
}
})

cmd({
            pattern: "promote",
            desc: "Provides admin role to replied/quoted user",
            category: "main",
            filename: __filename,
            use: '<quote|reply|number>',
        },
              async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

                 try {     if (!m.isGroup) return reply(`only for groups`);
            if (!isBotAdmins) return reply(`I can't do that. give group admin`);

                let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? citel.quoted.sender : q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
                if (!users) return;
                await conn.groupParticipantsUpdate(m.chat, [users], "promote");
} catch (e) {
reply('*Error !!*')
l(e)
}
})

cmd({
  pattern: "kick",
  alias: [".."],
  desc: "Kicks replied/quoted user from group.",
  category: "main",
  filename: __filename,
  use: '<quote|reply|number>',
},           
    async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

   try {
       if (!m.isGroup) return reply(`only for groups`);
  if (!isBotAdmins) return reply(`I can't do that. give group admin`);


    const user = m.quoted.sender;
    if (!user) return reply(`*Please give me a user to kick ❗*`);
    await conn.groupParticipantsUpdate(m.chat, [user], "remove");
   reply(`${user} *has been kicked out of the group!*`);
  } catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
            pattern: "hidetag",
            alias: ["htag"],
            desc: "Tags everyperson of group without mentioning their numbers",
            category: "group",
            filename: __filename,
            use: '<text>',
        },
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

   try { if (!isVihanga) return reply(`only for owner`);
            conn.sendMessage(m.chat, {
                text: q ? q : "",
                mentions: participants.map((a) => a.id),
            });
     } catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
            pattern: "add",
            desc: "Add that person in group",
            fromMe: true,
            category: "group",
            filename: __filename,
            use: '<number>',
        },
         async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname,isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

   try {
      
       if (!m.isGroup) return reply(`only for groups`);
            if (!q) return reply("Please provide me number.");
        
            let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            await conn.groupParticipantsUpdate(m.chat, [users], "add");
} catch (e) {
reply('*Error !!*')
l(e)
}
})
        
    
cmd({
    pattern: "ping",
    react: "📟",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isVihanga, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {

    try{
var inital = new Date().getTime();
let ping = await conn.sendMessage(from , { text: '```Pinging!!!```'  }, { quoted: mek} )
var final = new Date().getTime();
await conn.sendMessage(from, { delete: ping.key })
return await conn.sendMessage(from , { text: '*Pong*\n *' + (final - inital) + ' ms* '  }, { quoted: mek} )
} catch (e) {
reply('*Error !!*')
l(e)
}
})
