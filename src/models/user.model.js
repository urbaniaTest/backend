import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String },
    apellido: { type: String },
    perfil: {
      type: String,
      enum: ["Control", "Obra", "Director", "Coordinador"],
      required: true,
    },
    vista_de_obra: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Obra",
      },
    ],
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Asegúrate de exportar el modelo
const User = mongoose.model("User", userSchema);
export default User;
