var fs = require('fs'),
    Q = require('q'),
    path = require('path');

module.exports = {
    readFile: function(path) {
        var deferred = Q.defer();

        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                console.log('Error: ' + err);                
                return deferred.reject(err);
            }

            deferred.resolve(data);
        })

        return deferred.promise;
    },
    jsonParse: function(data) {
        var deferred = Q.defer();

        try {
            data = JSON.parse(data);
            deferred.resolve(data);
        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    },
    getDataFilePath: function(fileName, dataDirPath) {
        return path.normalize(__dirname + dataDirPath + fileName);
    },
}