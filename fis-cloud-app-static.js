'use strict';

function getAppDir(appName) {
    var app = 'fis-cloud-app-' + appName,
        path = fis.util.realpath(require.resolve(app));
    return path.substr(0, path.lastIndexOf('/') + 1);
}

module.exports = function(req, res){
    var pathName = req.path;
    if(pathName.substr(0, 1) === '/'){
        pathName = pathName.substr(1);
    }
    var urlSplit =  pathName.split('/'),
        appDir = getAppDir(urlSplit.splice(1,1)[0]), //拿出数组的第二项即为app的name
        filePath = appDir + urlSplit.join('/');      //默认查找app下面的static目录
    if(fis.util.isFile(filePath)){
        var ext = fis.util.pathinfo(filePath).ext,
            contentType = fis.util.getMimeType(ext),
            content = fis.util.read(filePath);
        res.set('Connection', 'close'); //请求应答之后关闭TCP连接，并监听TCP连接关闭事件杀死子进程
        res.type(contentType);
        res.send(content);
    }else{
        res.send(404);
    }
};