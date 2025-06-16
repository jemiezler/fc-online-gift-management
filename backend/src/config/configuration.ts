export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    mongo_uri: process.env.MONGODB_URI,
});