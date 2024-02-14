import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from './Category/Category.router.js';
import subCategoryRouter from './SubCategory/SubCategory.router.js'
import CouponRouter from './Coupon/Coupon.router.js';
import BrandRouter from './Brand/Brand.router.js'
import ProductRouter from './Product/Product.router.js'
import CartRouter from './Cart/Cart.router.js'
import OrderRouter from './Order/Order.router.js'
import ReviewRoter from './Review/Review.router.js'
import cors from 'cors'


import path from 'path'; 
import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
//  var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
    connectDB();
    app.use(express.json());
    app.use(cors())
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use("/category",CategoryRouter)
    app.use("/subCategory",subCategoryRouter)
    app.use('/user', UserRouter);
    app.use('/coupon', CouponRouter);
    app.use('/brand', BrandRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', CartRouter);
    app.use('/order', OrderRouter);

    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })
    //global error handler
    app.use(globalErrorHandel)
}
export default initApp;