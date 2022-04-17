const app = require('express')();
const PORT = 3001;
const bp = require('body-parser')
const read = require('./dbRequest/read');
const write = require('./dbRequest/write');
const deletion = require("./dbRequest/delete");
const cors = require('cors');
const multer = require('multer')
const { uploadFile} = require('./S3Request/s3')

app.use(bp.json())

app.use(cors({origin: 'http://localhost:3000'}))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })



app.get('/pets', async (req,res) => {
    const data = await read.scanTable();
    console.log(data);
    res.status(200).send({
        data
    })
})

app.post('/pets',upload.single('image'),async (req,res) => {
    const file = req.file
    const result = await uploadFile(file)
    if(result){
        res.status(200).json({
            message: "Resim kaydedildi"
        })
    }
})

app.post('/pets/data',async (req,res) => {
   
    const save = write.save(req.body)
    console.log(save)
    if(save){
        res.status(200).json({
            message: "Veri kaydedildi"
        })
    }
})

app.put('/pets/:id',(req,res) => {
    const pets = req.body;
    const {id} = req.params;
    pets.pet_id = id;
    const save = write.save(req.body);
    
    if(save){
        res.status(200).json({
            message: "Veri güncellendi"
        })
    }
})

app.delete('/pets/:id', (req,res) => {
    const {id} = req.params;
    const remove = deletion.remove(id);
    if(remove){
        res.status(200).json({
            message: "Veri silindi"
        })
    }
})

app.listen(
    PORT,
    () => console.log("Çalıştı.")
);