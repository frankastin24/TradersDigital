module.exports = (data, context) => {
    context.res.setHeader('Content-Type', 'application/json');
    context.res.status(200).send(JSON.stringify(data));
}