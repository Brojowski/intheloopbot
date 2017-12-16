
module.exports = function(reddit) {
    return {
        searchTopic: (topic, callback) => {
            reddit.search({query: topic})
                .map(data => {
                    return {
                        subreddit: data.subreddit.display_name,
                    }
                })
                .then(data => {
                    var subredditHeatmap = {};

                    data.forEach(element => {
                        displayName = 'r/' + element.subreddit;
                        subredditHeatmap[displayName] = subredditHeatmap[displayName] ? subredditHeatmap[displayName]+1 : 1;
                    });
                
                    var objs = Object.keys(subredditHeatmap).map(subreddit => {
                        return {
                            subreddit: subreddit,
                            hits: subredditHeatmap[subreddit]
                        }
                    })
                    .sort( (a,b) => b.hits-a.hits )
                    .slice(0, 20);
                    
                    var subreddits = objs.map(obj => obj.subreddit);
                    var hits = objs.map(obj => obj.hits);
                    var results = {
                        subreddits: subreddits, 
                        hits: hits
                    };

                    if (callback) callback(results);
                    else console.log(results);
                });
        }
    }
}