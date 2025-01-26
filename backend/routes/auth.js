const authRouter = require("express").Router();
const passport = require("../middlewares/passport");
const jwt = require("jsonwebtoken");

const createJWT = async (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};

authRouter
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.route("/auth/google/callback").get(
  passport.authenticate("google", {
    session: true,
    successRedirect: "/profile",
    // failureRedirect: "http://localhost:5173/",
    failureRedirect: "https://nijiyamaharjan.github.io/Bhitta/",
  })
);

authRouter.route("/profile").get(async (req, res) => {
  const token = await createJWT(req.user);

  res.send(
    `<script>
   window.opener.postMessage(${JSON.stringify({
     token,
     userID: req.user._id,
   })}, 'https://nijiyamaharjan.github.io/Bhitta/');
  //  })}, 'http://localhost:5173/');
        window.close();
        </script>
`
  );
});

authRouter.route("/logout").get((req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("https://nijiyamaharjan.github.io/Bhitta/");
    // res.redirect("http://localhost:5173/");
  });
});

module.exports = authRouter;
