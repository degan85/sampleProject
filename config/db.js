module.exports = function () {
    var db_config = require('./db-config.json');
    var OrientDB = require('orientjs');
    var server = OrientDB(db_config);
    var db = server.use(db_config.db);

    return db;
};

