const config = require('../config');
const {
    cmd,
    commands
} = require('../command')
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions')

var N_FOUND = "*I couldn't find anything :(*"

function formatCategories(categories) {
    if (!Array.isArray(categories)) {
        throw new Error("Input must be an array");
    }
    return categories.join(", ");
}

cmd({
        pattern: "cinesubs",
        filename: __filename
    },
    async (conn, mek, m, {
        from,
        prefix,
        l,
        quoted,
        body,
        isCmd,
        command,
        args,
        q,
        isGroup,
        sender,
        senderNumber,
        botNumber2,
        botNumber,
        pushname,
        isMe,
        isOwner,
        groupMetadata,
        groupName,
        participants,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        reply
    }) => {
        try {

            let data1 = await axios.get("https://movie-api-main.vercel.app/private/sit1/sc1?text=" + q + "&apikey=private999apikey")
            let data = data1.data.result.data
            if (data.length < 1) return await conn.sendMessage(from, {
                text: N_FOUND
            }, {
                quoted: mek
            })
            var srh = [];
            for (var i = 0; i < data.length; i++) {
                srh.push({
                    title: data[i].title,
                    description: data[i].description,
                    rowId: prefix + 'getcine ' + data[i].link
                });
            }

            const sections = [{
                title: "_[Results from cinesubs]_",
                rows: srh
            }]
            const listMessage = {
                text: `Total movies: ${data.length}\n\nQuery: ${q}`,
                footer: config.FOOTER,
                title: '*Cinesubs Movie Downloader.*',
                buttonText: '*🔢 Reply below number*',
                sections
            }
            await conn.listMessage(from, listMessage, mek)
        } catch (e) {
            reply('*ERROR !!*')
            l(e)
        }
    })

cmd({
        pattern: "getcine",
        filename: __filename
    },
    async (conn, mek, m, {
        from,
        prefix,
        l,
        quoted,
        body,
        isCmd,
        command,
        args,
        q,
        isGroup,
        sender,
        senderNumber,
        botNumber2,
        botNumber,
        pushname,
        isMe,
        isOwner,
        groupMetadata,
        groupName,
        participants,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        reply
    }) => {
        try {

            let data1 = await axios.get("https://movie-api-main.vercel.app/private/sit1/sc2?url=" + q + "&apikey=private999apikey")
            let data = data1.data.result.data
            if (data.length < 1) return await conn.sendMessage(from, {
                text: N_FOUND
            }, {
                quoted: mek
            })
            var srh = [];
            for (var i = 0; i < data.dl_links.length; i++) {
                if (!data[i].dl_links.size.split(" ")[0] > 2) {
                    srh.push({
                        title: data[i].dl_links.quality,
                        description: data[i].dl_links.size,
                        rowId: prefix + 'cinedl ' + data[i].dl_links.link + '@@' + data[i].title
                    });
                }
            }

            const sections = [{
                title: "_[Results from cinesubs]_",
                rows: srh
            }]
            let cat = formatCategories(data.categories);
            const listMessage = {
                text: `Title: ${data.title}\nDate: ${data.date}\nCountry: ${data.country}\nDuration: ${data.duration}\nSize: ${data.dl_links.size}\n\nCategories: ${cat}\n\nImdbRate: ${data.imdbRate}`,
                footer: config.FOOTER,
                title: '*Cinesubs Movie Downloader.*',
                buttonText: '*🔢 Reply below number*',
                sections
            }
            await conn.listMessage(from, listMessage, mek)
        } catch (e) {
            reply('*ERROR !!*')
            l(e)
        }
    })

cmd({
        pattern: "getcine",
        filename: __filename
    },
    async (conn, mek, m, {
        from,
        prefix,
        l,
        quoted,
        body,
        isCmd,
        command,
        args,
        q,
        isGroup,
        sender,
        senderNumber,
        botNumber2,
        botNumber,
        pushname,
        isMe,
        isOwner,
        groupMetadata,
        groupName,
        participants,
        groupAdmins,
        isBotAdmins,
        isAdmins,
        reply
    }) => {
        try {

            let data1 = await axios.get("https://movie-api-main.vercel.app/private/sit1/sc5?url=" + q + "&apikey=private999apikey")
            let data = data1.data.result
            if (data.gdrive) {
                let res = await fg.GDriveDl(dl_link)
                const f_name = q.split("@@")[1] || res.fileName
                var ext = ''

                if (res.mimetype == "video/mkv") {
                    ext = "mkv"
                } else {
                    ext = "mp4"
                }

                const mvdoc = await conn.sendMessage(from, {
                    document: {
                        url: res.downloadUrl
                    },
                    fileName: `${f_name}.` + ext,
                    mimetype: res.mimetype,
                    caption: ''
                })
            } else {
                await conn.sendMessage(from, {
                    document: {
                        url: data.direct
                    },
                    mimetype: "video/mp4",
                    fileName: `${q.split("@@")[1]}.mp4`,
                    caption: ''
                });

            }
        } catch (e) {
            reply('*ERROR !!*')
            l(e)
        }
    })