const express = require('express');
const router = express.Router({mergeParams: true});
const {signin,signup,resetPassword,updatePassword} = require('../handlers/user');

router.post('/signup', signup);
router.post('/signin', signin);
router.patch('/reset-password', resetPassword);
router.patch('/update-password',updatePassword);

module.exports = router;