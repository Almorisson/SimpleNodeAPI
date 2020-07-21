module.exports = (server) => {
  const {create_a_post, list_all_post, update_a_post, delete_a_post, get_a_post} = require('../controllers/postController');
  const jwtMiddleware = require('../middleware/jwtMiddleware');

  server.route('/posts')
  .post(jwtMiddleware.verify_token, create_a_post)
  .get(jwtMiddleware.verify_token, list_all_post)

 server.route('/posts/:post_id') // req.params.post_id
 .all(jwtMiddleware.verify_token)
 .get(get_a_post)
 .put(update_a_post)
 .delete(delete_a_post);
}
