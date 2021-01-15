module.exports = cds.service.impl(async function () {

    // Entities for Product Master
    const { cldProducts, viewProducts } = this.entities    
    const Prodsrv = await cds.connect.to('API_PRODUCT_SRV')
  
    Prodsrv.before('Product/Changed', async (req) => {
      console.log('RECEIVED: Product/Changed -- before Update') // logging confirm
   
      const pID = req.data.KEY[0].PRODUCT
      const iCatGrp = req.data.KEY[0].ITEMCATEGORYGROUP; 
      const matNumb = req.data.KEY[0].MANUFACTURERNUMBER
      const tx = cds.tx(req)
  
       await tx.run(SELECT('pID').from(viewProducts).where({pID:pID}))
                            .then(async (req) => {
                            tx.run(UPDATE(cldProducts).set({iCatGrp: iCatGrp, matNumb: matNumb}) .where({pID: pID}))
                                                        .then(console.log('Product Updated'))
                                                        .catch(console.log('Product update failed'))
                            })
                            .catch(console.log('Product does not exist'))
    })
})