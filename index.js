import express from "express";
import bodyparser from "body-parser";
import pg from "pg";

const app= express();
const port=4000;

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"Tannisa",
    port:5432,
});


let items = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
  ];

  db.connect();

app.get("/",async (req,res)=>{
    try{
        const result =await db.query("SELECT * FROM items ORDER BY id ASC ");
        items=result.rows;
        res.render("index.ejs",{
            listTitle:"Today",
            listItems:items,
        });
    }
    catch(err){
        console.log(err);
    }
});


app.post("/add",async (req,res)=>{
    const item=req.body.newItem;
    try{
        await db.query("INSERT INTO items(title) VALUES($1)",
        [item]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});


app.post("/edit", async(req,res)=>{
    const item=req.body.updatedItemTitle;
    const id=req.body.updatedItemId;
    try{
        await db.query("UPDATE items SET title =($1) WHERE id=($2)",[item,id]);
        res.redirect("/");

    }
    catch(err){
        console.log(err);
    }
});


app.post("/delete",async (req,res)=>{
    const id= req.body.deleteItemId;
    try{
        await db.query("DELETE FROM items WHERE id=($1)",[id]);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
