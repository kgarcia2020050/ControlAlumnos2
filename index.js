const mongoose = require("mongoose");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/IN6BM2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexion exitosa");

    app.listen(3030, function () {});
  })
  .catch((error) => console.log(error));
