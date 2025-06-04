import { Products } from "./productData.js"

           
           


           export const admin = {
                       id:1,
                       authCode: '0',
                       username: 'Elesh',
                       email: 'seun.olatunji2@gmail.com',
                       type: 'admin',
                       role: 'admin',
                       cookiesAccepted: false,
                       name: '',
                       phone: '',
                       address: '',
                       state: '',
                       newsletter: true,
                       
                   }

            // Anonymous Users
            export const anonymousUsers = [
                {
                    "username": "",
                    'email': 'anonymous@demo.com',
                    "cart": [],
                    "isLoggedIn": false,
                    "type": 'customer',
                    "role": "customer",
                    "createdAt": new Date(),
                    "cookiesAccepted": false,
                    name: '',
                    phone: '',
                    address: '',
                    state: '',
                    newsletter: true,
                  }
               
            ]


            // User
            // Has only one demo data
    export const Users= [
    {
    id: 1,
    authCode: '0',
    "username": 'elesh',
    'email': 'seun.olatunji2@gmail.com',
    "cart": [],
    "isLoggedIn": false,
    "type": "customer",
    "role": 'customer',
    "service": "Petrolage Store",
    "createdAt": new Date(),
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    orders: [], //When items in the cart are paid for, they move to orders.
    gender: '',
    city: '',
    state: '',
    isNewsletter: true,
    store: {name: 'Elteema', logo: 'Elteema', items: Products},
    }
          ]
            
        

          
            
            

          
            
            