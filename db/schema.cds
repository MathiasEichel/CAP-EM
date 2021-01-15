namespace my.domain;

entity  cldProducts{
   key pID : String;
      pType   : String;
      Status  : String;
      soSupply: String;
      pGroup  : String;
      UoM     : String;
      iCatGrp : String;
      matNumb : String;
}

entity BPartners {
  key BusinessPartner  : String;
      BusinessPartnerName      : String;
      Supplier : String;
}
// entity Products {
//   key ID             : Integer;
//       name           : String(100) not null;
//       stock          : Integer;
//       price          : Decimal(9, 2);
//       retail         : Decimal(9, 2);
//       virtual margin : Decimal(9, 2);
//       currency_code  : String(3);
//       supplier       : Association to Suppliers;
// }

// entity Suppliers {
//   key ID       : Integer;
//       name     : String(100);
//       priority : Integer;
//       products : Association to many Products
//                    on products.supplier = $self;
// }

// entity Orders {
//   key ID            : UUID;
//       orderNo       : String;
//       currency_code : String(3);
//       Items         : Composition of many OrderItems
//                         on Items.parent = $self;
// }

// entity OrderItems {
//   key ID      : UUID;
//       parent  : Association to Orders;
//       product : Association to Products;
//       amount  : Integer;
// }