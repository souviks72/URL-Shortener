const express = require('express');
const router = express.Router({mergeParams: true});
const {signin,signup,verify,updatePassword,forgetPassword} = require('../handlers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify/:id', verify);
router.patch('/:id/update-password',updatePassword);
router.post('/forgot-password',forgetPassword);

module.exports = router;