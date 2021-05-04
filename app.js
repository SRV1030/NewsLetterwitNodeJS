const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const { send } = require("process");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));//name of static folder

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
app.post("/",(req,res)=>{
    const fName=req.body.firstName;
    const lName=req.body.lastName;
    const email=req.body.email;
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    const jsonData= JSON.stringify(data);
    const url="https://us1.api.mailchimp.com/3.0/lists/aab8050823";
    const options={
        method: "POST",
        auth: "me:081d4e99736249b601e4092fb9786134-us1"//username:password
    }
    const request= https.request(url,options,function(response){//this request the server of api to let us write using our method psost
        if(response.statusCode===200) res.sendFile(__dirname+"/success.html");
        else res.sendFile(__dirname+"/failure.html");
        response.on("data",function(data1){
            console.log(JSON.parse(data1));
        })
    });    
    request.write(jsonData);
    request.end();

});
app.post("/failure",(req,res)=>{
    res.redirect("/");

})
app.listen(process.env.PORT || 3000,()=>{
    console.log("localhost:3000");
});
// 081d4e99736249b601e4092fb9786134-us1
//aab8050823 //list key from audience /managae audience in mailchimp