import { motion } from 'framer-motion'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'


export default function TaskManagerLanding() {
    return (
        <div className="min-vh-100 vw-100 d-flex align-items-center justify-content-center bg-primary bg-gradient" style={{width:"100vh"}}>

            <div className="text-center">
                <motion.h1
                    className="display-4 fw-bold text-white mb-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                Welcome to ADINATH TV
                </motion.h1>
                <motion.p
                    className="lead text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Organize your tasks efficiently and boost your productivity
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <Link to={"/login"}>
                        <button className="btn btn-light btn-lg">
                            Login
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}