let express = require('express');
let mongodb=require('mongodb');
let sanitizeHTML=require('sanitize-html');
let app=express();
let db;
let port=process.env.PORT;
if(port==null || port=="")
{
    port=3000;
}
app.use(passwordProtected);
app.use(express.static('public'));
let connectionString="mongodb+srv://archy26:afterearth!@@cluster0-hzrnj.mongodb.net/TodoApp?retryWrites=true&w=majority";
mongodb.connect(connectionString,{useNewUrlParser:true},(err,client)=>{
db=client.db();

app.listen(port);
})
app.use(express.json());
app.use(express.urlencoded({extended: false}));
function passwordProtected(req,res,next){
res.set("www-Authenticate","Basic realm=Simple to-do app")
//console.log(req.headers.authorization);
if(req.headers.authorization=="Basic ZmF0aGVyOm1l")
{
next();
}
else{
    res.status(401).send("Authentication required");
}
}


app.get('/',(req,res)=>{
    db.collection('items').find().toArray((err,items)=>{
        res.send(`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form id="create_form" action="/create_item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create_field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
            
            <ul id="list_item" class="list-group pb-5">
            </ul>
            
          </div>
          <script>
           
          let items=${JSON.stringify(items)};

          </script>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="/browser.js"></script>
        </body>
        </html>`);
    });
    
})
app.post('/create_item',(req,res)=>{
    let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}});
    db.collection('items').insertOne({text:safeText},(err,info)=>{
        //console.log(info.ops[0]);
        res.json(info.ops[0]);
    })
})
app.post('/update_item',(req,res)=>{
    let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}});
   db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:safeText}},()=>{
       res.send("success");
   }) 
})
app.post('/delete_item',(req,res)=>{
    db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},()=>{
        res.send("success");
    }) 
 })

