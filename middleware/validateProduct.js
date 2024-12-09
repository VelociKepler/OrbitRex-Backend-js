import { body, validationResult } from 'express-validator';

const validateProduct = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').optional().isString(),
    body('category').notEmpty().withMessage('Category is required'),
    body('pricing').notEmpty().withMessage('Pricing is required').isNumeric().withMessage('Pricing must be a number'),
    body('stock.total').isInt({ min: 0 }).withMessage('Stock total must be a non-negative integer'),
    body('stock.status').isIn(['in_stock', 'out_of_stock']).withMessage('Stock status must be either "in_stock" or "out_of_stock"'),
    body('images').optional().isURL().withMessage('Images must be a valid URL'),
    body('color').isArray().withMessage('Color must be an array'),
    body('metadata.brand').optional().isString(),
    body('metadata.weight').optional().isNumeric(),
    body('metadata.dimensions.width').optional().isNumeric(),
    body('metadata.dimensions.height').optional().isNumeric(),
    body('metadata.dimensions.length').optional().isNumeric(),

    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

export default validateProduct;