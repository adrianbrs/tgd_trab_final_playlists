export default defineEventHandler(async (event) => {
  const { path, node } = event;

  if (path && /^\/api\//.test(path)) {
    const req = node.req;
    const { method, url } = req;
    console.log(`${method} ${url}`);
  }
});
