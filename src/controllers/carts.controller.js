import * as services from '../services/carts.service.js'
import { getProductById, updateProduct } from '../services/products.service.js';
import { v4 as uuidv4 } from 'uuid';

export const addCart = async(req, res)=>{
    try{
        
        res.status(200).json(await services.addCart()) 
        
    }
    catch(error){
        console.log(error);
        res.status(404).json({msj:"error"})
    }
}

export const getCartProductsById =  async (req, res)=>{
    const {cid} = req.params;

    try{
        const cart = await services.getCartProductsById(cid)
        if(cart != null){
            res.status(200).json(cart)
        }else{
            res.status(404).send("No existe el cart")
        }
    }
    catch(error){
        res.status(404).json({msj:"error"})
    }

}

export const addProductToCart =  async (req, res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.query;
    
    try{
        
            const cart = await services.addProductToCart(cid, pid, Number(quantity))
            if(cart != null){
                res.status(200).json(cart)
            }else{
                res.status(404).send("El cart no existe")
            }
        }
    
    catch(error){
        res.status(404).json({msj:"error"})
    }

}


export const removeProductOfCartById =  async (req, res)=>{
    const {cid, pid} = req.params;
    
    try{
        
            const cart = await services.removeProductOfCartById(cid, pid)
            if(cart != null){
                res.status(200).json(cart)
            }else{
                res.status(404).send("El cart no existe")
            }
        }
    
    catch(error){
        res.status(404).json({msj:"error"})
    }
    
    
    
}
export const updateCartById =  async (req, res)=>{
    const {cid} = req.params;
    const obj = req.body;
    console.log("controller", obj);
    try{
        
        const cart = await services.updateCartById(cid, obj)
        if(cart != null){
            res.status(200).json(cart)
        }else{
            res.status(404).send("El cart no existe")
        }
    }
    
    catch(error){
        res.status(404).json({msj:"error"})
    }
}

export const updateProductQuantityOfCartById =  async (req, res)=>{
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    try{
        
            const cart = await services.updateProductQuantityOfCartById(cid, pid, quantity)
            if(cart != null){
                res.status(200).json(cart)
            }else{
                res.status(404).send("El cart no existe")
            }
        }
    
    catch(error){
        res.status(404).json({msj:"error"})
    }
}


export const deleteAllProductsOfCart =  async (req, res)=>{
    const {cid} = req.params;

    try{
        
            const cart = await services.deleteAllProductsOfCart(cid)
            if(cart != null){
                res.status(200).json(cart)
            }else{
                res.status(404).send("El cart no existe")
            }
        }
    
    catch(error){
        res.status(404).json({msj:"error"})
    }    
}


export const purchase = async (req, res)=>{
    const {cid} = req.params;

    try {
        console.log("CONTROLLER PURCHASE");
        
        //Verificar Existencia de Carrito
        const cart = await services.getCartProductsById(cid)

        if(!cart){
            return res.status(400).send("Carrito no encontrado")
        }
        console.log("CONTROLLER PURCHASE");

        
        console.log(cart.products);
        
        //return res.status(200).json(cart.products)
        
        let ticketProducts = []
        let productsOutOfStock=[]
        let TotalPurchase = 0

        //ForEach de cart.products
        await Promise.allSettled(
        cart.products.map( async (product)=>{
            const dbProduct = await getProductById(product.product)
            if(dbProduct){
                console.log("MAP - Init Product:",product);
                console.log("dbProduct:", dbProduct);
                
                if(product.quantity <= dbProduct.stock){
                    
                    await updateProduct(product.product, {stock: dbProduct.stock - product.quantity})
                    ticketProducts.push(product)
                    TotalPurchase += product.quantity*dbProduct.price;
                }else{
                    productsOutOfStock.push(product)
                }
            }
            else{
                productsOutOfStock.push(product)
                
            }
            console.log("MAP - Finish Product:",product);
            
        })
        )


        console.log("ticket:", ticketProducts);
        console.log("productsOutOfStock:", productsOutOfStock);

       /*  console.log("PRE Ticket");

        const userComplete = await services.getUserByEmail(req.user.email)
        console.log("User Complete",userComplete); */
        
        
        const code = uuidv4();
        const ticket ={
            code: code,
            amount: TotalPurchase,
            purchaser: req.user.email
        }
        console.log(req.user);
        
        console.log("PRE LOG Ticket");
        console.log("Ticket", ticket);

        const ticketResponse = await services.addTicket(ticket)
        console.log(ticketResponse);
        
        return res.status(200).json({ ticket: ticketResponse, productOutOfStock:productsOutOfStock })


    } catch (error) {
        console.log(error);
        
        res.status(404).json({msj:error})
    }
}

    