module.exports = {
    password: 'root',
    database: 'tgbot',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    get uri() {
        return `mongodb://root:${this.password}@cluster0-shard-00-00.bszr1.mongodb.net:27017,cluster0-shard-00-01.bszr1.mongodb.net:27017,cluster0-shard-00-02.bszr1.mongodb.net:27017/${this.database }?ssl=true&replicaSet=atlas-vm1dhv-shard-0&authSource=admin&retryWrites=true&w=majority`
    }
}