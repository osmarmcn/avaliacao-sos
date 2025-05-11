
// src/types/rating.ts
export interface Rating {
    id: string; // ou number, dependendo da sua definição de chave primária
    satisfaction: number;
    recommendation: number;
    speed: number;
    feedback: string | null;
    created_at: string; // Supabase retorna como string ISO 8601
    // Adicione outras colunas se tiver
  }