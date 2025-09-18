import { ContoCorrente } from "./ControCorrente";

export type Movimento = {
    movimentoID: string;
    contoCorrente: ContoCorrente;
    data: Date;
    saldo: number;
    categoriaMovimento: number;
    descrizioneEstesa: string;
}