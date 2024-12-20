import __dirname from "./index.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        let folder = `${__dirname}/../public/`;
        switch (req.baseUrl) {
            case "/api/users":
                folder = `${folder}/documents`
                break;
            case "/api/pets":
                folder = `${folder}/pets`
                break;
            default:
                folder = `${folder}/img`
                break;
        }
        cb(null,folder)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;