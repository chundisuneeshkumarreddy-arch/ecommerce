const specs = {
    openapi: "3.0.0",
    info: {
        title: "Ecommerce API",
        version: "1.0.0",
        description: "E-commerce REST API with JWT auth, product and user management"
    },
    servers: [
        {
            url: "http://localhost:5000"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            RegisterRequest: {
                type: "object",
                required: ["username", "email", "contact", "password", "location"],
                properties: {
                    username: { type: "string" },
                    email: { type: "string", format: "email" },
                    contact: { type: "number" },
                    password: { type: "string" },
                    location: { type: "string" }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                }
            },
            Product: {
                type: "object",
                required: ["name", "description", "price", "category", "stock"],
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    category: { type: "string" },
                    stock: { type: "number" },
                    published: { type: "boolean", default: false }
                }
            },
            RoleUpdateRequest: {
                type: "object",
                required: ["role"],
                properties: {
                    role: { type: "string", enum: ["user", "admin"] }
                }
            }
        }
    },
    paths: {
        "/api/auth/register": {
            post: {
                summary: "Register a new user",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" }
                        }
                    }
                },
                responses: {
                    201: { description: "User registered successfully" },
                    400: { description: "User already exists" }
                }
            }
        },
        "/api/auth/login": {
            post: {
                summary: "Login and get a JWT token",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" }
                        }
                    }
                },
                responses: {
                    200: { description: "Login successful, returns token" },
                    401: { description: "Invalid email or password" },
                    404: { description: "User not found" }
                }
            }
        },
        "/api/products": {
            get: {
                summary: "List products with filter, sort and pagination",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "query", name: "category", schema: { type: "string" } },
                    { in: "query", name: "minPrice", schema: { type: "number" } },
                    { in: "query", name: "maxPrice", schema: { type: "number" } },
                    { in: "query", name: "sort", schema: { type: "string", enum: ["price_asc", "price_desc", "newest"] } },
                    { in: "query", name: "page", schema: { type: "number", default: 1 } },
                    { in: "query", name: "limit", schema: { type: "number", default: 10 } }
                ],
                responses: {
                    200: { description: "List of products" },
                    401: { description: "Not authorized" }
                }
            },
            post: {
                summary: "Create a product (admin only)",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Product" }
                        }
                    }
                },
                responses: {
                    201: { description: "Product created" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/products/{id}": {
            get: {
                summary: "Get a single product by id",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Product found" },
                    404: { description: "Product not found" }
                }
            },
            put: {
                summary: "Update a product (admin only)",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Product" }
                        }
                    }
                },
                responses: {
                    200: { description: "Product updated" },
                    403: { description: "Access denied, admin only" }
                }
            },
            delete: {
                summary: "Delete a product (admin only)",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Product deleted" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/products/{id}/publish": {
            patch: {
                summary: "Publish a product (admin only)",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Product published" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/products/{id}/unpublish": {
            patch: {
                summary: "Unpublish a product (admin only)",
                tags: ["Products"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "Product unpublished" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/users": {
            get: {
                summary: "List all users (admin only)",
                tags: ["Users"],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "List of users" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/users/{id}": {
            get: {
                summary: "Get a single user (admin only)",
                tags: ["Users"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "User found" },
                    404: { description: "User not found" }
                }
            },
            delete: {
                summary: "Delete a user (admin only)",
                tags: ["Users"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: { description: "User deleted" },
                    403: { description: "Access denied, admin only" }
                }
            }
        },
        "/api/users/{id}/role": {
            patch: {
                summary: "Update a user's role (admin only)",
                tags: ["Users"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: "path", name: "id", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RoleUpdateRequest" }
                        }
                    }
                },
                responses: {
                    200: { description: "Role updated" },
                    400: { description: "Invalid role" },
                    403: { description: "Access denied, admin only" }
                }
            }
        }
    }
};

export default specs;