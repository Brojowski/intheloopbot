var express = require('express');
var app = express();
var server = require('http').Server(app);
var portal = require('./portal');
var io = require('socket.io')(server);
var snoowrap = require('snoowrap');
const config = require('./config/config.js').config;

const projectRoot = __dirname;
module.exports.projectRoot = projectRoot;

const reddit = new snoowrap(config);

// get top posts from subreddit
// reddit.getSubreddit('doggos').getTop().map(post => post.title).then(console.log);

// get top posts via a search
/* reddit.search({
    query: queryTopic,
    sort: 'top'
}).map(post => post.title).then(console.log); */

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: projectRoot });
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile('./node_modules/socket.io-client/dist/socket.io.js', { root: projectRoot });
});

app.get('/chart-js/chart.js', (req, res) => {
    res.sendFile('./node_modules/chart.js/dist/Chart.js', { root : projectRoot });
});

io.on('connection', (socket) => {
    portal(socket, reddit);
});

server.listen(8080, () => console.log('Server started'));