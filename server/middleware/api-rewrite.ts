export default fromNodeMiddleware((req, res, next) => {
    if (req.url?.startsWith("/fe-api/")) {
        req.url = req.url.replace("/fe-api/", "/api/");
    }
    next();
});