const express = require('express');
const http = require('http');
const path = require('path');
const connectMongo = require('./databases/connectMongo');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const blogRouter = require('./routes/blogRoutes');
const submitRouter = require('./routes/submit');
const userStatsRoute = require('./routes/userStatsRoute');
const problemRouter = require('../src/routes/problemCreator');
const redisClient = require('./databases/redis');
const interviewPrep = require('./routes/interviewPrep')
const feedRoutes = require('./routes/feedRoutes')

const cors = require('cors');
require('dotenv').config();


// Express App
const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const { Server } = require('socket.io');
const videoRouter = require('./routes/videoCreator');
const aiRouter = require('./routes/aiRoutes');
<<<<<<< HEAD
// const io = new Server(server, {
//   cors: {
//     origin: "https://getsmartcode.site",
//     credentials: true,
//   },
// });

// // Middleware
// app.use(cors({
//   origin: "https://getsmartcode.site",
//   credentials: true,
// }));


const allowedOrigins = [
=======
 const allowedOrigins = [
>>>>>>> ccecc6c8b4b21ad01d80939861f142ee8be85620
  "https://getsmartcode.site",     // production
  "http://localhost:5173"          // local frontend (Vite)
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user/auth', authRoutes);
app.use('/problem', problemRouter);
app.use('/blog', blogRouter);
app.use('/submission', submitRouter);
app.use('/user', userStatsRoute);
app.use('/generate',interviewPrep);
app.use('/video',videoRouter);
app.use('/feed',feedRoutes);
app.use('/ai',aiRouter);
 

// Real-Time Collaboration Logic
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User Connected', socket.id);

  let currentRoom = null;
  let currentUser = null;

  socket.on('join', ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit('userJoined', Array.from(rooms.get(currentRoom) || []));
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(userName);
    io.to(roomId).emit('userJoined', Array.from(rooms.get(roomId)));
  });

  socket.on('codeChange', ({ roomId, code }) => {
    socket.to(roomId).emit('codeUpdate', code);
  });

  socket.on('typing', ({ roomId, userName }) => {
    socket.to(roomId).emit('userTyping', userName);
  });

  socket.on('languageChange', ({ roomId, language }) => {
    io.to(roomId).emit('languageUpdate', language);
  });

  socket.on('leaveRoom', () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit('userJoined', Array.from(rooms.get(currentRoom) || []));
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit('userJoined', Array.from(rooms.get(currentRoom) || []));
    }
    console.log('User Disconnected');
  });
});

// DB + Server Initialization
const PORT = process.env.PORT || 3000;
 
const initializeConnection = async () => {
  try {
    // ✅ Only connect Redis if not already connected
    if (!redisClient.isOpen) {
      await Promise.all([connectMongo(), redisClient.connect()]);
      console.log("✅ Redis Connected");
    } else {
      await connectMongo();
      console.log("⚠️ Redis was already connected");
    }

    server.listen(PORT, () => {
      console.log("🚀 Listening on port", PORT);
    });
  } catch (error) {
    console.log("❌ Error during initialization:", error.message);
  }
};


initializeConnection();
