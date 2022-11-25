const router = require('express').Router();
let Type = require('../models/parentType.model');

//const query = ["_id : 1", "ChildSellerID : 1", "ChildSellerName : 1", "ChildType : 1", "ChildGeographyID : 1", "ChildGeographyName : 1", "ParentSellerID : 1", "ParentSellerName : 1", "ParentType : 1", "ParentGeographyID : 1", "ParentGeographyName : 1", "TotalNS90 : 1", "NS90 : 1"];

const query =  { ParentType : 1};

router.route('/').get((req, res) => {  
  Type.find({}, query, function (err, data) {
        if(err) { return handleError(res, err); }
        return JSON.stringify(res.data);        
    })
    .then(function(data){
        /// can get type from data and control data. 
        var length = data.length;
        var temp = "";
        var buf = "";
        var parent_buf="";
        var parent_type = [];
        
        for(var i=0; i<length; i++){
          buf = JSON.stringify(data[i]);
          temp = buf.split(',\"');
          parent_buf = temp[1].replace(/\"/g, '').replace(/}/g, '').replace("ParentType:", "");

          if(i == 0){
            parent_type.push(parent_buf);
          }else{
            var parent_flag = 0;
            for(var p=0;p<parent_type.length;p++){
              if(parent_type[p] == parent_buf){
                parent_flag = 0;
                break;
              }else{
                parent_flag = 1;
              }
            }
            if(parent_flag == 1){
              parent_type.push(parent_buf);
            }
          }
        }
        return res.json(parent_type);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {  
});

router.route('/:id').get((req, res) => {
  Type.findById(req.params.id)
    .then(type => res.json(type))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Type.findByIdAndDelete(req.params.id)
    .then(() => res.json('Individual Type was deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Type.findById(req.params.id)
    .then(type => {
        type.ParentType = req.body.ParentType;
      
        type.save()
            .then(() => res.json('Type was updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;