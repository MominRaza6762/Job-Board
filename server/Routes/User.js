import express from "express";
import { ristrictTo } from "../Middlewares/Auth.js";
import { signInUser , signUpUser ,getUser , updateUser , deleteUser ,changeUserPassword} from "../Controller/User.js";

const router = express.Router();

router.put('/user_update',ristrictTo(['employer','job-seeker','admin']),updateUser);

router.put('/change_password',ristrictTo(['employer','job-seeker','admin']),changeUserPassword);

router.delete('/delete',ristrictTo(['employer','job-seeker', 'admin']),deleteUser)

router.post('/register',signUpUser);

router.post('/signin',signInUser);

router.get('/me',ristrictTo(['admin','employer','job-seeker']),getUser);


export default router;