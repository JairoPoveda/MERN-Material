const router = require('express').Router();
let Parent = require('../models/parent.model');

//const query = ["_id : 1", "ChildSellerID : 1", "ChildSellerName : 1", "ChildType : 1", "ChildGeographyID : 1", "ChildGeographyName : 1", "ParentSellerID : 1", "ParentSellerName : 1", "ParentType : 1", "ParentGeographyID : 1", "ParentGeographyName : 1", "TotalNS90 : 1", "NS90 : 1"];

const query =  { _id : 1, ParentSellerID : 1, ParentSellerName : 1, ParentType : 1, ParentGeographyID : 1, ParentGeographyName : 1, TotalNS90 : 1, NS90 : 1 };

router.route('/').get((req, res) => {  
  Parent.find({}, query, function (err, data) {
      if(err) { return handleError(res, err); }
      return res.json(data);
    })
    .then(parent => res.json(parent))    
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  
});

router.route('/:id').get((req, res) => {
  Parent.findById(req.params.id)
    .then(parent => res.json(parent))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Parent.findByIdAndDelete(req.params.id)
    .then(() => res.json('Individual Seller was deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Parent.findById(req.params.id)
    .then(parent => {
      parent.ParentSellerID = Number(req.body.ParentSellerID);
      parent.ParentType = req.body.ParentType;
      parent.ParentSellerName = req.body.ParentSellerName;
      parent.ParentGeographyID = req.body.ParentGeographyID;
      parent.ParentGeographyName = req.body.ParentGeographyName;

      parent.TotalNS90 = Number(req.body.TotalNS90);
      parent.NS90 = Number(req.body.NS90);

      parent.save()
        .then(() => res.json('Parent was updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;