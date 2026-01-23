import { Router } from 'express';
import postController from '../controllers/post_controller';

const router = Router();

/**
 * @route POST /post
 * @desc Add a New Post
 */
router.post('/', postController.createPost);

/**
 * @route GET /post
 * @desc Get All Posts or Get Posts by Sender
 */
router.get('/', postController.getAllPosts);

/**
 * @route GET /post/:id
 * @desc Get a Post by ID
 */
router.get('/:id', postController.getPostById);

/**
 * @route PUT /post/:id
 * @desc Update a Post
 */
router.put('/:id', postController.updatePost);

// Note: The route GET /post/:id/comments is often handled here or in a separate comments router
// If handled here, it would look like: router.get('/:id/comments', ...);

export default router;