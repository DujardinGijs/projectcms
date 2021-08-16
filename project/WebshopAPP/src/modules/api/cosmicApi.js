const Cosmic = require('cosmicjs');

class CosmicApi {
    api = Cosmic();
    bucket = this.api.bucket({
        slug: 'headlesscms-production',
        read_key: 'A5UgOI91Ur1cnUG0dLIw24DTeWgC4Sw9fNOHLZhWBUrXR4QCZ3',
        write_key: 'xHOtNbkDtoyofUwE95hT2Beq3036VscWoystkW7hVTZY60buPr'
    });
    async get(query) {
        return await this.bucket.getObjects(query).catch(console.log);
    }
    async add(query) {
        return await this.bucket.addObject(query).catch(console.log);
    }
}
module.exports = CosmicApi;