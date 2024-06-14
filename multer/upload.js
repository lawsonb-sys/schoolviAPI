const multer =require('multer');


const storage = multer.diskStorage(
    {
        destination:(req,file,cb)=>{
cb(null,'uploads/')
        },
        filename:(req,file,cb)=>{
            cb(null,`${file.originalname}`);
        }
    }
);
const storage2 = multer.diskStorage(
    {
        destination:(req,file,cb)=>{
cb(null,'uploads_2/')
        },
        filename:(req,file,cb)=>{
            cb(null,`${file.originalname}`);
        }
    }
);
const storage3 =multer.diskStorage(
    {
        destination:(req,file,cb)=>{
cb(null,'upload_3/')
        },
        filename:(req,file,cb)=>{
            cb(null,`${file.originalname}`);
        }
    }
);
const upload =multer({
    storage:storage,
    limits:{fieldSize: 1024 * 1024 * 5}
});

const upload2 =multer({
    storage:storage2,
    limits:{fieldSize: 1024 * 1024 * 5}
});

const upload3 =multer({
    storage:storage3,
    limits:{fieldSize: 1024 * 1024 * 5}
});

module.exports ={upload,upload2,upload3}