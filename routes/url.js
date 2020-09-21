const express = require('express');
const router = express.Router({mergeParams: true});
const {shortenUrl, visitUrl,getUrls} = require('../handlers/url');

router.post('/shorten', shortenUrl);
router.get('/:code', visitUrl);
router.get('/', getUrls);

module.exports = router;