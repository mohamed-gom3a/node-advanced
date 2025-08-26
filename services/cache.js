const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const exec = mongoose.Query.prototype.exec;
const keys = require('../config/keys');
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

//define cache chain method 
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '') ; 
    return this;
}




//override exec
mongoose.Query.prototype.exec = async function() {

    if (!this.useCache) {  
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    console.log(key);
    const cachedBlogs = await client.hget(this.hashKey, key); 
    if (cachedBlogs) {
      return  Array.isArray(JSON.parse(cachedBlogs)) ? JSON.parse(cachedBlogs).map(blog => new this.model(blog)) : new this.model(JSON.parse(cachedBlogs));
    }
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 60);
    return result;
}

const clearCache = (hashKey) => {
    client.del(JSON.stringify(hashKey));
}

module.exports = {
    clearCache
}