import { ContoCorrente } from "./ControCorrente";

export type CategoriaMovimento = { id?: number; CategoriaMovimentoID?: string ;NomeCategoria?: string; tipologia: boolean; };

export type Movimento = {
dataMovimento: string|number|Date;
    movimentoID: string | null;
    contoCorrente: ContoCorrente | null;
    data: Date | null;
    importo: number | null;
    saldo: number | null;
    categoriaMovimento: CategoriaMovimento | null;
    descrizioneEstesa: string | null;
}