const router = require('express').Router();
let Type = require('../models/childType.model');

//const query = ["_id : 1", "ChildSellerID : 1", "ChildSellerName : 1", "ChildType : 1", "ChildGeographyID : 1", "ChildGeographyName : 1", "ParentSellerID : 1", "ParentSellerName : 1", "ParentType : 1", "ParentGeographyID : 1", "ParentGeographyName : 1", "TotalNS90 : 1", "NS90 : 1"];

const query =  { ChildType : 1 };

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
        var child_buf="";
        var child_type = [];
        
        for(var i=0; i<length; i++){
          buf = JSON.stringify(data[i]);
          temp = buf.split(',\"');
                              
          child_buf = temp[1].replace(/\"/g, '').replace(/}/g, '').replace("ChildType:", "");

          if(i == 0){
            child_type.push(child_buf);
          }else{
            var child_flag = 0;
            for(var c=0;c<child_type.length;c++){
              if(child_type[c] == child_buf){
                child_flag = 0;
                break;
              }else{
                child_flag = 1;
              }
            }
            if(child_flag == 1){
              child_type.push(child_buf);
            }
          }
        }

        return res.json(child_type);
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
        type.ChildType = req.body.ChildType;
      
        type.save()
            .then(() => res.json('Type was updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;