var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')

// GET all users
// /api/v1/users
router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({}).populate({ path: 'role', select: 'name description' })
    let result = data.filter(function (e) {
      return (!e.isDeleted)
    })
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
});

// GET user by id
// /api/v1/users/:id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne(
      { _id: req.params.id, isDeleted: false }
    ).populate({ path: 'role', select: 'name description' });
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// POST create user
// /api/v1/users
router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      role: req.body.role
    })
    await newObj.save()
    res.status(200).send(newObj);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
})

// PUT update user
// /api/v1/users/:id
router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      req.body, {
      new: true
    })
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// DELETE soft delete user
// /api/v1/users/:id
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(req.params.id,
      { isDeleted: true }, {
      new: true
    })
    res.status(200).send(result)
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// POST enable user
// /api/v1/users/enable
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userSchema.findOne({ email: email, username: username, isDeleted: false });
    if (user) {
      user.status = true;
      await user.save();
      res.status(200).send(user);
    } else {
      res.status(404).send({
        message: "User not found or information incorrect"
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

// POST disable user
// /api/v1/users/disable
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userSchema.findOne({ email: email, username: username, isDeleted: false });
    if (user) {
      user.status = false;
      await user.save();
      res.status(200).send(user);
    } else {
      res.status(404).send({
        message: "User not found or information incorrect"
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

module.exports = router;
