import mongoose, { connect } from "mongoose"

const config = useRuntimeConfig();

export default async () => {
    try {
        await mongoose.connect(config.mongoUri);
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}