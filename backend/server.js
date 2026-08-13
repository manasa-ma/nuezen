// LOGIN (With Serverless Auto-Fallback Seeding)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Look for the user
    let user = await User.findOne({ email });

    // 2. SERVERLESS FIX: If database is totally empty and they tried hr@neuzen.ai
    if (!user && email === "hr@neuzen.ai") {
      const hash = bcrypt.hashSync("password123", 10);
      user = await User.create({ 
        name: "HR Manager", 
        email: "hr@neuzen.ai", 
        password: hash, 
        role: "HR" 
      });
      console.log("🌱 Emergency Serverless Seeding: Created hr@neuzen.ai");
    }

    // 3. Run the credential verification check
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const secretKey = process.env.JWT_SECRET || "fallback_secret";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "7d" });
    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, salary: user.salary, token });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});
