import { ContoCorrente } from "./ControCorrente";

export type CategoriaMovimento = { id?: number; NomeCategoria?: string; tipologia: boolean; };

export type Movimento = {
    movimentoID: string | null;
    contoCorrente: ContoCorrente | null;
    data: Date | null;
    saldo: number | null;
    categoriaMovimento: CategoriaMovimento | null;
    descrizioneEstesa: string | null;
}