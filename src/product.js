const products = [
    {
        "id": 1,
        "title": "Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop Gaming Laptop",
        "description": "Powerful laptop for gaming",
        "vendor": "Tech Co.",
        "active": true,
        "variants": [
            {
                "id": 1,
                "product_id": 1,
                "inventory_item_id": 1,
                "price": 1499.99,
                "quantity": 80,
                "option1": "Color: Black",
                "option2": "Size: 15-inch",
                "option3": null
            }
        ],
        "options": [
            {
                "id": 1,
                "product_id": 1,
                "name": "Color",
                "position": 1,
                "values": [
                    "Black",
                    "Silver"
                ]
            },
            {
                "id": 2,
                "product_id": 1,
                "name": "Size",
                "position": 1,
                "values": [
                    "15-inch",
                    "13-inch"
                ]
            }
        ],
        "images": [
            {
                "id": 1,
                "position": 1,
                "src": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6511/6511432_rd.jpg",
                "width": 800,
                "height": 600
            }
        ]
    },
    {
        "id": 2,
        "title": "Ultrabook",
        "description": "Lightweight and portable laptop",
        "vendor": "Gadget Inc.",
        "active": true,
        "variants": [
            {
                "id": 2,
                "product_id": 2,
                "inventory_item_id": 2,
                "price": 999.99,
                "quantity": 60,
                "option1": "Color: Silver",
                "option2": "Size: 13-inch",
                "option3": null
            }
        ],
        "options": [
            {
                "id": 3,
                "product_id": 2,
                "name": "Color",
                "position": 1,
                "values": [
                    "Silver"
                ]
            }
        ],
        "images": [
            {
                "id": 2,
                "position": 1,
                "src": "https://cdn.ben.com.vn/Content/Images/Products/fbb51f84-a651-40e9-90ed-36eafae9536f.jpg",
                "width": 1000,
                "height": 800
            }
        ]
    },
    {
        "id": 3,
        "title": "Gaming PC",
        "description": "High-performance desktop computer",
        "vendor": "Digital Tech",
        "active": true,
        "variants": [
            {
                "id": 3,
                "product_id": 3,
                "inventory_item_id": 3,
                "price": 1999.99,
                "quantity": 60,
                "option1": "Color: Black",
                "option2": null,
                "option3": null
            }
        ],
        "options": [],
        "images": [
            {
                "id": 3,
                "position": 1,
                "src": "https://siriuspowerpc.com/wp-content/uploads/2023/07/Sirius-B-M-ATX-Mini-Gaming-PC-Black.png",
                "width": 1200,
                "height": 800
            }
        ]
    },
    {
        "id": 4,
        "title": "Budget Laptop",
        "description": "Affordable laptop for everyday use",
        "vendor": "Tech Co.",
        "active": true,
        "variants": [
            {
                "id": 4,
                "product_id": 4,
                "inventory_item_id": 4,
                "price": 299.99,
                "quantity": 30,
                "option1": "Color: Black",
                "option2": "Size: 15-inch",
                "option3": null
            }
        ],
        "options": [
            {
                "id": 5,
                "product_id": 4,
                "name": "Size",
                "position": 1,
                "values": [
                    "15-inch",
                    "13-inch",
                    "14-inch"
                ]
            },
            {
                "id": 4,
                "product_id": 4,
                "name": "Color",
                "position": 1,
                "values": [
                    "Black",
                    "Silver",
                    "Blue"
                ]
            }
        ],
        "images": [
            {
                "id": 4,
                "position": 1,
                "src": "https://i.pcmag.com/imagery/roundups/01LGL23MDBwSqivAsdTF3Ui-25..v1639764899.jpg",
                "width": 800,
                "height": 600
            }
        ]
    },
    {
        "id": 5,
        "title": "Gaming Beast",
        "description": "Powerful gaming laptop with high-end specs",
        "vendor": "Gadget Inc.",
        "active": true,
        "variants": [
            {
                "id": 5,
                "product_id": 5,
                "inventory_item_id": 5,
                "price": 439.99,
                "quantity": 40,
                "option1": "Color: Silver",
                "option2": "Size: 13-inch",
                "option3": null
            }
        ],
        "options": [
            {
                "id": 6,
                "product_id": 5,
                "name": "Color",
                "position": 1,
                "values": [
                    "Black",
                    "Silver",
                    "Gray"
                ]
            },
            {
                "id": 7,
                "product_id": 5,
                "name": "Size",
                "position": 1,
                "values": [
                    "15-inch",
                    "17-inch"
                ]
            }
        ],
        "images": [
            {
                "id": 5,
                "position": 1,
                "src": "https://www.pcworld.com/wp-content/uploads/2023/10/20220324_103646-1.jpg?quality=50&strip=all",
                "width": 1000,
                "height": 800
            }
        ]
    },
    {
        "id": 6,
        "title": "Travel Ultrabook",
        "description": "Portable laptop with long battery life",
        "vendor": "Digital Tech",
        "active": true,
        "variants": [
            {
                "id": 6,
                "product_id": 6,
                "inventory_item_id": 6,
                "price": 549.99,
                "quantity": 65,
                "option1": "Color: Black",
                "option2": "Size: 14-inch",
                "option3": null
            }
        ],
        "options": [
            {
                "id": 8,
                "product_id": 6,
                "name": "Color",
                "position": 1,
                "values": [
                    "Silver"
                ]
            },
            {
                "id": 9,
                "product_id": 6,
                "name": "Size",
                "position": 1,
                "values": [
                    "13-inch",
                    "14-inch"
                ]
            }
        ],
        "images": [
            {
                "id": 6,
                "position": 1,
                "src": "https://bizweb.dktcdn.net/100/372/934/products/z4689293971134-66aee887ccd126cf3f069a24ad904d5a.jpg?v=1694587231757",
                "width": 1200,
                "height": 800
            }
        ]
    },
    {
        "id": 7,
        "title": "Extreme Gaming PC",
        "description": "High-performance gaming desktop computer",
        "vendor": "Tech Co.",
        "active": true,
        "variants": [
            {
                "id": 7,
                "product_id": 7,
                "inventory_item_id": 7,
                "price": 699.99,
                "quantity": 90,
                "option1": "Color: Silver",
                "option2": "Size: 15-inch",
                "option3": null
            }
        ],
        "options": [],
        "images": [
            {
                "id": 7,
                "position": 1,
                "src": "https://encrypted-tbn0.gstatic.com/images?https://tinhocanhphat.vn/media/product/19310_z4659404286324_77138b50ddaf019aa0ff8714b11067fd.jpg",
                "width": 800,
                "height": 600
            }
        ]
    },
    {
        "id": 8,
        "title": "Slim Ultrabook",
        "description": "Slim and lightweight ultrabook",
        "vendor": "Gadget Inc.",
        "active": true,
        "variants": [
            {
                "id": 8,
                "product_id": 8,
                "inventory_item_id": 8,
                "price": 799.99,
                "quantity": 120,
                "option1": "Color: Gray",
                "option2": "Size: 13-inch",
                "option3": null
            }
        ],
        "options": [],
        "images": [
            {
                "id": 8,
                "position": 1,
                "src": "https://www.trustedreviews.com/wp-content/uploads/sites/54/2022/06/Asus-Zenbook-S-13-OLED-1-scaled.jpg",
                "width": 1000,
                "height": 800
            }
        ]
    },
    {
        "id": 9,
        "title": "Mid-Range Gaming PC",
        "description": "Mid-range gaming PC",
        "vendor": "Digital Tech",
        "active": true,
        "variants": [
            {
                "id": 9,
                "product_id": 9,
                "inventory_item_id": 9,
                "price": 899.99,
                "quantity": 145,
                "option1": "Color: Silver",
                "option2": "Size: 14-inch",
                "option3": null
            }
        ],
        "options": [],
        "images": [
            {
                "id": 9,
                "position": 1,
                "src": "https://img.overclockers.co.uk/images/FS-1DJ-EP/4b87894bc314470a87eead7cd06df530.jpg",
                "width": 1200,
                "height": 800
            }
        ]
    }
]
export default products;