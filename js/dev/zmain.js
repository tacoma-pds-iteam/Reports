/* zmain.js initializes socket connection events and controller for the report data */
class Main {
  constructor(socket) {
    socket.on('connect', () => {
        console.log('Connected to Server!');
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from Server!');
    });
    socket.on('report-data', (d) => {
      this.controller = new Controller(d);
    });
  }
}
