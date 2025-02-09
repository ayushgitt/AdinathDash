import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './welcome.css';

export default function TaskManagerLanding() {
    return (
        <div className="min-vh-100 vw-100 d-flex align-items-center justify-content-end bg-primary bg-gradient" style={{ backgroundImage: "url('../image/img01.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="text-center me-5">
                <motion.h1
                    className="display-4 fw-bold text-white mb-4"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Welcome to आदिनाथ TV
                </motion.h1>
                <motion.p
                    className="lead text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {/* Add any additional text here if needed */}
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
    );
}