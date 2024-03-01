import {SMTPServer} from 'smtp-server'
import {simpleParser} from 'mailparser'
import http from 'http'
import fs from 'fs/promises'
import {createReadStream} from 'fs'
import path from 'path'
const server = new SMTPServer({
    onData(stream,session,callback){
        simpleParser(stream,(err,mailParsed)=>{
            if(err) console.log(err);
            const email = {
                FROM : mailParsed.from?.text,
                TO : mailParsed.to,
                BODY : mailParsed.text
            }
            console.log(email)
            fs.readFile(path.join(__dirname,"..",'mailsDB.json')).then(content=>{
   
                let mailsDB : {mails : typeof email[]} = (JSON.parse(content.toString()))
                mailsDB.mails.push(email)
                fs.writeFile(path.join(__dirname,"..","mailsDB.json"),JSON.stringify(mailsDB))
            })
            stream.on("end",callback)
        })
    },
    disabledCommands : ["AUTH"]
})
const httpServer = http.createServer(async(req,res)=>{
    const mailsDBReadStream = createReadStream(path.join(__dirname,"..","mailsDB.json"))
    mailsDBReadStream.pipe(res)
})

httpServer.listen(3000,()=>{
    console.log("HTTP server up...")
})
server.listen(2500,()=>{
    console.log("SMTP server listening for incoming mails")
})

