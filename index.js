const express = require('express');
const fs = require('fs');
const path = require('path')

const app = express();

const PORT = process.env.PORT || 8080;

let idCounter = 1;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get("/api/notes", (req,res) => {

    const str = fs.readFileSync(dbPath, function(err, data) {
        if (err) throw err;
        console.log(data)
    })
    return res.json(JSON.parse(str));

})

app.post("/api/notes", (req,res) => {
    idCounter++;
    const saveTo = {
        title: req.body.title,
        text: req.body.text,
        id: idCounter
    }
    console.log(idCounter)
    fs.readFile("db/db.json", "utf-8", (err,data)=> {
        if(err) {
            return res.sendStatus(500);
        }
        let readFrom = JSON.parse(data);
        readFrom.push(saveTo);
        console.log(readFrom);

        fs.writeFile("db/db.json", JSON.stringify(readFrom), (err) => {
            if(err) throw err;
            console.log("Done")
            // res.json(readFrom)
        })
    })

    return res.json(saveTo)
})

app.delete("/api/notes/:id", function(req,res) {

    const array = JSON.parse (
        fs.readFileSync("/db/db.json", function(err,data) {
            if (err) throw err;
        })
    )

    const deleteID = array.findIndex(i => i.id == req.params.id);
    array.splice(deleteID, 1);

    fs.writeFileSync("/db/db.json", JSON.stringify(array), function(err) {
        if (err) throw err;
    })

    return res.send(true);
})

app.listen(PORT, function() {
    console.log(`You're running on PORT ${PORT}`);
})