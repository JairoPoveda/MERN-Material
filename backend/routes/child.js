const router = require('express').Router();
let Child = require('../models/child.model');

//const query = ["_id : 1", "ChildSellerID : 1", "ChildSellerName : 1", "ChildType : 1", "ChildGeographyID : 1", "ChildGeographyName : 1", "ParentSellerID : 1", "ParentSellerName : 1", "ParentType : 1", "ParentGeographyID : 1", "ParentGeographyName : 1", "TotalNS90 : 1", "NS90 : 1"];

const query =  { _id : 1, ChildSellerID : 1, ChildSellerName : 1, ChildType : 1, ChildGeographyID : 1, ChildGeographyName : 1, TotalNS90 : 1, NS90 : 1 };

router.route('/').get((req, res) => {  
  Child.find({}, query, function (err, data) {
      if(err) { return handleError(res, err); }
      return res.json(data);
    })
    .then(child => res.json(child))    
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  
});

router.route('/:id').get((req, res) => {
  Child.findById(req.params.id)
    .then(child => res.json(child))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Child.findByIdAndDelete(req.params.id)
    .then(() => res.json('Individual Seller was deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Child.findById(req.params.id)
    .then(child => {
      child.ChildSellerID = Number(req.body.ChildSellerID);
      child.ChildSellerName = req.body.ChildSellerName;
      child.ChildType = req.body.ChildType;
      child.ChildGeographyID = req.body.ChildGeographyID;
      child.ChildGeographyName = req.body.ChildGeographyName;
       
      child.TotalNS90 = Number(req.body.TotalNS90);
      child.NS90 = Number(req.body.NS90);

      child.save()
        .then(() => res.json('Seller was updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;