const commonInsignificantWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on',
    'at', 'to', 'from', 'by', 'we', 'of', 'as', 'do', 'up', 'if', 'i', 'you', 'are', 'they',
    'it', 'our', 'be', 'is', 'in', 'my', 'with', 'have', 'has', 'no', 'how', 'was', 'very',
    'this', 'he', 'that', 'it\'s' ]

module.exports = function(reddit) {
    return {
        findTopWords: (subreddit, callback) => {
            var tokens = {};
            reddit.getSubreddit(subreddit)
                .getHot({limit: 100})
                .map(data => data.title)
                .then(data => {
                    
                    data.forEach(title => {
                        var words = title.split(' ');
                        words.forEach(element => {
                            element = element.toLowerCase();
                            tokens[element] = tokens[element] ? tokens[element]+1 : 1;
                        });
                    });

                    var objs = Object.keys(tokens).map(toke => {
                        if (tokens[toke] > 1) {
                            return {
                                token: toke,
                                count: tokens[toke]
                            }
                        } else {
                            return false;
                        }
                    })
                    .filter(obj => obj)
                    .filter(obj => obj.token.length > 1)
                    .filter(obj => commonInsignificantWords.indexOf(obj.token) === -1)
                    .sort( (a,b) => b.count - a.count)
                    .slice(0, 20);
                    
                    var words = objs.map(obj => obj.token);
                    var counts = objs.map(obj => obj.count);
                    
                    if (callback) callback(words, counts);
                    else console.log(objs);
                });
        }
    }
}