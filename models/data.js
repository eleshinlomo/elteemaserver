           

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
            export const Users= [
              { id:1,
                authCode: '0',
                "username": "Elesh",
                'email': 'demo@demo.com',
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
              }, {
                id:2,
                authCode: '0',
                "username": "Teema",
                'email': 'mgrsconcept@gmail.com',
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
              },
              { 
                id:3,
                authCode: '0',
                "username": "Teema",
                'email': 'eleshphily@gmail.com',
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
            

          //  Product
            export const Products = [
                {   id: 1,
                    name: 'African Drum',
                    price: 10000,
                    src: '/images/products/african_drum.jpg',
                    numOfItemsSold: 8,
                    description: 'Experience the soul-stirring rhythm of Africa with our authentic African Drum, handcrafted by skilled artisans using premium materials. Each drum carries the rich heritage and vibrant energy of African culture, perfect for musical performances, cultural celebrations, or as a stunning decorative piece.',
                    quantity: 1,
                    stock: 1,
                    star: 3,
                    totalVotes: 200,
                    isAdded: false,
                    category: ['new']
            
                },
                {   id: 2,
                    name: 'Dope Chick red heels',
                    price: 12000,
                    src: '/images/products/women/shoes/freaky_heels.png',
                    quantity: 1,
                    stock: 1,
                    description: 'Step into confidence with Dope Chick, a vibrant African-inspired clothing line designed for the modern woman who embraces her roots with style. Each piece is a celebration of African heritage, crafted with bold prints, luxurious fabrics, and contemporary flair to make you stand out effortlessly.',
                    star: 4,
                    totalVotes: 8,
                    numOfItemsSold: 10,
                    isAdded: false,
                    category: ['new', 'women shoes']
            
                },
                {   id: 3,
                    name: 'Senator Bassey',
                    price: 8000,
                    src: '/images/products/men/clothes/senator_bassey.jpg',
                    quantity: 1,
                    stock: 1,
                    description: 'Command respect and exude sophistication with Senator Bassey, a premium African menswear collection that blends traditional craftsmanship with modern refinement. Inspired by the dignified style of African leaders, each piece is meticulously tailored for the man who carries himself with authority and cultural pride.',
                     star: 5,
                     totalVotes: 7,
                     numOfItemsSold: 3,
                     isAdded: false,
                     category: ['trending',  'men clothings']
            
                },
                {   id: 4,
                    name: 'Igara Chicken',
                    price: 5000,
                    src: '/images/products/men/clothes/men_lace.jpg',
                    quantity: 1,
                    stock: 1,
                    description: 'Feast your eyes on Igara Chicken, the daring new African menswear line that blends streetwise swagger with traditional flair. Inspired by the fiery spirit of West African pepper chicken, this collection serves up looks as bold as the dish itself. Perfect for men who are not afraid to stand out.',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 5,
                    isAdded: false,
                    category: ['trending', 'men clothings']
            
                },
                {   id: 5,
                    name: 'Sexy Red Flamingo',
                    price: 6000,
                    src: '/images/products/women/shoes/sexy_red_flamingo.png',
                    quantity: 1,
                    stock: 1,
                    description: "Slay every stride in Sexy Red Flamingo, the head-turning African-inspired heels that blend fierce femininity with unapologetic glamour. Like the vibrant flamingos of Africa's salt lakes, these statement shoes make you impossible to ignore.",
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 6,
                    isAdded: false,
                    category:  ['new', 'women shoes']
            
                },
                {   id: 6,
                    name: 'Ankara Shanti',
                    price: 20000,
                    src: '/images/products/women/clothes/ankara.jpg',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 4,
                    isAdded: false,
                    category: ['bestseller', 'women clothings']
            
                },
                {   id: 7,
                    name: 'Woman Bead',
                    price: 10000,
                    src: '/images/products/beads.jpg',
                    quantity: 1,
                    stock: 1,
                    description: '',
                     star: 5,
                     totalVotes: 2,
                     numOfItemsSold: 9,
                    isAdded: false,
                    category: ['bestseller', 'women accessories']
            
                },
                {   id: 8,
                    name: 'Woman Portrait by Fikor',
                    price: 7000,
                    src: '/images/products/woman_portrait.jpg',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 1,
                    numOfItemsSold: 8,
                    isAdded: false,
                    category: ['bestseller', 'art']
            
                },
                {   id: 9,
                    name: 'Goat',
                    price: 4000,
                    src: '/images/products/animals/goat.jpg',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 9,
                    numOfItemsSold: 8,
                    isAdded: false,
                    category: ['trending', 'farm produce']
            
                },
                {   id: 10,
                    name: 'African Wig',
                    price: 3000,
                    src: '/images/products/women/hairs/afro_wig.jpg',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 11,
                    numOfItemsSold: 7,
                    isAdded: false,
                    category: ['trending', 'women accessories']
            
                },
                {   id: 11,
                    name: 'Chima red shoe',
                    price: 15000,
                    src: '/images/products/women/shoes/sexy_red_flamingo.png',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 5,
                    isAdded: false,
                    category: ['bestseller', 'women shoes']
            
                },
                {   id: 12,
                    name: 'Red horse shoes',
                    price: 5000,
                    src: '/images/products/women/shoes/sexy_red_flamingo.png',
                    quantity: 1,
                    stock: 1,
                    description: '',
                    star: 5,
                    totalVotes: 5,
                    numOfItemsSold: 10,
                    isAdded: false,
                    category:  ['new', 'women shoes']
            
                },
            ]


          
            
            