import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const userPerformanceData = [
    { name: "DSA", value: 20, fill: "#10B981" },
    { name: "Web Dev", value: 20, fill: "#F59E0B" },
    { name: "Consistency", value: 10, fill: "#EF4444" },
    { name: "Problem Solving", value: 30, fill: "#3B82F6" },
    { name: "Communication", value: 20, fill: "#8B5CF6" },
];


const PerformancePieChart = () => {
	return (
		<motion.div
			className="mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className="text-white text-xl sm:text-2xl font-bold mb-4">
				SmartCode Strong Collaboration
			</h2>

			<div className="w-[60%] h-[270px]">
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={userPerformanceData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={60}
							label
						>
							{userPerformanceData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.fill} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "#0f172a",
								borderColor: "#475569",
								color: "#fff",
							}}
							itemStyle={{
								color: "#fff",               
								fontWeight: 500,
							}}
							labelStyle={{
								color: "#fff",              
								fontWeight: 600,
							}}
						/>

						<Legend
							verticalAlign="bottom"
							wrapperStyle={{
								color: "#fff",
								fontSize: "14px",
								fontWeight: "500",
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default PerformancePieChart;
