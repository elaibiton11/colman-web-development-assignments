import { Router } from 'express';
import commentController from '../controllers/comment_controller';

const router = Router();

/**
 * @route POST /comments
 * @desc Add a New Comment
 */
router.post('/', commentController.addComment);

/**
 * @route GET /comments
 * @desc Get All Comments or Get Comments by PostId
 */
router.get('/', commentController.getAllComments);

/**
 * @route GET /comments/:id
 * @desc Get a Comment by ID
 */
router.get('/:id', commentController.getCommentById);

/**
 * @route PUT /comments/:id
 * @desc Update a Comment
 */
router.put('/:id', commentController.updateComment);

/**
 * @route DELETE /comments/:id
 * @desc Delete a Comment
 */
router.delete('/:id', commentController.deleteComment);

/**
 * @route GET /comments/post/:postId
 * @desc Get All Comments for a Specific Post
 */
router.get('/post/:postId', commentController.getCommentByPostId);

export default router;
