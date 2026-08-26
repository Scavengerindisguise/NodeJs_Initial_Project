const path = require("path");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("../Course2/config/corsOptions");
const credentials = require("./middleware/credentials");
const express = require("express");
const PORT = process.env.PORT || 3500;
const app = express();

// custom middleware logger
app.use(logger);

app.use(credentials); // Handle options credentials check - before CORS!

//  Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Build In Middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Build In Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));

// routes - these routes do not need jwt verification so they are placed above the jwt verification middleware
app.use("/", require("./routes/root"));
// app.use("/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// Remember this works like waterfall so where ever you declare
// a middleware it will affect the lines below
app.use(verifyJWT); // Verify JWT for all routes below this line
app.use("/employees", require("./routes/api/employees"));

// Catch all
app.all("*path", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error handler (should be last piece of middleware)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
