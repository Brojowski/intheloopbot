
module.exports = function(socket, reddit) {
    const tokenizer = require('./tokenizer')(reddit);
    const topicSearch = require('./topicSearch')(reddit); 
    const userSearch = require('./userInfo')(reddit);

    // search via subreddit name
    socket.on('subreddit_name_update', (subRedditName) => {
        console.log('subreddit_name_update: ' + subRedditName);

        // get most common words (recently used) in subreddit
        tokenizer.findTopWords(subRedditName, (words, freq) => {
            socket.emit('summarize_subreddit', {
                topics: words,
                frequency: freq
            })
        });

        // get top posts (within last 24 hours) of subreddit
        reddit.getSubreddit(subRedditName).getTop().map(post => post.title).then( (data) => {
            socket.emit('getTitles', data);
        });
    });

    // search via word/phrase
    socket.on('topic_search', (topic) => {
        console.log('topic_search: ' + topic);

        // displays subreddits where word/phrase is most commonly used
        topicSearch.searchTopic(topic, (subredditHeatmap) => {
            socket.emit('topic_activity_by_subreddit', subredditHeatmap);
        });

        // retrieves top posts about the word/phrase
        reddit.search({
            query: topic,
            sort: 'top'
        }).map(post => post.title)
        .then( (data) => {
            socket.emit('getTitlesByTopic', data);
        }); 
    });

    socket.on('get_user_data', (username) => {
        console.log('get_user_data: ' + username);

        userSearch.getUserData(username, data => {
            socket.emit('user_sub_data', data);
        });
    });
}