import { ContoCorrente } from "./ControCorrente";

export type Movimento = {
    movimentoID: string | null;
    contoCorrente: ContoCorrente | null;
    data: Date | null;
    saldo: number | null;
    categoriaMovimento: string | null;
    descrizioneEstesa: string | null;
}