const express= require("express");
const bodyParser= require ("body-parser"); 
const request = require("request");
const { urlencoded } = require("body-parser");
const https = require("https")

const app=express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function (req,res) { 
    res.sendFile(__dirname+"/signup.html")
})



app.post("/",function(req,res)
{
    const firstName= req.body.fname ;
    const lastName= req.body.lname;
    const email= req.body.email;

    const Data = { members: [
        {
            email_address : email,
            status : "subscribed",
            merge_fields :{
                FNAME : firstName,
                LNAME : lastName 
            }  
        }
    ] }

    const jsonData = JSON.stringify(Data)
    const url = "https://us21.api.mailchimp.com/3.0/lists/7de04142e1" 
    const options = 
        {
            method : "POST",
            auth: "nandha1:2d0eefe8c0ae7182fcd0cda6f46af327-us21"
        }
    

    const request= https.request(url,options,function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }

            response.on("data",function (data) {

                console.log(JSON.parse(data)); 

            })
    }) 

    request.write(jsonData)
    request.end();

    
}
)

// apiKey
// 2d0eefe8c0ae7182fcd0cda6f46af327-us21

// ListId
// 7de04142e1

app.post("/failure",function (req,res) {
    res.redirect("/")
})

const port= process.env.PORT || 3000;

app.listen(port,function () {
    console.log('Server started running on ${port}');
})
