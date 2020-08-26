var smpp = require('smpp');
var server = smpp.createServer(function(session) {
    session.on('bind_transceiver', function(pdu) {
        // we pause the session to prevent further incoming pdu events,
        // untill we authorize the session with some async operation.
        session.pause();

        function checkAsyncUserPass(system_id, password, callback) {
            console.log(system_id,password)
            if (system_id === 'wavesmpp1' && password === 'wavesmp1') {
                callback(0); // no error
            } else {
                callback(1); // error
            }
        }

        checkAsyncUserPass(pdu.system_id, pdu.password, function(err) {
            if (err) {
                session.send(pdu.response({
                    command_status: smpp.ESME_RBINDFAIL
                }));
                session.close();
                return;
            }
            console.log(pdu.response())
            session.send(pdu.response());
            session.resume();
        });
    });
});

server.listen(2775);