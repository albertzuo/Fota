var Photo = require('../models').Photo;
var Restaurant = require('../models').Restaurant;
var User = require('../models').User;
var sequelize = require('sequelize');
var axios = require('axios');
var _ = require('lodash');

// create a new photo with given parameters
module.exports.post = (req, res) => {
  const { RestaurantId, UserId, link } = req.body;
  const googleKey = 'AIzaSyD6vcwe8-GiUFrC58UspiOA1-4JpYWvnGQ';
  axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${googleKey}`,
    {
      requests: [
        {
          image: {
            source: {
              imageUri: link
            }
          },
          features: [
            {
              type: "SAFE_SEARCH_DETECTION"
            },
            {
              type: "FACE_DETECTION"
            }
          ]
        }
      ]
    }
  ).then((result) => {
    response = result.data.responses[0];
    // Filter for inapporpriate photos
    if (response.faceAnnotations) {
      if (response.faceAnnotations[0].detectionConfidence > 0.7) return res.status(400).send({error: "invalid photo"});
    }
    if (response.safeSearchAnnotation) {
      const { medical, spoof, adult, violence } = response.safeSearchAnnotation;
      const rejects = ['LIKELY', 'VERY_LIKELY', 'POSSIBLE'];
      if (rejects.includes(medical) || rejects.includes(spoof) || rejects.includes(adult) || rejects.includes(violence))
        return res.status(400).send({error: "invalid photo"});
    }

    // Make sure the user exists and is authroized
    if (!UserId) return res.status(401).send({error: "Must provide user ID"});
    User.findById(UserId).then((user) => {
      if (!user) return res.status(404).send({error: "User not found"});
    }).catch((err) => {
      console.log(err);
      return res.status(500).send({error: "Internal server error"});
    })

    Photo.create({
      RestaurantId,
      UserId,
      likecount: 0,
      link
    }).then((photo) => {
      res.status(200).send({message: "creation successful"});
    }).catch((err) => {
      console.log(err);
    })
  })
}

module.exports.get = (req, res) => {
  // sequelizeInstance = new sequelize('fota_dev', 'postgres', '123', {dialect: 'postgres'});
  order = req.query.order;
  // distance = req.query.distance;
  if (order == 'hot') {
    order = ['likecount', 'DESC']
  } else if (order == 'new') {
    order = ['createdAt', 'DESC']
  } else {
    return res.status(400).send({error: "sorting order incorrect"})
  }

  // geographical data accessible as req.query.lat and req.query.lng
  Photo.findAll({
    order: [
      order
    ]
  }).then((photos) => {
    Restaurant.findAll({
    }).then((restaurants) => {
      res.status(200).send({photos, restaurants});
    });
  });

  // sequelizeInstance.query(`SELECT * FROM "Restaurants" WHERE 2 * 3961 * asin(sqrt((sin(radians((lat - 40.3468210) / 2))) ^ 2 + cos(radians(40.3468210)) * cos(radians(lat)) * (sin(radians((lng - -74.6552090) / 2))) ^ 2)) <= ${distance}`)
  // .then((rest) => {
  //   restaurants = rest[0];
  //   photos = [];
  //   restaurants.map((rest) => {
  //     rest.getPhotos((photo) => {
  //       photos.push(photo);
  //     })
  //   })
  // })

}

module.exports.delete = (req, res) => {
  id = req.body.id;
  Photo.destroy({where: {
    id: id
  }}).then((results) => {
    res.send("Delete Successful");
  }).catch((e) => {
    console.log(e);
  })
}

module.exports.patch = (req, res) => {
  userID = req.query.user;
  type = req.query.type;
  amount = req.query.amount || "1";

  if (type != "upvote" && type != "downvote")
    return res.status(400).send({error: "no vote type supplied"});

  if (type == "upvote") {
    if (userID) {
      User.findById(userID).then((user) => {
        if (!user) return res.status(404).send({error: "no user found"});

        var liked = user.likedPhotos || [];
        var disliked = user.dislikedPhotos || [];

        // Take care of special cases: how should we save it on the server?

        if (_.includes(disliked, parseInt(req.params.id))) {
          // Case 1: disliked -> none
          _.remove(disliked, function(item) {
            return (item === parseInt(req.params.id));
          });
          if (amount === "2") {
          // Case 2: disliked -> liked
            liked.push(req.params.id);
          }
        } else {
          // Case 3: none -> liked
          liked.push(req.params.id);
        }

        user.update({likedPhotos: liked, dislikedPhotos: disliked}).catch((e) => {
          console.log(e);
          return res.status(400).send({error: "error in accessing user information"})
        });
      })
    }

    Photo.update({
      likecount: sequelize.literal(`likecount + ${amount}`)
    }, {where: {
      id: req.params.id
    }}).then(() => {
      res.status(200).send({message: "Your upvote has been succesfully processed"})
    }).catch((e) => console.log(e))
  }

  if (type == "downvote") {
    if (userID) {
      User.findById(userID).then((user) => {
        if (!user) return res.status(404).send({error: "no user found"});

        var liked = user.likedPhotos || [];
        var disliked = user.dislikedPhotos || [];

        // Take care of special cases: how should we save it on the server?

        if (_.includes(liked, parseInt(req.params.id))) {
          // Case 4: liked -> none
          _.remove(liked, function(item) {
            return (item === parseInt(req.params.id));
          });
          if (amount === "2") {
          // Case 5: liked -> disliked
            disliked.push(req.params.id);
          }
        } else {
          // Case 6: none -> disliked
          disliked.push(req.params.id);
        }

        user.update({dislikedPhotos: disliked, likedPhotos: liked}).catch((e) => {
          console.log(e);
          return res.status(400).send({error: "error in accessing user information"})
        });
      })
    }

    Photo.update({
      likecount: sequelize.literal(`likecount - ${amount}`)
    }, {where: {
      id: req.params.id
    }}).then(() => {
      response = {
        message: "Your upvote/downvote request has been successfully processed."
      };
      return res.send(response);
    })
    .catch((e) => console.log(e))
  }


}
