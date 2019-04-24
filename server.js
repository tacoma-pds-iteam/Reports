/******************************************
Filename: Server.js
Description: This file controls the server connections for the reports application. This file also connects the MySQL database and runs all SQL queries to DB for client. 
*******************************************/
if(process.argv[2] == null) {
  console.log('Config file not included. Exiting...');
  return;
}
/* required node packages */
const fs = require('fs');
const mysql = require('mysql');
var server1 = require('diet');

const configs = JSON.parse(fs.readFileSync(process.argv[2])); //  grab JSON config file

const _database = getParameter('db-name');//db name
const PORT1 = parseInt(getParameter('port')); // open port
var currentUsers1 = 0;

/* MySQL Database connection startup */
if(!_database) {
  console.log('database parameter not found. Re-enter required parameters...')
  return;
}

const con1 = mysql.createConnection({ //create db connection
  host: getParameter('db-host', 'localhost'),
  user: getParameter('db-user', 'root'),
  password: getParameter('db-pass', 'password'),
  database: _database,
  multipleStatements: true
});

/* connect to db */
con1.connect((err) => {
  if(err){
    console.log(PORT1 + ':' +'Error connecting to Reports Database. Error: ' + err);
    return;
  }
  console.log(PORT1 + ':' +`Connection to ${_database} database established`);
});


var app1 = server1(); // startup diet server

/* server listener */
app1.listen(getParameter("url"), function() {
    console.log(PORT1 + ':' +'listening on port %s..', PORT1);
    console.log(PORT1 + ':' +'directory: ' + __dirname);
});

/* initialize server functionality for sockets and custom classes */
var static = require('diet-static')({path: app1.path + '\\client\\'}); //package to grab static files to client as one folder
app1.footer(static); // set static files to server

var io1 = require('socket.io').listen(app1.server, {wsEngine: 'ws'}); // initialize socket connections

/* serve index file */
app1.get('/', (res) => {
    res.sendFile(__dirname + '/index.html');
});

 /* client connection event */
io1.on('connection', function(socket) {
    currentUsers1++; // increment users
    console.log(PORT1 + ':' +`${currentUsers1} user(s) connected! (ip: ${socket.request.connection.remoteAddress})`);
    sendReports(socket,con1); // query reports

    /* disconnect user */
    socket.on('disconnect', function(d) {
        console.log(PORT1 + ':' +"user disconnected! Bye Bye!");
        currentUsers1--; //decrement
    });

    /* create new report in database */
    socket.on('create-report', function(d) {
      createReport(socket, con1, d);
    });

    /* update existing report in database */
    socket.on('update-report', function(d) {
      console.log(PORT1 + ':' + 'Updating report...');
      updateReport(socket, con1, d);
    });

    /* Deprecate reports with given name */
    socket.on('deprecate-reports', function(d) {
      console.log(PORT1 + ':' + 'Deprecating Reports');
      deprecatedReports(socket, con1, d);
    });
});

/* Function queries reports table and sends data to client */
sendReports = (s,con) => {
  con.query(`SELECT * FROM report`, (err, rows) => {
    if(err){
      console.log(PORT1 + ':' +err);
      return err;
    }
    s.emit('report-data', rows);
  });
};

/* Function runs insert query to reports table */
createReport = (s,con, data) => {
  let query = `INSERT INTO report `;
  let keyStr = [], valStr = [];
  // generate SQL keys and values strings
  for(let i in data){
    keyStr.push(i);
    valStr.push("'" + data[i] + "'");
  }
  keyStr.join(",");
  valStr.join(",");
  con.query(`INSERT INTO report (${keyStr}) VALUES (${valStr})`, (err, rows) => {
    if(err){
      console.log(PORT1 + ':' +err);
      return err;
    }
    sendReports(s,con); // resend full query again
  });
};

/* Function creates sql query for updating a specific entry in reports table */
updateReport = (s,con, data) => {
  let q = `UPDATE report SET `;
  let queryCondition = ` WHERE `;
  let condStr = [], valStr = [];
  for(let i in data){
    if(i == "report_name" || i == "version"){ // add to where clause
      condStr.push(`${i} = "${data[i]}"`);
    } else {
      valStr.push(`${i} = "${data[i]}"`); // set values
    }
  }
  condStr = condStr.join(' AND '); //generate str from array
  valStr = valStr.join(",");
  q += valStr + queryCondition + condStr; // append to make query
  con.query(q, (err, rows) => {
    if(err){
      console.log(PORT1 + ':' +err);
      return err;
    }
    sendReports(s,con); // resend reports
  });
};

/* function sets a given entry in table to deprecated */
deprecatedReports = (s, con, data) => {
  let query = `UPDATE report SET deprecated = "Y" WHERE report_name = "${data}"`;

  con.query(query, (err, rows) => {
    if(err) {
      console.log(PORT1 + ':' +err);
      return err;
    }
    sendReports(s,con); // resend
  });
};

/* Function searches for value from configs global based on given key, returns default if not found */
function getParameter(key, def){
  if(typeof configs[key] != "undefined") return configs[key];
  return def;
}
