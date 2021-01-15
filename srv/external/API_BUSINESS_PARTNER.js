module.exports = (srv) => {
    srv.on('UPDATE', req => {
        // payload structure of S/4HANA event
        const payload = 
            { KEY: [{BUSINESSPARTNER: req.data.BusinessPartner,
                    BUSINESSPARTNERNAME: req.data.BusinessPartnerName,
                    SUPPLIER: req.data.Supplier} ]
              //NAME: [{BUSINESSPARTNERNAME: req.data.BusinessPartnerName} ]
            };
        srv.emit('BusinessPartner/Changed', payload);
        console.log('EMITTED BusinessPartner/Changed with payload ', payload);
    })
} 