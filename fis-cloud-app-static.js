var fis = require('fis-cloud-kernal'),
    url = require('url'),
    mime = require('mime'),
    fs = require('fs');

function getAppDir(appname) {
    var app = 'fis-cloud-app-' + appname;
    var path = fis.util.realpath(require.resolve(app));
    var appDir = path.substr(0, path.lastIndexOf('/') + 1);
    return appDir;
}

module.exports = function(req, res){
    var pathname = url.parse(req.url).pathname;
    if(pathname.substr(0, 1) === '/'){
        pathname = pathname.substr(1);
    }
    var urlSplit =  pathname.split('/');
    urlSplit.splice(0, 1);
    var appDir = getAppDir(urlSplit.shift());
    var filepath = appDir + urlSplit.join('/');
    if(fis.util.isFile(filepath)){
        var contentType = mime.lookup(filepath),
            content = fs.readFileSync(filepath);
        res.type(contentType);
        res.send(content);
    }else{
        res.send(404);
    }
}