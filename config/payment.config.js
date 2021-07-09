module.exports = {
    tokens: {
        tranzzo: '410694247:TEST:a4c88085-df1a-4ab1-b2ec-0cb66ebb1654'
    },

    points: {
        min: 1000,
        rate: [1000, 3],
        cachback: [
            [3000, 4999, .05],
            [5000, 6999, .07],
            [7000, 9999, .1],
            [10000, 19999, .15],
            [20000, Infinity, .2]
        ]
    }
}