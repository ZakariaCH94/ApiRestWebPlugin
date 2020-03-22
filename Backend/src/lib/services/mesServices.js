const multer = require('multer');
verifieToken=(req,resp,next)=> {
    const beararHeader=req.headers["authorization"];
    if (typeof beararHeader !== 'undefined') {
        const baerar=beararHeader.split(" ");
        const beararToken=baerar[1];
        req.token=beararToken;
        next();
    }
    else {
        resp.json({message: "you are not authorized to make this request"});
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toDateString()+new Date().getMilliseconds()+file.originalname);
    }
});

const upload = multer({storage:storage});

module.exports = {
    verifieToken,
    upload

};
