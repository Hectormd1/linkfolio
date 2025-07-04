import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList= [process.env.FRONTED_URL,process.env.FRONTED_URL_2]
    
    if(process.argv[2] === '--api'){
      whiteList.push(undefined)
    }

    if(whiteList.includes(origin)){
       callback(null, true)
    } else { 
        callback(new Error('Error de CORS'))
        
    }
  },
}
