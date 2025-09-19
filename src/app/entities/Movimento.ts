import { ContoCorrente } from "./ControCorrente";

export type Movimento = {
    movimentoID: string | null;
    contoCorrente: ContoCorrente | null;
    data: Date | null;
    saldo: number | null;
    categoriaMovimentoID: number | null;
    descrizioneEstesa: string | null;
}