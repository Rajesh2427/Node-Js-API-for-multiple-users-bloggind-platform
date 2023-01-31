const multer = require('multer');

const MIME_TYPE_MAP ={
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg',
}
const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination : (req, file, cb) =>{
    cb(null, 'upload/images')
        },
        filename: (req, file, cb)=>{
            const extension = MIME_TYPE_MAP[file.mimetype]
            cb(null, `${new Date().now}_${file.originalname}.${extension}`)

        }
    }),
    fileFilter: (req, file, cb)=>{
        const isvalid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isvalid ? null : new Error('Invalid file')
        cb(error, isvalid)
    }
})

module.exports = fileUpload