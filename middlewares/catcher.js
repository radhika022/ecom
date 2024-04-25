function warnIfError(req, res, next){
  const payload = res.payload;
  if(!payload) next();
  if(!payload.success){
    res.status(403);
  }
  res.send(payload);
}

module.exports = {
  warnIfError
};
