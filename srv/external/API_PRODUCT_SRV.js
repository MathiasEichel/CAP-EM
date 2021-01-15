module.exports = (srv) => {
    srv.on('UPDATE', req => {
        // payload structure of S/4HANA event
        const payload = 
            { KEY: [{PRODUCT: req.data.Product,
                     ITEMCATEGORYGROUP: req.data.ItemCategoryGroup,
                     MANUFACTURERNUMBER:req.data.ManufacturerNumber
                    } ]
            };
        srv.emit('Product/Changed', payload);
        console.log('EMITTED Product/Changed with payload ', payload);
    })
    srv.on('CREATE', req => {
        // payload structure of S/4HANA event
        const payload = 
            { KEY: [{PRODUCT:           req.data.Product,
                     PRODUCTTYPE:       req.data.ProductType,
                     CROSSPLANTSTATUS:  req.data.CrossPlantStatus,
                     SOURCEOFSUPPLY:    req.data.SourceOfSupply,
                     PRODUCTGROUP:      req.data.ProductGroup,
                     BASEUNIT:          req.data.BaseUnit,
                     ITEMCATEGORYGROUP: req.data.ItemCategoryGroup,
                     MANUFACTURERNUMBER:req.data.ManufacturerNumber
                    } ]
            };
        srv.emit('Product/Created', payload);
        console.log('EMITTED Product/Created with payload ', payload);
    })
} 