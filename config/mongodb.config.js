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
        return `mongodb+srv://root:${this.password}@cluster0.bszr1.mongodb.net/${this.database}?retryWrites=true&w=majority`
    }
}