import { Router } from 'express'; //Punto de entrada de Router de Express
import {ProductMgr} from '../daos/fs/productManager.js'
import { validarNewProduct} from '../../middlewares/middlewares.js';
import { validarPut } from '../../middlewares/middlewares.js';
import { socketServer } from '../../serverExpress.js';
import * as controller from '../controllers/products.controller.js'

const router = Router();

//Devolver todos los Productos
router.get('/', controller.getProducts)

// Devolver Producto por ID
router.get('/:pid', controller.getProductById)

//Agregar Producto
router.post('/', validarNewProduct, controller.addProduct)

//Actualizar Producto
router.put('/:pid', validarPut, controller.updateProduct)

//Borrar Producto
router.delete('/:pid', controller.deleteProduct)

export default router




