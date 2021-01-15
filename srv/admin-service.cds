using my.domain from '../db/schema';
using {API_PRODUCT_SRV as ext_Prod} from './external/API_PRODUCT_SRV';

service AdminService {
  entity cldProducts as SELECT from domain.cldProducts;
  @readonly entity viewProducts as projection on domain.cldProducts;
 
  @readonly entity S4Products
    as projection on ext_Prod.A_Product {
      key Product as pID,
      ProductType as pType,
      CrossPlantStatus as Status,
      SourceOfSupply as soSupply,
      ProductGroup as pGroup,
      BaseUnit as UoM,
      ItemCategoryGroup as iCatGrp,
      ManufacturerNumber as matNumb
    };
   
  @readonly entity aService_DownloadProducts
    as projection on ext_Prod.A_Product {
      key Product,
      ProductType as pType,
      CrossPlantStatus as Status,
      SourceOfSupply as soSupply,
      ProductGroup as pGroup,
      BaseUnit as UoM,
      ItemCategoryGroup as iCatGrp,
      ManufacturerNumber as matNumb
    };
  
}