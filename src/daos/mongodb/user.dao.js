import { userModel } from "./models/user.model.js"


class UserManager{
    
    

    //Metodo Obtener users
    async getUsers(){
        return await userModel.find({})
    }

    //Metodo Agregar user
    async addUser(user){
        
        return  await userModel.create(user)
    }

    //Metodo Devuelve user por code
    async getUserByEmail(email){
        
        return await userModel.find({email})
    }
    
}



export const UserDaoMongoDB = new UserManager()





