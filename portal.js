
module.exports = function(socket, reddit) {
    var tokenizer = require('./tokenizer')(reddit);

    socket.on('subreddit_name_update', (subRedditName) => {
        console.log('subreddit_name_update: ' + subRedditName);

        tokenizer.findTopWords(subRedditName, (words, freq) => {
            console.log(words);
            socket.emit('summarize_subreddit', {
                topics: words,
                frequency: freq
            })
        });
    })
}