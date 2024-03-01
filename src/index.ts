import {SMTPServer} from 'smtp-server'
import {simpleParser} from 'mailparser'
const server = new SMTPServer({
    onData(stream,session,callback){
        simpleParser(stream,(err,mailParsed)=>{
            if(err) console.log(err);
            console.log("FROM: ", mailParsed.from?.text);
            console.log("TO: ", mailParsed.to);
            console.log("BODY: ",mailParsed.text)
            stream.on("end",callback)
        })
    },
    disabledCommands : ["AUTH"]
})

server.listen(25,()=>{
    console.log("SMTP server listening for incoming mails")
})