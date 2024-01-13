import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint={
    create:[roles.User,roles.Admin],
    update:[roles.Admin,roles.User],
    get:[roles.User,roles.Admin],
    softDelete:[roles.Admin],
    forceDelete:[roles.Admin],
    restore:[roles.Admin]
}