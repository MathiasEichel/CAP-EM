/*
   Implementations for AdminService defined in ./admin-service.cds
*/
module.exports = cds.service.impl(async function () {
    // Entities for BusinessPartners --ok
    const { aService_DownloadPartners, BusinessPartners, BPartners } = this.entities
    const BPsrv = await cds.connect.to('API_BUSINESS_PARTNER')
    this.on('READ', BusinessPartners, req => BPsrv.tx(req).run(req.query))

  //Handler for BusinessPartner/Changed event --ok
  BPsrv.on('BusinessPartner/Changed', async (msg) => {
    console.log('RECEIVED: BusinessPartner/Changed with data')
    const bID = msg.data.KEY[0].BUSINESSPARTNER
    const bname = msg.data.KEY[0].BUSINESSPARTNERNAME
    const liefer = msg.data.KEY[0].SUPPLIER
    const tx = cds.tx(msg)
    const result = await tx.run(UPDATE(BPartners).set({BusinessPartnerName: bname, Supplier: liefer}) .where({BusinessPartner:bID}))
    console.log('BPartner updated: ', result)
  })
  // handler for downloading Business Partners --ok
  this.on('READ', aService_DownloadPartners, async (req) =>{
    const tx = cds.tx(req)
    const bpartners = await BPsrv.tx(req).run(SELECT.from(BusinessPartners) )
    const results = await tx.run(INSERT.into( BPartners).rows(bpartners)) 
    //req.reject(400, 'Partners already downloaded')
    //req.reply(results[0].lastID, results[0].affectedRows,results[0].values)
    // return await tx.run(INSERT.into( BPartners).rows(bpartners)) .then(affectedRows => {if (!afffectedRows) {req.error(400,'alread downloaded')}} )    
    console.log('result: ', results)
  })

  // Entities for Product Master
  const { S4Products, aService_DownloadProducts, cldProducts, viewProducts } = this.entities    
  const Prodsrv = await cds.connect.to('API_PRODUCT_SRV')
  //this.on('READ', S4Products, req => Prodsrv.tx(req).run(req.query))

  // Prodsrv.before('Product/Changed', async (req) => {
  //   console.log('RECEIVED: Product/Changed -- before Update') // logging confirm
  //   const tx = cds.tx(req) 
  //   const pID = req.data.KEY[0].PRODUCT;
  //   const product = await tx.run( SELECT('pID').from(viewProducts).where({pID:pID}))
  //   if (product.length === 0) req.data.KEY[0].EXIST = false
  //   else req.data.KEY[0].EXIST = true 
  //   if (req.errors) throw req.errors.throwable()

  //})
  //Handler for Topic Product/Changed event 
  Prodsrv.on('Product/Changed', async (req) => {
    console.log('RECEIVED: Product/Changed') // logging confirm
    try{
      const pID = req.data.KEY[0].PRODUCT; const iCatGrp = req.data.KEY[0].ITEMCATEGORYGROUP; const matNumb = req.data.KEY[0].MANUFACTURERNUMBER
      const tx = cds.tx(req)  // get Transaction
      const affectedRows = await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
      console.log('Product Updated', affectedRows)
    } catch (e) {
        console.log("Error: " + e.message)
        console.log("Stack: " + e.stack)
    }
  })
    // get payload parameters:
    // if (req.data.KEY[0].EXIST === true) {
    //   const pID = req.data.KEY[0].PRODUCT; const iCatGrp = req.data.KEY[0].ITEMCATEGORYGROUP; const matNumb = req.data.KEY[0].MANUFACTURERNUMBER
    //   const tx = cds.tx(req)  // get Transaction
    //   const affectedRows = await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
    //   console.log('Product Updated', affectedRows)
    //  }
    //  else console.log('Product does not exist')
    //  if (req.errors) throw req.errors.throwable()
    
    //----check if product exists then updated------
    // the next line works but is too simple --- no check if product exist
    //const result = await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))

    // //const s4product = await tx.run(SELECT.from(cldProducts).where({pID:pID}) )
    // const s4product = await tx.run( SELECT('pID').from(cldProducts).where({pID:pID}))
    // if( s4product[0].pID === pID ) {
    //     const tx_upd = cds.tx(msg)
    //     const result = await tx_upd.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
    //     console.log('product',result)
    // }
    //if( s4product[0].pID === pID ) {  //if( s4product[0].pID === pID ) {  

    //   //const updProd = await Prodsrv.tx(msg).run(SELECT.one().from(S4Products).where({pID:pID}))
    //   const result = tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
    //   //const result = await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
    //   console.log(s4product)
    //   //console.log(msg._.event); //return (msg._.event)
    // }  
    // else { console.log(msg._.event, 'FAILED'); } //return msg._.event }
    //console.log(result)
  //})

  //Handler for Topic: Product/Created event 
  Prodsrv.on('Product/Created', async (msg) => {
    const tx = cds.tx(msg) // get transaction
      console.log('RECEIVED: Product/Created') // logging confirm
    // get payload  
    const pID = msg.data.KEY[0].PRODUCT; const pType = msg.data.KEY[0].PRODUCTTYPE; const Status = msg.data.KEY[0].CROSSPLANTSTATUS; const soSupply = msg.data.KEY[0].SOURCEOFSUPPLY;  
    const pGroup = msg.data.KEY[0].PRODUCTGROUP; const UoM = msg.data.KEY[0].BASEUNIT; const iCatGrp = msg.data.KEY[0].ITEMCATEGORYGROUP; const matNum = msg.data.KEY[0].MANUFACTURERNUMBER;
    
    //----check if Product is new then insert ------
    const s4product = await tx.run(SELECT.from(S4Products).where({pID:pID}) )
    if( s4product === undefined ) {  
      const result = await tx.run(INSERT.into( cldProduts)
                  .columns['pID','pType','Status','soSupply','pGroup','UoM','iCatGrp,matNum']
                  .rows[pID,pType,Status,soSupply,pGroup,UoM,iCatGrp,matNum] )
    }  
    //const s4product = await Prodsrv.tx(req).run(SELECT.from(S4Products).where({Product:pID}) )
    
    console.log('cloud Product inserted: ', result)
  })
  // handler for downloading Products --ok
  this.on('READ', aService_DownloadProducts, async (req) =>{
    const tx = cds.tx(req)
    const s4products = await Prodsrv.tx(req).run(SELECT.from(S4Products) )
    const result = await tx.run(INSERT.into( cldProducts).rows(s4products)) 
    console.log('result: ', result)
  })
})
