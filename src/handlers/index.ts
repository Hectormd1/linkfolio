import User from "../models/User"

let price = 50
price // VIDEO 34 

export const createAccount =  async (req, res) => {
    const user = new User(req.body)

    await user.save()

    res.send("Registro creado correctamente")
}