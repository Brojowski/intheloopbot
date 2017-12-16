
module.exports = function(socket, reddit) {
    const tokenizer = require('./tokenizer')(reddit);
    const topicSearch = require('./topicSearch')(reddit); 

    socket.on('subreddit_name_update', (subRedditName) => {
        console.log('subreddit_name_update: ' + subRedditName);

        tokenizer.findTopWords(subRedditName, (words, freq) => {
            socket.emit('summarize_subreddit', {
                topics: words,
                frequency: freq
            })
        });
    });

    socket.on('topic_search', (topic) => {
        console.log('topic_search: ' + topic);
        topicSearch.searchTopic(topic, (subredditHeatmap) => {
            socket.emit('topic_activity_by_subreddit', subredditHeatmap);
        });
    });
}