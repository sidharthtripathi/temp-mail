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
                // @ts-ignore
                TO : mailParsed.to?.text,
                BODY : mailParsed.text
            }
            console.log(email)
            fs.writeFile(path.join(__dirname,"..","lastMail.json"),JSON.stringify(email))
            
            stream.on("end",callback)
        })
    },
    disabledCommands : ["AUTH"]
})
const httpServer = http.createServer(async(req,res)=>{
    const mailsDBReadStream = createReadStream(path.join(__dirname,"..","lastMail.json"))
    mailsDBReadStream.pipe(res)
    
})

httpServer.listen(80,()=>{
    console.log("HTTP server up...")
})
server.listen(25,()=>{
    console.log("SMTP server listening for incoming mails")
})

