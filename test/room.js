/**
 * User: gamaroff
 * Date: 2012/08/22
 * Time: 11:19 AM
 */
var roomName = '';

// get all channel list
var rooms = socket.manager.rooms;
var roomClients = socket.manager.roomClients;

for (var channel in rooms) {                // slash + name = /name
    if (roomClients[socket.id][channel] == true) {
        roomName = channel;
    }
}