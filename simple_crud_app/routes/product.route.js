import express from 'express';
export const router = express.Router();
import { getProducts, getProduct, postProduct, putProduct, deleteProduct } from '../controllers/product.controller.js'

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', postProduct);
router.put('/:id', putProduct);
router.delete('/:id', deleteProduct);

