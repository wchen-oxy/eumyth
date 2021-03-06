const router = require('express').Router();
const { retrieveIndexUserByUsername } = require('../../data_access/dal');
const {
  validateQueryUsername,
  doesValidationErrorExist
} = require("../../utils/validators");

router.get('/',
  validateQueryUsername,
  doesValidationErrorExist,
   (req, res, next) => {
    console.log(req.query);
    const username = req.query.username;
    return retrieveIndexUserByUsername(username)
      .then(result => res.status(200).json(result))
      .catch(next)
  })

router.get('/pursuits', 
validateQueryUsername, 
doesValidationErrorExist,
 (req, res, next) => {
  const username = req.query.username;
  return retrieveIndexUserByUsername(username)
    .then(result => res.status(200).json(result.pursuits))
    .catch(next)
})

router.get('/username', 
validateQueryUsername,
 doesValidationErrorExist, 
 (req, res, next) => {
  const username = req.query.username;
  return retrieveIndexUserByUsername(username)
    .then(() => res.status(200).send())
    .catch(next)
})

module.exports = router;
