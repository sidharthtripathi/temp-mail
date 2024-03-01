import {SMTPServer} from 'smtp-server'
import {simpleParser} from 'mailparser'
import fs from 'fs/promises'
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

server.listen(25,()=>{
    console.log("SMTP server listening for incoming mails")
})

