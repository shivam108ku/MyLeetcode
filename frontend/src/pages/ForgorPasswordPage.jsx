import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router";

const ForgotPasswordPage = () => {
	const [emailId, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(emailId);
		setIsSubmitted(true);
	};

	return (

		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='w-[90%] sm:w-[80%] md:w-[70%] lg:max-w-md   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-auto'
		>
			<div className='p-6 sm:p-8'>
				<h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-white to--500 text-transparent bg-clip-text'>
					Forgot Password
				</h2>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 text-center'>
							Enter your emailId address and we'll send you a link to reset your password.
						</p>
						<Input
							icon={Mail}
							type='emailId'
							placeholder='Email Address'
							value={emailId}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-zinc-800 to-zinc-600 text-white font-bold 
					rounded-lg shadow-lg hover:from-zinc-600 hover:to-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 mt-4'
							type='submit'
						>
							{isLoading ? (
								<Loader className='size-6 animate-spin mx-auto' />
							) : (
								"Send Reset Link"
							)}
						</motion.button>
					</form>
				) : (
					<div className='text-center'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-white' />
						</motion.div>
						<p className='text-sm sm:text-base text-gray-300 mb-6'>
							If an account exists for <span className='font-semibold'>{emailId}</span>, you will receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className='px-6 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-green-500  hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
		</motion.div>

	);
};
export default ForgotPasswordPage;

