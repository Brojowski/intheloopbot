module.exports = function(reddit) {

    var subredditCounts = {};
    var commentsDone = false;
    var submissionsDone = false;

    var collapseToSubreddits = (data) => {
        data.forEach(element => {
            element = 'r/' + element;
            subredditCounts[element] = subredditCounts[element] ? subredditCounts[element]+1 : 1;
        });
    }

    var callbacker = (callback) => {
        if (commentsDone && submissionsDone)
        {
            var objs = Object.keys(subredditCounts).map(subreddit => {
                return {
                    subreddit: subreddit,
                    hits: subredditCounts[subreddit]
                }
            })
            .sort( (a,b) => b.hits - a.hits)
            .slice(0, 20);
            
            callback({
                subreddits: objs.map(data => data.subreddit),
                hits: objs.map(data => data.hits)
            });
        }
    }

    return {
        getUserData: (username, callback) => {
            reddit.getUser(username)
                .getComments({limit:100})
                .map(data => data.subreddit.display_name)
                .then(data => {
                    collapseToSubreddits(data);
                    commentsDone = true;
                    callbacker(callback);
                });

            reddit.getUser(username)
                .getSubmissions({limit: 100})
                .map(data => data.subreddit.display_name)
                .then(data => {
                    collapseToSubreddits(data);
                    submissionsDone = true;
                    callbacker(callback);
                });
            
        }
    }
};