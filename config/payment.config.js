module.exports = {
    tokens: {
        //410694247:TEST:6d7d63eb-5aaa-49a8-964a-352dd825c6c4
        tranzzo: '410694247:TEST:6f0edfb0-6578-46ed-9742-1270b96acd66'
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
