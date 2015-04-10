module.exports = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                returnURL: "http://localhost:4000/harvardId",
                realmURL: 'http://localhost:4000/'
            };

        case 'production':
            return {
                returnURL: "http://www.harvardgrill.com/harvardId",
                realmURL: "http://www.harvardgrill.com"
            };

        default:
            return {
                returnURL: "http://www.harvardgrill.com/harvardId",
                realmURL: "http://www.harvardgrill.com"
            };
    }
};