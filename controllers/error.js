exports.get404 = (req, res, next) => {
    res.status(404).send(`<html>Go to home page ===> <a href=http://100.26.211.77:3000/login.html>click me</a></html>`)
}