const router = require('express').Router();
let Seller = require('../models/seller.model');

//const query = ["_id : 1", "ChildSellerID : 1", "ChildSellerName : 1", "ChildType : 1", "ChildGeographyID : 1", "ChildGeographyName : 1", "ParentSellerID : 1", "ParentSellerName : 1", "ParentType : 1", "ParentGeographyID : 1", "ParentGeographyName : 1", "TotalNS90 : 1", "NS90 : 1"];

const query =  { _id : 1, ChildSellerID : 1, ChildSellerName : 1, ChildType : 1, ChildGeographyID : 1, ChildGeographyName : 1, ParentSellerID : 1, ParentSellerName : 1, ParentType : 1, ParentGeographyID : 1, ParentGeographyName : 1, TotalNS90 : 1, NS90 : 1 };

router.route('/').get((req, res) => {  
  res.set('Access-Control-Allow-Origin','*'),
  Seller.find({}, query, function (err, data) {
      if(err) { return handleError(res, err); }
      return res.json(data);
    })
    .then(seller => res.json(seller))    
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  
});

router.route('/:id').get((req, res) => {
  Seller.findById(req.params.id)
    .then(seller => res.json(seller))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Seller.findByIdAndDelete(req.params.id)
    .then(() => res.json('Individual Seller was deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Seller.findById(req.params.id)
    .then(seller => {
        seller.ChildSellerID = Number(req.body.ChildSellerID);
        seller.ChildSellerName = req.body.ChildSellerName;
        seller.ChildType = req.body.ChildType;
        seller.ChildGeographyID = req.body.ChildGeographyID;
        seller.ChildGeographyName = req.body.ChildGeographyName;  
      
        seller.ParentSellerID = Number(req.body.ParentSellerID);
        seller.ParentType = req.body.ParentType;
        seller.ParentSellerName = req.body.ParentSellerName;
        seller.ParentGeographyID = req.body.ParentGeographyID;
        seller.ParentGeographyName = req.body.ParentGeographyName;

        seller.TotalNS90 = Number(req.body.TotalNS90);
        seller.NS90 = Number(req.body.NS90);

      seller.save()
        .then(() => res.json('Seller was updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

/* Adrian code

router.route('/update-seller').post((req, res) => {

  const { body, query } = req;
  const { sellerId } = query;
  const { seller, salesOf90 } = body;
  const {
    rank,
    seller_name,
    type,
    seller_geographyid,
    seller_geographyname,
    seller_id,
    sales
  } = seller;

  Seller.find({
    ChildSellerID: seller_id
  }, (err, sellers) => {

    if (err) {
      return res.send({
        success: false,
        message: 'Error'
      })
    }

    if (sellers.length === 0) {
      return res.send({
        success: false,
        message: 'Error: seller not found'
      })
    }

    const seller = sellers[0]

    seller.ChildSellerName = seller_name;
    seller.ChildType = type;
    seller.ChildGeographyID = seller_geographyid;
    seller.ChildGeographyName = seller_geographyname;

    if (salesOf90 === 1) {
      seller.TotalNS90 = sales;
    }
    if (salesOf90 === 2) {
      seller.NS90 = sales;
    }

    seller.save();

    return res.send({
      success: true,
      message: seller
    })
  })

})*/

/* Yosuke Code */
router.route('/update-seller').post((req, res) => {
  const { body, query } = req;
  const {seller, sellerType, saleType} = body;
 
  var sellerID = seller.seller_id;
  sellerID = parseInt(sellerID, 10);
  
  var sellerName = seller.seller_name;
  if(sellerType == 1){  // parent    
    Seller.find({
      ParentSellerID: sellerID,
      ParentSellerName: sellerName
    }, (err, sellers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error'
        })
      }
      if (sellers.length === 0) {
        return res.send({
            success: false,
            message: 'Error: User not found'
        })
      }
      console.log("Parent");
      console.log(sellers[0].ParentSellerID);
      sellers[0].ParentSellerID = sellerID;
      sellers[0].ParentSellerName = sellerName;
      sellers[0].ParentType = seller.type;
      sellers[0].ParentGeographyID = seller.seller_geographyid;
      sellers[0].ParentGeographyName = seller.seller_geographyname;
      if(saleType == 1){  //TotalNS
        sellers[0].TotalNS90 = seller.sales;
      }else{   //NS
        sellers[0].NS90 = seller.sales;
      }
      sellers[0].save();

      return res.send({
        success: true,
        message: sellers[0]
      })
    })
  }else{                // child
    Seller.find({
      ChildSellerID: sellerID,
      ChildSellerName: sellerName
    }, (err, sellers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error'
        })
      }
      if (sellers.length === 0) {
        return res.send({
            success: false,
            message: 'Error: User not found'
        })
      }
      
      sellers[0].ChildSellerID = sellerID;
      sellers[0].ChildSellerName = sellerName;
      sellers[0].ChildType = seller.type;
      sellers[0].ChildGeographyID = seller.seller_geographyid;
      sellers[0].ChildGeographyName = seller.seller_geographyname;
      if(saleType == 1){  //TotalNS
        sellers[0].TotalNS90 = seller.sales;
      }else{   //NS
        sellers[0].NS90 = seller.sales;
      }
      
      sellers[0].save();
      return res.send({
        success: true,
        message: sellers[0]
      })
    })
  } 

})

module.exports = router;