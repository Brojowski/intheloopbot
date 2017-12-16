var snoowrap = require('snoowrap');
var server = require('http').createServer();
var socket = require('socket.io')(server);
const config = require('./config/config.js').config;

const reddit = new snoowrap(config);

//reddit.getHot().map(post => post.title).then(console.log);
reddit.getSubreddit('Dogberg').getHot().map(data => data.score).then(console.log);



