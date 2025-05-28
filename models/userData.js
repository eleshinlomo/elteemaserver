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
    "username": 'seun',
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
    store: [
        {   id: 1,
                    name: 'African Drum',
                    price: 10000,
                    condition: 'new',
                    deliver: 'pickup-only',
                    src: '/images/products/african_drum.jpg',
                    numOfItemsSold: 8,
                    description: 'Experience the soul-stirring rhythm of Africa with our authentic African Drum, handcrafted by skilled artisans using premium materials. Each drum carries the rich heritage and vibrant energy of African culture, perfect for musical performances, cultural celebrations, or as a stunning decorative piece.',
                    quantity: 0,
                    stock: 1,
                    star: 3,
                    totalVotes: 200,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category: ['new', 'art', 'trending'],
                    productPageVisits: 235
            
                },
                {   id: 2,
                    name: 'Dope Chick red heels',
                    price: 12000,
                    condition: 'new',
                    deliver: 'yes',
                    src: '/images/products/women/shoes/freaky_heels.png',
                    quantity: 0,
                    stock: 1,
                    description: 'Step into confidence with Dope Chick, a vibrant African-inspired clothing line designed for the modern woman who embraces her roots with style. Each piece is a celebration of African heritage, crafted with bold prints, luxurious fabrics, and contemporary flair to make you stand out effortlessly.',
                    star: 4,
                    totalVotes: 8,
                    numOfItemsSold: 10,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category: ['new', 'women shoes', 'trending'],
                    productPageVisits: 422
            
                },
                {   id: 3,
                    name: 'Senator Bassey',
                    price: 8000,
                    condition: 'new',
                    deliver: 'yes',
                    src: '/images/products/men/clothes/senator_bassey.jpg',
                    quantity: 0,
                    stock: 1,
                    description: 'Command respect and exude sophistication with Senator Bassey, a premium African menswear collection that blends traditional craftsmanship with modern refinement. Inspired by the dignified style of African leaders, each piece is meticulously tailored for the man who carries himself with authority and cultural pride.',
                    star: 5,
                    totalVotes: 7,
                    numOfItemsSold: 3,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category: ['trending',  'men clothings', 'agbada', 'men natives'],
                    productPageVisits: 334
            
                },
                {   id: 4,
                    name: 'Igara Chicken',
                    price: 5000,
                    condition: 'new',
                    deliver: 'pickup-only',
                    src: '/images/products/men/clothes/men_lace.jpg',
                    quantity: 0,
                    stock: 1,
                    description: 'Feast your eyes on Igara Chicken, the daring new African menswear line that blends streetwise swagger with traditional flair. Inspired by the fiery spirit of West African pepper chicken, this collection serves up looks as bold as the dish itself. Perfect for men who are not afraid to stand out.',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 5,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category: ['trending', 'men clothings', 'agbada', 'men natives'],
                    productPageVisits: 599
            
                },
                {   id: 5,
                    name: 'Sexy Red Flamingo',
                    condition: 'used',
                    deliver: 'yes',
                    price: 6000,
                    src: '/images/products/women/shoes/sexy_red_flamingo.png',
                    quantity: 0,
                    stock: 1,
                    description: "Slay every stride in Sexy Red Flamingo, the head-turning African-inspired heels that blend fierce femininity with unapologetic glamour. Like the vibrant flamingos of Africa's salt lakes, these statement shoes make you impossible to ignore.",
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 6,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category:  ['new', 'women shoes', 'bestseller'],
                    productPageVisits: 157
            
                },
                {   id: 6,
                    name: 'Ankara Shanti',
                    price: 20000,
                    condition: 'new',
                    deliver: 'pickup-only',
                    src: '/images/products/women/clothes/ankara.jpg',
                    quantity: 0,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 4,
                    isAdded: false,
                    size:'',
                    orderStatus:['processing', 'shipped', 'completed'],
                    category: ['bestseller', 'women clothings', 'women natives', 'women ankara'],
                    productPageVisits: 267
            
                }
            ],
    state: '',
    isNewsletter: true,
    }
          ]
            
        

          
            
            

          
            
            