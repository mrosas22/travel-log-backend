const mongoose = require('mongoose');
const router = require('express').Router();
const Parks = mongoose.model('Parks');

router.post('/parks', (req, res, next) => {
  const { body } = req;

  if(!body.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if(!body.imagePark) {
    return res.status(422).json({
      errors: {
        imagePark: 'is required',
      },
    });
  }

  if(!body.description) {
    return res.status(422).json({
      errors: {
        description: 'is required',
      },
    });
  }
  const newPark = new Parks(body);
  return newPark.save()
  .then(parks => res.json(parks))
  .catch(next);
});

router.get('/parks', (req, res, next) => {
  return Parks.find()
  .sort({ createdAt: 'descending' })
  .then(parks => res.json(parks))
  .catch(next);
});
  
router.param('id', (req, res, next, id) => {
  return Parks.findById(id, (err, park) => {
    if(err) {
      return res.sendStatus(404);
    } else if(park) {
      req.park = park;
      return next();
    }
  }).catch(next);
});
  
router.get('/parks/:id', (req, res, next) => {
  return res.json({
    park: req.park.toJSON(),
  });

});

router.put('/parks/:id', (req, res, next) => {
  const { body } = req;
  if(typeof body.name !== 'undefined') {
    req.park.name = body.name;
  }
  if(typeof body.description !== 'undefined') {
    req.park.description = body.description;
  }
  if(typeof body.imagePark !== 'undefined') {
    req.park.imagePark = body.imagePark;
  }
  return req.park.save()
  .then(parks => res.json(parks))
  .catch(next);
});

router.delete('/parks/:id', (req, res, next) => {
  return Parks.findByIdAndRemove(req.park._id)
  .then(() => res.sendStatus(200))
  .catch(next);
});

module.exports = router;

