import {SMTPServer} from 'smtp-server'
import {simpleParser} from 'mailparser'
import http from 'http'
let lastMail = {}
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
            lastMail = email
            stream.on("end",callback)
        })
    },
    disabledCommands : ["AUTH"]
})
const httpServer = http.createServer(async(req,res)=>{
    res.end(JSON.stringify(lastMail))
    
})

httpServer.listen(80,()=>{
    console.log("HTTP server up...")
})
server.listen(25,()=>{
    console.log("SMTP server listening for incoming mails")
})

