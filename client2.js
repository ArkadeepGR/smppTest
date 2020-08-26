const smpp = require('smpp');

const credentials={
    system_id: ' 095367',
    password: 'BUKKQE',
    system_type: '380666000600',
    address_range: '+380666000600',
    addr_ton: 1,
    addr_npi: 1
} 

const session = smpp.connect('smpp://localhost:7777')
var bound=false

session.on('connect',()=>{
    console.log("Connected Successfully to SMSC.")
    bindSession()
    })

session.on('error',()=>{console.log("Unable to connect to SMSC.")})
session.on('close',()=>{console.log("Disconnected from SMSC")
connected=false
})

const bindSession=function(){
    console.log("Binding...")
    session.bind_transceiver(credentials,(res)=>{
        console.log("Binding response:",res)
        if(res.command_status==0){
            console.log("Bind successfull")
            //sendSingle()
            sendMultiple()
        }else{
            console.log("Binding failed.")
        }
    })
}

session.on('pdu',function(e){
    if(e.command=='submit_multi_resp' || e.command=='submit_sm_resp' || e.command=="bind_transceiver_resp")
        return
    console.log("///PDU reveived:///")
    console.log(e)
    console.log("///////////////////")
})


const sendSingle=function(){
session.submit_sm({
    source_addr:"8617550058",
    destination_addr:"9928915982",
    short_message:"Hello test."
},(res)=>{console.log("Delivery Report : ",res)})
}

const sendMultiple=function(){
    session.submit_multi({
        source_addr:"8617550058",
        dest_address:[{
            dest_addr_ton:1,
            dest_addr_npi:1,
            destination_addr:'8617550058'
        },
        {
            dest_addr_ton:1,
            dest_addr_npi:1,
            destination_addr:'9928915982'
        }],
        short_message:"Hello test."
    },(res)=>{console.log("Delivery Report : ",res)})
    }
    


