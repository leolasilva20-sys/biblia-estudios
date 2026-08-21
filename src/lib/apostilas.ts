export type ApostilaStatic = {
  id: string;
  titulo: string;
  descricao: string;
  drive_id: string;
  drive_type: "doc" | "pdf";
};

export const APOSTILAS: ApostilaStatic[] = [
  {
    id: "genesis",
    titulo: "Apostila de Gênesis",
    descricao:
      "Estudo completo do livro de Gênesis, atualizado continuamente. Leia com paginação própria ou ouça a narração.",
    drive_id: "1gSfhG7etuw3-oCDV3BaUrsUyPSrZ0bNqt8ucRjv5ZPM",
    drive_type: "doc",
  },
];

export function getApostila(id: string) {
  return APOSTILAS.find((a) => a.id === id) ?? null;
}

export function buildDriveEmbedUrl(a: ApostilaStatic) {
  if (a.drive_type === "doc") {
    return `https://docs.google.com/document/d/${a.drive_id}/preview`;
  }
  return `https://drive.google.com/file/d/${a.drive_id}/preview`;
}
