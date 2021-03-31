const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const uplad = multer();

// route menant aux operations sur les posts
router.get('/',postController.readPost);
router.post('/',uplad.single('file'),postController.createPost);
router.put('/:id',postController.updatePost);
router.delete('/:id',postController.deletePost);
router.patch('/like-post/:id',postController.likePost);
router.patch('/unlike-post/:id',postController.unlikePost); 

// route menant aux operations sur les Comments
router.patch('/comment-post/:id',postController.commentPost);
router.patch('/edit-comment-post/:id',postController.editCommentPost);
router.patch('/delete-comment-post/:id',postController.deleteCommentPost);


module.exports = router;