export default defineEventHandler(async (event) => {
    console.log(`${event.node.req.method} ${event.path}`);
});