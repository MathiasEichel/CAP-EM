/*
   Implementations for AdminService defined in ./admin-service.cds
*/
module.exports = cds.service.impl(async function () {

  // Entities for Product Master
  const { S4Products, aService_DownloadProducts, cldProducts, viewProducts } = this.entities    
  const Prodsrv = await cds.connect.to('API_PRODUCT_SRV')
  
  //const srv = await cds.connect.to('S4Products')

  Prodsrv.before('Product/Changed', async (req) => {
    console.log('RECEIVED: Product/Changed -- before Update') // logging confirm
 
    const pID = req.data.KEY[0].PRODUCT
    const iCatGrp = req.data.KEY[0].ITEMCATEGORYGROUP; 
    const matNumb = req.data.KEY[0].MANUFACTURERNUMBER
    const tx = cds.tx(req)

    const ID = await tx.run(SELECT('pID').from(viewProducts).where({pID:pID}))
    if ( !(ID === undefined)) {
        await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
    } 

      // await tx.run(SELECT('pID').from(viewProducts).where({pID:pID}))
      //                       .then(async (req) => {
      //                        tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
      //                                                     .then(console.log('Product Updated'))
      //                                                     .catch(console.log('Product update failed'))
      //                       })
      //                       .catch(console.log('Product does not exist'))


              // const prod = req.data
              // return Promise.all(prod.KEY.map(each => tx.run(
              //   SELECT('pID').from(viewProducts).where({pID:pID}))
              // .then(affectedRows => {
              //   if (!affectedRows) {
              //     req.error(409, `error`)
              // }})))
  })
    // const pID = req.data.KEY[0].PRODUCT;
    // const product = await cds.run(SELECT('pID').from(viewProducts).where({pID:pID}))
    // if (product.length === 0) req.next()
    // else req.reject(new Error('no Product'))

    // const tx = cds.tx(req) 
    // const pID = req.data.KEY[0].PRODUCT;
    // const product = await tx.run( SELECT('pID').from(viewProducts).where({pID:pID}))
    // if (product.length === 0) req.data.KEY[0].EXIST = false
    // else req.data.KEY[0].EXIST = true 
    // if (req.errors) throw req.errors.throwable()
  //})

  //Handler for Topic Product/Changed event 
  // Prodsrv.on('Product/Changed', async (req) => {
  //   console.log('RECEIVED: Product/Changed') // logging confirm
  //   try{
  //     const pID = req.data.KEY[0].PRODUCT; const iCatGrp = req.data.KEY[0].ITEMCATEGORYGROUP; const matNumb = req.data.KEY[0].MANUFACTURERNUMBER
  //     const tx = cds.tx(req)  // get Transaction
  //     const affectedRows = await tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
  //     console.log('Product Updated', affectedRows)
  //   } catch (e) {
  //       console.log("Error: " + e.message)
  //       console.log("Stack: " + e.stack)
  //   }
  // }) 
   
  //Handler for Topic: Product/Created event 
  Prodsrv.on('Product/Created', async (msg) => {
    const tx = cds.tx(msg) // get transaction
      console.log('RECEIVED: Product/Created') // logging confirm
    // get payload  
    const pID = msg.data.KEY[0].PRODUCT; const pType = msg.data.KEY[0].PRODUCTTYPE; const Status = msg.data.KEY[0].CROSSPLANTSTATUS; const soSupply = msg.data.KEY[0].SOURCEOFSUPPLY;  
    const pGroup = msg.data.KEY[0].PRODUCTGROUP; const UoM = msg.data.KEY[0].BASEUNIT; const iCatGrp = msg.data.KEY[0].ITEMCATEGORYGROUP; const matNum = msg.data.KEY[0].MANUFACTURERNUMBER;
    
    //----check if Product is new then insert ------
    try {
      const result = await tx.run(INSERT.into( cldProduts)
                  .columns['pID','pType','Status','soSupply','pGroup','UoM','iCatGrp,matNum']
                  .rows[pID,pType,Status,soSupply,pGroup,UoM,iCatGrp,matNum] )
      console.log('cloud Product inserted: ', result)            
    } catch(e) {
      console.log("Error: " + e.message)
      console.log("Stack: " + e.stack)      
    }
  })
  
  // handler for downloading Products --ok
  this.on('READ', aService_DownloadProducts, async (req) =>{
    const tx = cds.tx(req)
    const s4products = await Prodsrv.tx(req).run(SELECT.from(S4Products) )
    const result = await tx.run(INSERT.into( cldProducts).rows(s4products)) 
    console.log('result: ', result)
  })
})
