import { Router } from "express";
/* import { CartMgr } from "../daos/fs/cartManager.js";
import { ProductMgr } from "../daos/fs/productManager.js"; */
import * as controller from '../controllers/carts.controller.js'

const router = Router();

//Agregar Cart
router.post('/', controller.addCart)

//Devolver Cart por ID
router.get('/:cid', controller.getCartProductsById)


//Agregar Producto por ID a Cart por ID
router.post('/:cid/products/:pid', controller.addProductToCart)

//Borrar Productos de Cart especifico
router.delete('/:cid/products/:pid', controller.removeProductOfCartById)

//Actualizar Cart por ID --> por body se pasa un array de products
router.put('/:cid', controller.updateCartById)

//Actualizar quantity de prod por Id y ID de cart
router.put('/:cid/products/:pid', controller.updateProductQuantityOfCartById)

//Borrar todos los Productos del Cart
router.delete('/:cid', controller.deleteAllProductsOfCart)

export default router;