'use_strict'

const Discord = require('discord.js')
const config = require('./config.json')

const completemsg = `T규칙과 행동 강령에 동의 해 주셔서 감사합니다! 이제 확인 된 길드원이되었습니다! \ n 원하는 역할을 자유롭게 선택하거나 자신을 소개하거나 다른 채널을 확인하세요. \ n \ n ** 귀하의 고유 토큰은 귀하가 당사의 규칙을 읽고 이해 한 서명입니다.**\n`

const shortcode = (n) => {
    const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
}

const client = new Discord.Client()

client.on('ready', () => {
    client.user.setActivity(config.playing)
    console.log(`[VERIFYBOT] Connected as ${client.user.username}#${client.user.discriminator} ${client.user.id}`)
})

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config.guild) return
    const token = shortcode(8)
    const welcomemsg = `서버에 오신 것을 환영합니다! 여기서 규칙을 찾으시기 바랍니다! \`#📢｜공지  \`채널을 확인하여 우리가 활기를 띠고 있는지 확인하세요. 목표가 비슷하다면 테이블에서 여러분을 기다리고있는 자리가 있습니다. \ n \ n 행동 강령에 동의하면 **이 DM **에 확인 문구와 함께 답장하여 동의를 확인하세요. \ n \ n \`모든 규칙을 준수 할 것에 동의합니다. 내 토큰은 $ {token}입니다. \`\ n \ n **이 메시지는 대소 문자를 구분하며 끝에 마침표를 포함하세요! ** \ n \ n 질문이 있으십니까? 서버 또는 DM을 통해 직원에게 문의하십시오.`
    console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`)
    member.send(welcomemsg)
    member.user.token = token
})

const verifymsg = '모든 규칙을 준수 할 것에 동의합니다. 내 토큰은 {token}입니다.'

client.on('message', (message) => {
    if (message.author.bot || !message.author.token || message.channel.type !== `dm`) return
    if (message.content !== (verifymsg.replace('{token}', message.author.token))) return
    message.channel.send({
        embed: {
            color: Math.floor(Math.random() * (0xFFFFFF + 1)),
            description: completemsg,
            timestamp: new Date(),
            footer: {
                text: `Verification Success`
            }
        }
    })
    client.guilds.get(config.guild).member(message.author).roles.add(config.role) // ensure this is a string in the config ("")
        .then(console.log(`TOKEN: ${message.author.token} :: Role ${config.role} added to member ${message.author.id}`))
        .catch(console.error)
})

client.on('disconnect', (event) => {
    setTimeout(() => client.destroy().then(() => client.login(config.token)), 10000)
    console.log(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`)
})

client.on('reconnecting', () => {
    console.log(`[NOTICE] ReconnectAction: Reconnecting to Discord...`)
})

client.on('error', console.error)
client.on('warn', console.warn)

process.on('unhandledRejection', (error) => {
    console.error(`Uncaught Promise Error: \n${error.stack}`)
})

process.on('uncaughtException', (err) => {
    let errmsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
    console.error(errmsg)
})

client.login(config.token)
